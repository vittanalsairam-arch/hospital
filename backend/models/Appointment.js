const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String, default: '' },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm or format
  status: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  },
  appointmentId: { type: String, required: true, unique: true },
  opToken: { type: String, default: 'OP-01' },
  roomNo: { type: String, default: 'OPD Counter 102' },
  consultationFee: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'Paid (Online)' },
  abhaId: { type: String, default: '9821-4412-8820' },
  symptoms: { type: String, default: 'General Outpatient Consultation' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

