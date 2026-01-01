import Admin from "../models/admin.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctors.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            permissions: ["full_access"] // Default permissions
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email,
                role: savedAdmin.role
            }
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const patients = await Patient.find({}, 'name email role createdAt image');
        const doctors = await Doctor.find({}, 'name email role createdAt photo');
        const admins = await Admin.find({}, 'name email role createdAt');

        // Normalize data structure
        const normalizedPatients = patients.map(p => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            role: 'patient',
            image: p.image,
            createdAt: p.createdAt
        }));

        const normalizedDoctors = doctors.map(d => ({
            _id: d._id,
            name: d.name,
            email: d.email,
            role: 'doctor',
            image: d.photo,
            createdAt: d.createdAt
        }));

        const normalizedAdmins = admins.map(a => ({
            _id: a._id,
            name: a.name,
            email: a.email,
            role: 'admin',
            createdAt: a.createdAt
        }));

        const allUsers = [...normalizedPatients, ...normalizedDoctors, ...normalizedAdmins];

        // Sort by creation date (newest first)
        allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            count: allUsers.length,
            data: allUsers
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Admin account is disabled"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: admin._id,
                email: admin.email,
                role: admin.role,
                name: admin.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const { name, email, image } = req.body;
        const adminId = req.userId; // From verifyToken middleware

        // Find admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (image) admin.image = image; // Assuming image is sent as base64 string or url

        // Save updates
        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                image: updatedAdmin.image
            }
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Server error during profile update"
        });
    }
};