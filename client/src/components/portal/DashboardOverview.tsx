import { motion } from 'motion/react';
import { Calendar, FileText, MessageSquare, Pill } from 'lucide-react';

export function DashboardOverview() {
  const stats = [
    {
      icon: Calendar,
      label: 'Upcoming Appointments',
      value: '3',
      change: '+1 this week',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FileText,
      label: 'Medical Records',
      value: '24',
      change: '2 new reports',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: '5',
      change: 'from Dr. Johnson',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Pill,
      label: 'Active Prescriptions',
      value: '2',
      change: 'Refill due soon',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </motion.div>

            {stat.label === 'Unread Messages' && parseInt(stat.value) > 0 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            )}
          </div>

          <div className="medical-number mb-1">{stat.value}</div>
          <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
          <div className="text-xs text-slate-500">{stat.change}</div>

          {/* Progress Bar for some stats */}
          {stat.label === 'Active Prescriptions' && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
