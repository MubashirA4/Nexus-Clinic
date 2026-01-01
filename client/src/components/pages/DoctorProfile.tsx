import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Star, Award, Calendar, MapPin, Clock, Users, ThumbsUp, Video, Phone, FileText, CheckCircle, XCircle, Download, TrendingUp, Activity, Search, Mail, Settings, Edit2, Globe } from 'lucide-react';
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

  // Detailed patients
  const [detailedPatients, setDetailedPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Dashboard UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'reports' | 'patients' | 'settings'>('dashboard');
  const [patientSearch, setPatientSearch] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'previous'>('all');

  // Profile Editor state
  const [profileFormData, setProfileFormData] = useState<any>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (doctor && !profileFormData) {
      setProfileFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone || '',
        specialization: doctor.specialization,
        experience: doctor.experience || 0,
        bio: doctor.bio || '',
        location: (doctor as any).location || '',
        gender: (doctor as any).gender || 'male',
        address: (doctor as any).address || '',
        languages: (doctor as any).languages || ['English'],
        education: (doctor as any).education || [],
        certifications: (doctor as any).certifications || [],
        image: doctor.image
      });
    }
  }, [doctor]);

  // Record Form Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [viewHistoryPatient, setViewHistoryPatient] = useState<any | null>(null);

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
        if (!token) {
          setLoadingAppointments(false);
          return;
        }

        // Try to get current user role/id if possible
        const userStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        const currentUser = userStr ? JSON.parse(userStr) : null;
        const isDoctor = currentUser?.role === 'doctor';

        // 1. If we are a doctor, ALWAYS try our own protected endpoint first
        if (isDoctor) {
          const res = await axios.get(`${apiURL}/api/doctor/appointments`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data?.success) {
            setAppointments(res.data.data || []);
            setLoadingAppointments(false);
            return;
          }
        }

        // 2. If an ID is present (might be admin viewing or public profile)
        if (id) {
          // If viewing as admin
          if (currentUser?.role === 'admin') {
            const res = await axios.get(`${apiURL}/api/admin/appointments`, { headers: { Authorization: `Bearer ${token}` }, params: { doctorId: id } });
            if (res.data?.success) {
              setAppointments(res.data.data || []);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();

    const handler = () => fetchAppointments();
    window.addEventListener('appointmentsUpdated', handler as EventListener);
    return () => window.removeEventListener('appointmentsUpdated', handler as EventListener);
  }, [id]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (id) return; // Only for dashboard
      setLoadingPatients(true);
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const res = await axios.get(`${apiURL}/api/doctor/patients/detailed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setDetailedPatients(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching detailed patients:', err);
      } finally {
        setLoadingPatients(false);
      }
    };

    if (activeTab === 'patients' || activeTab === 'dashboard') {
      fetchPatients();
    }
  }, [id, activeTab]);


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
                <div className="space-y-6">
                  {/* Doctor Welcome Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                          <img src={doctor.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black font-poppins text-slate-900 tracking-tight">Welcome, Dr. {doctor.name.split(' ')[doctor.name.split(' ').length - 1]}</h2>
                          <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.specialization} • {doctor.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <div className="px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Today's Load</div>
                          <div className="text-xl font-bold text-slate-900">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length} Appointments</div>
                        </div>
                      </div>
                    </div>
                    {/* Abstract background shape */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Patients', value: detailedPatients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% this month' },
                      { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Next: 2:00 PM' },
                      { label: 'Completion Rate', value: '98%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Excellence Level' },
                      { label: 'Experience', value: `${doctor.experience}+ yrs`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Expert Rating' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer"
                      >
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                          <stat.icon size={24} />
                        </div>
                        <div className="text-2xl font-black font-poppins text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{stat.label}</div>
                        <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                          {stat.trend}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Appointments */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black font-poppins text-slate-900 uppercase tracking-tight">Recent Activity</h3>
                          <button onClick={() => setActiveTab('appointments')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">View All</button>
                        </div>
                        <div className="space-y-4">
                          {appointments
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5).map((a, i) => (
                              <div key={a._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {(a.patient?.name || a.patientName || 'P').charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm">{a.patient?.name || a.patientName}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.time} • {new Date(a.date).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${a.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {a.status}
                                </div>
                              </div>
                            ))}
                          {appointments.length === 0 && (
                            <div className="py-12 text-center text-slate-400 font-bold">No recent activity</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats / Charts placeholder */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-lg font-black font-poppins text-slate-900 uppercase tracking-tight mb-6 flex items-center">
                          <Activity className="w-5 h-5 mr-3 text-blue-500" />
                          Health Flow
                        </h3>
                        <div className="space-y-6">
                          {[
                            { label: 'Patient Retention', value: 85, color: 'bg-blue-500' },
                            { label: 'Positive Feedback', value: 92, color: 'bg-emerald-500' },
                            { label: 'Consultation Depth', value: 78, color: 'bg-purple-500' },
                          ].map(bar => (
                            <div key={bar.label} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{bar.label}</span>
                                <span className="text-slate-900">{bar.value}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${bar.value}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={`h-full ${bar.color} rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black font-poppins text-slate-900 uppercase tracking-tight">Schedule Manager</h3>
                      </div>

                      <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'today', label: 'Today' },
                          { id: 'upcoming', label: 'Upcoming' },
                          { id: 'previous', label: 'Previous' },
                          { id: 'completed', label: 'Completed' },
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setAppointmentFilter(f.id as any)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${appointmentFilter === f.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {loadingAppointments ? (
                      <div className="py-20 text-center text-slate-400 font-bold">Synchronizing schedule...</div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          const filtered = appointments
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .filter(a => {
                              if (appointmentFilter === 'all') return true;
                              const d = new Date(a.date);
                              const now = new Date();
                              if (appointmentFilter === 'today') return d.toDateString() === now.toDateString();
                              if (appointmentFilter === 'upcoming') return d > now && a.status !== 'completed' && a.status !== 'cancelled';
                              if (appointmentFilter === 'previous') return d < now || a.status === 'completed' || a.status === 'cancelled';
                              if (appointmentFilter === 'completed') return a.status === 'completed';
                              return true;
                            });

                          if (filtered.length === 0) {
                            return (
                              <div className="py-20 text-center text-slate-400 font-bold bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 italic">
                                No {appointmentFilter} appointments found.
                              </div>
                            );
                          }

                          return filtered.map((a, i) => {
                            const meeting = a.telemedicineMeeting || null;
                            const withinWindow = (m: any) => {
                              if (!m || !m.startTime) return false;
                              const start = new Date(m.startTime).getTime();
                              const end = m.endTime ? new Date(m.endTime).getTime() : start + 30 * 60 * 1000;
                              const now = Date.now();
                              return now >= (start - 10 * 60 * 1000) && now <= end;
                            };

                            return (
                              <motion.div
                                key={a._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all group"
                              >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                  <div className="flex items-center space-x-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                      {(a.patient?.name || a.patientName || 'P').charAt(0)}
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-3 mb-1">
                                        <div className="font-black text-slate-900 text-lg uppercase tracking-tight">{a.patient?.name || a.patientName}</div>
                                        <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${a.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                          a.status === 'unverified' ? 'bg-slate-200 text-slate-500' :
                                            'bg-amber-100 text-amber-600'
                                          }`}>
                                          {a.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center text-xs text-slate-500 font-bold space-x-4">
                                        <span className="flex items-center"><Calendar size={12} className="mr-2 text-blue-500" /> {new Date(a.date).toLocaleDateString()}</span>
                                        <span className="flex items-center"><Clock size={12} className="mr-2 text-purple-500" /> {a.time}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center flex-wrap gap-3">
                                    {a.status === 'unverified' && (
                                      <div className="text-[10px] font-bold text-slate-400 italic mr-4">Waiting for email verification...</div>
                                    )}

                                    {meeting ? (
                                      <button
                                        onClick={() => withinWindow(meeting) ? window.open(meeting.meetingLink || meeting.join_url, '_blank') : alert('Meeting not available')}
                                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${withinWindow(meeting) ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-100 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                                      >
                                        {withinWindow(meeting) ? 'Join Video Call' : 'Session Scheduled'}
                                      </button>
                                    ) : (
                                      a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'unverified' && (
                                        <button
                                          onClick={async () => {
                                            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                                            await axios.post(`${apiURL}/api/appointments/${a._id}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
                                            window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
                                          }}
                                          className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                        >
                                          Activate Virtual Call
                                        </button>
                                      )
                                    )}

                                    {a.status !== 'cancelled' && a.status !== 'unverified' && (
                                      <button
                                        onClick={() => setSelectedAppointment(a)}
                                        className="px-6 py-2.5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm"
                                      >
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Case Report
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black font-poppins text-slate-900 uppercase tracking-tight">Patient Directory</h3>
                      </div>
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search by name, email or phone..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    {loadingPatients ? (
                      <div className="py-20 text-center text-slate-400 font-bold">Loading patients...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {detailedPatients
                          .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.email.toLowerCase().includes(patientSearch.toLowerCase()))
                          .map((p, i) => (
                            <motion.div
                              key={p.id || p.email}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all group"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm p-1">
                                    {p.image ? (
                                      <img src={p.image} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                      <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        {p.name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.gender || 'N/A'} • {p.age || 'N/A'} yrs</div>
                                  </div>
                                </div>
                                <div className="p-2 bg-emerald-50 rounded-full">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                              </div>

                              <div className="space-y-3 mb-6">
                                <div className="flex items-center text-xs text-slate-500 font-bold">
                                  <Phone size={14} className="mr-3 text-slate-300" />
                                  {p.phone || 'No phone'}
                                </div>
                                <div className="flex items-center text-xs text-slate-500 font-bold">
                                  <Mail size={14} className="mr-3 text-slate-300" />
                                  <span className="truncate max-w-[180px]">{p.email}</span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500 font-bold">
                                  <Clock size={14} className="mr-3 text-slate-300" />
                                  Last: {new Date(p.lastVisit).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setViewHistoryPatient({ id: p.id || p.email, name: p.name })}
                                  className="flex-1 py-3 bg-white text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                                >
                                  History
                                </button>
                                <button
                                  onClick={() => setActiveTab('appointments')}
                                  className="p-3 bg-white text-blue-500 rounded-2xl border border-slate-100 hover:border-blue-500 transition-all shadow-sm"
                                >
                                  <Calendar size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ))}

                        {detailedPatients.length === 0 && !loadingPatients && (
                          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
                            No patients records found.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold">Uploaded Patient Reports</h3>
                  </div>
                  <PatientReportsView />
                </div>
              )}


              {activeTab === 'settings' && profileFormData && (
                <div className="space-y-6 pb-20">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black font-poppins text-slate-900 uppercase tracking-tight">Professional Profile</h3>
                      </div>
                      <button
                        onClick={async () => {
                          setUpdatingProfile(true);
                          try {
                            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                            const res = await axios.put(`${apiURL}/api/doctor/profile`, profileFormData, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (res.data.success) {
                              const { toast } = (window as any).sonner || { toast: { success: (m: string) => alert(m) } };
                              toast.success("Profile updated successfully!");
                              setDoctor(res.data.user);
                            }
                          } catch (err) {
                            console.error('Error updating profile:', err);
                          } finally {
                            setUpdatingProfile(false);
                          }
                        }}
                        disabled={updatingProfile}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {updatingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Side - Basic Info */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6 mb-8">
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                              <img src={profileFormData.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                              <Edit2 size={16} />
                            </button>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">Profile Picture</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                              type="text"
                              value={profileFormData.name}
                              onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                            <input
                              type="text"
                              value={profileFormData.specialization}
                              onChange={(e) => setProfileFormData({ ...profileFormData, specialization: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                          <textarea
                            rows={4}
                            value={profileFormData.bio}
                            onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                            <input
                              type="text"
                              value={profileFormData.phone}
                              onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience</label>
                            <input
                              type="number"
                              value={profileFormData.experience}
                              onChange={(e) => setProfileFormData({ ...profileFormData, experience: parseInt(e.target.value) })}
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Additional Info */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                            <MapPin size={12} className="mr-2" /> Clinic Location
                          </label>
                          <input
                            type="text"
                            value={profileFormData.location}
                            placeholder="e.g. New York Medical Center"
                            onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                            <Globe size={12} className="mr-2" /> Languages Spoken
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['English', 'Spanish', 'French', 'Hindi', 'Arabic'].map(lang => (
                              <button
                                key={lang}
                                onClick={() => {
                                  const current = profileFormData.languages || [];
                                  const updated = current.includes(lang)
                                    ? current.filter((l: string) => l !== lang)
                                    : [...current, lang];
                                  setProfileFormData({ ...profileFormData, languages: updated });
                                }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${profileFormData.languages?.includes(lang) ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital Address</label>
                          <textarea
                            rows={3}
                            value={profileFormData.address}
                            onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 text-sm resize-none"
                          />
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <div className="flex items-center space-x-3 mb-4 text-slate-600">
                            <Award size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Trust Badges</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                              <CheckCircle size={16} className="text-emerald-500" />
                              <span>Verified Medical License</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                              <CheckCircle size={16} className="text-emerald-500" />
                              <span>Nexus Clinic Partner</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>

      {/* Record Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <RecordModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {viewHistoryPatient && (
          <HistoryModal
            patient={viewHistoryPatient}
            onClose={() => setViewHistoryPatient(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Sub-component for the Report Form Modal
function RecordModal({ appointment, onClose }: { appointment: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    medications: '',
    notes: '',
    treatment: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = (window as any).sonner || { toast: { success: (m: string) => alert(m), error: (m: string) => console.log(m) } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const res = await axios.post(`${apiURL}/api/records`, {
        patientId: appointment.patient?._id || appointment.patient,
        appointmentId: appointment._id,
        patientName: appointment.patientName || appointment.patient?.name,
        patientEmail: appointment.patientEmail || appointment.patient?.email,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Medical record saved successfully!");
        window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
        onClose();
      }
    } catch (err: any) {
      console.error("Error saving record", err);
      toast.error(err.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black font-poppins text-slate-900 uppercase tracking-tight">Post-Visit Report</h3>
                <p className="text-[10px] font-bold text-slate-400">Add medical details for this session</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
              <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-900" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Patient</label>
                  <div className="font-bold text-slate-900 text-sm truncate">{appointment.patientName || appointment.patient?.name}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Email</label>
                  <div className="font-bold text-slate-900 text-xs truncate">{appointment.patientEmail || appointment.patient?.email}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 ml-1">Diagnosis / Concern</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Chronic seasonal allergies"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-900 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 ml-1">Medications Prescribed</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Cetirizine 10mg daily..."
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-900 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 ml-1">Observation Notes</label>
                  <textarea
                    rows={2}
                    placeholder="What happened during visit..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-900 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 ml-1">Treatment Plan</label>
                  <textarea
                    rows={2}
                    placeholder="Future steps..."
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-900 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:shadow-2xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Report
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PatientReportsView() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const res = await axios.get(`${apiURL}/api/medical-reports/patient-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setReports(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching patient reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="py-12 text-center text-slate-500 font-medium">Loading reports...</div>;

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="py-12 text-center text-slate-500 font-medium bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          No reports uploaded by your patients yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 truncate max-w-[200px]">{report.title}</h4>
                  <p className="text-xs text-slate-500 font-bold">Patient: {report.patient?.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">{new Date(report.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <a
                href={`${apiURL}${report.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white text-slate-400 rounded-2xl hover:text-blue-600 hover:shadow-md transition-all"
              >
                <Download className="w-5 h-5" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component for viewing Patient History
function HistoryModal({ patient, onClose }: { patient: { id: string, name: string }, onClose: () => void }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const res = await axios.get(`${apiURL}/api/records/patient/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRecords(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching patient history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patient.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{patient.name}'s History</h3>
              <p className="text-[10px] font-bold text-slate-400">Past medical records and sessions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-left">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold">No medical records found for this patient.</p>
            </div>
          ) : (
            records.map((record, index) => (
              <div key={record._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    {new Date(record.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">ID: {record._id.slice(-6)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Diagnosis</label>
                    <div className="font-bold text-slate-900 text-sm">{record.diagnosis}</div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Medication</label>
                    <div className="font-bold text-slate-900 text-sm">{record.medications}</div>
                  </div>
                </div>

                {record.notes && (
                  <div className="pt-2 border-t border-slate-200/50">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Clinical Notes</label>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{record.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}