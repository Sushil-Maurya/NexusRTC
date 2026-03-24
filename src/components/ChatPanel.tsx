import React, { useState, useRef } from 'react';
import { useCallContext } from '../contexts/CallContext';
import { useWebRTC } from '../hooks/useWebRTC';
import { Send, Paperclip, FileText, Download } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { messages, files } = useCallContext();
  const { sendMessage, sendFile } = useWebRTC();
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="w-80 h-full hidden xl:flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/30">
      <div className="p-4 border-b border-white/20 dark:border-gray-700/30">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          Chat & Files
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 mx-1">{msg.sender}</span>
            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
              msg.isLocal 
                ? 'bg-indigo-500 text-white rounded-tr-none' 
                : 'bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {files.map((f) => (
          <div key={f.id} className={`flex flex-col ${f.sender === 'Me' ? 'items-end' : 'items-start'}`}>
             <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 mx-1">{f.sender} sent a file</span>
             <a 
               href={f.data} 
               download={f.name}
               className={`flex items-center gap-3 p-3 rounded-2xl max-w-[90%] shadow-sm transition-transform hover:scale-105 ${
                 f.sender === 'Me'
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-900 dark:text-indigo-100 rounded-tr-none'
                  : 'bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-tl-none'
               }`}
             >
               <div className="p-2 bg-indigo-100 dark:bg-gray-700 rounded-lg text-indigo-500 dark:text-indigo-400">
                 <FileText size={20} />
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium truncate w-32">{f.name}</p>
                 <p className="text-xs opacity-70">{(f.size / 1024).toFixed(1)} KB</p>
               </div>
               <Download size={16} className="opacity-70 hover:opacity-100" />
             </a>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/20 dark:border-gray-700/30 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md">
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
            className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm"
          />
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
