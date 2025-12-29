import { motion } from 'motion/react';
import { apiURL } from '../../../../../utils.js';
import axios from 'axios';
import { useState } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';

export function AddAdminPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (!token) {
                alert('No authentication token found. Please login again.');
                return;
            }

            const response = await axios.post(`${apiURL}/api/admin/add-admin`, {
                name,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.data.success) {
                alert('New Admin added successfully!');
                resetForm();
            }
        } catch (error: any) {
            console.error('Error adding admin:', error);
            const message = error.response?.data?.message || 'Failed to add admin.';
            alert(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Add New Admin</h1>
                <p className="text-slate-600 mt-2">Grant administrative access to a new user. Restricted to Super Admin.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            placeholder="Admin Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password *
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Creating Admin...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Create Admin
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
                Note: Only the primary Super Admin (admin@example.com) can perform this action.
            </div>
        </motion.div>
    );
}
