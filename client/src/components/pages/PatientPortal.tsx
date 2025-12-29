import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DashboardNavbar } from '../../components/ui/dashboardNavbar';
import { DashboardOverview } from '../portal/DashboardOverview';
import { UpcomingAppointments } from '../portal/UpcomingAppointments';
import { HealthMetrics } from '../portal/HealthMetrics';
import { QuickActions } from '../portal/QuickActions';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../components/auth/auth';
import { apiURL } from '../../../utils';

export function PatientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const [nextDoctor, setNextDoctor] = useState<any | null>(null);
  const [loadingNextDoctor, setLoadingNextDoctor] = useState(true);

  // Fetch patient's upcoming appointments and set next doctor (for showing image on dashboard)
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      setLoadingNextDoctor(false);
      return;
    }

    (async () => {
      try {
        const axios = (await import('axios')).default;
        const res = await axios.get(`${apiURL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data?.data || [];
        if (Array.isArray(data) && data.length > 0) {
          // find the next upcoming by date
          const upcoming = data
            .map((a: any) => ({ ...a, dateObj: new Date(a.date) }))
            .sort((a: any, b: any) => a.dateObj - b.dateObj)[0];
          setNextDoctor(upcoming.doctor || null);
        }
      } catch (err) {
        console.error('Error fetching patient appointments for dashboard:', err);
      } finally {
        setLoadingNextDoctor(false);
      }
    })();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'metrics', label: 'Health Metrics', icon: Activity },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
            {/* Sidebar Navigation with User Info - Wrapper with relative positioning */}
            <div className="lg:w-64 flex-shrink-0 relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-24"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Navigation Tabs */}
                  <nav className="space-y-1 p-4">
                    {tabs.map((tab, index) => (
                      <motion.button
                        key={tab.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
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
                  <DashboardOverview />
                  <div className="mt-8">
                    <UpcomingAppointments onViewAll={() => setActiveTab('appointments')} />
                  </div>
                  <div className="mt-8">
                    <QuickActions />
                  </div>
                </>
              )}

              {activeTab === 'metrics' && <HealthMetrics />}

              {activeTab === 'appointments' && <UpcomingAppointments fullView />}

              {activeTab !== 'dashboard' && activeTab !== 'metrics' && activeTab !== 'appointments' && (
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