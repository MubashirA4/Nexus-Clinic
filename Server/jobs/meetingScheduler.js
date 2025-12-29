import Appointment from '../models/appointments.js';
import TelemedicineMeeting from '../models/telemedicineMeeting.js';
import { createZoomMeeting } from '../services/zoomService.js';
import { sendMeetingLink } from '../services/notificationService.js';

const LEAD_MINUTES = parseInt(process.env.MEETING_LEAD_MINUTES || '5', 10);
const INTERVAL_MS = parseInt(process.env.MEETING_SCHEDULER_INTERVAL_MS || String(30 * 1000), 10); // Check every 30 seconds

let running = false;

export function startMeetingScheduler() {
  if (running) return;
  running = true;
  console.log(`🚀 Meeting scheduler started (lead ${LEAD_MINUTES} min, interval ${INTERVAL_MS}ms)`);

  const tick = async () => {
    try {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + LEAD_MINUTES * 60 * 1000);
      const windowStart = new Date(now.getTime() - 15 * 60 * 1000); // Look back 15 mins for missed ones

      // Find appointments without meeting between windowStart and windowEnd
      const appointments = await Appointment.find({
        telemedicineMeeting: { $exists: false },
        status: { $in: ['confirmed', 'pending'] },
        date: { $gte: windowStart, $lte: windowEnd }
      }).populate('doctor patient');

      if (appointments.length > 0) {
        console.log(`[${new Date().toLocaleTimeString()}] 🔎 Scheduler found ${appointments.length} appointment(s) in window.`);
      } else {
        // Heartbeat log every 5 ticks (approx 2.5 mins) to avoid spam but show life
        if (Math.floor(Date.now() / INTERVAL_MS) % 5 === 0) {
          console.log(`[${new Date().toLocaleTimeString()}] 💓 Scheduler is alive (scanning window ${windowStart.toLocaleTimeString()} - ${windowEnd.toLocaleTimeString()})`);
        }
      }

      for (const ap of appointments) {
        try {
          const startTime = ap.date;
          const topic = `Consultation: ${ap.patientName} with ${ap.doctor?.name || 'Doctor'}`;

          console.log(`Creating Zoom meeting for appointment ${ap._id} (Scheduled at: ${new Date(startTime).toLocaleTimeString()})`);

          const zoomRes = await createZoomMeeting({ topic, startTime, durationMinutes: 30 });

          const meetingDoc = new TelemedicineMeeting({
            appointment: ap._id,
            meetingId: zoomRes.id?.toString(),
            meetingLink: zoomRes.join_url,
            passcode: zoomRes.password || null,
            startTime: zoomRes.start_time ? new Date(zoomRes.start_time) : startTime,
            endTime: zoomRes.duration ? new Date(new Date(zoomRes.start_time).getTime() + zoomRes.duration * 60000) : null,
            status: 'scheduled',
            meta: zoomRes
          });

          const saved = await meetingDoc.save();
          ap.telemedicineMeeting = saved._id;

          // If it was pending, maybe we should auto-confirm it since we are generating a meeting?
          // For now, just keep status as is or let it be 'confirmed' if we are on it.
          await ap.save();

          console.log(`✅ Scheduled meeting ${saved.meetingId} for appointment ${ap._id}`);

          // Trigger Notification
          await sendMeetingLink({ appointment: ap, meetingLink: saved.meetingLink });

        } catch (err) {
          console.error(`❌ Scheduler: failed for appointment ${ap._id}:`, err.message || err);
        }
      }
    } catch (err) {
      console.error('⚠️ Scheduler tick error:', err.message || err);
    }
  };

  // Run immediately then interval
  tick();
  const id = setInterval(tick, INTERVAL_MS);

  return () => {
    clearInterval(id);
    running = false;
    console.log('🛑 Meeting scheduler stopped');
  };
}
