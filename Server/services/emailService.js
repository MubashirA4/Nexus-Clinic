import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
          if (!transporter) {
                    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                              console.warn('⚠️ Email credentials not found in env. Email service will likely fail.');
                    }

                    transporter = nodemailer.createTransport({
                              host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                              port: parseInt(process.env.EMAIL_PORT || '587'),
                              secure: process.env.EMAIL_SECURE === 'true',
                              auth: {
                                        user: process.env.EMAIL_USER,
                                        pass: process.env.EMAIL_PASS,
                              },
                    });

                    console.log(`📧 Mailer initialized with host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
          }
          return transporter;
};

/**
 * Send a professional HTML email
 */
export const sendEmail = async ({ to, subject, html, text }) => {
          try {
                    const mailer = getTransporter();
                    const info = await mailer.sendMail({
                              from: `"Nexus Clinic" <${process.env.EMAIL_USER}>`,
                              to,
                              subject,
                              text,
                              html,
                    });


                    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
                    return info;
          } catch (error) {
                    console.error(`❌ Failed to send email to ${to}:`, error.message);
                    // Don't throw for notifications, just log it so other things don't break
                    return null;
          }
};
