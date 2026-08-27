const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, getDoctorAvailability, getAlternativeDoctors } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/alternatives', getAlternativeDoctors);
router.get('/:doctorId/availability', getDoctorAvailability);

module.exports = router;
