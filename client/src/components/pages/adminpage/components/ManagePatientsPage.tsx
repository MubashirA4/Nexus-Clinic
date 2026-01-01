import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { apiURL } from '@/utils/api';

interface Patient {
    _id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    phone?: string;
    address?: string;
    image?: string;
    createdAt: string;
    isActive: boolean;
}

export function ManagePatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await axios.get(`${apiURL}/api/admin/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setPatients(response.data.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="mb-6 font-bold text-slate-800 text-xl">Manage Patients</h3>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <motion.div
                            key={patient._id}
                            whileHover={{ y: -5 }}
                            className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all bg-slate-50/30"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                                    {patient.image ? (
                                        <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-lg">{patient.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-900 truncate">{patient.name}</h4>
                                    <p className="text-sm text-slate-500 truncate">{patient.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Age/Gender:</span>
                                    <span className="font-medium text-slate-900">
                                        {patient.age ? `${patient.age} yrs` : 'N/A'} / {patient.gender ? patient.gender : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Phone:</span>
                                    <span className="font-medium text-slate-900">{patient.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Status:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${patient.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {patient.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex space-x-2">
                                    <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {patients.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            No patients found.
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
