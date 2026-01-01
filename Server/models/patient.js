import mongoose from "mongoose";
import { type } from "os";

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        default: 'patient'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export default Patient;