import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Check, AlertCircle, User, Stethoscope, Shield } from 'lucide-react';
import axios from 'axios';
import { apiURL } from '../../../utils';

// Type for login response
interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        specialization?: string;
        qualification?: string;
        experience?: number;
        licenseNumber?: string;
        phone?: string;
        dateOfBirth?: string;
        permissions?: string[];
    };
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to store authentication data
    const storeAuthData = (token: string, userData: any) => {
        // Store token
        if (rememberMe) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
    };

    // Function to handle login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // API call for login - Now checks all user types
            const response = await axios.post<LoginResponse>(`${apiURL}/api/login`, {
                email,
                password,
            });

            if (response.data.success && response.data.token && response.data.user) {
                // Store authentication data
                storeAuthData(response.data.token, response.data.user);

                // Notify application (same-tab) that auth state changed so hooks update immediately
                window.dispatchEvent(new Event('authChanged'));

                // Show success message
                setSuccess('Login successful! Redirecting...');

                // Clear form
                setEmail('');
                setPassword('');

                // Redirect based on user role
                setTimeout(() => {
                    // Prefer redirect query param if present (e.g., ?redirect=/booking)
                    const params = new URLSearchParams(location.search);
                    const redirect = params.get('redirect');
                    const user = response.data.user!;

                    if (redirect) {
                        navigate(redirect);
                        return;
                    }

                    switch (user.role) {
                        case 'doctor':
                            navigate('/doctor-dashboard');
                            break;
                        case 'admin':
                            navigate('/admin-dashboard');
                            break;
                        case 'patient':
                        default:
                            navigate('/patient-dashboard');
                            break;
                    }
                }, 1500);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            // Handle specific error messages
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid email or password');
                } else if (error.response.status === 403) {
                    setError('Your account is not active. Please contact administrator.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Reset password function
    const handleForgotPassword = () => {
        if (!email) {
            setError('Please enter your email first');
            return;
        }

        // In a real app, this would call an API
        setSuccess(`Password reset link sent to ${email}`);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6"
                    >
                        <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Sign in to access your account
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                >
                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start"
                        >
                            <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 text-sm font-medium">{success}</p>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
                        >
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    {/* User Type Indicators */}
                    <div className="mb-6 grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-blue-50">
                            <User className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <span className="text-xs text-blue-700">Patients</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-green-50">
                            <Stethoscope className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <span className="text-xs text-green-700">Doctors</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-purple-50">
                            <Shield className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                            <span className="text-xs text-purple-700">Admins</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    disabled={isLoading}
                                    className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${rememberMe
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-slate-300 bg-white'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}`}
                                >
                                    {rememberMe && <Check className="h-3 w-3 text-white" />}
                                </button>
                                <span
                                    className={`ml-2 text-sm text-slate-600 ${isLoading ? 'opacity-50' : 'cursor-pointer hover:text-slate-900'}`}
                                    onClick={() => !isLoading && setRememberMe(!rememberMe)}
                                >
                                    Remember me
                                </span>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={isLoading}
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={isLoading ? {} : { scale: 1.02 }}
                            whileTap={isLoading ? {} : { scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    Don't have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center"
                            >
                                Create a free account
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500 text-center">
                            By signing in, you agree to our{' '}
                            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}