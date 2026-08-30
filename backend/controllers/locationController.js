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
    const [states, districts, cities, subCities, hospitals, doctors, scheduleStats] = await Promise.all([
      State.find({}).sort({ name: 1 }).lean(),
      District.find({}).sort({ name: 1 }).lean(),
      City.find({}).sort({ name: 1 }).lean(),
      SubCity.find({}).sort({ name: 1 }).lean(),
      Hospital.find({}).populate('departments').lean(),
      Doctor.find({}).populate('departmentId').lean(),
      DoctorSchedule.aggregate([
        {
          $group: {
            _id: '$doctorId',
            totalSlots: { $sum: 1 },
            freeSlots: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ['$status', 'AVAILABLE'] }, { $lt: ['$bookedSlots', '$totalSlots'] }] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    // Map schedules count per doctor
    const doctorStatusMap = {};
    scheduleStats.forEach(stat => {
      if (stat._id) {
        doctorStatusMap[stat._id.toString()] = {
          totalSlots: stat.totalSlots,
          freeSlots: stat.freeSlots,
          isAvailable: stat.freeSlots > 0
        };
      }
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
