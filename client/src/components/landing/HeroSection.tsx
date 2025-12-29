import { motion } from 'motion/react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgHero from '../../../build/assets/1.jpg';
import { useAuth } from '../auth/auth';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [videoAvailable, setVideoAvailable] = useState(true); // toggled if remote video fails
  const navigate = useNavigate();

  const handleBooking = () => {
    console.log('Booking button clicked');
    if (isAuthenticated) {
      navigate('/booking');
    } else {
      navigate('/login?redirect=/booking');
    }
  };

  return (
    <section className="relative min-h-screen flex items-start overflow-hidden">
      {/* Video Background */}
      <div className="max-w-5xl">
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.7), rgba(30,41,59,0.7)), url(${bgHero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            aria-hidden="true"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50 z-10" />

          {/* Additional gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/40 z-10" />
        </div>

        <div className="relative z-30 px-4 sm:px-6 py-20">
          <div className="">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-6 py-3 mt-6 bg-white/10 backdrop-blur-md rounded-full mb-10 shadow-lg border border-white/20"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-white font-medium">Available 24/7 for Emergency Care</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mt-4 mb-6 leading-tight"
              >
                <span className="text-white">Revolutionizing Healthcare with </span>
                <span className="gradient-text">Compassion</span>
                <span className="text-white"> & </span>
                <span className="gradient-text">Technology</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white md:text-2xl text-slate-600 mb-8 font-light"
              >
                24/7 Telemedicine • Same-day Appointments • Expert Care
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <motion.button
                  onClick={handleBooking}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59,130,246,0.35)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-xl flex items-center space-x-2 font-semibold"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>


              </motion.div>


              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-wrap gap-6 items-center"
              >
                <div className="flex items-center space-x-2 text-white/80">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-white">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-white">Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-white">Certified Professionals</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}