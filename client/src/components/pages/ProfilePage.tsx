import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/auth';
import {
          User as UserIcon,
          Mail,
          Phone,
          MapPin,
          Calendar,
          UserCircle,
          Edit2,
          Save,
          X,
          ShieldCheck,
          Activity
} from 'lucide-react';
import { apiURL } from '../../../utils';
import axios from 'axios';
import { toast } from 'sonner';

export function ProfilePageContent() {
          const { user, isAuthenticated, loading: authLoading } = useAuth();
          const [isEditing, setIsEditing] = useState(false);
          const [saving, setSaving] = useState(false);

          // Form State
          const [formData, setFormData] = useState({
                    name: '',
                    email: '',
                    phone: '',
                    age: '',
                    gender: '',
                    address: '',
                    image: ''
          });

          useEffect(() => {
                    if (user) {
                              setFormData({
                                        name: user.name || '',
                                        email: user.email || '',
                                        phone: user.phone || '',
                                        age: user.age?.toString() || '',
                                        gender: user.gender || '',
                                        address: user.address || '',
                                        image: user.image || ''
                              });
                    }
          }, [user]);

          if (authLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
          if (!isAuthenticated) return <div className="p-8 text-center text-slate-500">Please log in to view your profile.</div>;

          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                    const { name, value } = e.target;
                    setFormData(prev => ({ ...prev, [name]: value }));
          };

          const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                        setFormData(prev => ({ ...prev, image: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                    }
          };

          const handleSave = async () => {
                    setSaving(true);
                    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

                    const isDoctor = user?.role === 'doctor';
                    const isAdmin = user?.role === 'admin';

                    let endpoint = `${apiURL}/api/update-profile`;
                    let method = 'post';

                    if (isDoctor) {
                              endpoint = `${apiURL}/api/doctor/profile`;
                              method = 'put';
                    } else if (isAdmin) {
                              endpoint = `${apiURL}/api/admin/profile`;
                              method = 'put';
                    }

                    try {
                              const res = await axios({
                                        method,
                                        url: endpoint,
                                        data: {
                                                  ...formData,
                                                  age: formData.age ? parseInt(formData.age) : undefined
                                        },
                                        headers: { Authorization: `Bearer ${token}` }
                              });

                              if (res.data.success) {
                                        // Update local storage
                                        const updatedUser = res.data.user;
                                        if (localStorage.getItem('userData')) {
                                                  localStorage.setItem('userData', JSON.stringify(updatedUser));
                                        } else {
                                                  sessionStorage.setItem('userData', JSON.stringify(updatedUser));
                                        }

                                        // Notify other components
                                        window.dispatchEvent(new Event('authChanged'));

                                        toast.success('Profile updated successfully!');
                                        setIsEditing(false);
                              }
                    } catch (err: any) {
                              console.error('Error updating profile:', err);
                              toast.error(err.response?.data?.message || 'Failed to update profile');
                    } finally {
                              setSaving(false);
                    }
          };

          return (
                    <div className="max-w-4xl mx-auto px-4 py-8">
                              {/* Profile Header Card */}
                              <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-8"
                              >
                                        {/* Cover Background */}
                                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90" />

                                        <div className="px-8 pb-8">
                                                  <div className="flex flex-col md:flex-row md:items-end -mt-12 space-y-4 md:space-y-0 md:space-x-6">
                                                            <div className="relative group">
                                                                      <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white relative z-10 overflow-hidden">
                                                                                <div
                                                                                          className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden relative"
                                                                                >
                                                                                          {formData.image ? (
                                                                                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover object-top hover:scale-110 transition-all" />
                                                                                          ) : (
                                                                                                    <UserIcon size={48} />
                                                                                          )}

                                                                                          {isEditing && (
                                                                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                                                                              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                                                                              <div className="text-white flex flex-col items-center">
                                                                                                                        <UserIcon size={24} />
                                                                                                              </div>
                                                                                                    </label>
                                                                                          )}
                                                                                </div>
                                                                      </div>
                                                                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full z-20 shadow-md"></div>
                                                            </div>

                                                            <div className="flex-1">
                                                                      <div className="flex items-center space-x-2">
                                                                                <h1 className="text-2xl font-bold font-poppins text-slate-900">{user?.name}</h1>
                                                                                <ShieldCheck size={20} className="text-blue-500" />
                                                                      </div>
                                                                      <p className="text-slate-500 font-medium flex items-center mt-1">
                                                                                <Mail size={14} className="mr-2" /> {user?.email}
                                                                      </p>
                                                            </div>

                                                            <div className="flex space-x-3">
                                                                      <motion.button
                                                                                whileHover={{ scale: 1.02 }}
                                                                                whileTap={{ scale: 0.98 }}
                                                                                onClick={() => setIsEditing(!isEditing)}
                                                                                className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${isEditing
                                                                                          ? 'bg-slate-100 text-slate-600'
                                                                                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-blue-200'
                                                                                          }`}
                                                                      >
                                                                                {isEditing ? (
                                                                                          <>
                                                                                                    <X size={16} className="mr-2" /> Cancel
                                                                                          </>
                                                                                ) : (
                                                                                          <>
                                                                                                    <Edit2 size={16} className="mr-2" /> Edit Profile
                                                                                          </>
                                                                                )}
                                                                      </motion.button>
                                                            </div>
                                                  </div>
                                        </div>
                              </motion.div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Side Info */}
                                        <div className="space-y-6">
                                                  <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 }}
                                                            className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100"
                                                  >
                                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                                                                      <Activity size={14} className="mr-2" /> Health Summary
                                                            </h3>

                                                            <div className="space-y-4">
                                                                      <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50">
                                                                                <span className="text-sm font-semibold text-slate-600">Member Since</span>
                                                                                <span className="text-sm font-bold text-blue-600 font-poppins">{new Date().getFullYear()}</span>
                                                                      </div>
                                                                      <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50">
                                                                                <span className="text-sm font-semibold text-slate-600">Status</span>
                                                                                <span className="text-sm font-bold text-purple-600 uppercase tracking-wider font-poppins">Active</span>
                                                                      </div>
                                                            </div>
                                                  </motion.div>
                                        </div>

                                        {/* Main Form Area */}
                                        <div className="md:col-span-2">
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100"
                                                  >
                                                            <div className="flex items-center justify-between mb-8">
                                                                      <h3 className="text-lg font-bold font-poppins flex items-center">
                                                                                <UserCircle size={22} className="mr-2 text-blue-500" />
                                                                                Personal Information
                                                                      </h3>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                      {/* Name */}
                                                                      <div className="space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Full Name</label>
                                                                                <div className="relative group">
                                                                                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                                                          <input
                                                                                                    type="text"
                                                                                                    name="name"
                                                                                                    disabled={!isEditing}
                                                                                                    value={formData.name}
                                                                                                    onChange={handleInputChange}
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-900 disabled:opacity-70"
                                                                                          />
                                                                                </div>
                                                                      </div>

                                                                      {/* Email (Read Only) */}
                                                                      <div className="space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Email Address</label>
                                                                                <div className="relative group">
                                                                                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                                                          <input
                                                                                                    type="email"
                                                                                                    disabled
                                                                                                    value={formData.email}
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100/60 border border-slate-100 text-slate-400 outline-none font-medium cursor-not-allowed"
                                                                                          />
                                                                                </div>
                                                                      </div>

                                                                      {/* Phone */}
                                                                      <div className="space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Phone Number</label>
                                                                                <div className="relative group">
                                                                                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                                                          <input
                                                                                                    type="tel"
                                                                                                    name="phone"
                                                                                                    disabled={!isEditing}
                                                                                                    value={formData.phone}
                                                                                                    onChange={handleInputChange}
                                                                                                    placeholder="e.g. +1 555 123 4567"
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-900 disabled:opacity-70"
                                                                                          />
                                                                                </div>
                                                                      </div>

                                                                      {/* Age */}
                                                                      <div className="space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Age</label>
                                                                                <div className="relative group">
                                                                                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                                                          <input
                                                                                                    type="number"
                                                                                                    name="age"
                                                                                                    disabled={!isEditing}
                                                                                                    value={formData.age}
                                                                                                    onChange={handleInputChange}
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-900 disabled:opacity-70"
                                                                                          />
                                                                                </div>
                                                                      </div>

                                                                      {/* Gender */}
                                                                      <div className="space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Gender</label>
                                                                                <div className="relative group">
                                                                                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                                                          <select
                                                                                                    name="gender"
                                                                                                    disabled={!isEditing}
                                                                                                    value={formData.gender}
                                                                                                    onChange={handleInputChange}
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-900 appearance-none disabled:opacity-70"
                                                                                          >
                                                                                                    <option value="">Select Gender</option>
                                                                                                    <option value="male">Male</option>
                                                                                                    <option value="female">Female</option>
                                                                                                    <option value="other">Other</option>
                                                                                          </select>
                                                                                </div>
                                                                      </div>

                                                                      {/* Address */}
                                                                      <div className="sm:col-span-2 space-y-2">
                                                                                <label className="text-sm font-bold text-slate-500 ml-1">Residential Address</label>
                                                                                <div className="relative group">
                                                                                          <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                                                          <textarea
                                                                                                    name="address"
                                                                                                    disabled={!isEditing}
                                                                                                    value={formData.address}
                                                                                                    onChange={handleInputChange}
                                                                                                    rows={3}
                                                                                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-900 disabled:opacity-70 resize-none"
                                                                                          />
                                                                                </div>
                                                                      </div>
                                                            </div>

                                                            <AnimatePresence>
                                                                      {isEditing && (
                                                                                <motion.div
                                                                                          initial={{ opacity: 0, height: 0 }}
                                                                                          animate={{ opacity: 1, height: 'auto' }}
                                                                                          exit={{ opacity: 0, height: 0 }}
                                                                                          className="mt-10 flex justify-end"
                                                                                >
                                                                                          <motion.button
                                                                                                    whileHover={{ scale: 1.02 }}
                                                                                                    whileTap={{ scale: 0.98 }}
                                                                                                    onClick={handleSave}
                                                                                                    disabled={saving}
                                                                                                    className="flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-blue-200 transition-all disabled:opacity-50"
                                                                                          >
                                                                                                    {saving ? (
                                                                                                              <>
                                                                                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                                                                                        Saving Changes...
                                                                                                              </>
                                                                                                    ) : (
                                                                                                              <>
                                                                                                                        <Save size={18} className="mr-2" /> Save Profile
                                                                                                              </>
                                                                                                    )}
                                                                                          </motion.button>
                                                                                </motion.div>
                                                                      )}
                                                            </AnimatePresence>
                                                  </motion.div>
                                        </div>
                              </div>
                    </div>
          );
}

export default function ProfilePage() {
          return (
                    <div className="min-h-screen bg-slate-50 font-inter text-slate-900 pb-20">
                              <ProfilePageContent />
                    </div>
          );
}
