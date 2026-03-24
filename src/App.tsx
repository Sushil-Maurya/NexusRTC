import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CallProvider, useCallContext } from './contexts/CallContext';
import { ThemeToggle } from './components/ThemeToggle';
import { VideoTile } from './components/VideoTile';
import { Controls } from './components/Controls';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { Video } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { localStream, remoteStream, callState, isSidebarOpen } = useCallContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden flex flex-col items-center font-sans">
      {/* Dynamic Background Elements for Glassmorphism Context */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className={`w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative transition-all duration-300 ${isSidebarOpen ? 'pl-[280px]' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Video className="text-white" size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            NexusRTC
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide border shadow-sm transition-colors duration-300 ${
            callState === 'Connected' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            callState === 'Calling' ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400' :
            'border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 backdrop-blur-md'
          }`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                callState === 'Connected' ? 'bg-emerald-500 animate-pulse' :
                callState === 'Calling' ? 'bg-amber-500 animate-pulse' :
                'bg-gray-400'
              }`}></span>
              {callState}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Grid Area */}
      <main className={`flex-1 w-full flex h-[calc(100vh-100px)] overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <Sidebar />

        <div className="flex-1 flex flex-col justify-center px-6 relative h-full">
          <div className={`grid gap-6 w-full max-w-7xl mx-auto transition-all duration-500 ease-in-out ${remoteStream ? 'grid-cols-1 lg:grid-cols-2 h-full py-6' : 'grid-cols-1 max-w-4xl mx-auto h-[70vh]'}`}>
            
            <div className={`h-full w-full relative group transition-all duration-500 ease-in-out ${remoteStream ? 'rounded-2xl overflow-hidden' : ''}`}>
              <VideoTile stream={localStream} isLocal name="Me" />
            </div>

            {remoteStream && (
              <div className="h-full w-full animate-in fade-in slide-in-from-right-8 duration-500 relative group rounded-2xl overflow-hidden">
                <VideoTile stream={remoteStream} name="Remote Peer" />
              </div>
            )}

          </div>
          <Controls />
        </div>

        <ChatPanel />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CallProvider>
        <Dashboard />
      </CallProvider>
    </ThemeProvider>
  );
};

export default App;
