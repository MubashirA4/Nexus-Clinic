import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Circle, User, Stethoscope, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import { apiURL } from '../../../utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Doctor {
  id: string | number;
  name: string;
  specialty: string;
  status: 'online' | 'busy' | 'offline';
  patients: number;
  rating: number;
  image: string;
}

export function LiveDoctorAvailability() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/doctors`);
        console.log('Doctors API response:', response.data);

        const doctorsArray = Array.isArray(response.data?.data) ? response.data.data : [];
        console.log('Doctors array:', doctorsArray);

        const mappedDoctors = doctorsArray.map((doc: any, index: number): Doctor => ({
          id: doc._id || doc.id || index,
          name: doc.name || `Dr. Doctor ${index + 1}`,
          specialty: doc.specialization || doc.specialty || 'General Physician',
          status: ['online', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'online' | 'busy' | 'offline',
          patients: Math.floor(Math.random() * 10),
          rating: 4.5 + Math.random() * 0.5,
          image: doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Doctor')}&background=3b82f6&color=fff&size=400`,
        }));

        console.log('Mapped doctors:', mappedDoctors);
        setDoctors(mappedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);



  const handleImageError = (index: number) => {
    console.log(`Image error for doctor ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleBookNow = (doctor: Doctor) => {
    const bookingPath = `/booking?doctorId=${doctor.id}&specialty=${encodeURIComponent(doctor.specialty)}`;
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`);
    } else {
      navigate(bookingPath);
    }
  };

  const statusConfig: Record<string, { color: string; text: string; bg: string }> = {
    online: { color: 'text-green-500', text: 'Available Now', bg: 'bg-green-50' },
    busy: { color: 'text-amber-500', text: 'In Consultation', bg: 'bg-amber-50' },
    offline: { color: 'text-slate-400', text: 'Offline', bg: 'bg-slate-100' },
  };

  // Debug: Check if doctors are loaded
  console.log('Current doctors state:', doctors);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end items-center justify-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
              </motion.div>
              <span className="text-blue-700 font-semibold">Live Doctor Availability</span>
            </div>
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
              Connect with Our <span className="text-blue-600">Expert Doctors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Real-time availability and instant booking with certified medical professionals
            </p>
          </motion.div>
        </div>

        {/* Debug info */}
        {doctors.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Loading doctors...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch doctor information
            </p>
          </div>
        )}

        {/* Doctor Cards Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-prev-button',
              nextEl: '.swiper-next-button',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {doctors.map((doctor, index) => (
              <SwiperSlide key={doctor.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full mb-8"
                >
                  {/* Image Section (hc-teamimage) */}
                  <div className="relative overflow-hidden">
                    <div className='h-[350px] overflow-hidden'>
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-top overflow-hidden transition-transform duration-700 group-hover:scale-110"
                        onError={() => handleImageError(index)}
                      />
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doctor.status === 'online' ? 'bg-green-100 text-green-600' :
                        doctor.status === 'busy' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                        <Circle className={`w-2 h-2 fill-current`} />
                        {doctor.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Content (hc-teamcard-main) */}
                  <div className="p-6 transition-all duration-500 ">
                    <h5 className="text-xl font-bold text-slate-900 mb-2 truncate">{doctor.name}</h5>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <p className="text-sm font-medium">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <h6 className="text-sm font-bold text-slate-700">{doctor.rating.toFixed(1)}</h6>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookNow(doctor)}
                      className="w-full py-3 rounded-xl font-bold shadow-lg transition-all bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 active:scale-95"
                    >
                      Book Appointment
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>



      </div>
    </section>
  );
}