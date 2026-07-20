'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';
import DashboardContainer from '../dashboard/DashboardContainer';

export default function ChatWrapper() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);

  const handleSendMessage = async (msg: string) => {
    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    
    // Here we would call our Next.js API route (/api/chat) to talk to Gemini
    // For now, we simulate a response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text: "I'm looking into that for you. Let me check with my resources." }]);
    }, 1000);
  };

  return (
    <>
      <ChatInput onSendMessage={handleSendMessage} />
      
      <DashboardContainer>
        {/* Placeholder for dashboard content */}
        <div className="space-y-4 pt-4 max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <h3 className="text-xl font-medium mb-2">Good morning!</h3>
              <p>How can I help you today?</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardContainer>
    </>
  );
}
