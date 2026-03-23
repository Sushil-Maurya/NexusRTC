import React from 'react';
import { useCallContext } from '../contexts/CallContext';
import { useWebRTC } from '../hooks/useWebRTC';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Settings } from 'lucide-react';

export const Controls: React.FC = () => {
  const { callState, isMuted, setIsMuted, isVideoOff, setIsVideoOff } = useCallContext();
  const { toggleMute, toggleVideo, endCall, initiateCall } = useWebRTC();

  const handleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 bg-white/70 dark:bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50">
      <button
        onClick={handleMute}
        className={`p-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center ${
          isMuted 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
            : 'bg-white/90 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600/90 text-gray-800 dark:text-gray-100 shadow-black/5'
        }`}
        aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? <MicOff size={22} strokeWidth={2.5} /> : <Mic size={22} strokeWidth={2.5} />}
      </button>

      <button
        onClick={handleVideo}
        className={`p-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center ${
          isVideoOff 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
            : 'bg-white/90 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600/90 text-gray-800 dark:text-gray-100 shadow-black/5'
        }`}
        aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isVideoOff ? <VideoOff size={22} strokeWidth={2.5} /> : <Video size={22} strokeWidth={2.5} />}
      </button>

      <div className="w-px h-8 bg-gray-300/50 dark:bg-white/10 mx-1 rounded-full" />

      {callState === 'Idle' || callState === 'Disconnected' ? (
        <button
          onClick={initiateCall}
          className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 font-semibold tracking-wide"
          aria-label="Start Call"
        >
          <Phone size={22} strokeWidth={2.5} />
          <span className="hidden sm:inline">Join Call</span>
        </button>
      ) : (
        <button
          onClick={endCall}
          className="px-8 py-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 font-semibold tracking-wide"
          aria-label="End Call"
        >
          <PhoneOff size={22} strokeWidth={2.5} />
          <span className="hidden sm:inline">End Call</span>
        </button>
      )}

      <div className="w-px h-8 bg-gray-300/50 dark:bg-white/10 mx-1 rounded-full" />

      <button
        className="p-4 rounded-full bg-white/90 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600/90 text-gray-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/5 flex items-center justify-center"
        aria-label="Settings"
      >
        <Settings size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
};
