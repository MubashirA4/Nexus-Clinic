import { motion } from 'motion/react';
import { Heart, Target, Users, Award, Shield, Clock } from 'lucide-react';

export function AboutUs() {
          const stats = [
                    { label: 'Specialist Doctors', value: '50+' },
                    { label: 'Patients Served', value: '10k+' },
                    { label: 'Years Experience', value: '15+' },
                    { label: 'Successful Surgeries', value: '2k+' },
          ];

          const values = [
                    {
                              icon: Heart,
                              title: 'Patient-Centered Care',
                              description: 'We prioritize our patients\' needs and well-being above all else, providing compassionate and personalized care.',
                              color: 'bg-red-50 text-red-600',
                    },
                    {
                              icon: Target,
                              title: 'Excellence in Service',
                              description: 'We strive for excellence in every aspect of our medical services, maintaining the highest standards of quality.',
                              color: 'bg-blue-50 text-blue-600',
                    },
                    {
                              icon: Users,
                              title: 'Collaborative Team',
                              description: 'Our diverse team of specialists works together to provide comprehensive and integrated healthcare solutions.',
                              color: 'bg-purple-50 text-purple-600',
                    },
                    {
                              icon: Shield,
                              title: 'Trust & Integrity',
                              description: 'We build lasting relationships with our patients based on transparency, honesty, and ethical practices.',
                              color: 'bg-green-50 text-green-600',
                    },
                    {
                              icon: Award,
                              title: 'Innovation',
                              description: 'We continuously adopt the latest medical technologies and practices to provide state-of-the-art care.',
                              color: 'bg-orange-50 text-orange-600',
                    },
                    {
                              icon: Clock,
                              title: '24/7 Support',
                              description: 'Our dedicated team is available around the clock to assist you with your healthcare needs.',
                              color: 'bg-cyan-50 text-cyan-600',
                    },
          ];

          return (
                    <div className="pt-20">
                              {/* Hero Section */}
                              <section className="relative py-20 overflow-hidden bg-slate-900 border-b border-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-center max-w-3xl mx-auto"
                                                  >
                                                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                                                      Your Health, Our <span className="gradient-text">Commitment</span>
                                                            </h1>
                                                            <p className="text-lg text-slate-300 mb-8">
                                                                      At Nexus Clinic, we combine medical excellence with compassionate care to provide
                                                                      comprehensive healthcare services tailored to your needs.
                                                            </p>
                                                  </motion.div>
                                        </div>
                              </section>

                              {/* Stats Section */}
                              <section className="py-12 bg-white border-b border-slate-100">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                            {stats.map((stat, index) => (
                                                                      <motion.div
                                                                                key={index}
                                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                className="text-center"
                                                                      >
                                                                                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                                                                                <div className="text-slate-500 font-medium">{stat.label}</div>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* Mission & Vision */}
                              <section className="py-20 bg-slate-50">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="grid md:grid-cols-2 gap-12 items-center">
                                                            <motion.div
                                                                      initial={{ opacity: 0, x: -20 }}
                                                                      whileInView={{ opacity: 1, x: 0 }}
                                                                      viewport={{ once: true }}
                                                                      className="space-y-6"
                                                            >
                                                                      <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
                                                                      <p className="text-lg text-slate-600 leading-relaxed">
                                                                                To provide accessible, high-quality healthcare that empowers individuals and
                                                                                communities to achieve optimal health. We are dedicated to delivering patient-centered
                                                                                medical services with excellence, compassion, and innovation.
                                                                      </p>
                                                                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                                                            </motion.div>
                                                            <motion.div
                                                                      initial={{ opacity: 0, x: 20 }}
                                                                      whileInView={{ opacity: 1, x: 0 }}
                                                                      viewport={{ once: true }}
                                                                      className="space-y-6"
                                                            >
                                                                      <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
                                                                      <p className="text-lg text-slate-600 leading-relaxed">
                                                                                To be the leading choice for healthcare, recognized for our medical expertise,
                                                                                ethical standards, and technological advancements. We envision a future where
                                                                                everyone has access to the best possible medical care.
                                                                      </p>
                                                                      <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" />
                                                            </motion.div>
                                                  </div>
                                        </div>
                              </section>

                              {/* Core Values */}
                              <section className="py-20 bg-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            className="mb-16"
                                                  >
                                                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                                                            <p className="text-slate-600 max-w-2xl mx-auto">
                                                                      The principles that guide everything we do, from patient interaction to clinical practice.
                                                            </p>
                                                  </motion.div>

                                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {values.map((value, index) => (
                                                                      <motion.div
                                                                                key={index}
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                whileHover={{ y: -5 }}
                                                                                className="p-8 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl group"
                                                                      >
                                                                                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                                                                          <value.icon className="w-7 h-7" />
                                                                                </div>
                                                                                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                                                                                <p className="text-slate-600 leading-relaxed">
                                                                                          {value.description}
                                                                                </p>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>
                    </div>
          );
}
