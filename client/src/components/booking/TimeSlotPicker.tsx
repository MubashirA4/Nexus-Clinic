import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function TimeSlotPicker({ data, onNext, onBack }: Props) {
  const [selectedDate, setSelectedDate] = useState(data.date || '');
  const [selectedTime, setSelectedTime] = useState(data.time || '');

  // Generate dates for next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['12:10 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:07 PM', '02:30 PM', '03:00 PM'],
    evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
  };

  // Randomly mark some slots as booked for demo
  const bookedSlots = ['09:30 AM', '10:30 AM', '02:00 PM', '05:00 PM'];

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onNext({ date: selectedDate, time: selectedTime });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h3 className="mb-6 text-center">Select Date & Time</h3>
      <p className="text-center text-slate-600 mb-8">
        Choose your preferred appointment slot
      </p>

      {/* Date Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4>Select Date</h4>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="text-sm text-slate-600">December 2025</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const dateStr = formatDate(date);
            const isSelected = selectedDate === dateStr;
            const isToday = index === 0;

            return (
              <motion.button
                key={dateStr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative p-3 rounded-xl transition-all ${isSelected
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-50 hover:bg-slate-100'
                  }`}
              >
                <div className="text-xs mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="medical-number">{date.getDate()}</div>
                {isToday && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                )}
                {isSelected && (
                  <motion.div
                    layoutId="dateGlow"
                    className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-50 -z-10"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Morning Slots */}
          <div>
            <h4 className="mb-3 flex items-center space-x-2">
              <span>🌅</span>
              <span>Morning</span>
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {timeSlots.morning.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <motion.button
                    key={time}
                    whileHover={!isBooked ? { scale: 1.05 } : {}}
                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`relative py-3 px-4 rounded-xl text-sm transition-all ${isBooked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200'
                      }`}
                  >
                    {time}
                    {isSelected && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-50 -z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div>
            <h4 className="mb-3 flex items-center space-x-2">
              <span>☀️</span>
              <span>Afternoon</span>
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {timeSlots.afternoon.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <motion.button
                    key={time}
                    whileHover={!isBooked ? { scale: 1.05 } : {}}
                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`relative py-3 px-4 rounded-xl text-sm transition-all ${isBooked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200'
                      }`}
                  >
                    {time}
                    {isSelected && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-50 -z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Evening Slots */}
          <div>
            <h4 className="mb-3 flex items-center space-x-2">
              <span>🌙</span>
              <span>Evening</span>
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {timeSlots.evening.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <motion.button
                    key={time}
                    whileHover={!isBooked ? { scale: 1.05 } : {}}
                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`relative py-3 px-4 rounded-xl text-sm transition-all ${isBooked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200'
                      }`}
                  >
                    {time}
                    {isSelected && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-50 -z-10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-slate-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-100 rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-50 border border-slate-200 rounded" />
          <span>Available</span>
        </div>
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
          disabled={!selectedDate || !selectedTime}
          className={`px-8 py-4 rounded-xl transition-all ${selectedDate && selectedTime
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
