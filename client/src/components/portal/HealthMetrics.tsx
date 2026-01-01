import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, Droplet, TrendingUp, TrendingDown, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { apiURL } from '../../../utils';
import { toast } from 'sonner';
import Heart from '@/assets/health metrics/heart-rate.png'
import BloodPressure from '@/assets/health metrics/blood-pressure.png'
import BloodGlucose from '@/assets/health metrics/glucose-meter.png'
import Steps from '@/assets/health metrics/step.png'



export function HealthMetrics() {
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isActivityReportOpen, setIsActivityReportOpen] = useState(false);

  // Form state
  const [logType, setLogType] = useState('heartRate');
  const [logValue, setLogValue] = useState('');
  const [logValue2, setLogValue2] = useState(''); // For blood pressure
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const [latestRes, historyRes] = await Promise.all([
        axios.get(`${apiURL}/api/health-metrics/latest?_=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiURL}/api/health-metrics?limit=50&_=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (latestRes.data.success) {
        const latest: any = {};
        latestRes.data.metrics.forEach((m: any) => {
          latest[m.type] = m;
        });
        setLatestMetrics(latest);
      }

      if (historyRes.data.success) {
        setMetricsData(historyRes.data.metrics);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast.error("Failed to load health metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

      let finalValue: any = parseFloat(logValue);
      let unit = '';

      switch (logType) {
        case 'heartRate': unit = 'bpm'; break;
        case 'bloodPressure':
          finalValue = { systolic: parseInt(logValue), diastolic: parseInt(logValue2) };
          unit = 'mmHg';
          break;
        case 'bloodGlucose': unit = 'mg/dL'; break;
        case 'steps': unit = 'steps'; break;
        case 'calories': unit = 'kcal'; break;
        case 'activeMinutes': unit = 'min'; break;
        case 'weight': unit = 'kg'; break;
      }

      const res = await axios.post(`${apiURL}/api/health-metrics`, {
        type: logType,
        value: finalValue,
        unit,
        date: logDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Metric logged successfully");
        setIsLogModalOpen(false);
        fetchMetrics();
        // Reset form
        setLogValue('');
        setLogValue2('');
      }
    } catch (error) {
      console.error("Error logging metric:", error);
      toast.error("Failed to log metric");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMetricStatus = (type: string, value: any) => {
    if (value === '--') return { label: 'No Data', color: 'bg-slate-50 text-slate-500' };

    switch (type) {
      case 'heartRate':
        const hr = parseFloat(value);
        if (hr > 100) return { label: '↑ High', color: 'bg-red-50 text-red-700' };
        if (hr < 60) return { label: '↓ Low', color: 'bg-blue-50 text-blue-700' };
        return { label: '✓ Normal', color: 'bg-green-50 text-green-700' };

      case 'bloodPressure':
        const [sys, dia] = value.split('/').map(Number);
        if (sys > 120 || dia > 80) return { label: '↑ High', color: 'bg-red-50 text-red-700' };
        if (sys < 90 || dia < 60) return { label: '↓ Low', color: 'bg-blue-50 text-blue-700' };
        return { label: '✓ Normal', color: 'bg-green-50 text-green-700' };

      case 'bloodGlucose':
        const bg = parseFloat(value);
        if (bg > 140) return { label: '⚠ High', color: 'bg-red-50 text-red-700' };
        if (bg > 100) return { label: '↑ Elevated', color: 'bg-orange-50 text-orange-700' };
        if (bg < 70) return { label: '↓ Low', color: 'bg-blue-50 text-blue-700' };
        return { label: '✓ Normal', color: 'bg-green-50 text-green-700' };

      case 'steps':
        const st = parseInt(value.toString().replace(/,/g, ''));
        if (st >= 10000) return { label: '★ Goal Hit', color: 'bg-emerald-50 text-emerald-700' };
        if (st >= 7000) return { label: '↑ Good', color: 'bg-green-50 text-green-700' };
        return { label: '→ Active', color: 'bg-blue-50 text-blue-700' };

      default:
        return { label: '✓ Recorded', color: 'bg-blue-50 text-blue-700' };
    }
  };

  const calculateChange = (type: string) => {
    const readings = metricsData.filter(m => m.type === type);
    if (readings.length < 2) return '--';

    const latest = readings[0].value;
    const previous = readings[1].value;

    if (type === 'bloodPressure') {
      const sysChange = latest.systolic - previous.systolic;
      return (sysChange >= 0 ? '+' : '') + sysChange;
    }

    const change = latest - previous;
    if (typeof change !== 'number') return '--';
    return (change >= 0 ? '+' : '') + change.toLocaleString();
  };

  const getMetricDisplay = (type: string) => {
    const m = latestMetrics[type];
    if (!m) return { value: '--', unit: type === 'bloodPressure' ? 'mmHg' : '' };

    if (type === 'bloodPressure') {
      return { value: `${m.value.systolic}/${m.value.diastolic}`, unit: 'mmHg' };
    }
    return {
      value: typeof m.value === 'number' ? m.value.toLocaleString() : m.value,
      unit: m.unit
    };
  };

  const heartRateChartData = metricsData
    .filter(m => m.type === 'heartRate')
    .slice(0, 7)
    .reverse()
    .map(m => ({
      time: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
      bpm: m.value
    }));

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      ...(() => {
        const display = getMetricDisplay('heartRate');
        return { ...display, status: getMetricStatus('heartRate', display.value) };
      })(),
      change: calculateChange('heartRate'),
      color: 'from-red-500 to-pink-600',
      type: 'heartRate'
    },
    {
      icon: BloodPressure,
      label: 'Blood Pressure',
      ...(() => {
        const display = getMetricDisplay('bloodPressure');
        return { ...display, status: getMetricStatus('bloodPressure', display.value) };
      })(),
      change: calculateChange('bloodPressure'),
      color: 'from-blue-500 to-blue-600',
      type: 'bloodPressure'
    },
    {
      icon: BloodGlucose,
      label: 'Blood Glucose',
      ...(() => {
        const display = getMetricDisplay('bloodGlucose');
        return { ...display, status: getMetricStatus('bloodGlucose', display.value) };
      })(),
      change: calculateChange('bloodGlucose'),
      color: 'from-purple-500 to-purple-600',
      type: 'bloodGlucose'
    },
    {
      icon: Steps,
      label: 'Steps Today',
      ...(() => {
        const display = getMetricDisplay('steps');
        return { ...display, status: getMetricStatus('steps', display.value) };
      })(),
      change: calculateChange('steps'),
      color: 'from-emerald-500 to-emerald-600',
      type: 'steps'
    },
  ];

  const bloodPressureData = [
    { name: 'Systolic', value: latestMetrics.bloodPressure?.value?.systolic || 0 },
    { name: 'Diastolic', value: latestMetrics.bloodPressure?.value?.diastolic || 0 },
  ];
  const COLORS = ['#8884d8', '#82ca9d'];

  const medicationAdherence = [
    { name: 'Taken', value: 85 },
    { name: 'Missed', value: 15 },
  ];
  const MED_COLORS = ['#4CAF50', '#FFC107'];

  return (
    <div className="space-y-6">
      {/* Header with Log Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Health Metrics</h2>
          <p className="text-slate-500">Track and monitor your vital signs</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Log Reading</span>
        </motion.button>
      </div>

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
                className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm`}
              >
                <img src={metric.icon} alt={metric.label} className="w-8 h-8 object-contain" />
              </motion.div>

              <div className={`flex items-center space-x-1 text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
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

            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${metric.status.color}`}>
              {metric.status.label}
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
          {heartRateChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={heartRateChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" />
                <YAxis stroke="#64748B" domain={['auto', 'auto']} />
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
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400">
              Log heart rate readings to see trend
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full" />
              <span className="text-slate-600">
                Average: {heartRateChartData.length > 0
                  ? Math.round(heartRateChartData.reduce((acc, curr) => acc + curr.bpm, 0) / heartRateChartData.length)
                  : '--'} bpm
              </span>
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
                <span className="medical-number">{getMetricDisplay('steps').value} / 10,000</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseInt(getMetricDisplay('steps').value.toString().replace(/,/g, '')) || 0) / 100)}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Calories Burned</span>
                <span className="medical-number">{getMetricDisplay('calories').value} / 600</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseFloat(getMetricDisplay('calories').value.toString()) || 0) / 6)}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Active Minutes</span>
                <span className="medical-number">{getMetricDisplay('activeMinutes').value} / 60</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseFloat(getMetricDisplay('activeMinutes').value.toString()) || 0) / 0.6)}%` }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsActivityReportOpen(true)}
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
          >
            View Full Activity Report
          </motion.button>
        </motion.div>
      </div>

      {/* Log Metric Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsLogModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Log Health Reading</h3>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Metric Type</label>
                  <select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="heartRate">Heart Rate</option>
                    <option value="bloodPressure">Blood Pressure</option>
                    <option value="bloodGlucose">Blood Glucose</option>
                    <option value="steps">Steps</option>
                    <option value="calories">Calories Burned</option>
                    <option value="activeMinutes">Active Minutes</option>
                    <option value="weight">Body Weight</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={logType === 'bloodPressure' ? '' : 'col-span-2'}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {logType === 'bloodPressure' ? 'Systolic' : 'Value'}
                    </label>
                    <input
                      type="number"
                      required
                      value={logValue}
                      onChange={(e) => setLogValue(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder={logType === 'heartRate' ? '72' : 'Value'}
                    />
                  </div>
                  {logType === 'bloodPressure' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Diastolic</label>
                      <input
                        type="number"
                        required
                        value={logValue2}
                        onChange={(e) => setLogValue2(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="80"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      required
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Reading'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Report Modal */}
      <AnimatePresence>
        {isActivityReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsActivityReportOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Activity Report</h3>
                  <p className="text-sm text-slate-500">Historical view of your activity metrics</p>
                </div>
                <button
                  onClick={() => setIsActivityReportOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Steps Trend */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <img src={Steps} className="w-5 h-5 object-contain" alt="" />
                    Steps History (Last 7 Days)
                  </h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metricsData
                          .filter(m => m.type === 'steps')
                          .slice(0, 7)
                          .reverse()
                          .map(m => ({
                            date: new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' }),
                            steps: m.value
                          }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
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
                          dataKey="steps"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ fill: '#10B981', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calories Trend */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" />
                      Calories Burned
                    </h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={metricsData
                            .filter(m => m.type === 'calories')
                            .slice(0, 7)
                            .reverse()
                            .map(m => ({
                              date: new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' }),
                              kcal: m.value
                            }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
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
                            dataKey="kcal"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: '#F59E0B', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Active Minutes Trend */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <img src={Heart} className="w-5 h-5 object-contain" alt="" />
                      Active Minutes
                    </h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={metricsData
                            .filter(m => m.type === 'activeMinutes')
                            .slice(0, 7)
                            .reverse()
                            .map(m => ({
                              date: new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' }),
                              min: m.value
                            }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
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
                            dataKey="min"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* History Table */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Detailed Log (Last 20 Entries)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-slate-500 bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Metric</th>
                          <th className="px-4 py-3 font-medium text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {metricsData
                          .filter(m => ['steps', 'calories', 'activeMinutes', 'heartRate', 'bloodPressure', 'bloodGlucose'].includes(m.type))
                          .slice(0, 20)
                          .map((m, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-slate-600">
                                {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-900 capitalize">
                                {m.type.replace(/([A-Z])/g, ' $1')}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {m.type === 'bloodPressure'
                                  ? `${m.value.systolic}/${m.value.diastolic} ${m.unit}`
                                  : `${m.value.toLocaleString()} ${m.unit}`
                                }
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsActivityReportOpen(false)}
                  className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
