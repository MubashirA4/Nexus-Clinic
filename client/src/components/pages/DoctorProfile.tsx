import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Star, Award, Calendar, MapPin, Clock, Users, ThumbsUp, Video, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../../utils';
import { DashboardNavbar } from '../ui/dashboardNavbar';
import { DoctorSidebar } from '../ui/doctorSidebar';

interface Doctor {
  _id: string; // MongoDB ID usually
  id?: number; // Fallback
  name: string;
  email: string;
  image: string;
  specialization: string;
  patients: number;
  status: string;
  bio?: string;
  phone?: string;
  experience?: string | number;
  location?: string;
  languages?: string[];
  education?: string[];
  certifications?: string[];
  specializations?: string[];
}


export function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Appointments for this doctor (shown only for authenticated doctor dashboard or admin)
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Dashboard UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients' | 'messages' | 'settings'>('dashboard');

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        let doctorData;

        if (id) {
          // Public View: Fetch fetch specific doctor
          const response = await axios.get(`${apiURL}/api/doctor/${id}`);
          if (response.data.success) {
            doctorData = response.data.data;
          }
          console.log(doctorData);
        } else {

          // Dashboard View: Fetch logged-in user profile
          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          if (!token) {
            setError('Please login to view your dashboard');
            setLoading(false);
            return;
          }

          const response = await axios.get(`${apiURL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.success && response.data.user.role === 'doctor') {
            doctorData = response.data.user;
            // Add default values for missing dashboard fields if needed
            doctorData.patients = doctorData.patients || 0;
            doctorData.status = "Active";
          } else if (response.data.success) {
            setError('This dashboard is for doctors only');
            setLoading(false);
            return;
          }
        }

        if (doctorData) {
          setDoctor(doctorData);
        } else {
          setError('Doctor not found');
        }

      } catch (error: any) {
        console.error('Error fetching doctor:', error);
        setError(error.response?.data?.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Fetch appointments for doctor (doctor dashboard or admin filtered view)
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        // If viewing own dashboard (no id), call doctor-protected endpoint
        if (!id && token) {
          const res = await axios.get(`${apiURL}/api/doctor/appointments`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data?.success) {
            setAppointments(res.data.data || []);
          }
          setLoadingAppointments(false);
          return;
        }

        // If admin viewing a doctor's public profile and has a token, call admin filtered endpoint
        if (id && token) {
          const res = await axios.get(`${apiURL}/api/admin/appointments`, { headers: { Authorization: `Bearer ${token}` }, params: { doctorId: id } });
          if (res.data?.success) {
            setAppointments(res.data.data || []);
          }
          setLoadingAppointments(false);
          return;
        }

        // Otherwise do not fetch — avoid exposing patient info publicly
        setLoadingAppointments(false);
      } catch (err) {
        console.error('Error fetching appointments for doctor profile:', err);
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();

    const handler = () => fetchAppointments();
    window.addEventListener('appointmentsUpdated', handler as EventListener);
    return () => window.removeEventListener('appointmentsUpdated', handler as EventListener);
  }, [id]);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600">{error}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!doctor) {
    return <div className="min-h-screen flex items-center justify-center">Doctor not found</div>;
  }


  const reviews = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      rating: 5,
      date: 'Nov 28, 2025',
      comment: 'Dr. Johnson is exceptional! She took the time to explain everything clearly and made me feel at ease. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Robert Thompson',
      rating: 5,
      date: 'Nov 25, 2025',
      comment: 'Outstanding cardiologist. Very knowledgeable and caring. The treatment plan she developed was perfect for my condition.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Lisa Chen',
      rating: 5,
      date: 'Nov 20, 2025',
      comment: 'Professional, compassionate, and thorough. Dr. Johnson saved my life with her quick diagnosis and expert care.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const availableSlots = [
    { date: 'Dec 10', time: '2:00 PM' },
    { date: 'Dec 10', time: '3:30 PM' },
    { date: 'Dec 11', time: '10:00 AM' },
    { date: 'Dec 11', time: '11:30 AM' },
    { date: 'Dec 12', time: '2:00 PM' },
    { date: 'Dec 12', time: '4:00 PM' },
  ];

  const isPublicProfile = Boolean(id);

  if (isPublicProfile) {
    // Public doctor profile (no dashboard navbar/sidebar)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          >
            <div className="grid lg:grid-cols-3 gap-8 p-8">
              {/* Left - Doctor Image */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden ring-8 ring-blue-100">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating Credentials */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>{doctor.experience}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right - Doctor Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="mb-2">{doctor.name}</h2>
                      <p className="text-xl text-slate-600">{doctor.specialization}</p>
                    </div>

                    <div className="flex items-center space-x-1 bg-amber-50 px-4 py-2 rounded-xl">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="medical-number">{doctor.patients}</div>
                        <div className="text-sm text-slate-600">Patients Treated</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl">
                      <ThumbsUp className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="medical-number">99%</div>
                        <div className="text-sm text-slate-600">Satisfaction Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Languages */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <MapPin className="w-5 h-5" />
                      <span>{doctor.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Clock className="w-5 h-5" />
                      <span>Languages: {doctor.languages?.join(', ') || 'English'}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Appointments (public view: may be empty if not authorized) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="mb-6">Appointments</h3>

                {loadingAppointments ? (
                  <div className="p-4 text-sm text-slate-500">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">No appointments available to display.</div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((a: any) => {
                      const meeting = a.telemedicineMeeting || null;
                      const withinWindow = (m: any) => {
                        if (!m || !m.startTime) return false;
                        const start = new Date(m.startTime).getTime();
                        const end = m.endTime ? new Date(m.endTime).getTime() : start + 30 * 60 * 1000;
                        const now = Date.now();
                        return now >= (start - 10 * 60 * 1000) && now <= end;
                      };

                      async function handleCreate() {
                        try {
                          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                          const res = await axios.post(`${apiURL}/api/appointments/${a._id}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
                          // refresh
                          window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
                        } catch (err) {
                          console.error('Error creating meeting', err);
                          alert('Could not create meeting');
                        }
                      }

                      return (
                        <div key={a._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium">{a.patientName || a.patient?.name || a.patientEmail || 'Anonymous'}</div>
                            <div className="text-sm text-slate-500">{new Date(a.date).toLocaleDateString()} • {a.time}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {meeting ? (
                              <button className={`px-3 py-1 rounded-lg text-sm ${withinWindow(meeting) ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => withinWindow(meeting) ? window.open(meeting.meetingLink || meeting.join_url, '_blank') : alert('Meeting not available')}>{withinWindow(meeting) ? 'Join' : 'Scheduled'}</button>
                            ) : (
                              // allow doctor creating meeting for the appointment
                              (!id) && (
                                <button className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm" onClick={handleCreate}>Create Meeting</button>
                              )
                            )}

                            <div className="text-sm text-slate-500 capitalize">{a.status}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Patient Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="mb-6">Patient Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="pb-6 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4>{review.name}</h4>
                            <span className="text-sm text-slate-500">{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-slate-600">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
              >
                <h3 className="mb-6">Available Time Slots</h3>

                <div className="space-y-3">
                  {availableSlots.map((slot, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                          <div>{slot.date}</div>
                          <div className="text-sm text-slate-600">{slot.time}</div>
                        </div>
                      </div>
                      <div className="text-blue-600">→</div>
                    </motion.button>
                  ))}
                </div>

                <Link to="/booking">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
                  >
                    View All Slots
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Doctor Dashboard View (protected)
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-slate-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:space-x-8">
            <DoctorSidebar activeTab={activeTab} setActiveTab={(t: any) => setActiveTab(t)} />

            <main className="flex-1 space-y-6">
              {activeTab === 'dashboard' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-semibold mb-4">Welcome, Dr. {doctor.name}</h2>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="text-sm text-slate-500">Patients</div>
                      <div className="text-xl font-bold">{doctor.patients}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50">
                      <div className="text-sm text-slate-500">Upcoming Appointments</div>
                      <div className="text-xl font-bold">{appointments.filter(a => new Date(a.date) >= new Date()).length}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50">
                      <div className="text-sm text-slate-500">Status</div>
                      <div className="text-xl font-bold">{doctor.status}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="mb-4">Appointments</h3>

                  {loadingAppointments ? (
                    <div>Loading...</div>
                  ) : appointments.length === 0 ? (
                    <div>No appointments</div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((a: any) => {
                        const meeting = a.telemedicineMeeting || null;
                        const withinWindow = (m: any) => {
                          if (!m || !m.startTime) return false;
                          const start = new Date(m.startTime).getTime();
                          const end = m.endTime ? new Date(m.endTime).getTime() : start + 30 * 60 * 1000;
                          const now = Date.now();
                          return now >= (start - 10 * 60 * 1000) && now <= end;
                        };

                        async function handleCreate() {
                          try {
                            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                            const res = await axios.post(`${apiURL}/api/appointments/${a._id}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
                            window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
                          } catch (err) {
                            console.error('Error creating meeting', err);
                            alert('Could not create meeting');
                          }
                        }

                        return (
                          <div key={a._id} className="p-3 border rounded-lg flex justify-between items-center">
                            <div>
                              <div className="font-medium">{a.patient?.name || a.patientName || a.patientEmail || 'Anonymous'}</div>
                              <div className="text-sm text-slate-500">{new Date(a.date).toLocaleDateString()} • {a.time}</div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {meeting ? (
                                <button className={`px-3 py-1 rounded-lg text-sm ${withinWindow(meeting) ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => withinWindow(meeting) ? window.open(meeting.meetingLink || meeting.join_url, '_blank') : alert('Meeting not available')}>{withinWindow(meeting) ? 'Join' : 'Scheduled'}</button>
                              ) : (
                                <button className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm" onClick={handleCreate}>Create Meeting</button>
                              )}

                              <div className="text-sm text-slate-500 capitalize">{a.status}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3>Patients</h3>
                  <p className="text-sm text-slate-500">Patient list coming soon.</p>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3>Messages</h3>
                  <p className="text-sm text-slate-500">Messaging coming soon.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3>Profile Settings</h3>
                  <div className="mt-4">
                    <p><strong>Name:</strong> {doctor.name}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phone || 'N/A'}</p>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}