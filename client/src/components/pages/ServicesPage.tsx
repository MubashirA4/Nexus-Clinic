import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
          Calendar,
          Video,
          Clock,
          Bell,
          Shield,
          FileText,
          CheckCircle,
          LucideIcon,
          Users
} from 'lucide-react';
import { servicesData } from '@/data/servicesData';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
          const navigate = useNavigate();
          const isAuthenticated = localStorage.getItem('token');

          const iconMap: Record<string, LucideIcon> = {
                    'appointment-scheduling': Calendar,
                    'teleconsultation': Video,
                    'calendar-management': Clock,
                    'reminders-notifications': Bell,
                    'secure-communication': Shield,
                    'patient-records': FileText,
          };

          const getIcon = (id: string) => iconMap[id] || CheckCircle;

          const stats = [
                    { icon: Users, value: '30K+', label: 'Patients Served' },
                    { icon: CheckCircle, value: '98%', label: 'Satisfaction Rate' },
                    { icon: Clock, value: '24/7', label: 'Availability' },
                    { icon: Shield, value: '100%', label: 'HIPAA Compliant' }
          ];

          return (
                    <div className="min-h-screen bg-white">
                              {/* Hero Section */}
                              <section className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
                                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20" />

                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 30 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.6 }}
                                                            className="text-center max-w-4xl mx-auto"
                                                  >
                                                            <motion.div
                                                                      initial={{ scale: 0 }}
                                                                      animate={{ scale: 1 }}
                                                                      transition={{ delay: 0.2, type: 'spring' }}
                                                                      className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                                                            >
                                                                      Virtual Healthcare Excellence
                                                            </motion.div>

                                                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                                                                      Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Medical Services</span>
                                                            </h1>

                                                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                                                      Comprehensive remote healthcare services delivered by certified professionals.
                                                                      Experience quality medical care from anywhere, anytime.
                                                            </p>

                                                            {/* Stats Grid */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                                                                      {stats.map((stat, index) => (
                                                                                <motion.div
                                                                                          key={stat.label}
                                                                                          initial={{ opacity: 0, y: 20 }}
                                                                                          animate={{ opacity: 1, y: 0 }}
                                                                                          transition={{ delay: 0.3 + index * 0.1 }}
                                                                                          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                                                                                >
                                                                                          <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                                                                          <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                                                                          <div className="text-sm text-slate-600">{stat.label}</div>
                                                                                </motion.div>
                                                                      ))}
                                                            </div>
                                                  </motion.div>
                                        </div>
                              </section>

                              {/* Services Grid */}
                              <section className="py-16 bg-slate-50">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <motion.div
                                                            layout
                                                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                                                  >
                                                            {servicesData.map((service, index) => {
                                                                      const Icon = getIcon(service.id);
                                                                      return (
                                                                                <motion.div
                                                                                          key={service.id}
                                                                                          layout
                                                                                          initial={{ opacity: 0, scale: 0.9 }}
                                                                                          whileInView={{ opacity: 1, scale: 1 }}
                                                                                          viewport={{ once: true }}
                                                                                          transition={{ delay: index * 0.1 }}
                                                                                          whileHover={{ y: -8 }}
                                                                                          className="group"
                                                                                >
                                                                                          <Link to={`/services/${service.id}`} className="block h-full">
                                                                                                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-100">
                                                                                                              {/* Image */}
                                                                                                              <div className="relative h-56 overflow-hidden">
                                                                                                                        <img
                                                                                                                                  src={service.imageUrl}
                                                                                                                                  alt={service.title}
                                                                                                                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                                                                        />
                                                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />


                                                                                                              </div>

                                                                                                              {/* Content */}
                                                                                                              <div className="p-6">
                                                                                                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                                                                                                  {service.title}
                                                                                                                        </h3>

                                                                                                                        <p className="text-slate-600 mb-4 leading-relaxed">
                                                                                                                                  {service.description}
                                                                                                                        </p>


                                                                                                              </div>
                                                                                                    </div>
                                                                                          </Link>
                                                                                </motion.div>
                                                                      );
                                                            })}
                                                  </motion.div>
                                        </div>
                              </section>

                              {/* Why Choose Us Section */}
                              <section className="py-20 bg-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="text-center mb-12">
                                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                                                      Why Choose Nexus Clinic?
                                                            </h2>
                                                            <p className="text-xl text-slate-600">
Transforming healthcare through intelligent, digital solutions                                                            </p>
                                                  </div>

                                                  <div className="grid md:grid-cols-3 gap-8">
                                                            {[
                                                                      {
                                                                                title: 'Expert Physicians',
                                                                                description: 'Board-certified doctors with years of experience',
                                                                                icon: '👨‍⚕️'
                                                                      },
                                                                      {
                                                                                title: 'Secure & Private',
                                                                                description: 'HIPAA-compliant platform ensuring your data safety',
                                                                                icon: '🔒'
                                                                      },
                                                                      {
                                                                                title: 'Convenient Care',
                                                                                description: 'Access quality healthcare from anywhere, anytime',
                                                                                icon: '📱'
                                                                      }
                                                            ].map((item, index) => (
                                                                      <motion.div
                                                                                key={item.title}
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.2 }}
                                                                                className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl"
                                                                      >
                                                                                <div className="text-5xl mb-4">{item.icon}</div>
                                                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                                                                <p className="text-slate-600">{item.description}</p>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* CTA Section */}
                              <section className="py-20 bg-blue-100 text-black relative overflow-hidden">
                                        <div className="absolute inset-0 bg-grid-white/10" />
                                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                                                  <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                  >
                                                            <h2 className="text-4xl font-bold mb-6">
                                                                      <span className='text-blue-500'> Ready </span> to Get Started?
                                                            </h2>
                                                            <p className="text-xl mb-8 max-w-2xl mx-auto">
                                                                      Book your first consultation today and experience the future of healthcare.
                                                                      Our medical team is ready to help you.
                                                            </p>
                                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                                      <motion.button
                                                                                onClick={() => navigate(isAuthenticated ? '/booking' : '/login?redirect=/booking')}
                                                                                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
                                                                      >
                                                                                Book Appointment Now
                                                                      </motion.button>

                                                            </div>
                                                  </motion.div>
                                        </div>
                              </section>
                    </div>
          );
}
