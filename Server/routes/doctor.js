import express from "express";
import { getMyPatients, updateProfile, getDoctorPatientsDetailed } from "../controller/doctor.js";
import { getAppointmentsForDoctor } from "../controller/appointments.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyDoctor } from "../middleware/verifyDoc.js";

const router = express.Router();

// All doctor routes require doctor role
router.use(verifyToken);
router.use(verifyDoctor);

// Protected routes for doctor only
router.get("/appointments", getAppointmentsForDoctor);
router.get("/patients", getMyPatients);
router.get("/patients/detailed", getDoctorPatientsDetailed);
router.put("/profile", updateProfile);

export default router;