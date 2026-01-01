import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { AddAdminPage } from './components/AddAdminPage';
import { AddDoctorPage } from './components/AddDoctorPage';
import { ManageDoctorsPage } from './components/ManageDoctorsPage';
import { ManagePatientsPage } from './components/ManagePatientsPage';
import { AppointmentsPage } from './components/AppointmentsPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { UsersPage } from './components/UsersPage';
import { DashboardNavbar } from '../../ui/dashboardNavbar';



export function AdminPanel() {
  const [activePage, setActivePage] = useState('Dashboard');
  // Default to false on mobile, true on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize correct state on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div>
      <DashboardNavbar />

      <div className="h-screen bg-slate-50 overflow-hidden flex flex-col md:flex-row">

        <div className='mt-24'></div>
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-4 flex-shrink-0 z-30 relative flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-slate-100/50 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-slate-800">Admin Portal</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Layout Container */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50 w-full relative">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Desktop Header / Breadcrumbs could go here */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{activePage}</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {activePage === 'Dashboard' && 'Overview & Analytics'}
                    {activePage === 'Add Admin' && 'Grant Administrator Access'}
                    {activePage === 'Add Doctor' && 'Register New Staff'}
                    {activePage === 'Manage Doctors' && 'Staff Directory & Management'}
                    {activePage === 'Manage Patients' && 'Patient Records'}
                    {activePage === 'All Users' && 'System Users Directory'}
                    {activePage === 'Appointments' && 'Scheduling System'}
                  </p>
                </div>
              </motion.div>

              {/* Rendering Pages */}
              <div className="min-h-[calc(100vh-12rem)]">
                {activePage === 'Dashboard' && <DashboardPage />}
                {activePage === 'Add Admin' && <AddAdminPage />}
                {activePage === 'Add Doctor' && <AddDoctorPage />}
                {activePage === 'Manage Doctors' && <ManageDoctorsPage />}
                {activePage === 'Manage Patients' && <ManagePatientsPage />}
                {activePage === 'All Users' && <UsersPage />}
                {activePage === 'Appointments' && <AppointmentsPage />}
                {activePage === 'Reports' && <ReportsPage />}
                {activePage === 'Settings' && <SettingsPage />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}