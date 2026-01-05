import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/pages/LandingPage';
import Footer from './components/ui/Footer';
import { BookingPage } from './components/pages/BookingPage';
import { PatientPortal } from './components/pages/PatientPortal';
import { DoctorProfile } from './components/pages/DoctorProfile';
// import { TelemedicinePage } from './components/pages/TelemedicinePage';
import ProfilePage from './components/pages/ProfilePage';
import { AdminPanel } from './components/pages/adminpage/AdminPanel';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { OurDoctorsPage } from './components/pages/ourDoctorPage';
import { AboutUs } from './components/pages/AboutUs';
import ServicesPage from './components/pages/ServicesPage';
import { VerifyAppointment } from './components/pages/VerifyAppointment';
import ChatWidget from './components/telemedicine/ChatWidget';

// Main App Component with conditional navigation
function AppContent() {
  const location = useLocation();

  // List of routes where we DON'T want the main navigation
  const hideNavigationRoutes = [
    '/patient-dashboard',
    '/doctor-dashboard',
    '/admin-dashboard'
    // Add other dashboard routes here
  ];

  // Check if current route should hide the main navigation
  const shouldShowNavigation = !hideNavigationRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Conditionally render main navigation */}
      {shouldShowNavigation && <Navigation />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientPortal /></ProtectedRoute>} />
          <Route path="/ourdoctors" element={<OurDoctorsPage />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorProfile /></ProtectedRoute>} />
          <Route path="/services/:service" element={<ServiceDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-appointment" element={<VerifyAppointment />} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />

      <ChatWidget />
    </Router>
  );
}