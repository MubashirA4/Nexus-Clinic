import React from 'react';
import { motion } from 'framer-motion';

export default function DoctorCard({ doctor, onBook }: { doctor: any, onBook: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center space-x-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group"
    >
      <div className="relative">
        <img src={doctor.image || '/doctor.png'} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-slate-800 truncate">{doctor.name}</div>
        <div className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">{doctor.specialization}</div>
        <div className="flex items-center mt-1 text-[10px] text-slate-400 font-medium">
          <span className="text-amber-400 mr-1">★</span> {doctor.rating || '4.8'} • {doctor.experience || '10+'} yrs Exp
        </div>
      </div>

      <button
        onClick={onBook}
        className="px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
      >
        Book Now
      </button>
    </motion.div>
  );
}
