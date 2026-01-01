import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, User, Activity, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../components/auth/auth'; // Import the custom hook
import Logo from '@/assets/Logo.svg'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownOpen && !e.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/ourdoctors', label: 'Our Doctors' },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : location.pathname === '/'
            ? 'bg-white/10 text-white backdrop-blur-md border-b border-white/10'
            : 'bg-white/95 backdrop-blur-lg shadow-lg'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <div>
                  <img src={Logo} alt="" />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`relative px-2 py-1 transition-colors font-medium ${location.pathname === link.path
                      ? 'text-blue-600'
                      : location.pathname === '/' && !scrolled
                        ? 'text-white/90 hover:text-white'
                        : 'text-slate-700 hover:text-blue-600'
                      }`}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                      />
                    )}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* CTA Buttons & User Dropdown */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative user-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${location.pathname === '/' && !scrolled ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                      }`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
                      {user?.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover object-top" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className={`font-medium transition-colors ${location.pathname === '/' && !scrolled ? 'text-white' : 'text-slate-700'
                      }`}>
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''
                      } ${location.pathname === '/' && !scrolled ? 'text-white/70' : 'text-slate-500'}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                              {user?.image ? (
                                <img src={user.image} alt="" className="w-full h-full object-cover object-top" />
                              ) : (
                                user?.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
                              <p className="text-sm text-slate-500">{user?.email || ''}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                {user?.role === 'doctor' ? 'Doctor' : user?.role === 'admin' ? 'Administrator' : 'Patient'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to={user?.role === 'doctor' ? '/doctor-dashboard' :
                              user?.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard'}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <User className="w-5 h-5 mr-3 text-slate-400" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <User className="w-5 h-5 mr-3 text-slate-400" />
                            My Profile
                          </Link>
                          <Link
                            to="/appointments"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                            My Appointments
                          </Link>
                        </div>

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
              ) : (
                <Link
                  to="/login"
                  className={`font-medium transition-colors px-4 py-2 ${location.pathname === '/' && !scrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-slate-700 hover:text-blue-600'
                    }`}
                >
                  Sign In
                </Link>
              )}

              <motion.button
                onClick={() => navigate(isAuthenticated ? '/booking' : '/login?redirect=/booking')}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
              >
                Book Appointment
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${location.pathname === '/' && !scrolled
                ? 'text-white hover:bg-white/10'
                : 'text-slate-900 hover:bg-slate-100'
                }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-200"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg ${location.pathname === link.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile User Info */}
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.1 }}
                      className="px-4 py-3 border-t border-slate-100"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                          {user?.image ? (
                            <img src={user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
                          <p className="text-sm text-slate-500">{user?.email || ''}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to={user?.role === 'doctor' ? '/doctor-dashboard' :
                            user?.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard'}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/appointments"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          My Appointments
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-slate-200"
                >
                  <button
                    onClick={() => { setIsOpen(false); navigate(isAuthenticated ? '/booking' : '/login?redirect=/booking'); }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
                  >
                    Book Appointment
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer - only shown on other pages to prevent content hiding behind navbar */}
      {location.pathname !== '/' && <div className="h-20" />}
    </>
  );
}