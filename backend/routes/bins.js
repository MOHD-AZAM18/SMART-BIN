const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Schema Definition
const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  fillLevel: { type: Number, default: 0 },
  position: { type: String, required: true }
});

// 2. Model Definition (Collection name: allBins)
const Bin = mongoose.model('Bin', binSchema, 'allBins');

// --- ROUTES ---

// GET: Fetch all bins
router.get('/', async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (error) {
    console.error("Database Fetch Error:", error);
    res.status(500).json({ message: "Error retrieving bin data" });
  }
});

// POST: Add a new bin to the database
router.post('/', async (req, res) => {
  try {
    const newBin = new Bin(req.body);
    const savedBin = await newBin.save();
    res.status(201).json(savedBin);
  } catch (error) {
    console.error("Database Insert Error:", error);
    // 11000 is the MongoDB error code for duplicate keys (unique: true)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bin ID already exists!" });
    }
    res.status(400).json({ message: "Error saving bin data" });
  }
});

// DELETE: Remove a bin by its MongoDB _id
router.delete('/:id', async (req, res) => {
  try {
    const deletedBin = await Bin.findByIdAndDelete(req.params.id);
    if (!deletedBin) {
      return res.status(404).json({ message: "Bin not found" });
    }
    res.json({ message: "Bin deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Database Delete Error:", error);
    res.status(500).json({ message: "Error deleting bin" });
  }
});

module.exports = router;