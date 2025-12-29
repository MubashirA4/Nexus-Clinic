import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/servicesData';

export function ServicesPage() {
          return (
                    <div className="pt-20">
                              {/* Hero Section */}
                              <section className="relative py-20 overflow-hidden bg-white">
                                        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-12 transform translate-x-1/2" />
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                                  <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="max-w-2xl"
                                                  >
                                                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                                                      Our <span className="gradient-text">Medical Services</span>
                                                            </h1>
                                                            <p className="text-lg text-slate-600 mb-8">
                                                                      We provide a wide range of specialized medical services, combining expert care with
                                                                      advanced technology to ensure you receive the best treatment possible.
                                                            </p>
                                                  </motion.div>
                                        </div>
                              </section>

                              {/* Services Grid */}
                              <section className="py-20 bg-slate-50">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {servicesData.map((service, index) => (
                                                                      <motion.div
                                                                                key={service.id}
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                whileHover={{ y: -5 }}
                                                                      >
                                                                                <Link
                                                                                          to={`/services/${service.id}`}
                                                                                          className="block overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-xl h-full group"
                                                                                >
                                                                                          <div className="h-48 overflow-hidden relative">
                                                                                                    <img
                                                                                                              src={service.imageUrl}
                                                                                                              alt={service.title}
                                                                                                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                                                    />
                                                                                                    {service.badge && (
                                                                                                              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                                                                                        {service.badge}
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>
                                                                                          <div className="p-8">
                                                                                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                                                                                              {service.title}
                                                                                                    </h3>
                                                                                                    <p className="text-slate-600 leading-relaxed mb-6">
                                                                                                              {service.description}
                                                                                                    </p>
                                                                                                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                                                                                                              Explore Feature
                                                                                                              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                                                              </svg>
                                                                                                    </div>
                                                                                          </div>
                                                                                </Link>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* Appointment CTA */}
                              <section className="py-20 bg-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                            className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white"
                                                  >
                                                            <h2 className="text-3xl font-bold mb-6 text-white">Need a Medical Consult?</h2>
                                                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                                                      Book an appointment with our specialist doctors today and take the first step
                                                                      towards your better health.
                                                            </p>
                                                            <Link
                                                                      to="/booking"
                                                                      className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                                                            >
                                                                      Book Your Appointment Now
                                                            </Link>
                                                  </motion.div>
                                        </div>
                              </section>
                    </div>
          );
}
