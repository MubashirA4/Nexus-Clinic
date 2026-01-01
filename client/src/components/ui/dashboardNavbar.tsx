import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../auth/auth';
import { useEffect, useState } from 'react';
import Logo from '@/assets/logo.svg'

export function DashboardNavbar() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserDropdownOpen && !(e.target as Element).closest('.user-navbar-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img src={Logo} alt="" />
              </motion.div>
            </Link>

            {/* Right: Home, Notifications & User Profile */}
            <div className="flex items-center space-x-4">
              {/* Home Button */}
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Home className="w-5 h-5 text-slate-700" />
                  <span className="font-medium text-slate-700 hidden md:block">Home</span>
                </motion.button>
              </Link>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-slate-100"
              >
                <Bell className="w-6 h-6 text-slate-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* User Profile Button in Navbar */}
              <div className="relative user-navbar-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover object-top" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-slate-900 text-sm">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.role === 'doctor' ? 'Doctor' : user?.role === 'admin' ? 'Admin' : 'Patient'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                    >
                      {/* User Info in Dropdown */}
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                            {user?.image ? (
                              <img src={user.image} alt="" className="w-full h-full object-cover object-top " />
                            ) : (
                              user?.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
                            <p className="text-sm text-slate-500">{user?.email || ''}</p>
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              {user?.role === 'doctor' ? 'Doctor Account' :
                                user?.role === 'admin' ? 'Administrator Account' :
                                  'Patient Account'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Options */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-5 h-5 mr-3 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-5 h-5 mr-3 text-slate-400" />
                          Settings
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}