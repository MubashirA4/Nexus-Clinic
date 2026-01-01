import React, { useEffect, useRef, useState } from 'react';
import { analyzeSymptoms, getDoctors, bookAppointment } from '../../../chatbot/chatService';
import DoctorCard from './DoctorCard';
import { Send, User, Bot, X, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import chatbotConfig from '../../../chatbot/chatbot.json';
import { useAuth } from '../../auth/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for a message
type Message = {
  from: 'user' | 'bot';
  text: string;
};

/**
 * Chat Header Component (Glassmorphism + Primary Gradient)
 */
const ChatHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <header
    className="flex items-center justify-between p-5 text-white shadow-lg relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
  >
    <div className="flex items-center space-x-3 z-10">
      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
        <Bot size={24} className="text-white" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-white font-poppins">Assistant</h1>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <p className="text-xs font-medium opacity-90 text-white font-inter">Nexus Clinic Online</p>
        </div>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white border border-white/10 group active:scale-90"
    >
      <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
    </button>
  </header>
);

/**
 * Message Bubble Component (Glassmorphic Bot Bubbles + Gradient User Bubbles)
 */
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.from === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5 px-4`}
    >
      <div className={`relative max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${isUser
          ? 'text-white rounded-tr-none'
          : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 rounded-tl-none'
        }`}
        style={isUser ? { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' } : {}}
      >
        {!isUser && (
          <div className="flex items-center space-x-1.5 mb-1.5 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
            <Bot size={12} />
            <span>Nexus Assistant</span>
          </div>
        )}
        <p className="text-[14px] leading-relaxed font-inter font-medium whitespace-pre-wrap">{message.text}</p>
        <span className={`text-[9px] mt-1.5 block opacity-60 text-right ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * Chat Input Component (Minimal Refined Theme)
 */
const ChatInput: React.FC<{ input: string, setInput: (s: string) => void, sendMessage: (s: string) => Promise<void> }> = ({ input, setInput, sendMessage }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/50 backdrop-blur-md border-t border-slate-100 flex items-center space-x-3">
      <div className="flex-grow relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="w-full px-5 py-3.5 pr-20 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm font-medium shadow-sm group-hover:shadow-md"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button type="button" className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
            <Smile size={20} />
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none active:scale-95 flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
        disabled={!input.trim()}
      >
        <Send size={22} className={input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
      </button>
    </form>
  );
};


