import React, { useEffect, useRef } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  name: string;
  isMuted?: boolean;
}

export const VideoTile: React.FC<VideoTileProps> = ({ stream, isLocal = false, name, isMuted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-200/50 dark:bg-gray-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl flex items-center justify-center min-h-[300px]">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || isMuted}
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
          <div className="w-24 h-24 rounded-full bg-white/60 dark:bg-gray-800/60 shadow-inner flex items-center justify-center mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest border border-white/50 dark:border-white/5">
            {name.charAt(0)}
          </div>
          <p className="font-medium tracking-wide">Waiting for video...</p>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white/70 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 dark:border-white/10 shadow-lg flex items-center gap-3">
        <span className="text-gray-900 dark:text-white text-sm font-semibold tracking-wide">{name}</span>
        {isLocal && <span className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">You</span>}
      </div>
    </div>
  );
};
