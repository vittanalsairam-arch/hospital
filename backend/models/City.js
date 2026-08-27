const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
