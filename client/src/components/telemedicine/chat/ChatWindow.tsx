import React, { useEffect, useRef, useState } from 'react';
import { analyzeSymptoms, getDoctors, bookAppointment } from '../../../chatbot/chatService';
import DoctorCard from './DoctorCard';
import { Send, User, Bot, X } from 'lucide-react';
import chatbotConfig from '../../../chatbot/chatbot.json';
import { useAuth } from '../../auth/auth';

// Define the type for a message (adjusting to your existing data structure)
type Message = {
  from: 'user' | 'bot'; // Corresponds to 'role' in the previous example
  text: string; // Corresponds to 'content'
};

const PRIMARY_BLUE = 'blue-600';     // Main accent blue
const BG_LIGHT = 'white';          // Main background color
const BOT_BUBBLE_COLOR = 'slate-100'; // Light gray for bot messages
const TEXT_COLOR = 'slate-800';      // Dark text color


/**
 * Chat Header Component (Bright Blue Gradient Theme)
 */
const ChatHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <header className={`flex items-center justify-between p-4 bg-blue-600 text-white shadow-md`}>
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center border border-white">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Assistant</h1>
          <p className="text-xs opacity-80">Nexus Clinic</p>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-3">

      <button
        onClick={onClose}
        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white">
        <X size={18} />
      </button>
    </div>
  </header>
);

/**
 * Message Bubble Component (Blue/White Theme)
 */
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.from === 'user';
  const bubbleClasses = isUser
    ? `text-white bg-blue-600 rounded-br-none ml-auto`
    : `bg-${BOT_BUBBLE_COLOR} text-${TEXT_COLOR} rounded-tl-none mr-auto border border-slate-200`;

  // Removed the icon circles next to the bubbles for a cleaner look that matches the image's message body
  const content = isUser ? message.text : (
    <>
      {/* Added Bot icon before content for Bot messages, similar to the "Jessica Smith" image */}
      <div className="flex items-start mb-1 text-slate-500 text-xs">
        <Bot size={14} className="mr-1 mt-0.5" />
        Assistant
      </div>
      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
    </>
  );

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`p-3 rounded-xl shadow-md max-w-[80%] ${bubbleClasses}`}>
        {isUser ? <p className="whitespace-pre-wrap text-sm">{message.text}</p> : content}
      </div>
    </div>
  );
};

