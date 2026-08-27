const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest booking is allowed
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String, required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  status: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  },
  appointmentId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
