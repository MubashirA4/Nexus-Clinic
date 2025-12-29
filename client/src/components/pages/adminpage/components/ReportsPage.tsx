import { motion } from 'motion/react';

export function ReportsPage() {
    const reports = [
        { title: 'Monthly Revenue Report', date: 'Jan 2024', type: 'Financial', size: '2.4 MB' },
        { title: 'Patient Statistics', date: 'Jan 2024', type: 'Analytics', size: '1.8 MB' },
        { title: 'Appointment Analysis', date: 'Dec 2023', type: 'Performance', size: '3.1 MB' },
        { title: 'Staff Performance Review', date: 'Dec 2023', type: 'HR', size: '2.7 MB' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3>Reports</h3>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all">
                        Generate Report
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {reports.map((report, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-medium mb-1">{report.title}</h4>
                                    <p className="text-sm text-slate-500">Generated: {report.date}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${report.type === 'Financial' ? 'bg-blue-50 text-blue-700' :
                                        report.type === 'Analytics' ? 'bg-purple-50 text-purple-700' :
                                            report.type === 'Performance' ? 'bg-emerald-50 text-emerald-700' :
                                                'bg-amber-50 text-amber-700'
                                    }`}>
                                    <span className="text-xs font-medium">{report.type}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                                <span>File size: {report.size}</span>
                                <span>📊</span>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                                    Download
                                </button>
                                <button className="flex-1 px-3 py-2 text-sm bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                                    Share
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
