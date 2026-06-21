import React, { useState, useEffect, useRef } from 'react';
import { Message, ServiceProvider, UserState } from '../types';
import { Send, Lock, Mic, Image, CheckCheck, Clock, UserX, Play, Volume2, AlertTriangle, Download } from 'lucide-react';

interface ChatSectionProps {
  currentUser: UserState;
  provider: ServiceProvider;
  onSendMessage: (msg: Message) => void;
  chatMessages: Message[];
  onBlockUser: (targetId: string) => void;
  isUserBlocked: boolean;
  onUpgradePremium?: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  currentUser,
  provider,
  onSendMessage,
  chatMessages,
  onBlockUser,
  isUserBlocked,
  onUpgradePremium,
}) => {
  const [inputText, setInputText] = useState('');
  const [expiration, setExpiration] = useState<'off' | '1h' | '24h'>('off');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showExpirationMenu, setShowExpirationMenu] = useState(false);
  
  const isClient = currentUser.role === 'customer';
  const limitCount = isClient ? (currentUser.isClientPremium ? 20 : 3) : 999;
  const currentSent = isClient ? (currentUser.todayMessageCount ?? 0) : 0;
  const limitReached = isClient && currentSent >= limitCount;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!inputText.trim() || isUserBlocked) return;
    
    // No typing indicator or AI replies simulate since AI bot is deactivated.
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      chatId: `${provider.id}_${currentUser.id}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      encrypted: true,
      read: true
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleExportChat = () => {
    if (chatMessages.length === 0) return;
    
    const formattedDate = new Date().toLocaleString();
    const txtContent = `--------------------------------------------------
LUXE PLATFORM - CHAT TRANSCRIPT RECORD (SECURED)
--------------------------------------------------
Export Timestamp: ${formattedDate}
Current User: ${currentUser.name} (ID: ${currentUser.id}, Role: ${currentUser.role})
Chat Partner: ${provider.name} (ID: ${provider.id}, Specialty: ${provider.title})
Storage Lifespan Policy: 30 Days Client-Side Cache Enforced
--------------------------------------------------

${chatMessages.map(m => {
  const isMe = m.senderId === currentUser.id;
  const tag = isMe ? 'SENT' : 'RECEIVED';
  return `[${m.timestamp}] <${tag}> ${m.senderName}: ${m.text}`;
}).join('\n\n')}

