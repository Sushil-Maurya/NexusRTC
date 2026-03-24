import React from 'react';
import { useCallContext } from '../contexts/CallContext';
import { Users, User, CircleDot } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { connectedUsers } = useCallContext();

  return (
    <div className="w-64 h-full hidden lg:flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30">
      <div className="p-4 border-b border-white/20 dark:border-gray-700/30 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Users size={20} />
        </div>
        <h2 className="font-semibold text-lg">Participants</h2>
        <span className="ml-auto bg-gray-200 dark:bg-gray-800 text-xs px-2 py-1 rounded-full">{connectedUsers.length + 1}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Local User */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 shadow-sm border border-white/40 dark:border-gray-700/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
            Me
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Me (You)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Host</p>
          </div>
          <CircleDot size={12} className="text-emerald-500" />
        </div>

        {/* Remote Users */}
        {connectedUsers.map((userId) => (
          <div key={userId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors cursor-pointer border border-transparent dark:border-transparent">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
              <User size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Peer {userId.substring(0,4)}</p>
              <p className="text-xs text-emerald-500">Connected</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
