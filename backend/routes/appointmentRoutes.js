const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getPatientAppointments, 
  getAppointmentById, 
  cancelAppointment, 
  generateLiveAppointment 
} = require('../controllers/appointmentController');

router.get('/', getPatientAppointments);
router.post('/', bookAppointment);
router.post('/generate-live', generateLiveAppointment);
router.get('/patient', getPatientAppointments); 
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;

