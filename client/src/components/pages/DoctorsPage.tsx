import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Circle, Clock, Star } from 'lucide-react';
import axios from 'axios';
import { apiURL } from '../../../utils';
import { useState, useEffect } from 'react';

interface Doctor {
    id: string | number;
    name: string;
    specialty: string;
    status: 'online' | 'busy' | 'offline';
    patients: number;
    rating: number;
    image: string;
}

export function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/doctors`);
                // Handle different response structures: data directly or data.data
                const rawData = Array.isArray(response.data) ? response.data :
                    (Array.isArray(response.data?.data) ? response.data.data : []);

                const mappedDoctors = rawData.map((doc: any, index: number): Doctor => ({
                    id: doc._id || doc.id,
                    name: doc.name,
                    specialty: doc.specialization || 'General',
                    status: ['online', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'online' | 'busy' | 'offline',
                    patients: Math.floor(Math.random() * 10),
                    rating: 4.5 + Math.random() * 0.5,
                    image: `https://i.pravatar.cc/150?u=${doc.email || doc.name}`,
                }));
                setDoctors(mappedDoctors);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const statusConfig: Record<string, { color: string; text: string; glow: string }> = {
        online: { color: 'bg-green-500', text: 'Available Now', glow: 'shadow-green-500/50' },
        busy: { color: 'bg-amber-500', text: 'In Consultation', glow: 'shadow-amber-500/50' },
        offline: { color: 'bg-slate-400', text: 'Offline', glow: 'shadow-slate-400/50' },
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                            <span className="text-blue-700">Meet Our Specialists</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Medical Team</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            World-class care from our experienced and compassionate doctors.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {doctors.map((doctor, index) => (
                            <motion.div
                                key={doctor.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-slate-100">
                                    <div className="absolute top-4 right-4">
                                        <motion.div
                                            animate={
                                                doctor.status === 'online'
                                                    ? { scale: [1, 1.1, 1] }
                                                    : {}
                                            }
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`${statusConfig[doctor.status].color} ${statusConfig[doctor.status].glow} w-4 h-4 rounded-full shadow-lg`}
                                        />
                                    </div>

                                    <div className="relative mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-slate-100"
                                        >
                                            <img
                                                src={doctor.image}
                                                alt={doctor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>

                                        <motion.div
                                            animate={
                                                doctor.status === 'online'
                                                    ? { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }
                                                    : {}
                                            }
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`absolute inset-0 ${statusConfig[doctor.status].color} rounded-full blur-md opacity-0`}
                                        />
                                    </div>

                                    <div className="text-center mb-4">
                                        <h4 className="mb-1 text-xl font-semibold">{doctor.name}</h4>
                                        <p className="text-sm text-slate-600 mb-2">{doctor.specialty}</p>

                                        <div className="flex items-center justify-center space-x-1 mb-2">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="medical-number font-bold text-slate-700">{doctor.rating.toFixed(1)}</span>
                                        </div>

                                        <div className={`inline-flex items-center space-x-2 px-3 py-1 ${doctor.status === 'online' ? 'bg-green-50' : doctor.status === 'busy' ? 'bg-amber-50' : 'bg-slate-50'} rounded-full text-sm`}>
                                            <span className={doctor.status === 'online' ? 'text-green-700' : doctor.status === 'busy' ? 'text-amber-700' : 'text-slate-600'}>
                                                {statusConfig[doctor.status].text}
                                            </span>
                                        </div>
                                    </div>

                                    {doctor.status !== 'offline' && (
                                        <div className="text-center text-sm text-slate-600 mb-4">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            {doctor.patients} {doctor.patients === 1 ? 'patient' : 'patients'} in queue
                                        </div>
                                    )}

                                    <Link to={`/doctor/${doctor.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={doctor.status === 'offline'}
                                            className={`w-full py-3 rounded-xl transition-all ${doctor.status === 'offline'
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            {doctor.status === 'offline' ? 'Unavailable' : 'View Profile'}
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
