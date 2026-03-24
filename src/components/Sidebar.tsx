import React from 'react';
import { useCallContext } from '../contexts/CallContext';
import { Users, User, CircleDot, ChevronLeft, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { connectedUsers, isSidebarOpen, setIsSidebarOpen } = useCallContext();

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-white/95 dark:bg-gray-800/95 rounded-r-xl shadow-lg border border-l-0 border-gray-200 dark:border-gray-700 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isSidebarOpen ? 'left-64' : 'left-0'}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>

      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 h-screen z-40 bg-white/95 dark:bg-gray-900/90 backdrop-blur-2xl border-r border-gray-200 dark:border-gray-800/50 transition-all duration-300 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] flex flex-col ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="w-64 h-full flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Participants</h2>
            <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-bold">{connectedUsers.length + 1}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Local User */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700/50">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                Me
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Me (You)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Host</p>
              </div>
              <CircleDot size={14} className="text-emerald-500 shrink-0" />
            </div>

            {/* Remote Users */}
            {connectedUsers.map((userId) => (
              <div key={userId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-inner">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Peer {userId.substring(0,4)}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Connected</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
