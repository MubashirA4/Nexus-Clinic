import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import { DepartmentSelection } from '../booking/DepartmentSelection';
import { DoctorSelection } from '../booking/DoctorSelection';
import { TimeSlotPicker } from '../booking/TimeSlotPicker';
import { PatientDetails } from '../booking/PatientDetails';
import { BookingConfirmation } from '../booking/BookingConfirmation';
import { Check } from 'lucide-react';

export function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If auth check finished and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      const currentPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [loading, isAuthenticated, navigate, location]);

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const doctorId = params.get('doctorId');
    const specialty = params.get('specialty');

    if (doctorId && specialty && bookingData.doctor !== doctorId) {
      // Map specialty to department ID (simple lowercase mapping for now)
      const deptId = specialty.toLowerCase();

      setBookingData(prev => ({
        ...prev,
        doctor: doctorId || '',
        department: deptId || ''
      }));

      // Jump to step 3 (Time Slot Picker)
      setCurrentStep(3);
    }
  }, [location.search, bookingData.doctor]);

  const steps = [
    { number: 1, title: 'Department', component: DepartmentSelection },
    { number: 2, title: 'Doctor', component: DoctorSelection },
    { number: 3, title: 'Time Slot', component: TimeSlotPicker },
    { number: 4, title: 'Details', component: PatientDetails },
    { number: 5, title: 'Confirmation', component: BookingConfirmation },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = (data: any) => {
    setBookingData({ ...bookingData, ...data });
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Book Your Appointment</h2>
          <p className="text-xl text-slate-600">
            Complete the steps below to schedule your visit
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step Circles */}
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${step.number < currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : step.number === currentStep
                      ? 'bg-white border-4 border-blue-500 text-blue-600'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                >
                  {step.number < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    step.number
                  )}

                  {step.number === currentStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-400 -z-10"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className={`text-sm hidden md:block ${step.number <= currentStep ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              data={bookingData}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
