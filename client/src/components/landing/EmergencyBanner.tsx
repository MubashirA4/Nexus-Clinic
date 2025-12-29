import { motion } from 'motion/react';
import { Phone, MessageCircle, AlertCircle } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <section className="py-12 relative overflow-hidden">
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #DC2626, #EF4444)',
            'linear-gradient(135deg, #EF4444, #DC2626)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="relative"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-full bg-white"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Left Side - Emergency Info */}
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div className="text-white">
                <h3 className="text-white mb-2">24/7 Emergency Services</h3>
                <p className="text-red-100">
                  Immediate medical attention available round the clock
                </p>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="tel:911"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center space-x-3 px-6 py-4 bg-white text-red-600 rounded-xl shadow-xl"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Phone className="w-6 h-6" />
                </motion.div>
                <div className="text-left">
                  <div className="text-xs text-red-400">Emergency Hotline</div>
                  <div className="font-bold">Call: (555) 911-HELP</div>
                </div>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center space-x-3 px-6 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Live Chat</span>
                
                {/* Notification Dot */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Pulse Animation */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 rounded-lg"
        />
      </motion.div>
    </section>
  );
}
