import { motion } from 'framer-motion';
import { Heart, Target, Users, Award, Shield, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutUs() {
          const navigate = useNavigate();
          const isAuthenticated = localStorage.getItem('token');

          const stats = [
                    {
                              label: 'Specialist Doctors',
                              value: '50+',
                              icon: Users,
                              color: 'from-blue-500 to-cyan-500'
                    },
                    {
                              label: 'Patients Served',
                              value: '10k+',
                              icon: Heart,
                              color: 'from-rose-500 to-pink-500'
                    },
                    {
                              label: 'Years Experience',
                              value: '15+',
                              icon: Award,
                              color: 'from-amber-500 to-orange-500'
                    },
                    {
                              label: 'Success Rate',
                              value: '98%',
                              icon: TrendingUp,
                              color: 'from-emerald-500 to-teal-500'
                    },
          ];

          const values = [
                    {
                              icon: Heart,
                              title: 'Patient-Centered Care',
                              description: 'We prioritize our patients\' needs and well-being above all else, providing compassionate and personalized care.',
                              color: 'from-rose-500 to-pink-500',
                              bgColor: 'bg-rose-50',
                    },
                    {
                              icon: Award,
                              title: 'Excellence in Service',
                              description: 'We strive for excellence in every aspect of our medical services, maintaining the highest standards of quality.',
                              color: 'from-blue-500 to-cyan-500',
                              bgColor: 'bg-blue-50',
                    },
                    {
                              icon: Users,
                              title: 'Collaborative Team',
                              description: 'Our diverse team of specialists works together to provide comprehensive and integrated healthcare solutions.',
                              color: 'from-purple-500 to-violet-500',
                              bgColor: 'bg-purple-50',
                    },
                    {
                              icon: Shield,
                              title: 'Trust & Integrity',
                              description: 'We build lasting relationships with our patients based on transparency, honesty, and ethical practices.',
                              color: 'from-emerald-500 to-teal-500',
                              bgColor: 'bg-emerald-50',
                    },
                    {
                              icon: Sparkles,
                              title: 'Innovation',
                              description: 'We continuously adopt the latest medical technologies and practices to provide state-of-the-art care.',
                              color: 'from-orange-500 to-amber-500',
                              bgColor: 'bg-orange-50',
                    },
                    {
                              icon: Clock,
                              title: '24/7 Support',
                              description: 'Our dedicated team is available around the clock to assist you with your healthcare needs.',
                              color: 'from-cyan-500 to-blue-500',
                              bgColor: 'bg-cyan-50',
                    },
          ];

          const milestones = [
                    { year: '2010', title: 'Nexus Clinic Founded', description: 'Started with a vision to transform healthcare' },
                    { year: '2015', title: 'Expanded Services', description: 'Added 10+ new specialties and departments' },
                    { year: '2020', title: 'Digital Innovation', description: 'Launched telemedicine and online consultations' },
                    { year: '2024', title: 'Award Recognition', description: 'Recognized as Top Healthcare Provider' },
          ];

          return (
                    <div className="min-h-screen bg-white">
                              {/* Hero Section */}

                              <section className="relative pt-32 pb-24 overflow-hidden ">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
                                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20" />

                                        {/* Animated Background */}
                                        <div className="absolute inset-0">
                                                  <motion.div
                                                            className="absolute top-20 left-20 w-96 h-96  rounded-full blur-3xl"
                                                            animate={{
                                                                      scale: [1, 1.2, 1],
                                                                      opacity: [0.3, 0.5, 0.3],
                                                            }}
                                                            transition={{
                                                                      duration: 8,
                                                                      repeat: Infinity,
                                                                      ease: "easeInOut",
                                                            }}
                                                  />
                                                  <motion.div
                                                            className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl"
                                                            animate={{
                                                                      scale: [1.2, 1, 1.2],
                                                                      opacity: [0.5, 0.3, 0.5],
                                                            }}
                                                            transition={{
                                                                      duration: 8,
                                                                      repeat: Infinity,
                                                                      ease: "easeInOut",
                                                            }}
                                                  />
                                        </div>

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
                                                                      About Nexus Clinic
                                                            </motion.div>

                                                            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                                                                      Your Health, Our <span className="bg-blue-500  bg-clip-text text-transparent">Commitment</span>
                                                            </h1>

                                                            <p className="text-xl text-slate-600 leading-relaxed">
                                                                      At Nexus Clinic, we combine medical excellence with compassionate care to provide
                                                                      comprehensive healthcare services tailored to your needs.
                                                            </p>
                                                  </motion.div>
                                        </div>
                              </section>

                              {/* Stats Section */}
                              <section className="py-16 bg-white relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                            {stats.map((stat, index) => (
                                                                      <motion.div
                                                                                key={index}
                                                                                initial={{ opacity: 0, y: 30 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                whileHover={{ y: -8, scale: 1.02 }}
                                                                                className="relative group"
                                                                      >
                                                                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-slate-100">
                                                                                          {/* Icon */}
                                                                                          <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                                                                    <stat.icon className="w-7 h-7 text-white" />
                                                                                          </div>

                                                                                          {/* Value */}
                                                                                          <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                                                                                                    {stat.value}
                                                                                          </div>

                                                                                          {/* Label */}
                                                                                          <div className="text-slate-600 font-medium">{stat.label}</div>

                                                                                          {/* Glow Effect */}
                                                                                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                                                                                </div>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* Mission & Vision */}
                              <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="grid lg:grid-cols-2 gap-12">
                                                            {/* Mission */}
                                                            <motion.div
                                                                      initial={{ opacity: 0, x: -30 }}
                                                                      whileInView={{ opacity: 1, x: 0 }}
                                                                      viewport={{ once: true }}
                                                                      className="relative"
                                                            >
                                                                      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 h-full">
                                                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                                                                          <Target className="w-8 h-8 text-white" />
                                                                                </div>

                                                                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>

                                                                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                                                                          To provide accessible, high-quality healthcare that empowers individuals and
                                                                                          communities to achieve optimal health. We are dedicated to delivering patient-centered
                                                                                          medical services with excellence, compassion, and innovation.
                                                                                </p>

                                                                                <div className="flex gap-2">
                                                                                          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                                                                          <div className="h-1 w-10 bg-gradient-to-r from-cyan-500 to-blue-300 rounded-full" />
                                                                                </div>
                                                                      </div>
                                                            </motion.div>

                                                            {/* Vision */}
                                                            <motion.div
                                                                      initial={{ opacity: 0, x: 30 }}
                                                                      whileInView={{ opacity: 1, x: 0 }}
                                                                      viewport={{ once: true }}
                                                                      className="relative"
                                                            >
                                                                      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 h-full">
                                                                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                                                                          <Sparkles className="w-8 h-8 text-white" />
                                                                                </div>

                                                                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>

                                                                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                                                                          To be the leading choice for healthcare, recognized for our medical expertise,
                                                                                          ethical standards, and technological advancements. We envision a future where
                                                                                          everyone has access to the best possible medical care.
                                                                                </p>

                                                                                <div className="flex gap-2">
                                                                                          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
                                                                                          <div className="h-1 w-10 bg-gradient-to-r from-violet-500 to-purple-300 rounded-full" />
                                                                                </div>
                                                                      </div>
                                                            </motion.div>
                                                  </div>
                                        </div>
                              </section>

                              {/* Core Values */}
                              <section className="py-24 bg-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            className="text-center mb-16"
                                                  >
                                                            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                                      What Drives Us
                                                            </div>
                                                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                                                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                                                      The principles that guide everything we do, from patient interaction to clinical practice.
                                                            </p>
                                                  </motion.div>

                                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {values.map((value, index) => (
                                                                      <motion.div
                                                                                key={index}
                                                                                initial={{ opacity: 0, y: 30 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                                whileHover={{ y: -8 }}
                                                                                className="group relative"
                                                                      >
                                                                                <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                                                                          {/* Background Glow */}
                                                                                          <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                                                                                          {/* Icon */}
                                                                                          <div className="relative z-10">
                                                                                                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                                                                                              <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center`}>
                                                                                                                        <value.icon className="w-7 h-7 text-white" />
                                                                                                              </div>
                                                                                                    </div>

                                                                                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                                                                                    <p className="text-slate-600 leading-relaxed">
                                                                                                              {value.description}
                                                                                                    </p>
                                                                                          </div>
                                                                                </div>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* Timeline/Milestones */}
                              <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            className="text-center mb-16"
                                                  >
                                                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
                                                            <p className="text-xl text-slate-600">Milestones that shaped our commitment to excellence</p>
                                                  </motion.div>

                                                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                            {milestones.map((milestone, index) => (
                                                                      <motion.div
                                                                                key={index}
                                                                                initial={{ opacity: 0, y: 30 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.15 }}
                                                                                className="relative"
                                                                      >
                                                                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100">
                                                                                          <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                                                                                                    {milestone.year}
                                                                                          </div>
                                                                                          <h3 className="text-lg font-bold text-slate-900 mb-2">{milestone.title}</h3>
                                                                                          <p className="text-slate-600 text-sm">{milestone.description}</p>
                                                                                </div>
                                                                      </motion.div>
                                                            ))}
                                                  </div>
                                        </div>
                              </section>

                              {/* CTA Section */}
                              <section className="py-20 bg-blue-100 text-black relative overflow-hidden">
                                        <div className="absolute inset-0">
                                                  <div className="absolute inset-0 bg-grid-white/10" />
                                        </div>

                                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                                                  <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                  >
                                                            <h2 className="text-4xl md:text-5xl font-bold  mb-6">
                                                                      Ready to <span className="text-blue-600">Experience Quality Care?</span>
                                                            </h2>
                                                            <p className="text-xl  mb-8 max-w-2xl mx-auto">
                                                                      Join thousands of satisfied patients who trust us with their health.
                                                                      Book your consultation today and take the first step towards better health.
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