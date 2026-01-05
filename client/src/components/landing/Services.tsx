import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Wifi, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { servicesData } from '../../data/servicesData';

export function ServicesHome() {
  // State for image loading errors
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const featuredServices = servicesData;

  // Fallback colors if images fail to load
  const fallbackColors: Record<string, string> = {
    'telemedicine': '#3b82f6',
    'mental-health': '#8b5cf6',
    'nutrition': '#10b981',
    'chronic-care': '#ef4444',
    'pediatrics': '#f59e0b',
    'dermatology': '#6366f1',
  };

  // Handle image loading errors
  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Remote Healthcare Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <Wifi className="w-4 h-4" />
              <span>100% Remote Healthcare</span>
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>

          <h2 className="mb-4">Virtual Medical Services</h2>
          <p className="text-xl text-slate-700 mb-6">
            Quality healthcare delivered remotely through secure video consultations
          </p>

          {/* Clear Disclaimer */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
              <p className="text-slate-700 font-medium">
                <span className="text-blue-600 font-semibold">Important:</span> All our services are provided
                virtually through secure video calls. No physical clinic visits required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Container for 6 Telemedicine Services - KEY FIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Add min-h-[600px] to ensure grid items stretch properly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex"
            >
              <Link to={`/services/${service.id}`} className="w-full flex flex-col">
                {/* Card container with min-height and flex column */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col h-full bg-white rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative border border-blue-100 overflow-hidden"
                >

                  {/* Image Container - Fixed Height */}
                  <div className="relative h-48 w-full overflow-hidden rounded-xl mb-6 flex-shrink-0">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                      src={service.imageUrl}
                      alt={`${service.title} service`}
                      onError={() => handleImageError(service.id)}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  {/* Content Section - Takes remaining space */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="mb-3 text-gray-800 text-xl font-semibold">{service.title}</h3>
                    <p className="text-slate-600 mb-6  flex-grow">{service.description}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}