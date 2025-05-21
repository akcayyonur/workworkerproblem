from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from pyomo.environ import *

app = Flask(__name__)

def solve_problem(allocation_costs, resource_consumption, resource_limits, max_iterations=10000, initial_threshold=10000, threshold_decay=0.999):
    num_agents = allocation_costs.shape[0]
    num_jobs = allocation_costs.shape[1]

    def generate_random_solution():
        return np.random.randint(0, num_agents, size=num_jobs)

    def calculate_cost(solution, iteration):
        agent_consumptions = np.zeros(num_agents)
        cost = 0
        for job, agent in enumerate(solution):
            agent_consumptions[agent] += resource_consumption[agent, job]
            cost += allocation_costs[agent, job]
        penalty_factor = np.exp(iteration / max_iterations)
        penalty = sum(max(0, agent_consumptions[i] - resource_limits[i]) * 1100 * penalty_factor for i in range(num_agents))
        return cost, penalty

    def generate_neighbors(solution):
        neighbors = []
        for _ in range(50):
            new_solution = solution.copy()
            for _ in range(5):
                job_to_change = np.random.randint(len(solution))
                new_agent = np.random.randint(num_agents)
                new_solution[job_to_change] = new_agent
            neighbors.append(new_solution)
        return neighbors

    solution = generate_random_solution()
    best_solution = solution.copy()
    best_cost, best_penalty = calculate_cost(solution, 0)

    threshold = initial_threshold
    for iteration in range(1, max_iterations + 1):
        neighbors = generate_neighbors(solution)
        for neighbor in neighbors:
            neighbor_cost, neighbor_penalty = calculate_cost(neighbor, iteration)
            total_neighbor_cost = neighbor_cost + neighbor_penalty
            total_current_cost = best_cost + best_penalty
            if total_neighbor_cost <= total_current_cost + threshold:
                solution = neighbor
                best_solution = neighbor
                best_cost = neighbor_cost
                best_penalty = neighbor_penalty
                break
        threshold *= threshold_decay

    return best_solution.tolist(), float(best_cost), float(best_penalty)

@app.route("/solve", methods=["POST"])
def solve():
    data = request.get_json()
    try:
        allocation_costs = np.array(data["allocation_costs"])
        resource_consumption = np.array(data["resource_consumption"])
        resource_limits = np.array(data["resource_limits"])

        best_solution, best_cost, best_penalty = solve_problem(allocation_costs, resource_consumption, resource_limits)

        return jsonify({
            "best_solution": best_solution,
            "best_cost": best_cost,
            "best_penalty": best_penalty
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)
