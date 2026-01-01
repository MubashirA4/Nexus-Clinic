import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { DashboardNavbar } from '../../components/ui/dashboardNavbar';
import { DashboardOverview } from '../portal/DashboardOverview';
import { UpcomingAppointments } from '../portal/UpcomingAppointments';
import { HealthMetrics } from '../portal/HealthMetrics';
import { QuickActions } from '../portal/QuickActions';
import { ProfilePageContent } from './ProfilePage';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Activity,
  UserCircle,
  Upload,
  Download,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../components/auth/auth';
import { apiURL } from '../../../utils';

export function PatientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const [nextDoctor, setNextDoctor] = useState<any | null>(null);
  const [loadingNextDoctor, setLoadingNextDoctor] = useState(true);
  const [stats, setStats] = useState({
    appointments: 0,
    records: 0,
    prescriptions: 0
  });

  // Fetch all dashboard data
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      setLoadingNextDoctor(false);
      return;
    }

    const fetchData = async () => {
      try {
        const axiosLib = (await import('axios')).default;
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Appointments
        const appointmentsRes = await axiosLib.get(`${apiURL}/api/appointments`, { headers });
        const appointments = appointmentsRes.data?.data || [];
        const upcomingCount = appointments.filter((a: any) => a.status === 'pending' || a.status === 'scheduled').length;

        if (appointments.length > 0) {
          const upcoming = appointments
            .map((a: any) => ({ ...a, dateObj: new Date(a.date) }))
            .sort((a: any, b: any) => a.dateObj - b.dateObj)[0];
          setNextDoctor(upcoming.doctor || null);
        }

        // Fetch Medical Records
        const recordsRes = await axiosLib.get(`${apiURL}/api/records/my-records`, { headers });
        const records = recordsRes.data?.data || [];

        // Count prescriptions (unique medications mentioned in records)
        const prescriptionsCount = records.filter((r: any) => r.medications && r.medications.toLowerCase() !== 'none').length;


        setStats({
          appointments: upcomingCount,
          records: records.length,
          prescriptions: prescriptionsCount
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingNextDoctor(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'metrics', label: 'Health Metrics', icon: Activity },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const UserCircleIcon = UserCircle; // for better prop passing if needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardNavbar />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-2xl sm:text-3xl font-bold text-slate-900"
            >
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600"
            >
              Here's your health overview for today
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:sticky lg:top-24"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-2 lg:p-4 scrollbar-hide">
                    {tabs.map((tab, index) => (
                      <motion.button
                        key={tab.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-shrink-0 lg:w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium whitespace-nowrap">{tab.label}</span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="hidden lg:block ml-auto w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'dashboard' && (
                <>
                  <DashboardOverview onTabChange={setActiveTab} data={stats} />
                  <div className="mt-8">
                    <UpcomingAppointments onViewAll={() => setActiveTab('appointments')} />
                  </div>
                  <div className="mt-8">
                    <QuickActions onTabChange={setActiveTab} />
                  </div>
                </>
              )}

              {activeTab === 'metrics' && <HealthMetrics />}

              {activeTab === 'appointments' && <UpcomingAppointments fullView />}

              {activeTab === 'records' && <MedicalRecordsView />}


              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                  <ProfilePageContent />
                </div>
              )}

              {activeTab !== 'dashboard' && activeTab !== 'metrics' && activeTab !== 'appointments' && activeTab !== 'records' && activeTab !== 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    This section is coming soon. Stay tuned for more features!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalRecordsView() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const axiosLib = (await import('axios')).default;
        const res = await axiosLib.get(`${apiURL}/api/records/my-records`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRecords(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading medical history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Health Records</h2>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-bold"
        >
          <Upload className="w-5 h-5" />
          <span>Upload New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Clinical History
          </h3>
          {records.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold">No clinical records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all">
                        <img
                          src={record.doctor?.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"}
                          alt={record.doctor?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{record.doctor?.name}</h4>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{record.doctor?.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Diagnosis</label>
                      <div className="font-bold text-slate-900">{record.diagnosis}</div>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Prescribed Medication</label>
                      <div className="font-bold text-blue-900">{record.medications}</div>
                    </div>

                    {record.notes && (
                      <div className="px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Clinical Notes</label>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-500" />
            Uploaded Reports
          </h3>
          <UploadedReportsList />
        </div>
      </div>

      <AnimatePresence>
        {showUploadModal && <UploadReportModal onClose={() => setShowUploadModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function UploadedReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const axiosLib = (await import('axios')).default;
        const res = await axiosLib.get(`${apiURL}/api/medical-reports/my-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setReports(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
    window.addEventListener('reportsUpdated', fetchReports);
    return () => window.removeEventListener('reportsUpdated', fetchReports);
  }, []);

  if (loading) return <div className="text-slate-400 text-sm">Loading reports...</div>;

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-slate-100 text-slate-400 text-sm font-bold">
          No uploaded reports yet.
        </div>
      ) : (
        reports.map((report) => (
          <motion.div
            key={report._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{report.title}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-black">{new Date(report.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <a
              href={`${apiURL}${report.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Download className="w-5 h-5" />
            </a>
          </motion.div>
        ))
      )}
    </div>
  );
}

function UploadReportModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [appointmentId, setAppointmentId] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const axiosLib = (await import('axios')).default;
        const res = await axiosLib.get(`${apiURL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAppointments(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching appointments for upload:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !appointmentId) return alert('Please select a file and an appointment');

    setUploading(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const axiosLib = (await import('axios')).default;
      const formData = new FormData();
      formData.append('report', file);
      formData.append('title', title || file.name);
      formData.append('appointmentId', appointmentId);

      const res = await axiosLib.post(`${apiURL}/api/medical-reports/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.data.success) {
        window.dispatchEvent(new CustomEvent('reportsUpdated'));
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
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
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Upload Report</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share with your doctor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Select Appointment</label>
            {loadingAppointments ? (
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 text-sm font-bold">Loading...</div>
            ) : (
              <select
                required
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 appearance-none"
              >
                <option value="">Choose an appointment</option>
                {appointments.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.doctor?.name} - {new Date(app.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Report Title</label>
            <input
              type="text"
              placeholder="e.g. Lab Results, X-Ray"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Document File</label>
            <div className="relative">
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 border-dashed hover:border-blue-500 transition-all outline-none font-bold text-slate-900 text-xs cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white transition-all shadow-xl ${uploading ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-200 active:scale-95'}`}
          >
            {uploading ? 'Uploading...' : 'Send to Doctor'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}