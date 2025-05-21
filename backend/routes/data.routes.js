import express from "express";
import mongoose from "mongoose";
import axios from "axios";

const router = express.Router();

const AllocationCost = mongoose.model("allocation_costs", new mongoose.Schema({}, { strict: false }));
const ResourceConsumption = mongoose.model("resource_consumption", new mongoose.Schema({}, { strict: false }));
const ResourceLimit = mongoose.model("resource_limits", new mongoose.Schema({}, { strict: false }));

// ✅ Yeni: Çözüm sonucu loglanacak koleksiyon
const SolutionLog = mongoose.model("solutions", new mongoose.Schema({}, { strict: false }));

router.post("/solve", async (req, res) => {
  try {
    const costs = await AllocationCost.find({});
    const consumption = await ResourceConsumption.find({});
    const limits = await ResourceLimit.find({});

    const agents = [...new Set(costs.map(item => item.agent_id))];
    const jobs = [...new Set(costs.map(item => item.job_id))];

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

    const response = await axios.post("http://localhost:8000/solve", {
      allocation_costs,
      resource_consumption,
      resource_limits
    });

    const solution = {
      ...response.data,
      timestamp: new Date()
    };

    // ✅ Çözüm verisini MongoDB'ye kaydet
    await SolutionLog.create(solution);

    res.json(solution);
  } catch (error) {
    console.error("Error in /solve:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
