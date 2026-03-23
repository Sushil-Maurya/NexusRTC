import React, { createContext, useContext, useState } from 'react';
import type { CallState } from '../types';

interface CallContextType {
  callState: CallState;
  setCallState: (state: CallState) => void;
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
  remoteStream: MediaStream | null;
  setRemoteStream: (stream: MediaStream | null) => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoOff: boolean;
  setIsVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>('Idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <CallContext.Provider
      value={{
        callState,
        setCallState,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        isMuted,
        setIsMuted,
        isVideoOff,
        setIsVideoOff,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
