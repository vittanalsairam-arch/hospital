const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  slotDuration: { type: Number, required: true }, // minutes
  totalSlots: { type: Number, required: true },
  bookedSlots: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'LIMITED', 'FULL', 'UNAVAILABLE', 'LEAVE', 'HOSPITAL_CLOSED'],
    default: 'AVAILABLE'
  }
}, { timestamps: true });

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
