import { useEffect, useRef, useCallback } from 'react';
import { useCallContext } from '../contexts/CallContext';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage, FileData } from '../types';

const SIGNALING_SERVER = 'http://localhost:5000';
const ROOM_ID = 'nexus-room';

export const useWebRTC = () => {
  const {
    setCallState,
    setLocalStream,
    setRemoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    setIsScreenSharing,
    localStream,
    setMessages,
    setFiles,
    setConnectedUsers,
  } = useCallContext();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const originalVideoTrackRef = useRef<MediaStreamTrack | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      originalVideoTrackRef.current = stream.getVideoTracks()[0];
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Permission Denied or Error accessing media devices:', error);
      alert('Cannot access camera or microphone. Please check permissions.');
      return null;
    }
  }, [setLocalStream]);

  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages((prev) => [...prev, data.payload]);
        } else if (data.type === 'file') {
          setFiles((prev) => [...prev, data.payload]);
        }
      } catch (e) {
        console.error('Error parsing data channel message', e);
      }
    };
    channel.onopen = () => console.log('Data channel opened');
    channel.onclose = () => console.log('Data channel closed');
  };

  const createPeerConnection = useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnectionRef.current = pc;

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    pc.ondatachannel = (event) => {
      dataChannelRef.current = event.channel;
      setupDataChannel(event.channel);
    };

    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          setCallState('Connected');
          break;
        case 'disconnected':
        case 'failed':
        case 'closed':
          setCallState('Disconnected');
          setRemoteStream(null);
          break;
        default:
          break;
      }
    };

    return pc;
  }, [setRemoteStream, setCallState, setMessages, setFiles]);

  useEffect(() => {
    socketRef.current = io(SIGNALING_SERVER);
    
    const socket = socketRef.current;
    
    socket.on('connect', () => {
      socket.emit('join-room', ROOM_ID);
    });

    socket.on('user-connected', async (userId) => {
      setConnectedUsers((prev) => [...prev, userId]);
      
      if (localStream) {
        setCallState('Calling');
        const pc = createPeerConnection(localStream);
        
        const dataChannel = pc.createDataChannel('data-channel');
        dataChannelRef.current = dataChannel;
        setupDataChannel(dataChannel);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { sdp: offer });
      }
    });

    socket.on('user-disconnected', (userId) => {
      setConnectedUsers((prev) => prev.filter(id => id !== userId));
      setCallState('Disconnected');
      setRemoteStream(null);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    });

    socket.on('offer', async (data) => {
      const pc = createPeerConnection(localStream || new MediaStream());
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer });
    });

    socket.on('answer', async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    });

    socket.on('ice-candidate', async (data) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [localStream, createPeerConnection, setCallState, setRemoteStream, setConnectedUsers]);

  const mediaRequestedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (!localStream && !mediaRequestedRef.current) {
        mediaRequestedRef.current = true;
        await startMedia();
      }
    };
    init();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [localStream, startMedia]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff; 
      });
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnectionRef.current || !localStream) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track in peer connection
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        // Replace track in local stream viewer
        localStream.removeTrack(localStream.getVideoTracks()[0]);
        localStream.addTrack(screenTrack);
        setIsScreenSharing(true);

        // When screen share stops naturally (e.g., via browser UI)
        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (!peerConnectionRef.current || !localStream || !originalVideoTrackRef.current) return;
    
    const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
    if (sender) {
      sender.replaceTrack(originalVideoTrackRef.current);
    }
    
    // localStream.removeTrack(localStream.getVideoTracks()[0]); 
    // It's better to just swap back the old one
    const currentTracks = localStream.getVideoTracks();
    if (currentTracks.length > 0) localStream.removeTrack(currentTracks[0]);
    
    localStream.addTrack(originalVideoTrackRef.current);
    setIsScreenSharing(false);
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    setCallState('Disconnected');
    setRemoteStream(null);
  };

  const initiateCall = () => {
    // Kept for backward compatibility if needed, but handled by signaling now
    if (localStream && socketRef.current) {
      setCallState('Calling');
      // Let 'user-connected' trigger it or explicitly re-join room
      socketRef.current.emit('join-room', ROOM_ID);
    }
  };

  const sendMessage = (text: string) => {
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'Me',
      text,
      timestamp: new Date(),
      isLocal: true,
    };
    
    setMessages((prev) => [...prev, msg]);
    
    if (dataChannelRef.current?.readyState === 'open') {
      const payload = { ...msg, isLocal: false, sender: 'Peer' };
      dataChannelRef.current.send(JSON.stringify({ type: 'chat', payload }));
    }
  };

  const sendFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData: FileData = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result as string, // base64
        sender: 'Me'
      };
      
      setFiles((prev) => [...prev, fileData]);
      
      if (dataChannelRef.current?.readyState === 'open') {
        const payload = { ...fileData, sender: 'Peer' };
        dataChannelRef.current.send(JSON.stringify({ type: 'file', payload }));
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
    initiateCall,
    sendMessage,
    sendFile,
  };
};
