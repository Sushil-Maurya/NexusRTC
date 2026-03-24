import React, { createContext, useContext, useState } from 'react';
import type { CallState, ChatMessage, FileData } from '../types';

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
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  connectedUsers: string[];
  setConnectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>('Idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        isScreenSharing,
        setIsScreenSharing,
        messages,
        setMessages,
        files,
        setFiles,
        connectedUsers,
        setConnectedUsers,
        isSidebarOpen,
        setIsSidebarOpen,
        isChatOpen,
        setIsChatOpen,
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
