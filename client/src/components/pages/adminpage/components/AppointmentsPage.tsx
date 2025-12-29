import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { apiURL } from '../../../../../utils';

export function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    // Fetch doctors list for selector (admin-only)
    useEffect(() => {
        setLoadingDoctors(true);
        import('axios').then(({ default: axios }) => {
            axios.get(`${apiURL}/api/admin/doctors`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setDoctors(res.data?.data || []);
                    setLoadingDoctors(false);
                })
                .catch(err => {
                    console.error('Error fetching doctors:', err);
                    setLoadingDoctors(false);
                });
        });
    }, [token]);

    // Fetch appointments (optionally filtered by selectedDoctor)
    useEffect(() => {
        setLoading(true);
        import('axios').then(({ default: axios }) => {
            const params: any = {};
            if (selectedDoctor) params.doctorId = selectedDoctor;
            axios.get(`${apiURL}/api/admin/appointments`, { headers: { Authorization: `Bearer ${token}` }, params })
                .then(res => {
                    setAppointments(res.data?.data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching appointments:', err);
                    setError('Failed to load appointments');
                    setLoading(false);
                });
        });
    }, [token, selectedDoctor]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const axios = (await import('axios')).default;
            const res = await axios.put(`${apiURL}/api/admin/appointments/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data?.success) {
                setAppointments(appointments.map(a => a._id === id ? res.data.data : a));
            }
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (loading && !loadingDoctors) return <div className="p-8 text-center">Loading appointments...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Appointments</h3>

                    <div className="flex items-center space-x-3">
                        <label className="text-sm text-slate-600">Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="px-3 py-2 border rounded-lg bg-white"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Patient</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Doctor</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Date & Time</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment: any) => (
                                <tr key={appointment._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium">{appointment.patientName || appointment.patient?.name || appointment.patientEmail}</td>
                                    <td className="p-4 text-slate-600">{appointment.doctor?.name || appointment.doctor}</td>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium">{new Date(appointment.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-500">{appointment.time}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleUpdateStatus(appointment._id, 'confirmed')} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                                Confirm
                                            </button>
                                            <button onClick={() => handleUpdateStatus(appointment._id, 'cancelled')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
