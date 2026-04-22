/**
 * Haversine Formula: Calculates the great-circle distance between two points
 */
function haversine(a, b) {
    // Check for nested location objects or flat lat/lng
    const lat1 = a.lat || (a.location && a.location.lat);
    const lon1 = a.lng || a.lon || (a.location && (a.location.lng || a.location.lon));
    const lat2 = b.lat || (b.location && b.location.lat);
    const lon2 = b.lng || b.lon || (b.location && (b.location.lng || b.location.lon));

    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;

    const toRad = deg => (parseFloat(deg) * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const aa = Math.sin(dLat / 2) ** 2 +
               Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(aa));
}

/**
 * Creates a distance matrix for the algorithm
 */
function computeDistanceMatrix(nodes) {
    const n = nodes.length;
    const dist = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const d = haversine(nodes[i], nodes[j]);
            dist[i][j] = d;
            dist[j][i] = d;
        }
    }
    return dist;
}

/**
 * Main Standalone ACO Function 
 * - Filters by predicted_weight > 20kg
 * - Returns structured data for terminal and frontend
 */
function runSmartACO(allNodes, options = {}) {
    // 1. FILTERING: Use 20kg threshold
    const weightThreshold = 20;
    
    const nodes = allNodes.filter((node, index) => {
        if (index === 0) return true; // Always keep Depot
        // Ensure weight is treated as a number
        const weight = parseFloat(node.predicted_weight || 0);
        return weight > weightThreshold;
    });

    const n = nodes.length;

    // Handle edge cases to prevent "undefined" errors in logs
    if (n === 0) {
        return { 
            route: [], 
            distance: 0, 
            unit: "km", 
            binsCollected: 0,
            duration: { totalMinutes: 0, formatted: "0m", driveTimeMinutes: 0, serviceTimeMinutes: 0 } 
        };
    }
    if (n === 1) {
        return { 
            route: [nodes[0]], 
            distance: 0, 
            unit: "km", 
            binsCollected: 0,
            duration: { totalMinutes: 0, formatted: "0m", driveTimeMinutes: 0, serviceTimeMinutes: 0 } 
        };
    }

    // 2. PARAMETERS
    const {
        ants = Math.min(n, 40),
        iterations = 100,
        alpha = 1,      
        beta = 3,       
        evaporation = 0.4,
        Q = 100,
        avgSpeed = 30,
        serviceTime = 2 
    } = options;

    const dist = computeDistanceMatrix(nodes);
    let pher = Array.from({ length: n }, () => Array(n).fill(1.0));
    let bestRoute = null;
    let bestDist = Infinity;

    // 3. SELECTION LOGIC
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
        if (probs.length === 0 || denom === 0) return null;

        let r = Math.random() * denom;
        for (const p of probs) {
            r -= p.val;
            if (r <= 0) return p.j;
        }
        return probs[probs.length - 1].j;
    }

    // 4. MAIN OPTIMIZATION LOOP
    for (let iter = 0; iter < iterations; iter++) {
        const allAntPaths = [];
        for (let a = 0; a < ants; a++) {
            const start = 0; 
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
            
            let d = 0;
            for (let k = 0; k < route.length - 1; k++) {
                d += dist[route[k]][route[k + 1]];
            }
            allAntPaths.push({ route, d });
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                pher[i][j] *= (1 - evaporation);
                if (pher[i][j] < 0.0001) pher[i][j] = 0.0001; 
            }
        }

        for (const ant of allAntPaths) {
            if (ant.d < bestDist && ant.route.length === n) {
                bestDist = ant.d;
                bestRoute = [...ant.route];
            }
            const deposit = Q / (ant.d + 1e-6);
            for (let k = 0; k < ant.route.length - 1; k++) {
                const i = ant.route[k], j = ant.route[k + 1];
                pher[i][j] += deposit;
                pher[j][i] += deposit;
            }
        }
    }

    // 5. FINAL CALCULATIONS
    const finalDist = bestDist === Infinity ? 0 : bestDist;
    const driveTimeMinutes = (finalDist / avgSpeed) * 60;
    const totalServiceTimeMinutes = (n - 1) * serviceTime;
    const totalDurationMinutes = driveTimeMinutes + totalServiceTimeMinutes;
    
    const hours = Math.floor(totalDurationMinutes / 60);
    const mins = Math.round(totalDurationMinutes % 60);

    const routeNodes = (bestRoute || [nodes[0]]).map(i => nodes[i]);

    return { 
        route: routeNodes, 
        distance: parseFloat(finalDist.toFixed(2)),
        unit: "km",
        binsCollected: n - 1,
        duration: {
            totalMinutes: Math.round(totalDurationMinutes),
            formatted: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
            driveTimeMinutes: Math.round(driveTimeMinutes),
            serviceTimeMinutes: totalServiceTimeMinutes
        }
    };
}

module.exports = { runSmartACO };