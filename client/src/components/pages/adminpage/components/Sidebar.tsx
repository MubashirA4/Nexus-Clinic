import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    UserPlus,
    UserCog,
    Users,
    Calendar,
    FileText,
    Settings,
    ChevronRight,
    LogOut,
    ShieldPlus
} from 'lucide-react';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }: SidebarProps) {
    const menuItems = [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Add Admin', label: 'Add Admin', icon: ShieldPlus },
        { id: 'Add Doctor', label: 'Add Doctor', icon: UserPlus },
        { id: 'Manage Doctors', label: 'Doctors', icon: UserCog },
        { id: 'Manage Patients', label: 'Patients', icon: Users },
        { id: 'All Users', label: 'All Users', icon: ShieldPlus },
        { id: 'Appointments', label: 'Appointments', icon: Calendar },
        { id: 'Reports', label: 'Reports', icon: FileText },
        { id: 'Settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/** Mobile Sidebar (Fixed) **/}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: sidebarOpen ? 0 : '-100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-slate-50 to-blue-50 border-r border-slate-200 shadow-2xl md:hidden overflow-hidden"
            >
                <SidebarContent activePage={activePage} setActivePage={setActivePage} setSidebarOpen={setSidebarOpen} menuItems={menuItems} isMobile={true} />
            </motion.aside>

            {/** Desktop Sidebar (Static/Collapsible) **/}
            <motion.aside
                initial={{ width: 280 }} // Default open on desktop
                animate={{ width: sidebarOpen ? 280 : 0 }}
                className="hidden md:flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 border-r border-slate-200 overflow-hidden shrink-0 relative"
            >
                <div className="w-[280px] h-full flex flex-col">
                    <SidebarContent activePage={activePage} setActivePage={setActivePage} setSidebarOpen={setSidebarOpen} menuItems={menuItems} isMobile={false} />
                </div>
            </motion.aside>
        </>
    );
}

function SidebarContent({ activePage, setActivePage, setSidebarOpen, menuItems, isMobile }: any) {
    return (
        <div className="flex flex-col h-full text-slate-600">


            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                <p className="text-xs font-semibold text-slate-400 mb-4 px-2 uppercase tracking-wider">Main Menu</p>
                <ul className="space-y-1">
                    {menuItems.map((item: any) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        setActivePage(item.id);
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className={`transition-colors ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-600'}`} />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={16} className="opacity-70 text-blue-100" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="p-4 border-t border-slate-200 bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm">
                <button className="flex items-center justify-center gap-3 w-full  text-red-500 hover:text-red-700  transition-all duration-300 hover:scale-[1.02] group">
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
