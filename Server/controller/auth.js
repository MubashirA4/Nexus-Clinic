import Patient from "../models/patient.js";
import Doctor from "../models/doctors.js";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const unifiedLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check all collections concurrently
        const [patient, doctor, admin] = await Promise.all([
            Patient.findOne({ email }),
            Doctor.findOne({ email }),
            Admin.findOne({ email })
        ]);

        let user = null;
        let userRole = '';
        let userData = {};

        // Determine which user type was found
        if (patient) {
            user = patient;
            userRole = 'patient';
            userData = {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                role: 'patient',
                phone: patient.phone || null,
                age: patient.age || null,
                gender: patient.gender || null,
                address: patient.address || null,
                image: patient.image || ""
            };
        } else if (doctor) {
            user = doctor;
            userRole = 'doctor';

            // Check if doctor is active
            if (doctor.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: "Your doctor account is not active. Please contact administrator."
                });
            }

            userData = {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: 'doctor',
                specialization: doctor.specialization || null,
                qualification: doctor.qualification || null,
                experience: doctor.experience || 0,
                licenseNumber: doctor.licenseNumber || null
            };
        } else if (admin) {
            user = admin;
            userRole = 'admin';

            // Check if admin is active
            if (admin.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: "Admin account is disabled"
                });
            }

            userData = {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                permissions: admin.permissions || []
            };
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: userRole,
                name: userData.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: userData
        });

    } catch (error) {
        console.error("Unified login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { role, userId } = req;

        let user = null;

        // Fetch user based on role
        switch (role) {
            case 'patient':
                user = await Patient.findById(userId).select("-password");
                break;
            case 'doctor':
                user = await Doctor.findById(userId).select("-password");
                break;
            case 'admin':
                user = await Admin.findById(userId).select("-password");
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid user role"
                });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,
                ...(role === 'patient' && {
                    phone: user.phone,
                    age: user.age,
                    gender: user.gender,
                    address: user.address,
                    image: user.image
                }),
                ...(role === 'doctor' && {
                    specialization: user.specialization,
                    qualification: user.qualification,
                    experience: user.experience,
                    licenseNumber: user.licenseNumber,
                    image: user.image,
                    phone: user.phone,
                    patients: user.patients,
                    bio: user.bio,
                }),
                ...(role === 'admin' && {
                    permissions: user.permissions
                })
            }
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};