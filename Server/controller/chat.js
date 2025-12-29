import { analyzeSymptoms } from '../services/symptomAnalyzer.js';
import Doctor from '../models/doctors.js';
import Appointment from '../models/appointments.js';
import ChatHistory from '../models/chatHistory.js';

export const postAnalyze = async (req, res, next) => {
  try {
    const { symptoms, severity, duration } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide symptoms array' });
    }

    const analysis = await analyzeSymptoms({ symptoms, severity: severity || 1, duration: duration || 'short' });

    // Save to chat history if user is authenticated
    if (req.userId) {
      await ChatHistory.create({ userId: req.userId, messages: [{ from: 'user', text: `Symptoms: ${symptoms.join(', ')}` }, { from: 'bot', text: `Analysis: ${analysis.results.map(r=>r.name).slice(0,3).join(', ')}` }] });
    }

    res.json({ success: true, ...analysis });
  } catch (err) {
    next(err);
  }
};

export const getDoctors = async (req, res, next) => {
  try {
    const { specialization } = req.query;
    const filter = specialization ? { specialization } : {};
    const doctors = await Doctor.find(filter).select('-password').lean();
    res.json({ success: true, doctors });
  } catch (err) {
    next(err);
  }
};

export const postBook = async (req, res, next) => {
  try {
    const { doctorId, date, time, patientName, patientEmail, patientPhone, reason } = req.body;
    if (!doctorId || !date || !time || !patientName || !patientEmail || !patientPhone) {
      return res.status(400).json({ success: false, message: 'Missing booking information' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const appointment = await Appointment.create({
      patient: req.userId || null,
      patientName,
      patientEmail,
      patientPhone,
      doctor: doctor._id,
      date: new Date(date),
      time,
      reason: reason || 'Telemedicine via chat'
    });

    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const history = await ChatHistory.findOne({ userId }).lean();
    res.json({ success: true, history: history?.messages || [] });
  } catch (err) {
    next(err);
  }
};
