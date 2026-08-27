const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // years
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  consultationFee: { type: Number, required: true },
  profileImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
