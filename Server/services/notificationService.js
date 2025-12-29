import { sendEmail } from './emailService.js';

/**
 * Notification Service
 * Separates the logic for notifying users (email/SMS/Log)
 */
export const sendMeetingLink = async ({ appointment, meetingLink }) => {
  const { patientEmail, patientName, doctor, date, time } = appointment;
  const doctorName = doctor?.name || 'Doctor';
  const doctorEmail = doctor?.email;

  const meetingDate = new Date(date).toLocaleDateString();

  console.log('--------------------------------------------------');
  console.log('🔔 NOTIFICATION: Telemedicine Meeting Link Ready');
  console.log(`Appointment ID: ${appointment._id}`);
  console.log(`Time: ${meetingDate} at ${time}`);
  console.log('--------------------------------------------------');

  // Professional HTML Email Template for Patient
  const patientHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Telemedicine Consultation Link</h2>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>Your scheduled consultation with <strong>${doctorName}</strong> is about to begin.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <p>Please click the button below to join the secure video session:</p>
      <a href="${meetingLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Join Meeting Now</a>
      <p style="margin-top: 20px; font-size: 0.8em; color: #64748b;">If the button doesn't work, copy and paste this link: ${meetingLink}</p>
    </div>
  `;

  // Professional HTML Email Template for Doctor
  const doctorHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #7c3aed;">New Session Ready</h2>
      <p>Hello <strong>${doctorName}</strong>,</p>
      <p>Your telemedicine session with <strong>${patientName}</strong> is ready for you to join.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <a href="${meetingLink}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Session</a>
      <p style="margin-top: 20px; font-size: 0.8em; color: #64748b;">Join Link: ${meetingLink}</p>
    </div>
  `;

  // Notify Patient
  console.log(`SENDING EMAIL TO PATIENT: ${patientEmail}`);
  await sendEmail({
    to: patientEmail,
    subject: `Your Consultation Link - Nexus Clinic`,
    html: patientHtml,
    text: `Hello ${patientName}, your meeting with ${doctorName} is ready. Join here: ${meetingLink}`
  });

  // Notify Doctor
  if (doctorEmail) {
    console.log(`SENDING EMAIL TO DOCTOR: ${doctorEmail}`);
    await sendEmail({
      to: doctorEmail,
      subject: `Patient Ready: ${patientName} - Nexus Clinic`,
      html: doctorHtml,
      text: `Hello ${doctorName}, your session with ${patientName} is ready. Join here: ${meetingLink}`
    });
  }
};

/**
 * Send Verification Email to Patient
 */
export const sendVerificationEmail = async ({ appointment, verificationLink }) => {
  const { patientEmail, patientName, doctor, time } = appointment;
  const doctorName = doctor?.name || 'Doctor';
  const meetingDate = new Date(appointment.date).toLocaleDateString();

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Verify Your Appointment</h2>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>You have requested an appointment with <strong>${doctorName}</strong>.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <p>To confirm this appointment and add it to our schedule, please click the button below:</p>
      <a href="${verificationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify & Confirm Appointment</a>
      <p style="margin-top: 20px; font-size: 0.8em; color: #64748b;">If you did not request this appointment, please ignore this email.</p>
    </div>
  `;

  console.log(`SENDING VERIFICATION EMAIL TO PATIENT: ${patientEmail}`);
  await sendEmail({
    to: patientEmail,
    subject: `Verify Your Appointment - Nexus Clinic`,
    html,
    text: `Hello ${patientName}, please verify your appointment with ${doctorName} by clicking here: ${verificationLink}`
  });
};
