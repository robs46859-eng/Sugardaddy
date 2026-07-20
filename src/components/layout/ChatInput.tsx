'use client';

import { useState } from 'react';
import { Mic, Send, StopCircle } from 'lucide-react';

export default function ChatInput({ onSendMessage }: { onSendMessage: (msg: string) => void }) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-[42%] md:bottom-[37%] left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-6 transition-all">
      <div className="relative flex items-center bg-white/40 dark:bg-black/50 backdrop-blur-xl border border-white/60 dark:border-white/20 p-2 rounded-3xl shadow-2xl">
        <button 
          onClick={() => setIsRecording(!isRecording)}
          className={`p-3 rounded-full transition-all duration-300 ${isRecording ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-white/80 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-white'}`}
        >
          {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tap microphone or type to speak..." 
          className="flex-1 bg-transparent border-none focus:outline-none px-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-lg font-medium"
        />
        
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:opacity-50 text-white rounded-full transition-colors"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>
      
      {/* Captions area could go here, currently empty */}
      <div className="mt-4 text-center">
        {isRecording && (
          <span className="text-xl font-medium text-slate-800 dark:text-white drop-shadow-md bg-white/20 dark:bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
            Listening...
          </span>
        )}
      </div>
    </div>
  );
}
