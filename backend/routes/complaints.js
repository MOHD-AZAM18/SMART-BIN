const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

// --- BIN MODEL SETUP ---
// Define Bin Schema locally to ensure we can access bin locations during complaint registration
const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  position: { type: String }, 
  fillLevel: { type: Number, default: 0 }
});

const Bin = mongoose.models.Bin || mongoose.model('Bin', binSchema);

/**
 * ✅ POST: Register a new complaint
 * Automatically pulls location data from the Bins collection
 */
router.post('/register', async (req, res) => {
  try {
    const { binId, reportedFillLevel } = req.body;
    const binExists = await Bin.findOne({ binId: binId });
    
    if (!binExists) {
      return res.status(404).json({ 
        success: false, 
        message: `Bin ID ${binId} not found.` 
      });
    }

    const newComplaint = new Complaint({
      binId,
      location: binExists.location,
      position: binExists.position || "Address Not Specified",
      reportedFillLevel,
      status: "Pending" // Default status for new complaints
    });
    
    await newComplaint.save();

    // Sync the bin's fill level with the reported level
    binExists.fillLevel = reportedFillLevel;
    await binExists.save();

    res.status(201).json({ success: true, complaint: newComplaint });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ GET: View all complaints (General fetch)
 */
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ GET: Fetch complaints within a specific date range (For History.js)
 * Logic: Sets query end to 23:59:59 to include reports from the final day.
 */
router.get('/history', async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both start and end dates." 
      });
    }

    const queryStart = new Date(start);
    const queryEnd = new Date(end);
    queryEnd.setHours(23, 59, 59, 999); // Inclusion of full end-day logs

    const historicalData = await Complaint.find({
      createdAt: {
        $gte: queryStart,
        $lte: queryEnd
      }
    }).sort({ createdAt: -1 });

    res.json(historicalData);
  } catch (err) {
    console.error("History Retrieval Error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to retrieve historical logs." 
    });
  }
});

/**
 * ✅ DELETE: Remove a single complaint log by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ success: false, message: "Complaint log not found" });
    }

    res.json({ success: true, message: "Complaint log removed successfully", id });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * ✅ DELETE: Clear all complaints
 */
router.delete('/actions/clear-all', async (req, res) => {
  try {
    await Complaint.deleteMany({});
    res.json({ success: true, message: "All logs cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;