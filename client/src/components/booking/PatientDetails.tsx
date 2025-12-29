import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/auth';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function PatientDetails({ data, onNext, onBack }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: data.patientName || user?.name || '',
    patientEmail: data.patientEmail || user?.email || '',
    patientPhone: data.patientPhone || user?.phone || '',
    age: data.age || user?.age || '',
    gender: data.gender || user?.gender || '',
    address: data.address || user?.address || '',
    reason: data.reason || '',
  });

  // Effect to sync user data when it becomes available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        patientEmail: prev.patientEmail || user.email || '',
        patientPhone: prev.patientPhone || user.phone || '',
        age: prev.age || user.age || '',
        gender: prev.gender || user.gender || '',
        address: prev.address || user.address || '',
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) newErrors.patientName = 'Name is required';
    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Invalid email format';
    }
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Phone is required';
    } else if (formData.patientPhone.replace(/\D/g, '').length < 10) {
      newErrors.patientPhone = 'Phone must be at least 10 digits';
    }
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h3 className="mb-6 text-center">Patient Information</h3>
      <p className="text-center text-slate-600 mb-8">
        Please provide your details to complete the booking
      </p>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm mb-2 text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              disabled={!!user?.name}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.patientName ? 'border-red-500' : 'border-slate-200'
                } ${user?.name ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
              placeholder="Enter your full name"
            />

          </div>
          {errors.patientName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.patientName}</span>
            </motion.p>
          )}
        </motion.div>

        {/* Email & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm mb-2 text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleChange}
                disabled={!!user?.email}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.patientEmail ? 'border-red-500' : 'border-slate-200'
                  } ${user?.email ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
                placeholder="email@example.com"
              />
            </div>
            {errors.patientEmail && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.patientEmail}</span>
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm mb-2 text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                disabled={!!user?.phone}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.patientPhone ? 'border-red-500' : 'border-slate-200'
                  } ${user?.phone ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.patientPhone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.patientPhone}</span>
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Age & Gender */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm mb-2 text-slate-700">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!!user?.age}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.age ? 'border-red-500' : 'border-slate-200'
                  } ${user?.age ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
                placeholder="Enter age"
              />
            </div>
            {errors.age && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.age}</span>
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm mb-2 text-slate-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!!user?.gender}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.gender ? 'border-red-500' : 'border-slate-200'
                } ${user?.gender ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 flex items-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.gender}</span>
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm mb-2 text-slate-700">Address (Optional)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!!user?.address}
              className={`w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${user?.address ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
              placeholder="Enter your address"
            />
          </div>
        </motion.div>

        {/* Reason for Visit */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm mb-2 text-slate-700">Reason for Visit (Optional)</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Briefly describe your symptoms or reason for consultation..."
          />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl"
        >
          ← Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
