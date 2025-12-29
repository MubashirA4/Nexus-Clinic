import React from 'react';

export default function DoctorCard({ doctor, onBook }: { doctor: any, onBook: () => void }) {
  return (
    <div className="flex items-center space-x-3 p-2 bg-white rounded shadow-sm">
      <img src={doctor.image || '/doctor.png'} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1">
        <div className="font-semibold text-sm">{doctor.name}</div>
        <div className="text-xs text-slate-500">{doctor.specialization}</div>
        <div className="text-xs text-slate-400 mt-1">Rating: {doctor.rating || '4.5'}</div>
      </div>
      <div>
        <button onClick={onBook} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Book Now</button>
      </div>
    </div>
  );
}
