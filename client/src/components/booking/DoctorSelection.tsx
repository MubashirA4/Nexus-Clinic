import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star, Calendar, Award } from 'lucide-react';
import { apiURL } from '../../../utils';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function DoctorSelection({ data, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(data.doctor || '');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from backend (public endpoint)
  useEffect(() => {
    let mounted = true;
    import('axios').then(({ default: axios }) => {
      axios.get(`${apiURL}/api/doctors`)
        .then((res: any) => {
          if (!mounted) return;
          const arr = res.data?.data || [];
          setDoctors(arr.map((d: any) => ({
            id: d._id,
            name: d.name,
            specialty: d.specialization || 'General',
            experience: d.experience || 'N/A',
            rating: d.rating || 4.5,
            reviews: d.reviewCount || 0,
            availability: 'Available',
            image: d.image || 'https://i.pravatar.cc/150?u=' + (d.email || d._id),
            nextSlot: 'Next available'
          })));
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching doctors for selection:', err);
          setLoading(false);
        });
    });

    return () => { mounted = false; };
  }, []);

  const handleContinue = () => {
    if (selected) {
      onNext({ doctor: selected });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h3 className="mb-6 text-center">Select Your Doctor</h3>
      <p className="text-center text-slate-600 mb-8">
        Choose from our experienced medical professionals
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelected(doctor.id)}
            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all ${selected === doctor.id
                ? 'border-blue-500 bg-blue-50 shadow-xl'
                : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
              }`}
          >
            {selected === doctor.id && (
              <motion.div
                layoutId="doctorGlow"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-10"
              />
            )}

            <div className="relative flex items-start space-x-4">
              {/* Doctor Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selected === doctor.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Doctor Info */}
              <div className="flex-1">
                <h4 className="mb-1">{doctor.name}</h4>
                <p className="text-sm text-slate-600 mb-2">{doctor.specialty}</p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(doctor.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm medical-number">{doctor.rating}</span>
                  <span className="text-sm text-slate-500">({doctor.reviews})</span>
                </div>

                {/* Experience & Availability */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Award className="w-4 h-4" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="text-green-600">{doctor.availability}</span>
                  </div>
                </div>

                {/* Next Available Slot */}
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Next slot: {doctor.nextSlot}
                </div>
              </div>
            </div>

            {/* View Profile Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-purple-600 transition-colors"
            >
              View Full Profile →
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
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
