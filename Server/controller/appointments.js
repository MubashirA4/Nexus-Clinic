import mongoose from 'mongoose';
import Appointment from "../models/appointments.js";
import Doctor from "../models/doctors.js";
import Patient from "../models/patient.js";
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from "../services/notificationService.js";

// Create new appointment (authenticated patients only)
export const createAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            date,
            time,
            reason,
            patientName,
            patientEmail,
            patientPhone,
        } = req.body;

        // Require authenticated patient
        const patientId = req.userId || null;
        if (!patientId) return res.status(401).json({ success: false, message: 'Authentication required to create appointments' });

        if (!doctorId || !date || !time || !patientName || !patientEmail || !patientPhone) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Validate doctorId format
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ success: false, message: 'Invalid doctor id' });
        }

        // Validate patient id
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ success: false, message: 'Invalid patient id' });
        }

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        // Parse time string (e.g., "01:46 PM") and combine with date
        const [timePart, ampm] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const combinedDate = new Date(date);
        combinedDate.setHours(hours, minutes, 0, 0);

        const appointment = new Appointment({
            patient: patientId,
            patientName,
            patientEmail,
            patientPhone,
            doctor: doctorId,
            date: combinedDate,
            time,
            reason: reason || '',
            status: 'unverified'
        });

        const saved = await appointment.save();

        // Generate Verification Token
        const token = jwt.sign(
            { appointmentId: saved._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const verificationLink = `http://localhost:5173/verify-appointment?token=${token}`;

        await sendVerificationEmail({
            appointment: await Appointment.findById(saved._id).populate('doctor'),
            verificationLink
        });

        // Populate doctor details before sending response
        await saved.populate('doctor');

        res.status(201).json({
            success: true,
            message: 'Verification email sent. Please confirm to finalize booking.',
            data: saved
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: get all appointments (optionally filter by doctorId query param)
export const getAllAppointments = async (req, res) => {
    try {
        const { doctorId } = req.query;
        const filter = {};
        if (doctorId) {
            if (!mongoose.Types.ObjectId.isValid(doctorId)) {
                return res.status(400).json({ success: false, message: 'Invalid doctor id' });
            }
            filter.doctor = doctorId;
        }
        const appointments = await Appointment.find(filter).populate('doctor', '-password').populate('patient', '-password');
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Doctor: get appointments for the logged-in doctor
export const getAppointmentsForDoctor = async (req, res) => {
    try {
        const doctorId = req.userId;
        const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', '-password').populate('telemedicineMeeting');
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Patient: get appointments for logged-in patient
export const getAppointmentsForPatient = async (req, res) => {
    try {
        const patientId = req.userId;
        const appointments = await Appointment.find({ patient: patientId }).populate('doctor', '-password').populate('telemedicineMeeting');
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Optionally allow admin/doctor to update status
export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid appointment id' });
        const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true }).populate('doctor patient', '-password');
        if (!updated) return res.status(404).json({ success: false, message: 'Appointment not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Appointment
export const verifyAppointment = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const appointmentId = decoded.appointmentId;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        if (appointment.status !== 'unverified') {
            return res.status(400).json({ success: false, message: 'Appointment already verified or processed' });
        }

        appointment.status = 'pending';
        await appointment.save();

        res.status(200).json({ success: true, message: 'Appointment verified successfully' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};