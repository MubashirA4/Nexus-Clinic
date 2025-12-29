import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        default: ['full_access']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;