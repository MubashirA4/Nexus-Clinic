import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Users, Award, Heart, Clock } from 'lucide-react';
import TrustIcon from '@/assets/services/good-feedback.png';

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref} className="medical-number">{count}</span>;
}

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: 50,
      suffix: '+',
      label: 'Expert Doctors',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      value: 10000,
      suffix: '+',
      label: 'Happy Patients',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: TrustIcon,
      value: 99,
      suffix: '%',
      label: 'Satisfaction Rate',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Clock,
      value: 24,
      suffix: '/7',
      label: 'Available Support',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-slate-600">
            Delivering excellence in healthcare with compassion and innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                {typeof stat.icon === 'string' ? (
                  <div className={`w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg`}>
                    <img src={stat.icon} alt={stat.label} className="w-8 h-8 object-contain" />
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                )}

                <div className="text-center">
                  <div className="mb-2">
                    <Counter end={stat.value} />
                    <span className="medical-number">{stat.suffix}</span>
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: `linear-gradient(135deg, ${stat.color})`,
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
