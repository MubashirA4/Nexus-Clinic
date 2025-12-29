import React from 'react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DoctorSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'Patients' },
    { id: 'messages', label: 'Messages' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="w-64 hidden lg:block flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-24">
        <div className="mb-4">
          <h4 className="font-semibold">Doctor Panel</h4>
          <p className="text-xs text-slate-500">Manage your schedule & patients</p>
        </div>

        <nav className="space-y-2">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === m.id ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
