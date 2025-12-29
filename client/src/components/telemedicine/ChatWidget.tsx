import React, { useState, useCallback, useRef } from 'react';
import ChatWindow from './chat/ChatWindow';

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
    <div>
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      {/* Floating toggle button */}
      <button
        onClick={handleToggle}
        aria-label="Open Chat"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-400 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        style={{ zIndex: 100000 }}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
