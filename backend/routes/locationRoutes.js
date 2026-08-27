const express = require('express');
const router = express.Router();
const { getStates, getDistricts, getCities, getSubCities, getLocationTree } = require('../controllers/locationController');

router.get('/states', getStates);
router.get('/districts', getDistricts);
router.get('/cities', getCities);
router.get('/subcities', getSubCities);
router.get('/tree', getLocationTree);

module.exports = router;
