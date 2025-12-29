import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export const VerifyAppointment = () => {
          const [searchParams] = useSearchParams();
          const token = searchParams.get('token');
          const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
          const [message, setMessage] = useState('Verifying your appointment...');
          const navigate = useNavigate();

          useEffect(() => {
                    const verify = async () => {
                              if (!token) {
                                        setStatus('error');
                                        setMessage('Invalid verification link.');
                                        return;
                              }

                              try {
                                        const response = await axios.get(`http://localhost:5000/api/appointments/verify/${token}`);
                                        if (response.data.success) {
                                                  setStatus('success');
                                                  setMessage('Your appointment has been successfully verified! You can now view it in your dashboard.');
                                        } else {
                                                  setStatus('error');
                                                  setMessage(response.data.message || 'Verification failed.');
                                        }
                              } catch (error: any) {
                                        setStatus('error');
                                        setMessage(error.response?.data?.message || 'Invalid or expired verification link.');
                              }
                    };

                    verify();
          }, [token]);

          return (
                    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                              <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
                              >
                                        {status === 'loading' && (
                                                  <div className="space-y-4">
                                                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                                            <h2 className="text-2xl font-bold text-slate-900">Verifying...</h2>
                                                            <p className="text-slate-600">{message}</p>
                                                  </div>
                                        )}

                                        {status === 'success' && (
                                                  <div className="space-y-6">
                                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                                                            </div>
                                                            <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
                                                            <p className="text-slate-600 leading-relaxed">
                                                                      {message}
                                                            </p>
                                                            <button
                                                                      onClick={() => navigate('/login')}
                                                                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                      Go to Login
                                                            </button>
                                                  </div>
                                        )}

                                        {status === 'error' && (
                                                  <div className="space-y-6">
                                                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                                                      <XCircle className="w-12 h-12 text-red-500" />
                                                            </div>
                                                            <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
                                                            <p className="text-slate-600 leading-relaxed">
                                                                      {message}
                                                            </p>
                                                            <button
                                                                      onClick={() => navigate('/')}
                                                                      className="w-full border-2 border-slate-200 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                      <ArrowLeft className="w-5 h-5" />
                                                                      Return Home
                                                            </button>
                                                  </div>
                                        )}
                              </motion.div>
                    </div>
          );
};
