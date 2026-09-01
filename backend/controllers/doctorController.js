const Doctor = require('../models/Doctor');
const DoctorSchedule = require('../models/DoctorSchedule');

exports.getDoctors = async (req, res) => {
  try {
    const { hospitalId, departmentId, specialization } = req.query;
    let query = {};
    if (hospitalId) query.hospitalId = hospitalId;
    if (departmentId) query.departmentId = departmentId;
    if (specialization) query.specialization = specialization;
    
    const doctors = await Doctor.find(query).populate('hospitalId').populate('departmentId');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitalId').populate('departmentId');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { doctorId: req.params.doctorId };
    if (date) query.date = date; // Expecting YYYY-MM-DD
    
    const schedules = await DoctorSchedule.find(query).sort({ date: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find available alternative doctors when a target doctor is full / unavailable
exports.getAlternativeDoctors = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDoctor = await Doctor.findById(id).populate('hospitalId');
    if (!currentDoctor) return res.status(404).json({ message: 'Doctor not found' });

    // 1. Search for other doctors in the SAME hospital or SAME department
    const hospId = currentDoctor.hospitalId?._id || currentDoctor.hospitalId;
    const orConditions = [
      { specialization: currentDoctor.specialization }
    ];
    if (hospId) orConditions.push({ hospitalId: hospId });
    if (currentDoctor.departmentId) orConditions.push({ departmentId: currentDoctor.departmentId });

    let alternativeQuery = {
      _id: { $ne: currentDoctor._id },
      $or: orConditions
    };

    let alternatives = await Doctor.find(alternativeQuery)
      .populate('hospitalId')
      .populate('departmentId')
      .limit(6);

    // Filter to those who have available schedules
    const results = [];
    for (const doc of alternatives) {
      const docSchedules = await DoctorSchedule.find({
        doctorId: doc._id,
        status: 'AVAILABLE'
      });
      const availableSlotsCount = docSchedules.filter(s => s.bookedSlots < s.totalSlots).length;

      results.push({
        ...doc.toObject(),
        availableSlotsCount,
        isAvailable: availableSlotsCount > 0,
        nextAvailableSlot: docSchedules.length > 0 ? `${docSchedules[0].date} ${docSchedules[0].startTime}` : 'Today 09:00 AM'
      });
    }

    // Sort available ones first
    results.sort((a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
