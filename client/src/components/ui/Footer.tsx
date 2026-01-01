import { motion } from 'motion/react';
import { Activity, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import LOGO from '@/assets/logo.svg';

export default function Footer() {
    const quickLinks = [
        { label: 'About Us', path: '/about' },
        { label: 'Services', path: '/services' },
        { label: 'Our Doctors', path: '/ourdoctors' },
        { label: 'Book Appointment', path: '/booking' },
    ];

    const services = [
        { label: 'Appointment Scheduling', path: '/services/appointment-scheduling' },
        { label: 'Teleconsultation', path: '/services/teleconsultation' },
        { label: 'Calendar Management', path: '/services/calendar-management' },
        { label: 'Patient Records', path: '/services/patient-records' },
        { label: 'All Services', path: '/services' },
    ];

    const policies = [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact Us', path: '/contact' },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];


    return (
        <footer className="relative text-white overflow-hidden" style={{ background: 'var(--dark-color)' }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))' }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.06))' }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                {/* Main Footer Content - FIXED GRID LAYOUT */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <a href="/" className="flex items-center space-x-3 group">
                            <img src={LOGO} alt="" />
                        </a>

                        <p className="text-slate-400 leading-relaxed">
                            Providing exceptional healthcare services with compassion and expertise. Your health and well-being are our top priorities.
                        </p>
                        <div className="mt-6 flex items-center space-x-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative overflow-hidden"
                                    aria-label={social.label}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {/* Animated gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />

                                    <social.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold mb-6 gradient-text">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <a
                                        href={link.path}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center group"
                                    >
                                        <span
                                            className="w-0 h-0.5 group-hover:w-4 transition-all mr-0 group-hover:mr-2"
                                            style={{ background: 'linear-gradient(90deg, var(--primary-color-1), var(--primary-color-2))' }}
                                        />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold mb-6 gradient-text">
                            Our Services
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.path}>
                                    <a
                                        href={service.path}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center group"
                                    >
                                        <span
                                            className="w-0 h-0.5 group-hover:w-4 transition-all mr-0 group-hover:mr-2"
                                            style={{ background: 'linear-gradient(90deg, var(--primary-color-1), var(--primary-color-2))' }}
                                        />
                                        {service.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Us */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold mb-6 gradient-text">Contact Us</h3>

                        <div className="space-y-1.5">
                            <motion.a
                                href="tel:+1234567890"
                                whileHover={{ x: 5 }}
                                className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group"
                            >
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[rgba(59,130,246,0.12)] transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span>+1 (234) 567-890</span>
                            </motion.a>

                            <motion.a
                                href="mailto:info@nexusclinic.com"
                                whileHover={{ x: 5 }}
                                className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group"
                            >
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[rgba(139,92,246,0.12)] transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span>info@nexusclinic.com</span>
                            </motion.a>

                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center space-x-3 text-slate-400 group cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[rgba(59,130,246,0.12)] transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="text-sm">123 Medical Center Dr, Suite 100</span>
                            </motion.div>


                        </div>
                    </motion.div>
                </div>



                {/* Bottom Section */}
                <div className="border-t border-white/10">
                    <p className="text-slate-400 text-sm mt-3 text-center">
                        © {new Date().getFullYear()} Nexus Clinic. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}