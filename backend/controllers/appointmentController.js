const Appointment = require('../models/Appointment');
const DoctorSchedule = require('../models/DoctorSchedule');

exports.bookAppointment = async (req, res) => {
  try {
    const { patientName, patientAge, patientGender, patientPhone, patientEmail, hospitalId, doctorId, departmentId, date, time } = req.body;
    
    // Check if slot is available in schedule
    const schedule = await DoctorSchedule.findOne({ doctorId, date, startTime: { $lte: time }, endTime: { $gte: time } });
    
    // In a real system, you'd calculate exact 15-min slots. For MVP, we simply allow booking if date matches and we aren't FULL
    if (!schedule || schedule.status === 'FULL' || schedule.bookedSlots >= schedule.totalSlots) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }

    // Generate unique ID MEDOP-YYYY-RANDOM
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `MEDOP-${year}-${random}`;

    const appointment = await Appointment.create({
      patientId: req.user ? req.user._id : null,
      patientName, patientAge, patientGender, patientPhone, patientEmail,
      hospitalId, doctorId, departmentId, date, time, appointmentId
    });

    // Update schedule booked slots
    schedule.bookedSlots += 1;
    if (schedule.bookedSlots >= schedule.totalSlots) {
      schedule.status = 'FULL';
    } else if (schedule.bookedSlots >= schedule.totalSlots * 0.8) {
      schedule.status = 'LIMITED';
    }
    await schedule.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    // Assuming user is attached by auth middleware
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('hospitalId')
      .populate('doctorId')
      .populate('departmentId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('hospitalId')
      .populate('doctorId')
      .populate('departmentId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    appointment.status = 'Cancelled';
    await appointment.save();
    
    // Logic to decrease bookedSlots in schedule could go here
    
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
