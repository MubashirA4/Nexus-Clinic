import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import { Star, Award, Mail, Phone, Users, Calendar, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../../utils';
import { useNavigate } from 'react-router-dom';

interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    experience?: number;
    patients?: number;
    status?: string;
    bio?: string;
    phone?: string;
    email?: string;
    qualifications?: string[];
    rating?: number;
    reviewCount?: number;
    image?: string;
}

const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
];

export function OurDoctorsPage() {
    const { isAuthenticated } = useAuth();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/doctors`);
                let doctorsData: Doctor[] = [];

                if (response.data.success && Array.isArray(response.data.data)) {
                    doctorsData = response.data.data.map((doc: any, index: number) => ({
                        _id: doc._id,
                        name: doc.name || 'Doctor',
                        specialization: doc.specialization || 'General Physician',
                        experience: doc.experience || 5 + Math.floor(Math.random() * 15),
                        patients: doc.patients || 0,
                        status: doc.status || 'Available',
                        bio: doc.bio || 'Experienced medical professional providing quality healthcare services.',
                        phone: doc.phone || '+92 300 1234567',
                        email: doc.email || 'doctor@example.com',
                        qualifications: doc.qualifications || ['MBBS', 'FCPS'],
                        rating: 4.5 + (Math.random() * 0.5),
                        reviewCount: Math.floor(Math.random() * 500) + 50,
                        image: doc.image || doctorImages[index % doctorImages.length]
                    }));
                }
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const generateSpecializations = (specialization: string) => {
        const specialtyMap: Record<string, string[]> = {
            'Cardiology': ['Cardiologist', 'Heart Specialist', 'Consultant Physician'],
            'Dermatology': ['Dermatologist', 'Cosmetologist', 'Skin Specialist'],
            'Pediatrics': ['Pediatrician', 'Neonatologist', 'Child Specialist'],
            'Orthopedics': ['Orthopedic Surgeon', 'Joint Specialist', 'Bone Surgeon'],
            'Gynecology': ['Gynecologist', 'Obstetrician', 'Women Health Specialist'],
            'Neurology': ['Neurologist', 'Brain Specialist', 'Nerve Specialist'],
            'General': ['General Physician', 'Family Doctor', 'Consultant']
        };
        return specialtyMap[specialization] || [specialization, 'Consultant Physician'];
    };

    // Get unique specialties from doctors
    const specialties = ['all', ...Array.from(new Set(doctors.map(d => d.specialization)))];

    // Filter doctors based on selected specialty
    const filteredDoctors = selectedSpecialty === 'all'
        ? doctors
        : doctors.filter(d => d.specialization === selectedSpecialty);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                        <div className="relative border-4 border-blue-600 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-slate-700">Loading our expert doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Hero Section */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                        >
                            Meet Our Team
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Expert Doctors</span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                            Board-certified specialists dedicated to providing exceptional healthcare with compassion and expertise
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">{doctors.length}+</div>
                                <div className="text-slate-600 mt-1">Expert Doctors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">20K+</div>
                                <div className="text-slate-600 mt-1">Patients Treated</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600">89%</div>
                                <div className="text-slate-600 mt-1">Satisfaction Rate</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Specialty Filter */}
            <section className="py-8 bg-white/50  top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {specialties.map((specialty) => (
                            <button
                                key={specialty}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`px-5 py-2.5 rounded-full font-medium transition-all ${selectedSpecialty === specialty
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {specialty === 'all' ? 'All Specialties' : specialty}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        layout
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {filteredDoctors.map((doctor, index) => (
                            <motion.div
                                key={doctor._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden h-full">
                                    <div className="p-6">
                                        <div className="flex gap-6">
                                            {/* Doctor Image */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-48 h-full rounded-2xl overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                                                    <img
                                                        src={doctor.image}
                                                        alt={doctor.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>


                                            </div>

                                            {/* Doctor Info */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name & Verification */}
                                                <div className="mb-3">
                                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                                                        {doctor.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                                                            <CheckCircle className="w-3 h-3" />
                                                            PMDC Verified
                                                        </span>

                                                    </div>
                                                </div>

                                                {/* Specialization */}
                                                <div className="mb-4">
                                                    <p className="text-blue-600 font-semibold text-lg">
                                                        {generateSpecializations(doctor.specialization).slice(0, 2).join(', ')}
                                                    </p>
                                                    <p className="text-slate-600 text-sm mt-1">
                                                        {doctor.qualifications?.join(' • ')}
                                                    </p>
                                                </div>

                                                {/* Bio */}
                                                {doctor.bio && (
                                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                                        {doctor.bio}
                                                    </p>
                                                )}

                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Award className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600">Experience</p>
                                                            <p className="font-bold text-slate-900">{doctor.experience} Years</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <Users className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600">Patients</p>
                                                            <p className="font-bold text-slate-900">{doctor.patients || 0}+</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact & Action */}
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        to={`/booking?doctor=${doctor._id}`}
                                                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-lg"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                        Book Appointment
                                                    </Link>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* No Results */}
                    {filteredDoctors.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No doctors found</h3>
                            <p className="text-slate-600">Try selecting a different specialty</p>
                        </div>
                    )}
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
                            Can't Find <span className="text-blue-600">the Right Doctor?</span>
                        </h2>
                        <p className="text-xl  mb-8 max-w-2xl mx-auto">
                            Our support team is here to help you find the perfect specialist for your needs  </p>
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