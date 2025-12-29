import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star, Quote, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export function TestimonialsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      role: 'Patient',
      rating: 5,
      text: 'Nexus Clinic changed my life. The telemedicine feature allowed me to consult with Dr. Johnson from home during my recovery. The care was exceptional!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      video: true,
    },
    {
      id: 2,
      name: 'Robert Thompson',
      role: 'Patient',
      rating: 5,
      text: 'The emergency care team saved my life. Their quick response and professionalism were outstanding. I cannot thank them enough for their dedication.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      video: false,
    },
    {
      id: 3,
      name: 'Lisa Chen',
      role: 'Patient',
      rating: 5,
      text: 'As a busy mom, the pediatric care here is amazing. Dr. Rodriguez is wonderful with children and the online booking system makes scheduling so easy.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      video: true,
    },
    {
      id: 4,
      name: 'David Kumar',
      role: 'Patient',
      rating: 5,
      text: 'The cardiac care unit is world-class. The technology and expertise combined with genuine compassion make this clinic truly special.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      video: false,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">What Our Patients Say</h2>
          <p className="text-xl text-slate-600">
            Real stories from real people
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Left Side - Image & Rating */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="relative mb-6"
                  >
                    <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-purple-100">
                      <img
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Video Badge */}
                    {testimonials[activeIndex].video && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Rating Stars */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-1 mb-4"
                  >
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                      >
                        <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <h4 className="mb-1">{testimonials[activeIndex].name}</h4>
                    <p className="text-slate-600">{testimonials[activeIndex].role}</p>
                  </motion.div>
                </div>

                {/* Right Side - Quote */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Quote className="w-12 h-12 text-purple-200 mb-4" />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-700 leading-relaxed mb-6"
                  >
                    {testimonials[activeIndex].text}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-2 text-sm text-slate-500"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Verified Patient Review</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveIndex(index)}
              className="relative"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8'
                  : 'bg-slate-300'
                  }`}
              />
              {index === activeIndex && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-blue-400 rounded-full blur-sm"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Auto-play Progress Bar */}
        <div className="max-w-4xl mx-auto mt-6 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            key={activeIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          />
        </div>
      </div>
    </section>
  );
}
