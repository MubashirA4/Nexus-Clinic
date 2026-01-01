import { motion } from 'motion/react';
import { Calendar, FileText, Pill } from 'lucide-react';

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
  data: {
    appointments: number;
    records: number;
    prescriptions: number;
  };
}

export function DashboardOverview({ onTabChange, data }: DashboardOverviewProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Upcoming Appointments',
      value: data.appointments.toString(),
      change: data.appointments > 0 ? 'View schedule' : 'No upcoming',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      tab: 'appointments'
    },
    {
      icon: FileText,
      label: 'Medical Records',
      value: data.records.toString(),
      change: data.records > 0 ? 'View history' : 'No records yet',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      tab: 'records'
    },
    {
      icon: Pill,
      label: 'Active Prescriptions',
      value: data.prescriptions.toString(),
      change: data.prescriptions > 0 ? 'View details' : 'None active',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      tab: 'records' // Assuming prescriptions are in records
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          onClick={() => onTabChange(stat.tab)}
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
