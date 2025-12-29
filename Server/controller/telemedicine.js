import mongoose from 'mongoose';
import Appointment from '../models/appointments.js';
import TelemedicineMeeting from '../models/telemedicineMeeting.js';
import { createZoomMeeting, getZoomMeeting } from '../services/zoomService.js';

export const createMeetingForAppointment = async (req, res) => {
  const { id } = req.params; // appointment id
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid appointment id' });
    const appointment = await Appointment.findById(id).populate('doctor patient');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // only allow patient who owns it or assigned doctor/admin
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    const isOwner = appointment.patient && appointment.patient._id.toString() === userId;
    const isDoctor = appointment.doctor && appointment.doctor._id.toString() === userId;
    // You may add admin check here
    if (!isOwner && !isDoctor) return res.status(403).json({ success: false, message: 'Not authorized to create meeting for this appointment' });

    // If meeting already exists, return it
    if (appointment.telemedicineMeeting) {
      const existing = await TelemedicineMeeting.findById(appointment.telemedicineMeeting);
      return res.status(200).json({ success: true, data: existing });
    }

    const startTime = appointment.date;
    const topic = `Consultation: ${appointment.patientName} with ${appointment.doctor?.name || 'Doctor'}`;

    // create meeting on zoom
    const zoomRes = await createZoomMeeting({ topic, startTime, durationMinutes: 30 });

    const meetingDoc = new TelemedicineMeeting({
      appointment: appointment._id,
      meetingId: zoomRes.id?.toString(),
      meetingLink: zoomRes.join_url,
      passcode: zoomRes.password || null,
      startTime: zoomRes.start_time ? new Date(zoomRes.start_time) : startTime,
      endTime: zoomRes.duration ? new Date(new Date(zoomRes.start_time).getTime() + zoomRes.duration * 60000) : null,
      status: 'scheduled',
      meta: zoomRes
    });

    const saved = await meetingDoc.save();
    appointment.telemedicineMeeting = saved._id;
    await appointment.save();

    // Trigger Notification
    const { sendMeetingLink } = await import('../services/notificationService.js');
    await sendMeetingLink({ appointment, meetingLink: saved.meetingLink });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetingForAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid appointment id' });
    const appointment = await Appointment.findById(id).populate('telemedicineMeeting');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (!appointment.telemedicineMeeting) return res.status(404).json({ success: false, message: 'No meeting scheduled for this appointment' });

    const meeting = await TelemedicineMeeting.findById(appointment.telemedicineMeeting);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting record not found' });

    // Optionally refresh meeting details from Zoom
    try {
      const remote = await getZoomMeeting(meeting.meetingId);
      // update stored meta/status
      meeting.meta = remote;
      meeting.status = remote.status || meeting.status;
      await meeting.save();
    } catch (err) {
      console.warn('Could not refresh meeting details:', err.message);
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error('Error getting meeting details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};