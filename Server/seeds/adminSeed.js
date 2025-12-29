// adminSeed.js - creates a default admin user if none exists
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/healthcare$/, '/healthcarehealthcare') : 'mongodb://localhost:27017/healthcarehealthcare';

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Delete existing admin to ensure fresh password hash
        await Admin.deleteOne({ email: 'admin@example.com' });
        console.log('🗑️  Function existing admin');

        const hashed = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashed,
            // isActive defaults to true in schema
        });
        await admin.save();
        console.log('🛠️ Admin user created with email: admin@example.com and password: admin123');
    } catch (err) {
        console.error('❌ Seed error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

createAdmin();
