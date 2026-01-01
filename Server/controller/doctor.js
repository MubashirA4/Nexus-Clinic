import Doctor from "../models/doctors.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Appointment from "../models/appointments.js";
import Patient from "../models/patient.js";


// In your Doctor controller (Doctor.js)

export const addDoctor = async (req, res) => {
    try {
        console.log('Request received:', {
            body: req.body,
            file: req.file,
            files: req.files
        });

        // Access req.body directly
        const body = req.body;

        // Use body.firstName, body.lastName, etc.
        const fullName = (body.firstName && body.lastName)
            ? `${body.firstName} ${body.lastName}`
            : (body.name || "Unknown Doctor");

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email: body.email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists"
            });
        }

        // Generate default password if not provided
        const passwordToHash = body.password || "password123";
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);

        // ✅ Handle image - check if file was uploaded
        let imageUrl;
        if (req.file) {
            // If you uploaded a file, use the file path/URL
            imageUrl = `/uploads/${req.file.filename}`;
            console.log('Using uploaded image:', imageUrl);
        } else {
            // Use provided image URL or default
            const defaultImages = [
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=400&h=400&fit=crop",
            ];
            imageUrl = body.image || defaultImages[Math.floor(Math.random() * defaultImages.length)];
            console.log('Using default/URL image:', imageUrl);
        }

        // Create new doctor
        const newDoctor = new Doctor({
            name: fullName,
            email: body.email,
            password: hashedPassword,
            specialization: body.specialization,
            phone: body.phone,
            experience: body.experience || 0,
            patients: body.patients || 0,
            bio: body.bio || `${body.specialization} specialist with ${body.experience || 0} years of experience.`,
            image: imageUrl,
            role: "doctor",
            isActive: true,
        });

        const savedDoctor = await newDoctor.save();

        res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor: savedDoctor
        });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const doctorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {
                userId: doctor._id,
                email: doctor.email,
                name: doctor.name,
                role: doctor.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add this new function to Doctor.js
export const getDoctorById = async (req, res) => {
    const { id } = req.params; // Get ID from URL
    try {
        const doctor = await Doctor.findById(id).select('-password');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        // Handle invalid ID format (CastError) and other errors
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const updateDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedDoctor
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        // Assuming appointment model has doctorId field
        const appointments = await Appointment.find({ doctor: req.userId });
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyPatients = async (req, res) => {
    try {
        // This logic depends on schema. Assuming we fetch appointments and get unique patients or similar.
        // For now, let's just return a placeholder or all patients if not defined.
        // Better implementation: fetch appointments for doctor, extract patient IDs, fetch patients.
        const appointments = await Appointment.find({ doctor: req.userId });
        const patientIds = [...new Set(appointments.map(app => app.patient))];
        const patients = await Patient.find({ _id: { $in: patientIds } }).select("-password");

        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorPatientsDetailed = async (req, res) => {
    try {
        const doctorId = req.userId;

        // Fetch all appointments for this doctor, populated with patient details
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient', '-password')
            .sort({ date: -1 });

        // Group by patient to get unique list with most recent appointment
        const patientsMap = new Map();

        appointments.forEach(app => {
            const patientKey = app.patient?._id?.toString() || app.patientEmail;
            if (!patientKey) return;

            if (!patientsMap.has(patientKey)) {
                patientsMap.set(patientKey, {
                    id: app.patient?._id || null,
                    name: app.patient?.name || app.patientName || 'Anonymous',
                    email: app.patient?.email || app.patientEmail,
                    phone: app.patient?.phone || app.patientPhone,
                    image: app.patient?.image || null,
                    lastVisit: app.date,
                    lastReason: app.reason,
                    lastStatus: app.status,
                    totalAppointments: 1,
                    gender: app.patient?.gender,
                    age: app.patient?.age
                });
            } else {
                const p = patientsMap.get(patientKey);
                p.totalAppointments += 1;
            }
        });

        const detailedPatients = Array.from(patientsMap.values());

        res.status(200).json({
            success: true,
            count: detailedPatients.length,
            data: detailedPatients
        });
    } catch (error) {
        console.error('Error in getDoctorPatientsDetailed:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const id = req.userId;
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated",
            user: {
                id: updatedDoctor._id,
                name: updatedDoctor.name,
                email: updatedDoctor.email,
                role: updatedDoctor.role || 'doctor',
                phone: updatedDoctor.phone,
                image: updatedDoctor.image,
                specialization: updatedDoctor.specialization,
                experience: updatedDoctor.experience,
                bio: updatedDoctor.bio,
                location: updatedDoctor.location,
                languages: updatedDoctor.languages,
                education: updatedDoctor.education,
                certifications: updatedDoctor.certifications,
                specializations: updatedDoctor.specializations,
                gender: updatedDoctor.gender,
                address: updatedDoctor.address,
                patients: updatedDoctor.patients
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};