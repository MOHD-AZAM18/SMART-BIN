const express = require('express');
const router = express.Router();
const { runACO } = require('../aco/aco');
const fixedBins = require('../Data/fixedData.json');
const Complaint = require('../models/Complaint');

// --- STANDARD ROUTE ---
router.get('/', (req, res) => {
  try {
    const binsToCollect = fixedBins.filter((bin, index) => {
      return index === 0 || bin.fillLevel >= 80;
    });

    if (binsToCollect.length <= 1) {
      return res.json({ 
        route: binsToCollect, 
        distance: 0, 
        duration: { totalMinutes: 0, formatted: "0m" }, 
        message: "All bins below threshold." 
      });
    }

    const result = runACO(binsToCollect, { avgSpeed: 30, serviceTime: 2 });
    
    res.json({ 
      ...result, 
      totalFullBins: binsToCollect.length - 1 
    });
  } catch (err) {
    res.status(500).json({ route: [], distance: 0, error: "Standard calculation failed" });
  }
});

// --- EMERGENCY ROUTE ---
router.get('/complaint-optimization', async (req, res) => {
  try {
    const activeComplaints = await Complaint.find({ 
      reportedFillLevel: { $gte: 80 },
      status: "Pending" 
    });

    if (activeComplaints.length === 0) {
      return res.status(404).json({ message: "No critical complaints to optimize." });
    }

    const formattedBins = activeComplaints.map(c => ({
      binId: c.binId,
      location: c.location,
      fillLevel: c.reportedFillLevel,
      position: c.position
    }));

    const depot = fixedBins[0]; 
    const binsToVisit = [depot, ...formattedBins];

    const result = runACO(binsToVisit, { 
      avgSpeed: 40,
      serviceTime: 5 
    });

    res.json({
      ...result,
      source: "Manual Complaints",
      totalFullBins: formattedBins.length
    });

  } catch (err) {
    console.error("Emergency ACO Error:", err);
    res.status(500).json({ 
      route: [], 
      distance: 0, 
      duration: { totalMinutes: 0, formatted: "0m" }, 
      error: "Emergency calculation failed" 
    });
  }
});

// --- ✅ HISTORY ROUTE (Added for History.js) ---
router.get('/history', async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required." });
    }

    // Professional Date Handling:
    // Create a range from the very start of the 'start' day to the very end of the 'end' day
    const queryStart = new Date(start);
    const queryEnd = new Date(end);
    queryEnd.setHours(23, 59, 59, 999);

    console.log(`Fetching history from ${queryStart} to ${queryEnd}`);

    const historicalComplaints = await Complaint.find({
      createdAt: { // Ensure your Schema uses 'createdAt' or change this to your date field
        $gte: queryStart,
        $lte: queryEnd
      }
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(historicalComplaints);
  } catch (err) {
    console.error("History API Error:", err);
    res.status(500).json({ message: "Failed to fetch historical data." });
  }
});

module.exports = router;