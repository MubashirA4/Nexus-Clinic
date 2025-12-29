import mongoose from 'mongoose';

const TelemedicineMeetingSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  meetingId: { type: String, required: true },
  meetingLink: { type: String, required: true },
  passcode: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['scheduled','active','completed','failed','cancelled'], default: 'scheduled' },
  meta: { type: Object }, // additional provider data
  createdAt: { type: Date, default: Date.now }
});

const TelemedicineMeeting = mongoose.models.TelemedicineMeeting || mongoose.model('TelemedicineMeeting', TelemedicineMeetingSchema);
export default TelemedicineMeeting;