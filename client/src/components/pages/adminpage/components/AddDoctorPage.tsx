import { motion } from 'motion/react';
import { apiURL } from '../../../../../utils.js';
import axios from 'axios';
import { useState, useRef } from 'react';
import { Upload, UserPlus, X } from 'lucide-react';

export function AddDoctorPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState<number>(0);
    const [patients, setPatients] = useState<number>(0);
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Specialization options
    const specializations = [
        'Cardiologist',
        'Pediatrics',
        'Dermatologist',
        'Orthopedics',
        'Neurology',
        'Gynecology',
        'General Physician',
        'Emergency Medicine',
        'Psychiatry',
        'Oncology',
        'Urology',
        'ENT',
        'Ophthalmology',
        'Dentistry',
        'Physical Therapy'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create a JSON object instead of FormData
            const doctorData = {
                firstName,
                lastName,
                email,
                password,
                specialization,
                phone,
                experience,
                patients,
                bio,
                image: imagePreview || '' // Send image URL if you have one
            };

            // Retrieve token from local or session storage
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (!token) {
                alert('No authentication token found. Please login again.');
                return;
            }

            const response = await axios.post(`${apiURL}/api/admin/doctor`, doctorData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('Doctor added:', response.data);

            if (response.data.success) {
                alert('Doctor added successfully!');
                resetForm();
            }
        } catch (error: any) {
            console.error('Error adding doctor:', error);
            const message = error.response?.data?.message || 'Failed to add doctor.';
            alert(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setSpecialization('');
        setPhone('');
        setExperience(0);
        setPatients(0);
        setBio('');
        setImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Add New Doctor</h1>
                <p className="text-slate-600 mt-2">Register a new medical specialist to the team</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                            Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="doctor@example.com"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-slate-500 mt-2">Minimum 8 characters required</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                            Professional Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Specialization *
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required
                                >
                                    <option value="">Select specialization</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec.toLowerCase()}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="5"
                                    value={experience}
                                    onChange={(e) => setExperience(Number(e.target.value))}
                                    min="0"
                                    max="50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="+92 300 1234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Initial Patient Count
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="0"
                                    value={patients}
                                    onChange={(e) => setPatients(Number(e.target.value))}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Doctor Image Upload */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                            Profile Image
                        </h3>
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-blue-100">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <div
                                        className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                                        <p className="text-slate-600">Click to upload image</p>
                                        <p className="text-sm text-slate-500 mt-2">JPG, PNG (Max 2MB)</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                            <p className="text-sm text-slate-500">
                                Optional. If not provided, a default doctor image will be used.
                            </p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                            Biography
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Professional Bio
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="Describe the doctor's qualifications, achievements, and areas of expertise..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <p className="text-sm text-slate-500 mt-2">
                                This will be displayed on the doctor's public profile
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
                            disabled={loading}
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Adding Doctor...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Add Doctor
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Form Notes */}
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Fields marked with * are required</li>
                    <li>• Doctor will receive login credentials via email (implement separately)</li>
                    <li>• Profile image should be professional and clear</li>
                    <li>• Bio will be visible to patients on the doctor's profile</li>
                    <li>• Default password can be changed by the doctor after first login</li>
                </ul>
            </div>
        </motion.div>
    );
}