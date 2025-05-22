import express from "express";
import mongoose from "mongoose";
import axios from "axios";

const router = express.Router();

const AllocationCost = mongoose.model("allocation_costs", new mongoose.Schema({}, { strict: false }));
const ResourceConsumption = mongoose.model("resource_consumption", new mongoose.Schema({}, { strict: false }));
const ResourceLimit = mongoose.model("resource_limits", new mongoose.Schema({}, { strict: false }));

// Solution log collection
const SolutionLog = mongoose.model("solutions", new mongoose.Schema({}, { strict: false }));

router.post("/solve", async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Get advanced parameters from request body (if provided)
    const advancedParams = req.body || {};
    
    console.log("🔄 Starting solve request with params:", advancedParams);
    
    // Fetch data from MongoDB collections
    const costs = await AllocationCost.find({});
    const consumption = await ResourceConsumption.find({});
    const limits = await ResourceLimit.find({});

    // Validate that we have data
    if (costs.length === 0 || consumption.length === 0 || limits.length === 0) {
      return res.status(400).json({ 
        error: "Missing data in database. Please ensure allocation_costs, resource_consumption, and resource_limits collections have data." 
      });
    }

    // Extract unique agents and jobs from the database
    const agents = [...new Set(costs.map(item => item.agent_id))].sort((a, b) => a - b);
    const jobs = [...new Set(costs.map(item => item.job_id))].sort((a, b) => a - b);

    console.log(`📊 Processing ${agents.length} agents and ${jobs.length} jobs`);

    // Build matrices (same as before...)
    const allocation_costs = agents.map(agent =>
      jobs.map(job => {
        const record = costs.find(c => c.agent_id === agent && c.job_id === job);
        return record ? record.cost : 0;
      })
    );

    const resource_consumption = agents.map(agent =>
      jobs.map(job => {
        const record = consumption.find(c => c.agent_id === agent && c.job_id === job);
        return record ? record.consumption : 0;
      })
    );

    const resource_limits = agents.map(agent => {
      const record = limits.find(l => l.agent_id === agent);
      return record ? record.limit : 0;
    });

    // Create request payload with problem data and optional advanced parameters
    const payload = {
      allocation_costs,
      resource_consumption,
      resource_limits,
      max_iterations: advancedParams.max_iterations || 10000,
      threshold_decay: advancedParams.threshold_decay || 0.995,
      restart_count: advancedParams.restart_count || 3,
      initial_threshold: advancedParams.initial_threshold || null
    };

    const pythonStartTime = Date.now();
    console.log("🐍 Calling Python service...");

    // Call Python service
    const response = await axios.post("http://localhost:8000/solve", payload);

    const pythonEndTime = Date.now();
    const pythonTime = (pythonEndTime - pythonStartTime) / 1000;

    console.log(`✅ Python service completed in ${pythonTime.toFixed(3)} seconds`);

    // Prepare solution with timestamp and metadata
    const solution = {
      ...response.data,
      timestamp: new Date(),
      parameters: {
        max_iterations: payload.max_iterations,
        threshold_decay: payload.threshold_decay,
        restart_count: payload.restart_count
      },
      agents_count: agents.length,
      jobs_count: jobs.length,
      agents_list: agents,
      jobs_list: jobs,
      backend_processing_time: pythonTime
    };

    // Save solution to MongoDB
    await SolutionLog.create(solution);

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`🎯 Total request time: ${totalTime.toFixed(3)} seconds`);
    console.log(`📈 Solution quality: Cost=${solution.best_cost}, Penalty=${solution.best_penalty}, Total=${solution.best_cost + solution.best_penalty}`);

    res.json(solution);
  } catch (error) {
    const totalTime = (Date.now() - startTime) / 1000;
    console.error(`❌ Error after ${totalTime.toFixed(3)} seconds:`, error.message);
    if (error.response) {
      console.error("Python service error:", error.response.data);
    }
    res.status(500).json({ 
      error: "Something went wrong.", 
      details: error.message,
      python_error: error.response?.data,
      processing_time: totalTime
    });
  }
});

// New endpoint to retrieve previous solutions
router.get("/solutions", async (req, res) => {
  try {
    const solutions = await SolutionLog.find()
      .sort({ timestamp: -1 }) // Most recent first
      .limit(10);
    
    res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error.message);
    res.status(500).json({ error: "Failed to retrieve solution history." });
  }
});

export default router;