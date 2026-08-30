const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  subCityId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCity' },
  address: { type: String, required: true },
  phone: { type: String },
  ambulancePhone: { type: String, default: '108' },
  email: { type: String, default: 'opd-desk@hospitalcare.in' },
  website: { type: String },
  hospitalType: { type: String },
  tier: { 
    type: String, 
    enum: [
      'Tier 1 - Neighborhood Clinic',
      'Tier 2 - Community Health Center (CHC)',
      'Tier 3 - Government Area Hospital',
      'Tier 4 - District Headquarters Hospital',
      'Tier 5 - Multi-Specialty Private',
      'Tier 6 - Super-Specialty Chain Branch',
      'Tier 7 - Apex Institute / AIIMS'
    ],
    default: 'Tier 5 - Multi-Specialty Private'
  },
  branchCode: { type: String, default: 'BR-MED-001' },
  parentChain: { type: String, default: 'National Healthcare Network' },
  emergencyAvailable: { type: Boolean, default: true },
  imageUrl: { type: String },
  gallery: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  bedCapacity: { type: Number, default: 250 },
  icuBeds: { type: Number, default: 40 },
  operationTheatres: { type: Number, default: 8 },
  establishedYear: { type: Number, default: 2005 },
  opdTimings: { type: String, default: 'Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 01:00 PM' },
  accreditations: [{ type: String }],
  governmentSchemes: [{ type: String }],
  facilities: [{ type: String }],
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }]
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
