import express from 'express'
import { createUsers, updateProfile } from '../controller/patient.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { verifyPatient } from '../middleware/verifypatients.js'
import { verifyPatientOrDoctor } from '../middleware/verifyPatientOrDoctor.js'
import { createAppointment, getAppointmentsForPatient, verifyAppointment } from '../controller/appointments.js'
import { createMeetingForAppointment, getMeetingForAppointment } from '../controller/telemedicine.js'

const router = express.Router();

// Public routes
router.post('/signup', createUsers);
router.post('/update-profile', updateProfile);
router.get('/appointments/verify/:token', verifyAppointment);

// Create appointment (requires patient auth)
router.post('/appointments', verifyToken, verifyPatient, createAppointment);

// Protected routes for patients only
// router.use(verifyToken);
// router.use(verifyPatient);

// Example protected patient routes
router.get('/dashboard', verifyToken, verifyPatient, (req, res) => {
  res.json({
    success: true,
    message: "Patient dashboard",
    userId: req.userId
  });
});

// Patient: get their appointments (requires auth)
router.get('/appointments', verifyToken, verifyPatient, getAppointmentsForPatient);

// Telemedicine meeting management for an appointment
router.post('/appointments/:id/create-meeting', verifyToken, verifyPatientOrDoctor, createMeetingForAppointment);
router.get('/appointments/:id/meeting-details', verifyToken, verifyPatientOrDoctor, getMeetingForAppointment);

// Add other patient routes here (appointments, medical records, etc.)

export default router;