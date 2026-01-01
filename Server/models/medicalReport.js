import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema({
          patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
          doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
          appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false },
          title: { type: String, required: true },
          fileUrl: { type: String, required: true },
          fileType: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const MedicalReport = mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);
export default MedicalReport;
