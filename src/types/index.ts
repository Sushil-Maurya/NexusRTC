export type Theme = 'light' | 'dark' | 'system';

export type CallState = 'Idle' | 'Calling' | 'Connected' | 'Disconnected';

export interface WebRTCEvent {
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: any;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isLocal: boolean;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // Base64 or Blob URL for simplicity
  sender: string;
}
