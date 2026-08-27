const mongoose = require('mongoose');

const subCitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SubCity', subCitySchema);
