import { motion } from 'motion/react';
import { useState } from 'react';
import { Heart, Baby, Activity, Stethoscope, Brain, Bone, Eye, Ear } from 'lucide-react';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function DepartmentSelection({ data, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(data.department || '');

  const departments = [
    { id: 'cardiology', name: 'Cardiology', icon: Heart, color: 'from-red-500 to-pink-600', description: 'Heart & cardiovascular care' },
    { id: 'pediatrics', name: 'Pediatrics', icon: Baby, color: 'from-purple-500 to-purple-600', description: 'Child & infant health' },
    { id: 'emergency', name: 'Emergency', icon: Activity, color: 'from-red-600 to-red-700', description: 'Urgent medical care' },
    { id: 'general', name: 'General Medicine', icon: Stethoscope, color: 'from-blue-500 to-blue-600', description: 'Primary healthcare' },
    { id: 'neurology', name: 'Neurology', icon: Brain, color: 'from-indigo-500 to-indigo-600', description: 'Brain & nervous system' },
    { id: 'orthopedics', name: 'Orthopedics', icon: Bone, color: 'from-emerald-500 to-emerald-600', description: 'Bones & joints' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'from-cyan-500 to-cyan-600', description: 'Eye care' },
    { id: 'ent', name: 'ENT', icon: Ear, color: 'from-amber-500 to-amber-600', description: 'Ear, nose & throat' },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleContinue = () => {
    if (selected) {
      onNext({ department: selected });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h3 className="mb-6 text-center">Select Department</h3>
      <p className="text-center text-slate-600 mb-8">
        Choose the medical department for your consultation
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(dept.id)}
            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all ${selected === dept.id
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
          >
            {/* Selection Glow */}
            {selected === dept.id && (
              <motion.div
                layoutId="departmentGlow"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-10"
              />
            )}

            <div className="relative">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center`}
              >
                <dept.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h4 className="text-center mb-2">{dept.name}</h4>
              <p className="text-sm text-slate-600 text-center">{dept.description}</p>

              {/* Check Mark */}
              {selected === dept.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!selected}
          className={`px-8 py-4 rounded-xl transition-all ${selected
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
