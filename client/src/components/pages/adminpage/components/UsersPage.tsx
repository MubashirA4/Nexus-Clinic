import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Users, Search, Shield, User, Stethoscope } from 'lucide-react';
import { apiURL } from '@/utils/api';

interface SystemUser {
          _id: string;
          name: string;
          email: string;
          role: 'admin' | 'doctor' | 'patient';
          image?: string;
          createdAt: string;
}

export function UsersPage() {
          const [users, setUsers] = useState<SystemUser[]>([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState('');
          const [searchTerm, setSearchTerm] = useState('');

          useEffect(() => {
                    fetchUsers();
          }, []);

          const fetchUsers = async () => {
                    try {
                              const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                              const response = await axios.get(`${apiURL}/api/admin/users`, {
                                        headers: { Authorization: `Bearer ${token}` }
                              });

                              if (response.data.success) {
                                        setUsers(response.data.data);
                              }
                    } catch (err: any) {
                              setError(err.response?.data?.message || 'Failed to fetch users');
                    } finally {
                              setLoading(false);
                    }
          };

          const filteredUsers = users.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const getRoleIcon = (role: string) => {
                    switch (role) {
                              case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
                              case 'doctor': return <Stethoscope className="w-4 h-4 text-blue-600" />;
                              default: return <User className="w-4 h-4 text-emerald-600" />;
                    }
          };

          const getRoleBadgeColor = (role: string) => {
                    switch (role) {
                              case 'admin': return 'bg-purple-100 text-purple-800';
                              case 'doctor': return 'bg-blue-100 text-blue-800';
                              default: return 'bg-emerald-100 text-emerald-800';
                    }
          };

          if (loading) {
                    return (
                              <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              </div>
                    );
          }

          return (
                    <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                    >
                              <div className="bg-white rounded-2xl shadow-xl p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                                  <div className="flex items-center space-x-3">
                                                            <div className="p-3 bg-blue-50 rounded-xl">
                                                                      <Users className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                      <h3 className="text-xl font-bold text-slate-800">All System Users</h3>
                                                                      <p className="text-sm text-slate-500">Manage and view all registered users</p>
                                                            </div>
                                                  </div>

                                                  <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                            <input
                                                                      type="text"
                                                                      placeholder="Search users..."
                                                                      value={searchTerm}
                                                                      onChange={(e) => setSearchTerm(e.target.value)}
                                                                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                                                            />
                                                  </div>
                                        </div>

                                        {error && (
                                                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                                                            {error}
                                                  </div>
                                        )}

                                        <div className="overflow-x-auto">
                                                  <table className="w-full">
                                                            <thead>
                                                                      <tr className="border-b border-slate-100">
                                                                                <th className="text-left py-4 px-4 text-slate-500 font-medium">User</th>
                                                                                <th className="text-left py-4 px-4 text-slate-500 font-medium">Role</th>
                                                                                <th className="text-left py-4 px-4 text-slate-500 font-medium">Joined Date</th>
                                                                                <th className="text-left py-4 px-4 text-slate-500 font-medium">Status</th>
                                                                      </tr>
                                                            </thead>
                                                            <tbody>
                                                                      {filteredUsers.map((user) => (
                                                                                <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                                                          <td className="py-4 px-4">
                                                                                                    <div className="flex items-center space-x-3">
                                                                                                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                                                                                                        {user.image ? (
                                                                                                                                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                                                                                        ) : (
                                                                                                                                  <span className="text-slate-500 font-medium text-lg">
                                                                                                                                            {user.name.charAt(0).toUpperCase()}
                                                                                                                                  </span>
                                                                                                                        )}
                                                                                                              </div>
                                                                                                              <div>
                                                                                                                        <div className="font-medium text-slate-900">{user.name}</div>
                                                                                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                                                                              </div>
                                                                                                    </div>
                                                                                          </td>
                                                                                          <td className="py-4 px-4">
                                                                                                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                                                                              {getRoleIcon(user.role)}
                                                                                                              <span className="capitalize">{user.role}</span>
                                                                                                    </span>
                                                                                          </td>
                                                                                          <td className="py-4 px-4 text-slate-600">
                                                                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                                                          </td>
                                                                                          <td className="py-4 px-4">
                                                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                                              Active
                                                                                                    </span>
                                                                                          </td>
                                                                                </tr>
                                                                      ))}
                                                            </tbody>
                                                  </table>
                                        </div>

                                        {filteredUsers.length === 0 && (
                                                  <div className="text-center py-12 text-slate-500">
                                                            No users found matching your search.
                                                  </div>
                                        )}
                              </div>
                    </motion.div>
          );
}
