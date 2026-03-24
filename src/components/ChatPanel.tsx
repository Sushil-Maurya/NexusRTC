import React, { useState, useRef, useEffect } from 'react';
import { useCallContext } from '../contexts/CallContext';
import { useWebRTC } from '../hooks/useWebRTC';
import { Send, Paperclip, FileText, Download, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { messages, files, isChatOpen, setIsChatOpen } = useCallContext();
  const { sendMessage, sendFile } = useWebRTC();
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, files, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      sendFile(e.target.files[0]);
    }
  };

  return (
    <div className={`fixed bottom-0 right-4 sm:right-8 w-[340px] z-50 flex flex-col bg-white/95 dark:bg-[#12121a]/95 backdrop-blur-3xl border border-b-0 border-gray-200 dark:border-gray-800 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isChatOpen ? 'h-[500px] max-h-[80vh]' : 'h-14 cursor-pointer hover:bg-white dark:hover:bg-gray-900'}`}>
      
      {/* Header - click to toggle */}
      <div 
        className="h-14 px-5 border-b border-gray-100 dark:border-gray-800/80 flex shrink-0 items-center justify-between rounded-t-2xl"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageSquare size={20} className="text-indigo-600 dark:text-indigo-400" />
            {messages.length > 0 && !isChatOpen && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#12121a]"></span>
            )}
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-[15px]">
            Messaging
          </h2>
        </div>
        <div className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
          {isChatOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>
      </div>

      {isChatOpen && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
            {messages.length === 0 && files.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                  <MessageSquare size={28} />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No messages yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Start a conversation with your peers.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 mx-1 font-medium">{msg.sender}</span>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-[14px] leading-relaxed shadow-sm ${
                  msg.isLocal 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {files.map((f) => (
              <div key={f.id} className={`flex flex-col ${f.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                 <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 mx-1 font-medium">{f.sender}</span>
                 <a 
                   href={f.data} 
                   download={f.name}
                   className={`flex items-center gap-3 p-3 rounded-2xl max-w-[90%] shadow-sm transition-transform hover:-translate-y-0.5 ${
                     f.sender === 'Me'
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200 rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                   }`}
                 >
                   <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                     <FileText size={20} />
                   </div>
                   <div className="flex-1 min-w-0 pr-2">
                     <p className="text-sm font-semibold truncate">{f.name}</p>
                     <p className="text-xs opacity-75 mt-0.5">{(f.size / 1024).toFixed(1)} KB • {f.type.split('/')[1] || 'File'}</p>
                   </div>
                   <div className="shrink-0 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                     <Download size={16} className="opacity-70" />
                   </div>
                 </a>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#12121a]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0"
                aria-label="Attach file"
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-800/80 border border-transparent dark:border-gray-700 rounded-full px-4 py-2.5 text-[14px] text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-gray-900 transition-all"
              />
              <button 
                type="submit" 
                disabled={!text.trim()}
                className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send size={18} className="translate-x-[1px]" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
