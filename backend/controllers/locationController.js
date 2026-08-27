const State = require('../models/State');
const District = require('../models/District');
const City = require('../models/City');
const SubCity = require('../models/SubCity');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const DoctorSchedule = require('../models/DoctorSchedule');

exports.getStates = async (req, res) => {
  try {
    const states = await State.find({}).sort({ name: 1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const { stateId } = req.query;
    let query = {};
    if (stateId) query.stateId = stateId;
    const districts = await District.find(query).sort({ name: 1 });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const { stateId, districtId } = req.query;
    let query = {};
    if (stateId) query.stateId = stateId;
    if (districtId) query.districtId = districtId;
    const cities = await City.find(query).sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubCities = async (req, res) => {
  try {
    const { stateId, districtId, cityId } = req.query;
    let query = {};
    if (stateId) query.stateId = stateId;
    if (districtId) query.districtId = districtId;
    if (cityId) query.cityId = cityId;
    const subCities = await SubCity.find(query).sort({ name: 1 });
    res.json(subCities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Returns full hierarchy tree for the 29-State Directory Explorer
exports.getLocationTree = async (req, res) => {
  try {
    const states = await State.find({}).sort({ name: 1 }).lean();
    const districts = await District.find({}).sort({ name: 1 }).lean();
    const cities = await City.find({}).sort({ name: 1 }).lean();
    const subCities = await SubCity.find({}).sort({ name: 1 }).lean();
    const hospitals = await Hospital.find({}).lean();
    const doctors = await Doctor.find({}).populate('departmentId').lean();
    const schedules = await DoctorSchedule.find({}).lean();

    // Map schedules count per doctor
    const doctorStatusMap = {};
    doctors.forEach(doc => {
      const docSchedules = schedules.filter(s => s.doctorId.toString() === doc._id.toString());
      const freeSlots = docSchedules.filter(s => s.status === 'AVAILABLE' && s.bookedSlots < s.totalSlots).length;
      doctorStatusMap[doc._id.toString()] = {
        totalSlots: docSchedules.length,
        freeSlots,
        isAvailable: freeSlots > 0
      };
    });

    res.json({
      states,
      districts,
      cities,
      subCities,
      hospitals,
      doctors,
      doctorStatusMap
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
