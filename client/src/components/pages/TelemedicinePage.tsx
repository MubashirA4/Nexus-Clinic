import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/auth';
import { apiURL } from '../../../utils';
import axiosLib from 'axios';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Phone,
  MessageSquare,
  FileText,
  Activity,
  Heart,
  Users
} from 'lucide-react';

export function TelemedicinePage() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();

  // Meeting state
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<any | null>(null);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('appointment');
    if (id) setAppointmentId(id);
  }, []);

  useEffect(() => {
    let timer: any;
    if (appointmentId) {
      setMeetingLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      axiosLib.get(`${apiURL}/api/appointments/${appointmentId}/meeting-details`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setMeeting(res.data?.data || null);
          setMeetingError(null);
        })
        .catch(err => {
          // if 404 means no meeting scheduled
          if (err.response && err.response.status === 404) setMeeting(null);
          else setMeetingError('Failed to load meeting details');
          console.warn(err);
        })
        .finally(() => setMeetingLoading(false));

      timer = setInterval(() => {
        if (!meeting) return setCountdown(null);
        const start = new Date(meeting.startTime).getTime();
        const end = meeting.endTime ? new Date(meeting.endTime).getTime() : start + 30 * 60 * 1000;
        const now = Date.now();
        if (now < start - 10 * 60 * 1000) {
          // more than 10 min before
          const diff = start - 10 * 60 * 1000 - now;
          setCountdown(`Join available in ${formatMs(diff)}`);
        } else if (now >= start - 10 * 60 * 1000 && now <= end) {
          setCountdown('Join now');
        } else if (now > end) {
          setCountdown('Meeting ended');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [appointmentId, meeting]);

  function formatMs(ms: number) {
    if (ms <= 0) return '00:00';
    const total = Math.floor(ms / 1000);
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  async function handleCreateMeeting() {
    if (!appointmentId) return alert('No appointment selected');
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    try {
      setMeetingLoading(true);
      const res = await axiosLib.post(`${apiURL}/api/appointments/${appointmentId}/create-meeting`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMeeting(res.data.data);
      // notify updated appointments list
      window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
    } catch (err) {
      console.error('Error creating meeting', err);
      alert('Could not create meeting');
    } finally {
      setMeetingLoading(false);
    }
  }

  useEffect(() => {
    const handler = () => {
      if (!appointmentId) return;
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      axiosLib.get(`${apiURL}/api/appointments/${appointmentId}/meeting-details`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setMeeting(res.data.data))
        .catch(() => setMeeting(null));
    };

    window.addEventListener('appointmentsUpdated', handler as EventListener);
    return () => window.removeEventListener('appointmentsUpdated', handler as EventListener);
  }, [appointmentId]);
  function handleJoin() {
    if (!meeting) return;
    window.open(meeting.meetingLink || meeting.join_url, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Doctor Video Feed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-slate-700 rounded-3xl overflow-hidden shadow-2xl aspect-video"
            >
              {/* Simulated Video Feed */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Video className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-white mb-2">Dr. Sarah Johnson</h3>
                  <p className="text-white/60">Connected - 00:15:32</p>

                  {/* Meeting top controls */}
                  <div className="mt-4 flex items-center justify-center space-x-3">
                    {meetingLoading ? (
                      <div className="text-sm text-white/60">Checking meeting...</div>
                    ) : meeting ? (
                      <>
                        <div className="text-sm text-white/60">{meeting.status || 'Scheduled'}</div>
                        <div className="px-3 py-1 rounded-lg bg-slate-800 text-white text-sm">{countdown}</div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
                          onClick={handleJoin}
                        >
                          Join Meeting
                        </motion.button>
                      </>
                    ) : (
                      (user?.role === 'patient' || user?.role === 'doctor') ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-slate-700 text-white rounded-lg"
                          onClick={handleCreateMeeting}
                        >
                          Create Meeting
                        </motion.button>
                      ) : (
                        <div className="text-sm text-white/60">No meeting scheduled</div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-green-500/90 backdrop-blur-sm rounded-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <span className="text-white text-sm">Live</span>
              </motion.div>

              {/* Recording Indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-6 right-6 flex items-center space-x-2 px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <span className="text-white text-sm">Recording</span>
                </motion.div>
              )}

              {/* Self View */}
              <motion.div
                drag
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                className="absolute bottom-6 right-6 w-48 h-36 bg-slate-600 rounded-xl overflow-hidden shadow-xl cursor-move"
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-white/50 mx-auto mb-2" />
                    <p className="text-white/50 text-sm">You</p>
                  </div>
                </div>
              </motion.div>

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`p-4 rounded-full ${isAudioOn ? 'bg-slate-700' : 'bg-red-500'
                      } hover:bg-opacity-90 transition-all`}
                  >
                    {isAudioOn ? (
                      <Mic className="w-6 h-6 text-white" />
                    ) : (
                      <MicOff className="w-6 h-6 text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-4 rounded-full ${isVideoOn ? 'bg-slate-700' : 'bg-red-500'
                      } hover:bg-opacity-90 transition-all`}
                  >
                    {isVideoOn ? (
                      <Video className="w-6 h-6 text-white" />
                    ) : (
                      <VideoOff className="w-6 h-6 text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-full bg-slate-700 hover:bg-opacity-90 transition-all"
                  >
                    <Monitor className="w-6 h-6 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-700'
                      } hover:bg-opacity-90 transition-all`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 135 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Chat Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-5 h-5 text-white" />
                <h4 className="text-white">Consultation Notes</h4>
              </div>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                <div className="bg-blue-600/20 text-white p-3 rounded-lg">
                  <p className="text-sm">Dr. Johnson: How are you feeling today?</p>
                  <span className="text-xs text-white/60">10:30 AM</span>
                </div>
                <div className="bg-slate-600 text-white p-3 rounded-lg ml-8">
                  <p className="text-sm">You: Much better, thank you!</p>
                  <span className="text-xs text-white/60">10:31 AM</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-xl border-2 border-transparent focus:border-blue-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                >
                  Send
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-700 rounded-2xl p-6 shadow-xl"
            >
              <h4 className="text-white mb-4">Patient Information</h4>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white/60 mb-1">Name</div>
                  <div className="text-white">Sarah Anderson</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1">Age</div>
                  <div className="text-white">34 years</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1">Reason for Visit</div>
                  <div className="text-white">Follow-up Consultation</div>
                </div>
              </div>
            </motion.div>

            {/* Vital Signs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-5 h-5 text-white" />
                <h4 className="text-white">Vital Signs</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-white text-sm">Heart Rate</span>
                  </div>
                  <span className="text-white medical-number">72 bpm</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm">Blood Pressure</span>
                  </div>
                  <span className="text-white medical-number">120/80</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="text-white text-sm">Temperature</span>
                  </div>
                  <span className="text-white medical-number">98.6°F</span>
                </div>
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
              >
                <span className="text-green-400 text-sm">✓ All vitals normal</span>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-700 rounded-2xl p-6 shadow-xl"
            >
              <h4 className="text-white mb-4">Quick Actions</h4>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>View Medical History</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>Write Prescription</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>Request Lab Tests</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>Send Report</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
