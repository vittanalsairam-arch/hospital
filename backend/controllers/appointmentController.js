const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const DoctorSchedule = require('../models/DoctorSchedule');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');

exports.bookAppointment = async (req, res) => {
  try {
    const { 
      patientName, 
      patientAge, 
      patientGender, 
      patientPhone, 
      patientEmail, 
      hospitalId, 
      doctorId, 
      departmentId, 
      date, 
      time, 
      abhaId, 
      symptoms, 
      paymentStatus 
    } = req.body;

    if (!patientName || !patientPhone || !doctorId || !hospitalId || !date || !time) {
      return res.status(400).json({ message: 'Missing required booking fields (patientName, patientPhone, doctorId, hospitalId, date, time)' });
    }

    // Find Doctor to fetch details and consultation fee
    const doctor = await Doctor.findById(doctorId).populate('hospitalId').populate('departmentId');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is in schedule (if schedule exists, update booked count)
    const schedule = await DoctorSchedule.findOne({ 
      doctorId, 
      date, 
      $or: [
        { startTime: time },
        { startTime: { $lte: time }, endTime: { $gte: time } }
      ]
    });

    if (schedule && schedule.status === 'FULL') {
      return res.status(400).json({ message: 'Selected time slot is already full. Please select another slot.' });
    }

    if (schedule) {
      schedule.bookedSlots += 1;
      if (schedule.bookedSlots >= schedule.totalSlots) {
        schedule.status = 'FULL';
      } else if (schedule.bookedSlots >= schedule.totalSlots * 0.8) {
        schedule.status = 'LIMITED';
      }
      await schedule.save();
    }

    // Generate unique verifiable Reference ID e.g. MEDOP-2026-84920
    const year = new Date().getFullYear();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `MEDOP-${year}-${randomCode}`;

    // Generate Real OPD Token number e.g. OP-07
    const todayCount = await Appointment.countDocuments({ doctorId, date });
    const opToken = `OP-${String(todayCount + 1).padStart(2, '0')}`;

    // OPD Room Assignment
    const roomNo = `OPD Room ${101 + (todayCount % 8)}, Wing ${['A', 'B', 'C'][todayCount % 3]}`;

    const newAppointment = await Appointment.create({
      patientId: req.user ? req.user._id : (req.body.patientId || null),
      patientName,
      patientAge: Number(patientAge) || 28,
      patientGender: patientGender || 'Male',
      patientPhone,
      patientEmail: patientEmail || '',
      hospitalId: doctor.hospitalId?._id || hospitalId,
      doctorId: doctor._id,
      departmentId: departmentId || doctor.departmentId?._id,
      date,
      time,
      status: 'Confirmed',
      appointmentId,
      opToken,
      roomNo,
      consultationFee: doctor.consultationFee || 500,
      paymentStatus: paymentStatus || 'Paid (Online Confirmation)',
      abhaId: abhaId || (req.user?.abhaId || `9821-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}`),
      symptoms: symptoms || 'Outpatient Consultation & Diagnosis'
    });

    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('hospitalId')
      .populate('doctorId')
      .populate('departmentId');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const { phone, email, patientId } = req.query;
    let query = {};

    if (req.user) {
      query.$or = [{ patientId: req.user._id }, { patientEmail: req.user.email }, { patientPhone: req.user.phone }];
    } else if (patientId) {
      query.patientId = patientId;
    } else if (phone) {
      query.patientPhone = phone;
    } else if (email) {
      query.patientEmail = email;
    }

    const appointments = await Appointment.find(query)
      .populate('hospitalId')
      .populate('doctorId')
      .populate('departmentId')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    let appointment = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      appointment = await Appointment.findById(id)
        .populate('hospitalId')
        .populate('doctorId')
        .populate('departmentId');
    }

    if (!appointment) {
      appointment = await Appointment.findOne({ appointmentId: id })
        .populate('hospitalId')
        .populate('doctorId')
        .populate('departmentId');
    }

    if (!appointment) {
      // Fallback: search case-insensitive or recent
      appointment = await Appointment.findOne({ appointmentId: new RegExp(id, 'i') })
        .populate('hospitalId')
        .populate('doctorId')
        .populate('departmentId');
    }

    if (!appointment) {
      return res.status(404).json({ message: 'Hospital OP Ticket not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let appointment = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      appointment = await Appointment.findById(id);
    } else {
      appointment = await Appointment.findOne({ appointmentId: id });
    }

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    appointment.status = 'Cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate an instant live real OP ticket with authentic doctor and hospital
exports.generateLiveAppointment = async (req, res) => {
  try {
    const { patientName, patientPhone, stateId, cityId, specialization } = req.body;

    // Pick a real doctor
    let docQuery = {};
    if (specialization) docQuery.specialization = new RegExp(specialization, 'i');
    
    let doctors = await Doctor.find(docQuery).populate('hospitalId').populate('departmentId').limit(20);
    if (doctors.length === 0) {
      doctors = await Doctor.find().populate('hospitalId').populate('departmentId').limit(20);
    }

    if (doctors.length === 0) {
      return res.status(400).json({ message: 'No doctors available in directory' });
    }

    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const hospital = doctor.hospitalId;

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeSlots = ['09:30 AM', '10:15 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'];
    const selectedTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];

    const year = today.getFullYear();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `MEDOP-${year}-${randomCode}`;
    const todayCount = await Appointment.countDocuments({ doctorId: doctor._id });
    const opToken = `OP-${String(todayCount + 1).padStart(2, '0')}`;
    const roomNo = `OPD Room ${101 + (todayCount % 8)}, Wing ${['A', 'B', 'C'][todayCount % 3]}`;

    const appointment = await Appointment.create({
      patientId: req.user ? req.user._id : null,
      patientName: patientName || 'Sairam Vittanala',
      patientAge: req.body.patientAge || 28,
      patientGender: req.body.patientGender || 'Male',
      patientPhone: patientPhone || '+91 98765 43210',
      patientEmail: req.body.patientEmail || 'sairam@hospitalop.in',
      hospitalId: hospital._id,
      doctorId: doctor._id,
      departmentId: doctor.departmentId?._id,
      date: dateStr,
      time: selectedTime,
      status: 'Confirmed',
      appointmentId,
      opToken,
      roomNo,
      consultationFee: doctor.consultationFee || 500,
      paymentStatus: 'Cashless (Ayushman PM-JAY / Verified)',
      abhaId: req.body.abhaId || '9821-4412-8820',
      symptoms: req.body.symptoms || 'General Health Examination & Consultation'
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('hospitalId')
      .populate('doctorId')
      .populate('departmentId');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Generate Live Appointment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

