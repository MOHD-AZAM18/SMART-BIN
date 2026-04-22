/**
 * Haversine Formula: Calculates the great-circle distance between two points
 * @param {Object} a - {lat, lng}
 * @param {Object} b - {lat, lng}
 */
function haversine(a, b) {
  if (!a || !b) return 0;
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  
  const aa = Math.sin(dLat / 2) ** 2 + 
             Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(aa));
}

/**
 * Creates a pre-computed matrix of distances between all nodes
 */
function computeDistanceMatrix(nodes) {
  const n = nodes.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversine(nodes[i].location, nodes[j].location);
      dist[i][j] = d;
      dist[j][i] = d;
    }
  }
  return dist;
}

/**
 * Main Ant Colony Optimization Function
 * Includes distance and time estimation logic
 */
function runACO(nodes, options = {}) {
  const n = nodes.length;
  if (n === 0) return { route: [], distance: 0, duration: { totalMinutes: 0, formatted: "0m" } };
  if (n === 1) return { route: [nodes[0]], distance: 0, duration: { totalMinutes: 0, formatted: "0m" } };

  const dist = computeDistanceMatrix(nodes);
  
  // Parameters
  const {
    ants = 25,
    iterations = 50,
    alpha = 1,      // Pheromone importance
    beta = 2,       // Distance importance
    evaporation = 0.5,
    Q = 100,
    avgSpeed = 30,    // Average speed in km/h
    serviceTime = 2   // Average minutes spent at each stop/bin
  } = options;

  let pher = Array.from({ length: n }, () => Array(n).fill(1.0));
  let bestRoute = null;
  let bestDist = Infinity;

  // Probability function for ants to choose the next node
  function chooseNext(curr, visited) {
    const probs = [];
    let denom = 0;
    for (let j = 0; j < n; j++) {
      if (!visited.has(j)) {
        const tau = Math.pow(pher[curr][j], alpha);
        const eta = Math.pow(1.0 / (dist[curr][j] + 1e-6), beta);
        const val = tau * eta;
        probs.push({ j, val });
        denom += val;
      }
    }
    if (probs.length === 0) return null;

    let r = Math.random() * denom;
    for (const p of probs) {
      r -= p.val;
      if (r <= 0) return p.j;
    }
    return probs[probs.length - 1].j;
  }

  // Iteration Loop
  for (let iter = 0; iter < iterations; iter++) {
    const allAnts = [];
    for (let a = 0; a < ants; a++) {
      const start = 0; // Depot
      const visited = new Set([start]);
      const route = [start];
      let curr = start;

      while (visited.size < n) {
        const nxt = chooseNext(curr, visited);
        if (nxt === null) break;
        route.push(nxt);
        visited.add(nxt);
        curr = nxt;
      }
      allAnts.push(route);
    }

    // Pheromone Evaporation
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        pher[i][j] *= (1 - evaporation);
      }
    }

    // Pheromone Update
    for (const route of allAnts) {
      let d = 0;
      for (let k = 0; k < route.length - 1; k++) {
        d += dist[route[k]][route[k + 1]];
      }

      if (d < bestDist) {
        bestDist = d;
        bestRoute = [...route];
      }

      const deposit = Q / (d + 1e-6);
      for (let k = 0; k < route.length - 1; k++) {
        const i = route[k], j = route[k + 1];
        pher[i][j] += deposit;
        pher[j][i] += deposit;
      }
    }
  }

  // --- Time Calculations ---
  // Drive time based on distance and average speed
  const driveTimeMinutes = (bestDist / avgSpeed) * 60;
  
  // Service time (n - 1 because we don't 'service' the depot starting point)
  const totalServiceTimeMinutes = (n - 1) * serviceTime;
  
  const totalDurationMinutes = driveTimeMinutes + totalServiceTimeMinutes;
  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = Math.round(totalDurationMinutes % 60);

  // Mapping back to original objects
  const routeNodes = (bestRoute || []).map(i => nodes[i]);
  
  return { 
    route: routeNodes, 
    distance: parseFloat(bestDist.toFixed(2)),
    unit: "km",
    duration: {
      totalMinutes: Math.round(totalDurationMinutes),
      formatted: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
      driveTimeMinutes: Math.round(driveTimeMinutes),
      serviceTimeMinutes: totalServiceTimeMinutes
    }
  };
}

module.exports = { runACO };