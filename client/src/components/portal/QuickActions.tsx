import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Pill, Download } from 'lucide-react';

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export function QuickActions({ onTabChange }: QuickActionsProps) {
  const actions = [
    {
      icon: Calendar,
      label: 'Book Appointment',
      description: 'Schedule a new visit',
      color: 'from-blue-500 to-blue-600',
      link: '/booking',
    },
    {
      icon: FileText,
      label: 'View Records',
      description: 'Medical history',
      color: 'from-emerald-500 to-emerald-600',
      tab: 'records',
    },
    {
      icon: Pill,
      label: 'Prescriptions',
      description: 'Manage medications',
      color: 'from-pink-500 to-pink-600',
      tab: 'records',
    },
    {
      icon: Download,
      label: 'Download Reports',
      description: 'Lab results & reports',
      color: 'from-amber-500 to-amber-600',
      tab: 'records',
    },
    {
      icon: Download,
      label: 'Upload Report',
      description: 'Share medical reports',
      color: 'from-cyan-500 to-cyan-600',
      tab: 'records',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <h3 className="mb-6 font-bold text-slate-800 uppercase tracking-wider text-sm">Quick Actions</h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const content = (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => action.tab && onTabChange(action.tab)}
              className="group p-6 rounded-xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer h-full"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}
              >
                <action.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h4 className="mb-1 font-bold text-slate-900">{action.label}</h4>
              <p className="text-sm text-slate-600 mb-4">{action.description}</p>

              <div className="mt-auto flex items-center text-sm text-blue-600 group-hover:text-purple-600 transition-colors font-bold uppercase tracking-widest">
                <span className="mr-1">Go</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          );

          return action.link ? (
            <Link key={action.label} to={action.link}>
              {content}
            </Link>
          ) : (
            <div key={action.label}>
              {content}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
