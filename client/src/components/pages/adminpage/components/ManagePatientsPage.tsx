import { motion } from 'motion/react';

export function ManagePatientsPage() {
    const patients = [
        { id: 1, name: 'John Smith', age: 45, lastVisit: '2024-01-15', status: 'Active' },
        { id: 2, name: 'Maria Garcia', age: 32, lastVisit: '2024-01-14', status: 'Active' },
        { id: 3, name: 'David Wilson', age: 58, lastVisit: '2024-01-13', status: 'Inactive' },
        { id: 4, name: 'Lisa Brown', age: 29, lastVisit: '2024-01-12', status: 'Active' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="mb-6">Manage Patients</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <motion.div
                            key={patient.id}
                            whileHover={{ y: -5 }}
                            className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-medium">{patient.name}</h4>
                                    <p className="text-sm text-slate-500">Age: {patient.age}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Last Visit:</span>
                                    <span className="font-medium">{patient.lastVisit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${patient.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-slate-100 text-slate-800'
                                        }`}>
                                        {patient.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex space-x-2">
                                    <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                                        View Details
                                    </button>
                                    <button className="flex-1 px-3 py-2 text-sm bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                                        Schedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
