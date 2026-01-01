import React, { useState, useCallback, useRef } from 'react';
import ChatWindow from './chat/ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const toggleInProgress = useRef(false);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent rapid toggling
    if (toggleInProgress.current) {
      return;
    }

    toggleInProgress.current = true;
    setOpen(prev => !prev);

    // Reset toggle lock after a short delay
    setTimeout(() => {
      toggleInProgress.current = false;
    }, 300);
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <ChatWindow onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={handleToggle}
        aria-label="Open Chat"
        initial={{ scale: 0, opacity: 1, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center transition-all overflow-hidden"
        style={{
          zIndex: 100000,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X size={28} /> : <MessageCircle size={28} />}
        </motion.div>
      </motion.button>
    </>
  );
}
