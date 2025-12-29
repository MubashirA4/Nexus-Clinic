import mongoose from "mongoose";

const AppointSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['unverified', 'pending', 'confirmed', 'cancelled', 'completed'], default: 'unverified' },
    telemedicineMeeting: { type: mongoose.Schema.Types.ObjectId, ref: 'TelemedicineMeeting', required: false },
    createdAt: { type: Date, default: Date.now }
})

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointSchema);
export default Appointment;