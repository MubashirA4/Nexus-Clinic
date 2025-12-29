import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Heart, CheckCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

export function ServiceDetailPage() {
  const { service: serviceId } = useParams();
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Image */}
            <div className="h-96 lg:h-auto w-full">
              <div className="flex items-center justify-center h-full w-full">
                <motion.div className="w-full h-full flex items-center justify-center">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Right - Info */}
            <div className="p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  <span className="text-sm">Premium Service</span>
                </div>

                <h1 className="mb-4 capitalize">{service.title} Services</h1>
                <p className="text-xl text-slate-600 mb-6">
                  {service.longDescription}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <div className="medical-number">24/7</div>
                      <div className="text-sm text-slate-600">Emergency Care</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="medical-number">Same Day</div>
                      <div className="text-sm text-slate-600">Appointments</div>
                    </div>
                  </div>
                </div>


              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12"
        >
          <h2 className="mb-8 text-center">Our Process</h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block" />

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Initial Consultation',
                  description: 'Comprehensive evaluation and medical history review',
                  duration: '30 minutes',
                },
                {
                  step: 2,
                  title: 'Diagnostic Testing',
                  description: 'Advanced cardiac imaging and laboratory tests',
                  duration: '1-2 hours',
                },
                {
                  step: 3,
                  title: 'Treatment Plan',
                  description: 'Personalized care strategy developed by specialists',
                  duration: '45 minutes',
                },
                {
                  step: 4,
                  title: 'Follow-up Care',
                  description: 'Ongoing monitoring and support for optimal outcomes',
                  duration: 'As needed',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg z-10"
                  >
                    <span className="medical-number">{item.step}</span>
                  </motion.div>

                  <div className="flex-1 bg-slate-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3>{item.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="mb-8 text-center">Why Choose Us</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Expert Team',
                description: 'Board-certified specialists with years of experience',
                icon: '👨‍⚕️',
              },
              {
                title: 'Advanced Technology',
                description: 'State-of-the-art equipment and diagnostic tools',
                icon: '🔬',
              },
              {
                title: 'Personalized Care',
                description: 'Tailored treatment plans for each patient',
                icon: '💙',
              },
              {
                title: 'Quick Results',
                description: 'Fast turnaround on tests and consultations',
                icon: '⚡',
              },
              {
                title: 'Affordable Pricing',
                description: 'Competitive rates and insurance acceptance',
                icon: '💰',
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock emergency and patient care',
                icon: '🏥',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
