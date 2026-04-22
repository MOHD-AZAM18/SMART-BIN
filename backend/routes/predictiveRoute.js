const express = require('express');
const router = express.Router();
const { runSinglePrediction } = require('../ml_service');
const { runSmartACO } = require('../aco/aco_predict');

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

router.post('/process-intelligence', async (req, res) => {
    try {
        const { complaints } = req.body; 
        const now = new Date();
        
        // Setup Today's bounds for filtering
        const todayStr = now.toISOString().split('T')[0]; // Result: "2026-04-21"

        if (!complaints) {
            return res.status(400).json({ error: "Complaints data is required" });
        }

        // --- FILTER: Only complaints from today ---
        const todaysComplaints = complaints.filter(c => {
            if (!c.createdAt) return false; // Skip if no date field
            const complaintDate = new Date(c.createdAt).toISOString().split('T')[0];
            return complaintDate === todayStr;
        });

        if (todaysComplaints.length === 0) {
            console.log(`\n--- 🧠 INTELLIGENCE HUB: No complaints for today (${todayStr}) ---`);
            return res.json({
                success: true,
                totalAnalyzed: 0,
                heavyBinsFound: 0,
                results: [],
                route: { distance: 0, duration: { formatted: '0 mins' }, route: [] },
                message: "No complaints filed today."
            });
        }

        const processedComplaints = [];
        console.log(`\n--- 🧠 STARTING TODAY'S COMPLAINT INTELLIGENCE ---`);
        console.log(`📅 Date: ${todayStr} | 📍 Processing ${todaysComplaints.length} locations...`);

        // 1. Intelligence Loop
        for (let complaint of todaysComplaints) {
            const features = [
                parseFloat(complaint.lat), 
                parseFloat(complaint.lon), 
                500, 100, 1, 5, 10, 0, 0, 
                getRandom(1, 24),    
                getRandom(0, 5),     
                getRandom(1, 10),    
                now.getDate(), 
                now.getMonth() + 1, 
                now.getDay()
            ];

            const priorityScore = await runSinglePrediction(features);
            
            processedComplaints.push({
                ...complaint,
                predicted_weight: priorityScore, 
                location: { 
                    lat: parseFloat(complaint.lat), 
                    lng: parseFloat(complaint.lon) 
                }
            });
        }

        // 2. Run Optimization
        const smartRouteResult = runSmartACO(processedComplaints);

        // --- 3. TERMINAL LOGGING ---
        console.log(`\n--- 🚛 TODAY'S RESOLUTION ROUTE ---`);
        console.log(`📏 Total Distance: ${smartRouteResult.distance} km`);
        console.log(`🚩 Today's Issues Handled: ${smartRouteResult.binsCollected}`);
        
        const pathString = smartRouteResult.route && smartRouteResult.route.length > 0
            ? smartRouteResult.route.map((node, i) => `${i === 0 ? '🏢' : '🚩'} ${node.title || 'Issue'}`).join(' -> ')
            : "No path generated";
        
        console.log(`🛣️  OPTIMAL SEQUENCE: ${pathString}`);

        // 4. Send Response
        res.json({
            success: true,
            totalAnalyzed: processedComplaints.length,
            heavyBinsFound: smartRouteResult.binsCollected,
            results: processedComplaints,
            route: smartRouteResult
        });

    } catch (error) {
        console.error("\n❌ Intelligence Hub Error:", error);
        res.status(500).json({ success: false, error: "Failed to process today's intelligence." });
    }
});

module.exports = router;