'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import DashboardContainer from '../dashboard/DashboardContainer';

export default function ChatWrapper() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // We constantly dispatch the amplitude so the 3D model can pick it up
    let animationFrameId: number;
    const updateAmplitude = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0-255 to 0-1
        const amplitude = Math.min(average / 100, 1.0); 

        // Dispatch a custom event that Model.tsx will listen to
        window.dispatchEvent(new CustomEvent('avatar-amplitude', { detail: { amplitude } }));
      }
      animationFrameId = requestAnimationFrame(updateAmplitude);
    };

    updateAmplitude();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const playAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
    }

    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      source.start(0);
    } catch (e) {
      console.error("Audio decoding failed", e);
    }
  };

  const handleSendMessage = async (msg: string) => {
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    
    try {
      // 1. In a real app we'd call /api/chat here to get the text response.
      // For this demo, we'll just simulate the AI text response.
      const aiResponseText = "Of course, dear. Let me look into that for you.";
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);

      // 2. Fetch TTS
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiResponseText })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          await playAudio(data.audioBase64);
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };

  return (
    <>
      <ChatInput onSendMessage={handleSendMessage} />
      
      <DashboardContainer>
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
