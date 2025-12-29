import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Calendar, Clock, Video, MapPin, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiURL } from '../../../utils';
import { useAuth } from '../../components/auth/auth';

interface Props {
  fullView?: boolean;
  onViewAll?: () => void;
}

export function UpcomingAppointments({ fullView = false, onViewAll }: Props) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchAppointments = async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const axios = (await import('axios')).default;
        const res = await axios.get(`${apiURL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data?.data || [];
        const mapped = data.map((a: any) => ({
          id: a._id,
          doctor: a.doctor?.name || 'Your Doctor',
          specialty: a.doctor?.specialization || 'General',
          date: new Date(a.date).toLocaleDateString(),
          dateObj: new Date(a.date),
          time: a.time,
          type: a.type || 'In-Person',
          status: a.status || 'pending',
          image: a.doctor?.image || 'https://i.pravatar.cc/100',
          telemedicineMeeting: a.telemedicineMeeting || null
        }));

        // For any appointment with a telemedicineMeeting object (populated by server), attach meeting data
        for (const ap of mapped) {
          if (ap.telemedicineMeeting && typeof ap.telemedicineMeeting === 'object') {
            // server already populated meeting details
            ap.meeting = ap.telemedicineMeeting;
          } else if (ap.telemedicineMeeting) {
            // telemedicineMeeting id exists but not populated, try fetching
            try {
              const mres = await axios.get(`${apiURL}/api/appointments/${ap.id}/meeting-details`, { headers: { Authorization: `Bearer ${token}` } });
              ap.meeting = mres.data?.data || null;
            } catch (err) {
              ap.meeting = null;
            }
          }
        }

        if (mounted) {
          setAppointments(mapped);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAppointments();

    const handler = () => fetchAppointments();
    window.addEventListener('appointmentsUpdated', handler as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('appointmentsUpdated', handler as EventListener);
    };
  }, []);

  const statusColors = {
    confirmed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcomingAppointments = appointments
    .filter(a => a.dateObj >= startOfToday)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  const pastAppointments = appointments
    .filter(a => a.dateObj < startOfToday)
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  const nextAppointment = upcomingAppointments[0] || null;
  const { user } = useAuth();

  function meetingWithinWindow(meeting: any) {
    if (!meeting || !meeting.startTime) return false;
    const start = new Date(meeting.startTime).getTime();
    const end = meeting.endTime ? new Date(meeting.endTime).getTime() : start + 30 * 60 * 1000;
    const now = Date.now();
    return now >= (start - 10 * 60 * 1000) && now <= end;
  }

  async function createMeetingFor(appointmentId: string) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const axios = (await import('axios')).default;
    try {
      const res = await axios.post(`${apiURL}/api/appointments/${appointmentId}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
      // refresh appointments list
      window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
      return res.data.data;
    } catch (err) {
      console.error('Error creating meeting', err);
      throw err;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3>Upcoming Appointments</h3>
        {!fullView && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-sm text-blue-600 hover:text-purple-600 transition-colors"
            onClick={() => onViewAll ? onViewAll() : null}
          >
            View All →
          </motion.button>
        )}
      </div>

      {/* Quick view of your next appointment's doctor (if available) */}
      {fullView ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-3">Upcoming</h4>
            {loading ? (
              <div className="p-4 text-sm text-slate-500">Loading appointments...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No upcoming appointments.</div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <AppointmentRow key={appointment.id} appointment={appointment} index={index} statusColors={statusColors} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Previous</h4>
            {loading ? (
              <div className="p-4 text-sm text-slate-500">Loading appointments...</div>
            ) : pastAppointments.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No previous appointments.</div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment, index) => (
                  <AppointmentRow key={appointment.id} appointment={appointment} index={index} statusColors={statusColors} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <motion.button
              onClick={() => navigate('/booking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
            >
              Schedule New Appointment
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading appointments...</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No upcoming appointments.</div>
          ) : (
            upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <AppointmentRow key={appointment.id} appointment={appointment} index={index} statusColors={statusColors} />
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}




function AppointmentRow({ appointment, index, statusColors }: any) {
  const { user } = useAuth();

  const meeting = appointment.meeting || null;

  function withinWindow(meeting: any) {
    if (!meeting || !meeting.startTime) return false;
    const start = new Date(meeting.startTime).getTime();
    const end = meeting.endTime ? new Date(meeting.endTime).getTime() : start + 30 * 60 * 1000;
    const now = Date.now();
    // available 10 minutes before start until end
    return now >= (start - 10 * 60 * 1000) && now <= end;
  }

  async function handleCreateMeeting() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const axios = (await import('axios')).default;
    try {
      const res = await axios.post(`${apiURL}/api/appointments/${appointment.id}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
      appointment.meeting = res.data.data;
      // force re-render by updating DOM via dispatching an event (simple hack)
      window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
    } catch (err) {
      console.error('Failed to create meeting', err);
      alert('Could not create meeting.');
    }
  }

  function handleJoin() {
    if (!meeting) return;
    window.open(meeting.meetingLink || meeting.join_url, '_blank');
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className="group flex items-center space-x-4 p-4 rounded-xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative flex-shrink-0"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white">
          <img
            src={appointment.image}
            alt={appointment.doctor}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[appointment.status as keyof typeof statusColors].dot} rounded-full border-2 border-white`} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <h4 className="mb-1 truncate">{appointment.doctor}</h4>
        <p className="text-sm text-slate-600 mb-2">{appointment.specialty}</p>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center space-x-1">
            {appointment.type === 'Telemedicine' ? (
              <Video className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>{appointment.type}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className={`${statusColors[appointment.status as keyof typeof statusColors].bg} ${statusColors[appointment.status as keyof typeof statusColors].text} px-3 py-1 rounded-full text-sm capitalize`}>
          {appointment.status}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center space-x-2">
        {meeting ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-lg text-sm ${withinWindow(meeting) ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => withinWindow(meeting) ? handleJoin() : alert('Meeting is not yet available')}
          >
            {withinWindow(meeting) ? 'Join' : 'Scheduled'}
          </motion.button>
        ) : (
          (user?.role === 'patient' || user?.role === 'doctor') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm"
              onClick={handleCreateMeeting}
            >
              Create Meeting
            </motion.button>
          )
        )}

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </motion.button>
      </div>
    </motion.div>
  );
}