--------------------------------------------------
End of secured encryption record export. Conforms to GDPR Art. 15.
--------------------------------------------------`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SecureChat_${provider.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      const minutes = Math.floor(recordingSeconds / 60);
      const seconds = recordingSeconds % 60;
      const durationStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      
      const voiceMsg: Message = {
        id: `msg_voice_${Date.now()}`,
        chatId: `${provider.id}_${currentUser.id}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: 'Voice Memo',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        encrypted: true,
        isVoice: true,
        voiceDuration: durationStr,
        read: true
      };
      
      onSendMessage(voiceMsg);
    } else {
      setIsRecording(true);
    }
  };

  const simulateImageSend = () => {
    const images = [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=300',
    ];
    const item = images[Math.floor(Math.random() * images.length)];

    const imgMsg: Message = {
      id: `msg_img_${Date.now()}`,
      chatId: `${provider.id}_${currentUser.id}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: item,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      encrypted: true,
      isImage: true,
      read: true
    };
    onSendMessage(imgMsg);
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-xl flex flex-col h-[550px] overflow-hidden shadow-2xl relative">
      
      {/* End-to-End Encryption Header Notice */}
      <div className="bg-primary/10 border-b border-primary/25 px-4 py-2 flex items-center justify-between text-[11px] text-primary font-mono z-10 select-none">
        <div className="flex items-center gap-1.5 font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>E2E SECURED CHAT INTERACTION</span>
        </div>
        <div className="flex items-center gap-3">
          {isClient && (
            <span className="bg-neutral-900 text-[#ffdebf] border border-[#a28a75]/30 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono">
              DAILY QUOTA: {currentSent}/{limitCount} SENT
            </span>
          )}
          {expiration !== 'off' && (
            <span className="bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Limits: {expiration}
            </span>
          )}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Profile Contact Header */}
      <div className="p-4 bg-[#100e0c] flex items-center justify-between border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={provider.avatarUrl} 
              alt={provider.name} 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-outline-variant" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#151311]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{provider.name}</h3>
            <p className="text-[11px] font-mono text-[#d6c3b4] uppercase">{provider.title}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Expiration Button Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowExpirationMenu(!showExpirationMenu)}
              className="p-2 rounded-lg bg-surface hover:bg-surface-bright text-neutral-400 hover:text-white transition-colors border border-outline-variant"
              title="Disappearing Messages"
            >
              <Clock className="w-4 h-4" />
            </button>
            {showExpirationMenu && (
              <div className="absolute right-0 top-11 w-40 bg-surface border border-outline-variant rounded-lg p-1.5 shadow-2xl z-25 text-left text-xs text-neutral-300">
                <p className="p-1.5 text-[10px] uppercase tracking-wider font-mono text-neutral-500">Auto-Delete Timer</p>
                <button 
                  onClick={() => { setExpiration('off'); setShowExpirationMenu(false); }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-background font-mono uppercase ${expiration === 'off' ? 'text-primary' : ''}`}
                >
                  Disabled
                </button>
                <button 
                  onClick={() => { setExpiration('1h'); setShowExpirationMenu(false); }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-background font-mono uppercase ${expiration === '1h' ? 'text-primary' : ''}`}
                >
                  1 Hour
                </button>
                <button 
                  onClick={() => { setExpiration('24h'); setShowExpirationMenu(false); }}
                  className={`w-full text-left p-2 rounded-lg hover:bg-background font-mono uppercase ${expiration === '24h' ? 'text-primary' : ''}`}
                >
                  24 Hours
                </button>
              </div>
            )}
          </div>

          {/* Export Chat Button */}
          {chatMessages.length > 0 && (
            <button
              onClick={handleExportChat}
              className="p-2 rounded-lg bg-surface hover:bg-surface-bright text-primary hover:scale-105 transition-all border border-outline-variant"
              title="Export Private Chat Transcript"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Block User Control */}
          <button 
            onClick={() => onBlockUser(provider.id)}
            className={`p-2 rounded-lg lg:px-3 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors border border-outline-variant ${
              isUserBlocked ? 'bg-red-500/20 text-red-350' : 'bg-surface text-neutral-400 hover:bg-surface-bright hover:text-red-400'
            }`}
            title={isUserBlocked ? 'Unblock Provider' : 'Block Private Circle'}
          >
            <UserX className="w-4 h-4" />
            <span className="hidden md:inline">{isUserBlocked ? 'Blocked' : 'Block'}</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-background/20">
        
        {chatMessages.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-2">
            <div className="p-4 rounded-full bg-surface border border-outline-variant w-14 h-14 flex items-center justify-center mx-auto text-primary shadow-[0_0_8px_rgba(255,222,191,0.1)]">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-neutral-300">Start Your Secured Communication</p>
            <p className="text-[11px] text-[#9e8e80] max-w-sm mx-auto leading-relaxed uppercase font-mono">
              Verify itineraries, ask personal credentials or align details safely. Platform rules strict escrow compliance. Let&apos;s initiate beautifully!
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 shadow-md flex flex-col relative ${
                  isMe 
                    ? 'bg-primary text-[#492900] font-semibold rounded-tr-none shadow-[0_0_12px_rgba(255,222,191,0.15)] shadow-amber-900/10' 
                    : 'bg-surface-container-high text-on-surface border border-outline-variant rounded-tl-none'
                }`}>
                  
                  {/* Encrypted tag watermark */}
                  {msg.encrypted && (
                    <span className={`text-[8px] uppercase tracking-wider font-mono absolute -top-4 right-1 ${
                      isMe ? 'text-primary/80' : 'text-neutral-500'
                    }`}>
                      🔐 e2e-encrypted
                    </span>
                  )}

                  {/* Body Content */}
                  {msg.isVoice ? (
                    <div className="flex items-center gap-2 py-1 select-none">
                      <button className={`p-1.5 rounded-full ${isMe ? 'bg-primary-dark text-white' : 'bg-surface text-primary'} animate-pulse`}>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <div className="flex items-center gap-0.5 whitespace-nowrap">
                        <Volume2 className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-mono font-bold">Voice note ({msg.voiceDuration})</span>
                      </div>
                    </div>
                  ) : msg.isImage ? (
                    <div className="rounded-lg overflow-hidden border border-outline-variant max-w-xs mt-1 mb-1 bg-black/40">
                      <img src={msg.text} alt="Shared Attachment" className="w-full h-32 object-cover" />
                      <span className="text-[9px] block p-1 opacity-75 font-mono">Attachment file</span>
                    </div>
                  ) : (
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  )}

                  {/* Footer Stats inside bubble */}
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-65 text-[9px] self-end font-mono">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-center gap-2">
            <div className="bg-surface border border-outline-variant text-[#d6c3b4] rounded-lg rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5 font-mono">
              <span>{provider.name} is typing</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray Area */}
      <div className="p-3 bg-[#100e0c] border-t border-outline-variant">
        {limitReached ? (
          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-amber-300">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">DAILY SECURED MESSAGE LIMIT REACHED</span>
            </div>
            {!currentUser.isClientPremium ? (
              <div className="space-y-2.5">
                <p className="text-[11px] text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Basic clients are entitled to 3 private messages per day. Upgrade to Premium Membership to send 20 messages daily & unlock direct contacts!
                </p>
                <button
                  onClick={onUpgradePremium}
                  className="px-4 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow font-mono uppercase tracking-wider"
                >
                  🚀 Upgrade to Premium ($25/mo)
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-sans">
                You have reached your Premium tier limit of 20 secure messages per day. Re-boost counters tomorrow!
              </p>
            )}
          </div>
        ) : isUserBlocked ? (
          <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-lg text-center text-xs text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-mono uppercase text-[10px] tracking-wider">Secured chat is paused. Review active filters.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 relative">
            
            {/* Attachment Actions */}
            <button 
              onClick={simulateImageSend}
              className="p-2.5 rounded-lg bg-surface border border-outline-variant text-neutral-400 hover:text-white transition-colors hover:bg-surface-bright hover:scale-105"
              title="Send Photo"
            >
              <Image className="w-4 h-4" />
            </button>

            {/* Voice Memo Action */}
            <button 
              onClick={handleSendVoice}
              className={`p-2.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5 border border-outline-variant ${
                isRecording 
                  ? 'bg-rose-500 border-rose-600 text-white animate-pulse' 
                  : 'bg-surface text-neutral-400 hover:text-white hover:bg-surface-bright'
              }`}
              title="Record Voice"
            >
              <Mic className="w-4 h-4" />
              {isRecording && (
                <span className="text-[10px] font-mono font-bold mr-1">{recordingSeconds}s</span>
              )}
            </button>

            {/* Input Element */}
            <input 
              type="text" 
              placeholder={isRecording ? 'Recording voice broadcast memo...' : 'Type e2e encrypted message...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              disabled={isRecording}
              className="bg-surface border border-outline-variant px-4 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 flex-grow outline-none focus:border-primary"
            />

            {/* Send Trigger */}
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isRecording}
              className="p-2.5 rounded-lg bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] transition-all font-bold hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 glow-primary-sm"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>
        )}
      </div>

    </div>
  );
};
export default ChatSection;
