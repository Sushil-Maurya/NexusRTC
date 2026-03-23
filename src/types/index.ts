export type Theme = 'light' | 'dark' | 'system';

export type CallState = 'Idle' | 'Calling' | 'Connected' | 'Disconnected';

export interface WebRTCEvent {
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: any;
}
