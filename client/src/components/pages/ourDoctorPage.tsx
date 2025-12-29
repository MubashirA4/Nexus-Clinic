import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Award, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../../utils';

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

// Mock doctor images - replace with your actual image URLs
const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
];

export function OurDoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-slate-900 mb-4"
                >
                    Our Expert Medical Team
                </motion.h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Meet our board-certified specialists dedicated to providing exceptional healthcare
                </p>
            </div>

            {/* Doctors Grid - 2 columns on desktop, 1 on mobile */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {doctors.map((doctor, index) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 h-full">

                                {/* Doctor Card Content */}
                                <div className="p-6">
                                    <div className="flex items-start space-x-6">

                                        {/* Doctor Image */}
                                        <div className="relative">
                                            <div className="w-28 h-full rounded-xl overflow-hidden ring-4 ring-blue-100">
                                                <img
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Online Status Indicator */}
                                            <div className="absolute -bottom-1 -right-1">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Doctor Information */}
                                        <div className="flex-1">

                                            {/* Name and Verification */}
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {doctor.name}
                                                </h3>
                                                <div className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    PMDC Verified
                                                </div>
                                            </div>

                                            {/* Specialization */}
                                            <div className="mb-4">
                                                <p className="text-slate-700 font-medium">
                                                    {generateSpecializations(doctor.specialization).slice(0, 2).join(', ')}
                                                </p>
                                                <p className="text-slate-600 text-sm mt-1">
                                                    {doctor.qualifications?.slice(0, 2).join(', ')}
                                                </p>
                                            </div>

                                            {/* Stats Row */}
                                            <div className="flex items-center space-x-6">

                                                {/* Experience */}
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <Award className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Experience</p>
                                                        <p className="font-semibold text-slate-900">{doctor.experience} Years</p>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-2 bg-amber-50 rounded-lg">
                                                        <Star className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Rating</p>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="font-semibold text-slate-900">{doctor.rating?.toFixed(1)}</span>
                                                            <span className="text-slate-500 text-xs">({doctor.reviewCount})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}