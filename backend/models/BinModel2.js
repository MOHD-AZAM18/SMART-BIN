const mongoose = require('mongoose'); // This line was missing

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  fillLevel: { type: Number, default: 0 }
});

// Use 'Bin' if binModel.js isn't using it, or 'BinSimulator' if it is
const Bin = mongoose.models.Bin || mongoose.model('Bin', binSchema);

module.exports = {
  setAll: async (binsArray) => {
    await Bin.deleteMany({});
    return await Bin.insertMany(binsArray);
  },
  getAll: async () => {
    return await Bin.find({});
  }
};