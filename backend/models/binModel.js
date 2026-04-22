const mongoose = require('mongoose');

// 1. Define the Minimalist Schema
const binSchema = new mongoose.Schema({
  binId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Bin = mongoose.model('Bin', binSchema);

// 2. Export Database Logic
module.exports = {
  // Fetch all bins from the DB
  getAll: async () => {
    return await Bin.find({});
  },

  // Update a bin's location or details
  updateBin: async (binId, updates) => {
    return await Bin.findOneAndUpdate(
      { binId: binId },
      updates,
      { new: true } // Returns the updated document
    );
  },

  // Reset/Seed the database
  setAll: async (binsArray) => {
    await Bin.deleteMany({});
    return await Bin.insertMany(binsArray);
  }
};