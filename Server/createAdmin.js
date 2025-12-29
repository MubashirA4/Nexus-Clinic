// scripts/createAdmin.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "./models/admin.js";
import dotenv from "dotenv";

dotenv.config();

async function createInitialAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const adminEmail = "admin@nexusmed.com";

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Create admin
        const admin = new Admin({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            permissions: ["full_access"]
        });

        await admin.save();
        console.log("Initial admin created successfully");
        console.log("Email: admin@nexusmed.com");
        console.log("Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createInitialAdmin();