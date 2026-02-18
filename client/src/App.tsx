import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Footer from "./components/ui/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import ChatWidget from "./components/telemedicine/ChatWidget";
import { ScrollToTop } from "./components/ScrollToTop";

// Lazy loaded components
const LandingPage = lazy(() =>
  import("./components/pages/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);
const BookingPage = lazy(() =>
  import("./components/pages/BookingPage").then((module) => ({
    default: module.BookingPage,
  })),
);
const PatientPortal = lazy(() =>
  import("./components/pages/PatientPortal").then((module) => ({
    default: module.PatientPortal,
  })),
);
const DoctorProfile = lazy(() =>
  import("./components/pages/DoctorProfile").then((module) => ({
    default: module.DoctorProfile,
  })),
);
const ProfilePage = lazy(() => import("./components/pages/ProfilePage"));
const AdminPanel = lazy(() =>
  import("./components/pages/adminpage/AdminPanel").then((module) => ({
    default: module.AdminPanel,
  })),
);
const ServiceDetailPage = lazy(() =>
  import("./components/pages/ServiceDetailPage").then((module) => ({
    default: module.ServiceDetailPage,
  })),
);
const LoginPage = lazy(() =>
  import("./components/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const SignupPage = lazy(() =>
  import("./components/pages/SignupPage").then((module) => ({
    default: module.SignupPage,
  })),
);
const OurDoctorsPage = lazy(() =>
  import("./components/pages/ourDoctorPage").then((module) => ({
    default: module.OurDoctorsPage,
  })),
);
const AboutUs = lazy(() =>
  import("./components/pages/AboutUs").then((module) => ({
    default: module.AboutUs,
  })),
);
const ServicesPage = lazy(() => import("./components/pages/ServicesPage"));
const VerifyAppointment = lazy(() =>
  import("./components/pages/VerifyAppointment").then((module) => ({
    default: module.VerifyAppointment,
  })),
);

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Main App Component with conditional navigation
function AppContent() {
  const location = useLocation();

  // List of routes where we DON'T want the main navigation
  const hideNavigationRoutes = [
    "/patient-dashboard",
    "/doctor-dashboard",
    "/admin-dashboard",
    // Add other dashboard routes here
  ];

  // Check if current route should hide the main navigation
  const shouldShowNavigation = !hideNavigationRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Conditionally render main navigation */}
      {shouldShowNavigation && <Navigation />}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/ourdoctors" element={<OurDoctorsPage />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/services/:service" element={<ServiceDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-appointment" element={<VerifyAppointment />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />

      <ChatWidget />
    </Router>
  );
}
