import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, Activity, Droplet, TrendingUp, TrendingDown } from 'lucide-react';

export function HealthMetrics() {
  const heartRateData = [
    { time: 'Mon', bpm: 72 },
    { time: 'Tue', bpm: 75 },
    { time: 'Wed', bpm: 70 },
    { time: 'Thu', bpm: 73 },
    { time: 'Fri', bpm: 71 },
    { time: 'Sat', bpm: 68 },
    { time: 'Sun', bpm: 74 },
  ];

  const bloodPressureData = [
    { name: 'Systolic', value: 120 },
    { name: 'Diastolic', value: 80 },
  ];

  const medicationAdherence = [
    { name: 'Taken', value: 85 },
    { name: 'Missed', value: 15 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6'];
  const MED_COLORS = ['#10B981', '#EF4444'];

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      change: '+2',
      color: 'from-red-500 to-pink-600',
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      change: '-3',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Droplet,
      label: 'Blood Glucose',
      value: '95',
      unit: 'mg/dL',
      status: 'normal',
      change: '+5',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Steps Today',
      value: '8,432',
      unit: 'steps',
      status: 'good',
      change: '+1,234',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}
              >
                <metric.icon className="w-6 h-6 text-white" />
              </motion.div>

              <div className={`flex items-center space-x-1 text-sm ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change.startsWith('+') ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>

            <div className="medical-number mb-1">
              {metric.value}
              <span className="text-sm text-slate-600 ml-1">{metric.unit}</span>
            </div>
            <div className="text-sm text-slate-600 mb-2">{metric.label}</div>

            <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
              metric.status === 'normal' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {metric.status === 'normal' ? '✓ Normal' : '↑ Good'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="mb-6">Weekly Heart Rate Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={heartRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" />
              <YAxis stroke="#64748B" domain={[60, 80]} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="bpm"
                stroke="url(#heartGradient)"
                strokeWidth={3}
                dot={{ fill: '#EF4444', r: 6 }}
                activeDot={{ r: 8 }}
              />
              <defs>
                <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full" />
              <span className="text-slate-600">Average: 72 bpm</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 hover:text-purple-600 transition-colors"
            >
              View Details →
            </motion.button>
          </div>
        </motion.div>

        {/* Blood Pressure Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="mb-6">Blood Pressure Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bloodPressureData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {bloodPressureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {bloodPressureData.map((item, index) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS[index] }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <div className="medical-number">{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medication Adherence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="mb-6">Medication Adherence (This Month)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={medicationAdherence}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {medicationAdherence.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MED_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {medicationAdherence.map((item, index) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: MED_COLORS[index] }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <div className="medical-number">{item.value}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="mb-6">Today's Activity Summary</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Steps Goal</span>
                <span className="medical-number">8,432 / 10,000</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Calories Burned</span>
                <span className="medical-number">452 / 600</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Active Minutes</span>
                <span className="medical-number">45 / 60</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
          >
            View Full Activity Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
