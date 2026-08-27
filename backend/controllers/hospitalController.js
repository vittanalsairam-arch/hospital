const Hospital = require('../models/Hospital');

exports.getHospitals = async (req, res) => {
  try {
    const { cityId, districtId, stateId } = req.query;
    let query = {};
    if (cityId) query.cityId = cityId;
    if (districtId) query.districtId = districtId;
    if (stateId) query.stateId = stateId;
    const hospitals = await Hospital.find(query).populate('departments');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('departments');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
