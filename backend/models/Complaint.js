const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  binId: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  reportedFillLevel: { type: Number, required: true },
  position: { type: String, required: true }, // Added for address
  reportedBy: { type: String, default: 'Area Sweeper Head' },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);