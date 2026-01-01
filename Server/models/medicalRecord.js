import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema({
          patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
          doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
          appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false },
          patientName: { type: String, required: true },
          patientEmail: { type: String, required: true },
          diagnosis: { type: String, required: true },
          medications: { type: String, required: true },
          notes: { type: String, required: false },
          treatment: { type: String, required: false },
          date: { type: Date, default: Date.now }
}, { timestamps: true });

const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", MedicalRecordSchema);
export default MedicalRecord;
