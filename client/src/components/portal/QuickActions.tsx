import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Video, Pill, Download, MessageSquare } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      icon: Calendar,
      label: 'Book Appointment',
      description: 'Schedule a new visit',
      color: 'from-blue-500 to-blue-600',
      link: '/booking',
    },
    {
      icon: Video,
      label: 'Start Telemedicine',
      description: 'Virtual consultation',
      color: 'from-purple-500 to-purple-600',
      link: '/telemedicine',
    },
    {
      icon: FileText,
      label: 'View Records',
      description: 'Medical history',
      color: 'from-emerald-500 to-emerald-600',
      link: '/portal',
    },
    {
      icon: Pill,
      label: 'Prescriptions',
      description: 'Manage medications',
      color: 'from-pink-500 to-pink-600',
      link: '/portal',
    },
    {
      icon: Download,
      label: 'Download Reports',
      description: 'Lab results & reports',
      color: 'from-amber-500 to-amber-600',
      link: '/portal',
    },
    {
      icon: MessageSquare,
      label: 'Contact Doctor',
      description: 'Send a message',
      color: 'from-cyan-500 to-cyan-600',
      link: '/portal',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <h3 className="mb-6">Quick Actions</h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link key={action.label} to={action.link}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group p-6 rounded-xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}
              >
                <action.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h4 className="mb-1">{action.label}</h4>
              <p className="text-sm text-slate-600">{action.description}</p>

              <motion.div
                className="mt-3 flex items-center text-sm text-blue-600 group-hover:text-purple-600 transition-colors"
              >
                <span className="mr-1">Go</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