/**
 * Chat Input Component (Blue/White Theme)
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
    <form onSubmit={handleSubmit} className={`p-3 border-t border-slate-200 bg-${BG_LIGHT} flex items-center`}>
      {/* Left Utility Icons (Bot, Clip, Smile) */}
      <div className="flex space-x-3 text-slate-400 mr-2">
        <Bot size={22} className="hover:text-slate-600 transition-colors cursor-pointer" />
        <button type="button"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-slate-600 transition-colors cursor-pointer"><path d="M15 7h.01"></path><path d="M10 12h.01"></path><path d="M10 17h.01"></path><path d="M9 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path></svg></button>
        <button type="button"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-slate-600 transition-colors cursor-pointer"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></button>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your message..."
        className={`flex-grow p-3 rounded-full bg-slate-50  text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all border border-slate-200 text-sm`}
      />

      {/* Send Button (Large, Circular, Blue Gradient) */}
      <button
        type="submit"
        className={`p-3 w-12 h-12 ml-2 bg-blue-300 text-white bg-blue-600 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center flex-shrink-0`}
        disabled={!input.trim()}
      >
        <Send size={24} />
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

  // --- State and Logic (UNCHANGED) ---

  useEffect(() => {
    // Clear any existing chat history
    localStorage.removeItem('chat_history');

    // Welcome message from JSON
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
          console.log('🔍 API Response:', docs);

          // Backend returns { success: true, doctors: [...] }
          const doctorList = docs.doctors || docs.data || [];
          const isSuccess = docs.success !== false; // Assume success if not explicitly false

          if (isSuccess && Array.isArray(doctorList) && doctorList.length > 0) {
            const specialty = flow.specialty.toLowerCase();
            console.log('🎯 Looking for specialty:', specialty);
            console.log('📋 All doctors:', doctorList);

            const filtered = doctorList.filter((d: any) => {
              console.log(`👨‍⚕️ Doctor: ${d.name}, Specialization: "${d.specialization}"`);
              return d.specialization?.toLowerCase().includes(specialty);
            });

            console.log('✅ Filtered doctors:', filtered);

            if (filtered.length === 0) {
              addBotMessage(`Sorry, we don't have any ${flow.specialty} specialists available at the moment. Please try another specialty or contact us directly.`);
            } else {
              setRecommendations([{ disease: flow.specialty, doctors: filtered }]);
            }
          } else {
            console.error('❌ API Error or no doctors:', docs);
            addBotMessage(`Sorry, I couldn't fetch the doctor list at the moment. Please try again later.`);
          }
        }).catch(err => {
          console.error('❌ Network Error:', err);
          addBotMessage(`Sorry, there was an error connecting to the server. Please try again later.`);
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
    }, 600);
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

    // Heuristics for non-input flows
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
    // Save the doctor selection
    const updatedData: Record<string, any> = {
      selected_doctor: doctorName,
      doctorId
    };

    // Check if user is authenticated
    if (isAuthenticated && user) {
      // Pre-populate user data for authenticated users
      updatedData.patient_name = user.name;
      updatedData.patient_email = user.email;
      updatedData.patient_phone = user.phone || '';

      setSessionData(prev => ({ ...prev, ...updatedData }));

      addBotMessage(`Excellent choice! I've noted your selection for Dr. ${doctorName}. Let's schedule your appointment.`);

      // Skip to date selection for authenticated users
      handleFlowTransition('appointment_date_selection');
    } else {
      // Guest user - go through full flow
      setSessionData(prev => ({ ...prev, ...updatedData }));

      addBotMessage(`Excellent choice! I've noted your selection for Dr. ${doctorName}.`);

      // Go to appointment_name for guest users
      handleFlowTransition('appointment_name');
    }
  }

  // --- UI START ---

  return (
    <div
      className={`fixed right-6 flex flex-col border border-slate-300 rounded-xl shadow-2xl overflow-hidden bg-${BG_LIGHT}`}
      style={{
        zIndex: 99999,
        bottom: '6rem', // Positioned above the chat button
        width: '40vw', // 40% of viewport width
        height: '60vh', // 60% of viewport height
        minWidth: '320px', // Minimum width for smaller screens
        maxWidth: '400px' // Maximum width for very large screens
      }}
    >

      {/* 1. Header */}
      <ChatHeader onClose={onClose} />

      {/* 2. Message Area */}
      <div
        className={`flex-grow p-4 overflow-y-auto space-y-4 bg-white custom-scrollbar text-${TEXT_COLOR}`}
        ref={scrollRef}
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}

        {loading && (
          <div className="my-2 flex justify-start">
            <div className="bg-slate-100 text-slate-800 px-3 py-2 rounded-lg text-sm">Assistant is typing...</div>
          </div>
        )}

        {/* Dynamic Options from Flow */}
        <div className="mt-6 flex flex-wrap gap-2 justify-start pb-4">
          {(config.flows as any)[currentFlowId]?.options?.map((opt: any) => (
            <button
              key={opt.id}
              onClick={() => handleOptionSelect(opt)}
              className={`px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm`}
            >
              {opt.label}
            </button>
          ))}

          {currentFlowId !== 'main' && (
            <button
              onClick={() => handleFlowTransition('main')}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-full text-sm hover:bg-slate-50"
            >
              Back to Start
            </button>
          )}
        </div>



        {/* Recommendations */}
        <div className="mt-3 space-y-3">
          {recommendations.map((r: any, idx: number) => (
            <div key={idx} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className={`text-sm font-semibold text-${TEXT_COLOR}`}>Doctors for {r.disease}</div>
              <div className="mt-2 space-y-2">
                {(r.doctors || []).map((doc: any) => (
                  <div key={doc._id} className="p-2 bg-slate-100/50 rounded-lg">
                    <DoctorCard doctor={doc} onBook={() => handleBook(doc._id, doc.name)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* 3. Input */}
      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
}