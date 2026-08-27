const express = require('express');
const router = express.Router();
const { bookAppointment, getPatientAppointments, getAppointmentById, cancelAppointment } = require('../controllers/appointmentController');
// const { protect } = require('../middleware/authMiddleware'); // For MVP, we'll allow guest booking but we should add protect for getPatientAppointments

router.post('/', bookAppointment);
// router.get('/patient', protect, getPatientAppointments); 
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
