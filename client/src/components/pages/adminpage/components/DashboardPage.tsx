import { motion } from 'motion/react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    Activity
} from 'lucide-react';

export function DashboardPage() {
    const revenueData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 67000 },
    ];

    const appointmentData = [
        { day: 'Mon', appointments: 45 },
        { day: 'Tue', appointments: 52 },
        { day: 'Wed', appointments: 48 },
        { day: 'Thu', appointments: 61 },
        { day: 'Fri', appointments: 55 },
        { day: 'Sat', appointments: 35 },
        { day: 'Sun', appointments: 20 },
    ];

    const departmentData = [
        { name: 'Cardiology', value: 30 },
        { name: 'Pediatrics', value: 25 },
        { name: 'General', value: 20 },
        { name: 'Emergency', value: 15 },
        { name: 'Others', value: 10 },
    ];

    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];

    const stats = [
        {
            icon: DollarSign,
            label: 'Total Revenue',
            value: '$328,000',
            change: '+12.5%',
            color: 'from-emerald-500 to-emerald-600',
            trend: 'up',
        },
        {
            icon: Users,
            label: 'Total Patients',
            value: '2,847',
            change: '+8.2%',
            color: 'from-blue-500 to-blue-600',
            trend: 'up',
        },
        {
            icon: Calendar,
            label: 'Appointments',
            value: '316',
            change: '+15.3%',
            color: 'from-purple-500 to-purple-600',
            trend: 'up',
        },
        {
            icon: Activity,
            label: 'Occupancy Rate',
            value: '87%',
            change: '-2.4%',
            color: 'from-amber-500 to-amber-600',
            trend: 'down',
        },
    ];

    return (
        <div>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </motion.div>

                            <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' && 'rotate-180'}`} />
                                <span>{stat.change}</span>
                            </div>
                        </div>

                        <div className="medical-number mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                >
                    <h3 className="mb-6">Revenue Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#64748B" />
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
                                dataKey="revenue"
                                stroke="url(#revenueGradient)"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Appointments Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                >
                    <h3 className="mb-6">Weekly Appointments</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={appointmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="day" stroke="#64748B" />
                            <YAxis stroke="#64748B" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Bar dataKey="appointments" fill="url(#appointmentGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Department Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                >
                    <h3 className="mb-6">Department Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={departmentData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label
                            >
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 space-y-2">
                        {departmentData.map((dept, index) => (
                            <div key={dept.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: COLORS[index] }}
                                    />
                                    <span className="text-slate-600">{dept.name}</span>
                                </div>
                                <span className="medical-number">{dept.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Staff Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                >
                    <h3 className="mb-6">Top Performing Staff</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Dr. Sarah Johnson', rating: 4.9, patients: 234 },
                            { name: 'Dr. Michael Chen', rating: 4.8, patients: 198 },
                            { name: 'Dr. Emily Rodriguez', rating: 5.0, patients: 256 },
                        ].map((staff, index) => (
                            <motion.div
                                key={staff.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                            >
                                <div>
                                    <h4 className="mb-1">{staff.name}</h4>
                                    <p className="text-sm text-slate-600">{staff.patients} patients</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-1 text-amber-500">
                                        <span className="medical-number">{staff.rating}</span>
                                        <span>⭐</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                >
                    <h3 className="mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[
                            { action: 'New appointment booked', time: '5 min ago', type: 'success' },
                            { action: 'Patient checked in', time: '12 min ago', type: 'info' },
                            { action: 'Lab results uploaded', time: '25 min ago', type: 'success' },
                            { action: 'Appointment cancelled', time: '1 hr ago', type: 'warning' },
                        ].map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                            >
                                <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                                        activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700">{activity.action}</p>
                                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
