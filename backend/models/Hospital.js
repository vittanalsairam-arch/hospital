const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  subCityId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCity' },
  address: { type: String, required: true },
  phone: { type: String },
  hospitalType: { type: String },
  emergencyAvailable: { type: Boolean, default: false },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }]
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