// --- Main Chatbot Component ---

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Authentication
  const { isAuthenticated, user } = useAuth();

  // Flow State
  const [currentFlowId, setCurrentFlowId] = useState('main');
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const config = chatbotConfig.chatbot_config;

  const parseTemplate = (template: string, data: Record<string, any>) => {
    return template.replace(/{(\w+)}/g, (_, key) => {
      return data[key] || `{${key}}`;
    });
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { from: 'bot', text }]);
  };

  useEffect(() => {
    localStorage.removeItem('chat_history');
    const welcomeFlow = config.flows.main;
    addBotMessage(welcomeFlow.message);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);


  const handleFlowTransition = (flowId: string, additionalData?: Record<string, any>) => {
    const flow = (config.flows as any)[flowId];
    if (!flow) return;

    let updatedData = { ...sessionData };
    if (additionalData) {
      updatedData = { ...updatedData, ...additionalData };
    }
    if (flow.save_to && flow.save_value) {
      updatedData = { ...updatedData, [flow.save_to]: flow.save_value };
    }

    setSessionData(updatedData);
    setCurrentFlowId(flowId);
    setLoading(true);

    setTimeout(async () => {
      const message = flow.message_template ? parseTemplate(flow.message_template, updatedData) : flow.message;
      addBotMessage(message);
      setLoading(false);

      if (flow.type === 'doctor_list') {
        getDoctors().then(docs => {
          const doctorList = docs.doctors || docs.data || [];
          const isSuccess = docs.success !== false;

          if (isSuccess && Array.isArray(doctorList) && doctorList.length > 0) {
            const specialty = flow.specialty.toLowerCase();
            const filtered = doctorList.filter((d: any) => {
              return d.specialization?.toLowerCase().includes(specialty);
            });

            if (filtered.length === 0) {
              addBotMessage(`Sorry, we don't have any ${flow.specialty} specialists available at the moment.`);
            } else {
              setRecommendations([{ disease: flow.specialty, doctors: filtered }]);
            }
          } else {
            addBotMessage(`Sorry, I couldn't fetch the doctor list at the moment.`);
          }
        }).catch(err => {
          addBotMessage(`Sorry, there was an error connecting to the server.`);
        });
      }

      if (flowId === 'appointment_confirmation') {
        const payload = {
          doctorId: updatedData.doctorId,
          date: updatedData.appointment_date === 'Today' ? new Date().toISOString() :
            updatedData.appointment_date === 'Tomorrow' ? new Date(Date.now() + 86400000).toISOString() :
              updatedData.appointment_date,
          time: updatedData.appointment_time,
          patientName: updatedData.patient_name,
          patientEmail: updatedData.patient_email || 'guest@example.com',
          patientPhone: updatedData.patient_phone,
          reason: `Chatbot booking. Symptoms: ${updatedData.user_input || 'N/A'}`
        };
        try {
          await bookAppointment(payload);
        } catch (err) {
          console.error('Bot booking error:', err);
        }
      }
    }, 800);
  };

  const handleOptionSelect = (option: any) => {
    setMessages(prev => [...prev, { from: 'user', text: option.label }]);

    const dataToSave: Record<string, any> = {};
    if (option.save_to && option.value) {
      dataToSave[option.save_to] = option.value;
    } else if (option.value) {
      if (currentFlowId.includes('time')) dataToSave['appointment_time'] = option.value;
      if (currentFlowId.includes('doctor')) dataToSave['selected_doctor'] = option.label;
    }

    handleFlowTransition(option.next_flow, dataToSave);
  };

  async function sendMessage(text: string) {
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');

    const currentFlow = (config.flows as any)[currentFlowId];

    if (currentFlow?.type === 'text_input') {
      const dataToSave: Record<string, any> = {};
      if (currentFlow.save_to) {
        dataToSave[currentFlow.save_to] = text;
      }

      if (currentFlow.next_flow) {
        handleFlowTransition(currentFlow.next_flow, dataToSave);
      }
      return;
    }

    const lower = text.toLowerCase();
    if (lower.includes('doctor')) {
      handleFlowTransition('find_doctor_specialty');
    } else if (lower.includes('appointment') || lower.includes('book')) {
      handleFlowTransition('appointment_name');
    } else if (lower.includes('contact')) {
      handleFlowTransition('contact_us');
    } else if (lower.includes('about')) {
      handleFlowTransition('about_us');
    } else if (lower.includes('help')) {
      handleFlowTransition('need_help');
    } else {
      setLoading(true);
      setTimeout(() => {
        addBotMessage("I'm here to help! Choose an option below or type what you need.");
        setLoading(false);
      }, 700);
    }
  }


  async function handleBook(doctorId: string, doctorName: string) {
    const updatedData: Record<string, any> = {
      selected_doctor: doctorName,
      doctorId
    };

    if (isAuthenticated && user) {
      updatedData.patient_name = user.name;
      updatedData.patient_email = user.email;
      updatedData.patient_phone = user.phone || '';
      setSessionData(prev => ({ ...prev, ...updatedData }));
      addBotMessage(`Excellent choice! I've noted your selection for Dr. ${doctorName}. Let's schedule your appointment.`);
      handleFlowTransition('appointment_date_selection');
    } else {
      setSessionData(prev => ({ ...prev, ...updatedData }));
      addBotMessage(`Excellent choice! I've noted your selection for Dr. ${doctorName}.`);
      handleFlowTransition('appointment_name');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
      className="fixed right-6 flex flex-col rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-white/40 glass-morph"
      style={{
        zIndex: 99999,
        bottom: '7rem',
        width: '400px',
        height: '650px',
        maxHeight: '80vh',
        maxWidth: '90vw',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <ChatHeader onClose={onClose} />

      <div
        className="flex-grow p-0 overflow-y-auto space-y-2 bg-transparent custom-scrollbar"
        ref={scrollRef}
      >
        <div className="pt-6">
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))}
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-2 flex justify-start"
          >
            <div className="bg-white/80 backdrop-blur-sm text-slate-400 px-4 py-2 rounded-2xl text-xs font-semibold flex items-center space-x-2 border border-slate-100 shadow-sm">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span>Assistant is typing</span>
            </div>
          </motion.div>
        )}

        {/* Dynamic Options */}
        <div className="px-6 py-4 flex flex-wrap gap-2.5 justify-start">
          <AnimatePresence>
            {(config.flows as any)[currentFlowId]?.options?.map((opt: any) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOptionSelect(opt)}
                className="px-5 py-2.5 bg-white border border-blue-100 text-blue-600 rounded-2xl text-[13px] font-bold hover:border-blue-400 transition-all shadow-sm flex items-center gap-2 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-150 transition-transform"></div>
                {opt.label}
              </motion.button>
            ))}
          </AnimatePresence>

          {currentFlowId !== 'main' && (
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => handleFlowTransition('main')}
              className="px-4 py-2 text-slate-400 hover:text-slate-600 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back to Start
            </motion.button>
          )}
        </div>

        {/* Recommendations */}
        <div className="px-6 pb-6 space-y-4">
          {recommendations.map((r: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] mb-4">Available Specialists</div>
              <div className="space-y-3">
                {(r.doctors || []).map((doc: any) => (
                  <div key={doc._id} className="p-1 rounded-2xl hover:bg-white transition-colors">
                    <DoctorCard doctor={doc} onBook={() => handleBook(doc._id, doc.name)} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </motion.div>
  );
}
