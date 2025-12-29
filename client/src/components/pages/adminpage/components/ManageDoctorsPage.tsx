import { motion } from 'motion/react';
import { apiURL } from '../../../../../utils';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Doctor {
    _id: string; // MongoDB ID usually
    id?: number; // Fallback
    name: string;
    specialization: string;
    patients: number;
    status: string;
    bio?: string;
    phone?: string;
    experience?: string;
}

export function ManageDoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [editForm, setEditForm] = useState<Partial<Doctor>>({});

    useEffect(() => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        axios.get(`${apiURL}/api/admin/doctors`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('API Response:', response.data);
                // Handle different response structures
                const data = Array.isArray(response.data) ? response.data :
                    (response.data && Array.isArray(response.data.data)) ? response.data.data : [];
                setDoctors(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string | number) => {
        if (!confirm('Are you sure you want to remove this doctor?')) return;

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            await axios.delete(`${apiURL}/api/admin/doctor/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI by removing deleted doctor
            setDoctors(doctors.filter(d => (d._id || d.id) !== id));
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Failed to delete doctor');
        }
    };

    const handleEditClick = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setEditForm(doctor);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDoctor) return;

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const id = editingDoctor._id || editingDoctor.id;

            const response = await axios.put(`${apiURL}/api/admin/doctor/${id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Update local list
                setDoctors(doctors.map(d =>
                    (d._id === id || d.id === id) ? { ...d, ...editForm } : d
                ));
                setEditingDoctor(null);
                alert('Doctor updated successfully');
            }
        } catch (error) {
            console.error('Error updating doctor:', error);
            alert('Failed to update doctor');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading doctors...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading doctors</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                        <h3>Manage Doctors</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                🔍
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Doctor</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Specialization</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Phone</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Experience</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Patients</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor, index) => (
                                <tr key={doctor._id || doctor.id || index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                                                {doctor.name}
                                            </div>
                                            <span className="font-medium">{doctor.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{doctor.specialization}</td>
                                    <td className="p-4 text-slate-600">{doctor.phone || '-'}</td>
                                    <td className="p-4 text-slate-600">{doctor.experience || '-'}</td>
                                    <td className="p-4">
                                        <span className="medical-number">{doctor.patients || 0}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {doctor.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(doctor)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doctor._id || doctor.id!)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingDoctor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Edit Doctor</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    className="w-full p-2 border rounded-lg"
                                    value={editForm.name || ''}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Specialization</label>
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        value={editForm.specialization || ''}
                                        onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        value={editForm.phone || ''}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Experience</label>
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        value={editForm.experience || ''}
                                        onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Patients</label>
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        type="number"
                                        value={editForm.patients || ''}
                                        onChange={e => setEditForm({ ...editForm, patients: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg"
                                    rows={3}
                                    value={editForm.bio || ''}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingDoctor(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
