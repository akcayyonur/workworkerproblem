from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from pyomo.environ import *
from flask_cors import CORS  # Adding CORS support

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def solve_problem_fast(allocation_costs, resource_consumption, resource_limits, 
                       max_iterations=5000, initial_threshold=None, 
                       threshold_decay=0.995, restart_count=1):
    """Küçük problemler için optimize edilmiş basit threshold accepting."""
    num_agents = allocation_costs.shape[0]
    num_jobs = allocation_costs.shape[1]
    
    if initial_threshold is None:
        initial_threshold = np.mean(allocation_costs) * num_jobs * 0.1
    
    def generate_random_solution():
        return np.random.randint(0, num_agents, size=num_jobs)
    
    def calculate_cost_simple(solution):
        agent_consumptions = np.zeros(num_agents)
        cost = 0
        for job, agent in enumerate(solution):
            agent_consumptions[agent] += resource_consumption[agent, job]
            cost += allocation_costs[agent, job]
        violations = np.maximum(0, agent_consumptions - resource_limits)
        penalty = np.sum(violations * 1000)
        return cost, penalty
    
    def generate_neighbors_simple(solution):
        neighbors = []
        neighbor_count = min(20, num_jobs * 3)
        for _ in range(neighbor_count):
            new_solution = solution.copy()
            changes = min(2, max(1, num_jobs // 3))
            for _ in range(changes):
                job_to_change = np.random.randint(len(solution))
                new_agent = np.random.randint(num_agents)
                new_solution[job_to_change] = new_agent
            neighbors.append(new_solution)
        return neighbors
    
    best_global_solution = None
    best_global_cost = float('inf')
    best_global_penalty = float('inf')
    
    # Grafik verileri için listeler
    iterations_data = []
    cost_data = []
    threshold_data = []
    best_cost_data = []
    
    for restart in range(restart_count):
        solution = generate_random_solution()
        best_solution = solution.copy()
        best_cost, best_penalty = calculate_cost_simple(solution)
        threshold = initial_threshold
        no_improvement = 0
        
        for iteration in range(1, max_iterations + 1):
            neighbors = generate_neighbors_simple(solution)
            best_neighbor = None
            best_neighbor_cost = float('inf')
            best_neighbor_penalty = float('inf')
            
            for neighbor in neighbors:
                neighbor_cost, neighbor_penalty = calculate_cost_simple(neighbor)
                if neighbor_cost + neighbor_penalty < best_neighbor_cost + best_neighbor_penalty:
                    best_neighbor = neighbor
                    best_neighbor_cost = neighbor_cost
                    best_neighbor_penalty = neighbor_penalty
            
            current_total = best_cost + best_penalty
            neighbor_total = best_neighbor_cost + best_neighbor_penalty
            
            if neighbor_total <= current_total + threshold:
                solution = best_neighbor
                if neighbor_total < current_total:
                    best_solution = best_neighbor
                    best_cost = best_neighbor_cost
                    best_penalty = best_neighbor_penalty
                    no_improvement = 0
                else:
                    no_improvement += 1
            else:
                no_improvement += 1
            
            # Grafik verilerini kaydet (her 10 iterasyonda bir)
            if iteration % 10 == 0 or iteration == 1:
                iterations_data.append(restart * max_iterations + iteration)
                cost_data.append(best_cost + best_penalty)
                threshold_data.append(threshold)
                best_cost_data.append(best_cost + best_penalty)
            
            threshold *= threshold_decay
            if no_improvement > 100 or threshold < 0.001:
                break
        
        if best_cost + best_penalty < best_global_cost + best_global_penalty:
            best_global_solution = best_solution
            best_global_cost = best_cost
            best_global_penalty = best_penalty
    
    # Grafik verileri döndür
    graph_data = {
        "iterations": iterations_data,
        "cost_values": cost_data,
        "threshold_values": threshold_data,
        "best_costs": best_cost_data
    }
    
    return best_global_solution.tolist(), float(best_global_cost), float(best_global_penalty), graph_data

def solve_problem_fast(allocation_costs, resource_consumption, resource_limits, 
                       max_iterations=5000, initial_threshold=None, 
                       threshold_decay=0.995, restart_count=1):
    """Küçük problemler için optimize edilmiş basit threshold accepting."""
    num_agents = allocation_costs.shape[0]
    num_jobs = allocation_costs.shape[1]
    
    if initial_threshold is None:
        initial_threshold = np.mean(allocation_costs) * num_jobs * 0.1
    
    def generate_random_solution():
        return np.random.randint(0, num_agents, size=num_jobs)
    
    def calculate_cost_simple(solution):
        agent_consumptions = np.zeros(num_agents)
        cost = 0
        for job, agent in enumerate(solution):
            agent_consumptions[agent] += resource_consumption[agent, job]
            cost += allocation_costs[agent, job]
        violations = np.maximum(0, agent_consumptions - resource_limits)
        penalty = np.sum(violations * 1000)
        return cost, penalty
    
    def generate_neighbors_simple(solution):
        neighbors = []
        neighbor_count = min(20, num_jobs * 3)
        for _ in range(neighbor_count):
            new_solution = solution.copy()
            changes = min(2, max(1, num_jobs // 3))
            for _ in range(changes):
                job_to_change = np.random.randint(len(solution))
                new_agent = np.random.randint(num_agents)
                new_solution[job_to_change] = new_agent
            neighbors.append(new_solution)
        return neighbors
    
    best_global_solution = None
    best_global_cost = float('inf')
    best_global_penalty = float('inf')
    
    for restart in range(restart_count):
        solution = generate_random_solution()
        best_solution = solution.copy()
        best_cost, best_penalty = calculate_cost_simple(solution)
        threshold = initial_threshold
        no_improvement = 0
        
        for iteration in range(1, max_iterations + 1):
            neighbors = generate_neighbors_simple(solution)
            best_neighbor = None
            best_neighbor_cost = float('inf')
            best_neighbor_penalty = float('inf')
            
            for neighbor in neighbors:
                neighbor_cost, neighbor_penalty = calculate_cost_simple(neighbor)
                if neighbor_cost + neighbor_penalty < best_neighbor_cost + best_neighbor_penalty:
                    best_neighbor = neighbor
                    best_neighbor_cost = neighbor_cost
                    best_neighbor_penalty = neighbor_penalty
            
            current_total = best_cost + best_penalty
            neighbor_total = best_neighbor_cost + best_neighbor_penalty
            
            if neighbor_total <= current_total + threshold:
                solution = best_neighbor
                if neighbor_total < current_total:
                    best_solution = best_neighbor
                    best_cost = best_neighbor_cost
                    best_penalty = best_neighbor_penalty
                    no_improvement = 0
                else:
                    no_improvement += 1
            else:
                no_improvement += 1
            
            threshold *= threshold_decay
            if no_improvement > 100 or threshold < 0.001:
                break
        
        if best_cost + best_penalty < best_global_cost + best_global_penalty:
            best_global_solution = best_solution
            best_global_cost = best_cost
            best_global_penalty = best_penalty
    
    return best_global_solution.tolist(), float(best_global_cost), float(best_global_penalty)

def solve_problem(allocation_costs, resource_consumption, resource_limits, 
                 max_iterations=10000, initial_threshold=None, 
                 threshold_decay=0.995, restart_count=3):
    """Problem boyutuna göre algoritma seçer"""
    num_agents = allocation_costs.shape[0]
    num_jobs = allocation_costs.shape[1]
    
    # Küçük problemler için hızlı versiyon
    if num_agents <= 10 and num_jobs <= 20:
        print(f"🚀 Using fast algorithm for small problem ({num_agents}x{num_jobs})")
        return solve_problem_fast(
            allocation_costs, resource_consumption, resource_limits,
            max_iterations, initial_threshold, threshold_decay, restart_count
        )
    else:
        print(f"🔧 Using complex algorithm for large problem ({num_agents}x{num_jobs})")
        return solve_problem_complex(
            allocation_costs, resource_consumption, resource_limits,
            max_iterations, initial_threshold, threshold_decay, restart_count
        )

def solve_problem_complex(allocation_costs, resource_consumption, resource_limits, 
                         max_iterations=10000, initial_threshold=None, 
                         threshold_decay=0.995, restart_count=3):
    """
    Improved threshold accepting algorithm for the job allocation problem.
    
    Parameters:
    -----------
    allocation_costs : numpy.ndarray
        Cost matrix for assigning jobs to agents
    resource_consumption : numpy.ndarray
        Resource consumption for each agent-job pair
    resource_limits : numpy.ndarray
        Resource limit for each agent
    max_iterations : int
        Maximum number of iterations per restart
    initial_threshold : float or None
        Starting threshold value (if None, calculated from average cost)
    threshold_decay : float
        Rate at which threshold decreases (0.995 means 0.5% reduction per iteration)
    restart_count : int
        Number of times to restart the algorithm with different initial solutions
    
    Returns:
    --------
    best_solution : list
        The best job-agent assignment found
    best_cost : float
        Total cost of the best solution
    best_penalty : float
        Total penalty of the best solution
    """
    num_agents = allocation_costs.shape[0]
    num_jobs = allocation_costs.shape[1]
    
    # Set initial threshold based on problem characteristics if not provided
    if initial_threshold is None:
        initial_threshold = np.mean(allocation_costs) * num_jobs * 0.2
    
    def generate_random_solution():
        """Generate a random assignment of jobs to agents"""
        return np.random.randint(0, num_agents, size=num_jobs)
    
    def calculate_cost(solution, iteration):
        """Calculate cost and penalty for a given solution"""
        agent_consumptions = np.zeros(num_agents)
        job_costs = np.zeros(num_jobs)
        
        for job, agent in enumerate(solution):
            agent_consumptions[agent] += resource_consumption[agent, job]
            job_costs[job] = allocation_costs[agent, job]
            
        cost = np.sum(job_costs)
        
        # More sophisticated penalty calculation with progressive weighting
        violations = np.maximum(0, agent_consumptions - resource_limits)
        penalty_factor = 1 + np.exp(min(20, iteration / (max_iterations * 0.2)))
        penalty = np.sum(violations * 1100 * penalty_factor)
        
        return cost, penalty, job_costs, agent_consumptions
    
    def generate_neighbors(solution, current_job_costs, current_agent_consumptions, iteration):
        """Generate candidate neighbor solutions with intelligent selection"""
        # Küçük problemler için daha az komşu
        neighbor_count = min(30, max(10, int(num_jobs * 0.8)))  # Azaltıldı
        # Değişiklik sayısını da azalt
        change_count = max(1, min(3, int(np.log2(num_jobs))))  # Maksimum 3
        
        neighbors = []
        for _ in range(neighbor_count):
            new_solution = solution.copy()
            
            # Küçük problemlerde daha az karmaşık strateji
            if iteration > max_iterations * 0.2:  # %20'den sonra akıllı seçim
                # Sadece en pahalı 2-3 işi hedefle
                expensive_jobs = np.argsort(current_job_costs)[-min(3, num_jobs):]
                for _ in range(change_count):
                    if len(expensive_jobs) > 0:
                        job_to_change = np.random.choice(expensive_jobs)
                        new_agent = np.random.randint(num_agents)
                        new_solution[job_to_change] = new_agent
            else:
                # Erken dönemde basit rastgele
                for _ in range(change_count):
                    job_to_change = np.random.randint(len(solution))
                    new_agent = np.random.randint(num_agents)
                    new_solution[job_to_change] = new_agent
                    
            neighbors.append(new_solution)
            
        return neighbors
    
    def local_search(solution, job_costs, agent_consumptions):
        """Apply greedy local search to improve a solution"""
        improved = True
        improved_solution = solution.copy()
        current_cost = np.sum(job_costs)
        
        agent_consumptions = agent_consumptions.copy()  # Create a copy to avoid modifying the original
        
        while improved:
            improved = False
            for job in range(num_jobs):
                current_agent = improved_solution[job]
                current_job_cost = allocation_costs[current_agent, job]
                current_resource = resource_consumption[current_agent, job]
                
                best_delta = 0
                best_agent = current_agent
                
                for agent in range(num_agents):
                    if agent == current_agent:
                        continue
                        
                    # Calculate cost delta
                    new_cost = allocation_costs[agent, job]
                    cost_delta = new_cost - current_job_cost
                    
                    # Calculate penalty delta
                    new_consumption = agent_consumptions.copy()
                    new_consumption[current_agent] -= current_resource
                    new_consumption[agent] += resource_consumption[agent, job]
                    
                    old_violations = np.maximum(0, agent_consumptions - resource_limits)
                    new_violations = np.maximum(0, new_consumption - resource_limits)
                    
                    old_penalty = np.sum(old_violations * 1100)
                    new_penalty = np.sum(new_violations * 1100)
                    penalty_delta = new_penalty - old_penalty
                    
                    total_delta = cost_delta + penalty_delta
                    
                    if total_delta < best_delta:
                        best_delta = total_delta
                        best_agent = agent
                
                # Apply the best move if it improves the solution
                if best_delta < 0:
                    improved = True
                    improved_solution[job] = best_agent
                    
                    # Update tracking variables
                    agent_consumptions[current_agent] -= current_resource
                    agent_consumptions[best_agent] += resource_consumption[best_agent, job]
                    job_costs[job] = allocation_costs[best_agent, job]
                    
        return improved_solution
    
    # Multi-start strategy variables
    best_global_solution = None
    best_global_cost = float('inf')
    best_global_penalty = float('inf')
    
    # Multi-start strategy
    for restart in range(restart_count):
        solution = generate_random_solution()
        best_solution = solution.copy()
        best_cost, best_penalty, job_costs, agent_consumptions = calculate_cost(solution, 0)
        
        threshold = initial_threshold
        no_improvement_count = 0
        
        for iteration in range(1, max_iterations + 1):
            neighbors = generate_neighbors(solution, job_costs, agent_consumptions, iteration)
            
            best_neighbor = None
            best_neighbor_cost = float('inf')
            best_neighbor_penalty = float('inf')
            
            for neighbor in neighbors:
                neighbor_cost, neighbor_penalty, n_job_costs, n_agent_consumptions = calculate_cost(neighbor, iteration)
                total_neighbor_cost = neighbor_cost + neighbor_penalty
                
                if total_neighbor_cost < best_neighbor_cost + best_neighbor_penalty:
                    best_neighbor = neighbor
                    best_neighbor_cost = neighbor_cost
                    best_neighbor_penalty = neighbor_penalty
                    best_n_job_costs = n_job_costs
                    best_n_agent_consumptions = n_agent_consumptions
            
            total_current_cost = best_cost + best_penalty
            total_neighbor_cost = best_neighbor_cost + best_neighbor_penalty
            
            # Threshold accepting criterion
            if total_neighbor_cost <= total_current_cost + threshold:
                solution = best_neighbor
                job_costs = best_n_job_costs
                agent_consumptions = best_n_agent_consumptions
                
                if total_neighbor_cost < total_current_cost:
                    best_solution = best_neighbor
                    best_cost = best_neighbor_cost
                    best_penalty = best_neighbor_penalty
                    no_improvement_count = 0
                else:
                    no_improvement_count += 1
            else:
                no_improvement_count += 1
            
            # Apply threshold decay
            threshold *= threshold_decay
            
            # Apply threshold reheating when stuck
            if no_improvement_count >= 100:  # Azaltıldı 200'den 100'e
                threshold = initial_threshold * (0.5 ** restart)
                no_improvement_count = 0
                
                # Apply local search to the best solution found so far
                if iteration > max_iterations * 0.3:  # %50'den %30'a çekildi
                    improved_solution = local_search(best_solution, job_costs, agent_consumptions)
                    improved_cost, improved_penalty, improved_job_costs, improved_agent_consumptions = calculate_cost(improved_solution, iteration)
                    
                    if improved_cost + improved_penalty < best_cost + best_penalty:
                        best_solution = improved_solution
                        best_cost = improved_cost
                        best_penalty = improved_penalty
                        job_costs = improved_job_costs
                        agent_consumptions = improved_agent_consumptions
            
            # Early stopping - daha agresif
            if threshold < 1e-5 or (no_improvement_count > 150 and iteration > max_iterations * 0.2):  # Daha erken dur
                break
        
        # Apply final local search
        final_solution = local_search(best_solution, job_costs, agent_consumptions)
        final_cost, final_penalty, _, _ = calculate_cost(final_solution, max_iterations)
        
        if final_cost + final_penalty < best_cost + best_penalty:
            best_solution = final_solution
            best_cost = final_cost
            best_penalty = final_penalty
        
        # Update global best
        if best_cost + best_penalty < best_global_cost + best_global_penalty:
            best_global_solution = best_solution
            best_global_cost = best_cost
            best_global_penalty = best_penalty
    
    return best_global_solution.tolist(), float(best_global_cost), float(best_global_penalty)

@app.route("/solve", methods=["POST"])
def solve():
    import time
    start_time = time.time()
    
    data = request.get_json()
    try:
        allocation_costs = np.array(data["allocation_costs"])
        resource_consumption = np.array(data["resource_consumption"])
        resource_limits = np.array(data["resource_limits"])

        # Get optional parameters if provided
        max_iterations = data.get("max_iterations", 10000)
        initial_threshold = data.get("initial_threshold", None)
        threshold_decay = data.get("threshold_decay", 0.995)
        restart_count = data.get("restart_count", 3)

        print(f"🚀 Starting optimization with parameters:")
        print(f"   Iterations: {max_iterations}")
        print(f"   Threshold Decay: {threshold_decay}")
        print(f"   Restarts: {restart_count}")
        print(f"   Problem Size: {allocation_costs.shape[0]} agents, {allocation_costs.shape[1]} jobs")

        try:
            best_solution, best_cost, best_penalty, graph_data = solve_problem(
                allocation_costs, 
                resource_consumption, 
                resource_limits,
                max_iterations=max_iterations,
                initial_threshold=initial_threshold,
                threshold_decay=threshold_decay,
                restart_count=restart_count
            )
        except ValueError as e:
            # Eski versiyonla uyumlu olması için fallback
            print(f"⚠️ Falling back to simple version: {e}")
            result = solve_problem_fast(
                allocation_costs, 
                resource_consumption, 
                resource_limits,
                max_iterations=max_iterations,
                initial_threshold=initial_threshold,
                threshold_decay=threshold_decay,
                restart_count=restart_count
            )
            if len(result) == 4:
                best_solution, best_cost, best_penalty, graph_data = result
            else:
                best_solution, best_cost, best_penalty = result
                graph_data = {"iterations": [], "cost_values": [], "threshold_values": [], "best_costs": []}

        end_time = time.time()
        execution_time = end_time - start_time

        print(f"✅ Optimization completed in {execution_time:.3f} seconds")
        print(f"   Best Cost: {best_cost}")
        print(f"   Best Penalty: {best_penalty}")
        print(f"   Total Cost: {best_cost + best_penalty}")
        
        # Grafik verisi kontrolü
        if 'graph_data' in locals() and graph_data:
            print(f"📊 Graph data generated: {len(graph_data.get('iterations', []))} points")
            print(f"   Iterations range: {min(graph_data.get('iterations', [0])) if graph_data.get('iterations') else 0} - {max(graph_data.get('iterations', [0])) if graph_data.get('iterations') else 0}")
            print(f"   Cost range: {min(graph_data.get('cost_values', [0])) if graph_data.get('cost_values') else 0} - {max(graph_data.get('cost_values', [0])) if graph_data.get('cost_values') else 0}")
        else:
            print("⚠️ No graph data generated")

        response_data = {
            "best_solution": best_solution,
            "best_cost": best_cost,
            "best_penalty": best_penalty,
            "execution_time_seconds": round(execution_time, 3),
            "execution_time_ms": round(execution_time * 1000, 1),
            "algorithm": "improved_threshold_accepting",
            "parameters": {
                "max_iterations": max_iterations,
                "threshold_decay": threshold_decay,
                "restart_count": restart_count
            }
        }
        
        # Grafik verisi varsa ekle
        if 'graph_data' in locals() and graph_data:
            response_data["graph_data"] = graph_data
            
        return jsonify(response_data)
    except Exception as e:
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"❌ Error after {execution_time:.3f} seconds: {str(e)}")
        return jsonify({
            "error": str(e),
            "execution_time_seconds": round(execution_time, 3)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)