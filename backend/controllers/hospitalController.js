const Hospital = require('../models/Hospital');

exports.getHospitals = async (req, res) => {
  try {
    const { cityId, districtId, stateId, subCityId, tier, parentChain, search } = req.query;
    let query = {};
    if (subCityId) query.subCityId = subCityId;
    if (cityId) query.cityId = cityId;
    if (districtId) query.districtId = districtId;
    if (stateId) query.stateId = stateId;
    if (tier) query.tier = tier;
    if (parentChain) query.parentChain = parentChain;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { parentChain: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    const hospitals = await Hospital.find(query)
      .populate('departments')
      .populate('cityId', 'name')
      .populate('districtId', 'name')
      .populate('stateId', 'name')
      .populate('subCityId', 'name');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('departments')
      .populate('cityId', 'name')
      .populate('districtId', 'name')
      .populate('stateId', 'name')
      .populate('subCityId', 'name');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
