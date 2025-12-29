import express from "express";
import { addDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor } from "../controller/doctor.js";
import { createAdmin } from "../controller/admin.js";
import { getAllAppointments, updateAppointmentStatus } from "../controller/appointments.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// All admin routes require admin role
router.use(verifyToken);
router.use(verifyAdmin);

// Super Admin only: Create new admin
router.post("/add-admin", (req, res, next) => {
    // req.email is set by verifyToken middleware
    if (req.email !== 'admin@example.com') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only the Super Admin can create new administrators."
        });
    }
    next();
}, createAdmin);

// Doctor management
router.post("/doctor", addDoctor);
router.get("/doctors", getDoctors);
router.get("/doctor/:id", getDoctorById);
router.put("/doctor/:id", updateDoctor);
router.delete("/doctor/:id", deleteDoctor);

// Appointments (Admin)
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Add other admin routes here (patients, appointments, reports, etc.)

export default router;