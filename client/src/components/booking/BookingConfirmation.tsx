import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Check, Download, Share2, Calendar, Clock, User, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateICS, downloadICS } from '../../utils/calendarUtils';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function BookingConfirmation({ data, onNext, onBack }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  useEffect(() => {
    let mounted = true;
    const submitAppointment = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          setError('You must be signed in to book an appointment. Please log in.');
          return;
        }
        setLoading(true);
        setError(null);
        const payload = {
          doctorId: data.doctor,
          date: data.date,
          time: data.time,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          reason: data.reason || ''
        };
        const axios = (await import('axios')).default;
        const response = await axios.post(`${(await import('../../../utils')).apiURL}/api/appointments`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!mounted) return;
        if (response.data && response.data.success) {
          setSaved(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to save appointment');
        }
      } catch (err: any) {
        console.error('Error saving appointment:', err);
        setError(err.response?.data?.message || err.message || 'Failed to save appointment');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    submitAppointment();

    return () => { mounted = false; };
  }, [data]);

  // Show login link when not authenticated
  const isAuthenticated = !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));

  const handleDownload = () => {
    const card = document.getElementById('appointment-card');
    if (!card) return;

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Inject styles and content
    doc.write(`
      <html>
        <head>
          <title>Appointment Confirmation - Nexus</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: auto; margin: 20mm; }
            body { font-family: ui-sans-serif, system-ui, sans-serif; }
            .print-container { max-width: 800px; margin: 0 auto; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${card.innerHTML}
          </div>
          <script>
            // Wait for tailwind and images to load
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => {
                  window.frameElement.remove();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleShare = async () => {
    const shareText = `My appointment with ${saved?.doctor?.name || 'Dr. Sarah Johnson'} is confirmed for ${saved ? new Date(saved.date).toLocaleDateString() : (data.date || 'December 10, 2025')} at ${saved?.time || data.time || '2:00 PM'}.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nexus Clinic Appointment Confirmation',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Appointment details copied to clipboard!');
    }
  };

  const handleAddToCalendar = () => {
    const doctorName = saved?.doctor?.name || 'Dr. Sarah Johnson';
    const specialization = saved?.doctor?.specialization || 'Cardiologist';
    const appointmentDate = saved ? new Date(saved.date) : new Date(data.date || '2025-12-10');
    const timeStr = saved?.time || data.time || '14:00';

    // Parse time and create start/end dates
    const [hours, minutes] = timeStr.includes(':')
      ? timeStr.split(':').map((t: string) => parseInt(t.replace(/\D/g, '')))
      : [14, 0]; // Default to 2:00 PM

    const startDate = new Date(appointmentDate);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour duration

    // Use ICS generation
    const icsContent = generateICS({
      title: `Medical Appointment - ${doctorName}`,
      description: `Consultation with ${doctorName} (${specialization})\n\nPatient: ${data.patientName}\nEmail: ${data.patientEmail}\n\nThis is a virtual consultation via Zoom. You will receive the meeting link via email.`,
      location: 'Virtual Consultation (Nexus Clinic)',
      startDate,
      durationMinutes: 60,
      organizer: { name: 'Nexus Clinic', email: 'noreply@nexusclinic.com' },
      attendees: [
        { name: data.patientName, email: data.patientEmail },
        // Try to include doctor email if available, otherwise just name
        { name: doctorName, email: saved?.doctor?.email || 'doctor@nexusclinic.com' }
      ]
    });

    downloadICS(icsContent, 'appointment.ics');
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                background: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)],
              }}
              animate={{
                y: [0, window.innerHeight],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Status */}
      {loading && (
        <div className="text-center mb-4 text-sm text-slate-600">Saving appointment...</div>
      )}
      {error && (
        <div className="text-center mb-4 text-sm text-red-500">
          {error}
          {!isAuthenticated && (
            <div className="mt-2">
              <Link to="/login" className="text-blue-600 underline">Sign in to continue</Link>
            </div>
          )}
        </div>
      )}

      {/* Success Animation */}
      <div id="appointment-card">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Clock className="w-16 h-16 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-3xl font-bold mb-4">Verification Email Sent!</h2>
          <p className="text-lg text-slate-600">
            Please check your inbox at <span className="font-bold text-blue-600">{data.patientEmail}</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">You must click the verification link in your email to finalize your booking.</p>
        </div>

        {/* Improved Appointment Card for Printing */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-800">Booking Summary (Pending Verification)</h3>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Doctor</div>
                  <div className="font-semibold text-slate-800">{saved?.doctor?.name || 'Dr. Sarah Johnson'}</div>
                  <div className="text-sm text-slate-600">{saved?.doctor?.specialization || 'Cardiologist'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Schedule</div>
                  <div className="font-semibold text-slate-800">{saved ? new Date(saved.date).toLocaleDateString('en-US', { dateStyle: 'full' }) : (data.date || 'December 10, 2025')}</div>
                  <div className="text-sm text-slate-600">{saved?.time || data.time || '2:00 PM'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Patient Details</div>
                  <div className="font-semibold text-slate-800">{data.patientName}</div>
                  <div className="text-sm text-slate-600">{data.patientEmail}</div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</div>
                  <div className="font-semibold text-slate-800">Virtual Consultation</div>
                  <div className="text-sm text-slate-600">Join via Zoom (Link in email)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 italic">This appointment will not appear in your portal until it is verified via email.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Download Confirmation</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCalendar}
          className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 transition-all"
        >
          <Calendar className="w-5 h-5" />
          <span>Add to Calendar</span>
        </motion.button>
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="bg-blue-50 rounded-2xl p-6 text-center"
      >
        <h4 className="mb-3">What's Next?</h4>
        <div className="space-y-2 text-sm text-slate-600">
          <p>📧 Open your email: <strong>{data.patientEmail}</strong></p>
          <p>🔗 Click the verification link in the email</p>
          <p>✨ Your appointment will then be added to your schedule</p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
            >
              Back to Home
            </motion.button>
          </Link>

          <div className="text-sm text-slate-400 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Waiting for verification...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
