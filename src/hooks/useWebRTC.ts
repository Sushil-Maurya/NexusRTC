import { useEffect, useRef, useCallback } from 'react';
import { useCallContext } from '../contexts/CallContext';

export const useWebRTC = () => {
  const {
    setCallState,
    setLocalStream,
    setRemoteStream,
    isMuted,
    isVideoOff,
    localStream
  } = useCallContext();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Permission Denied or Error accessing media devices:', error);
      alert('Cannot access camera or microphone. Please check permissions.');
      return null;
    }
  }, [setLocalStream]);

  const initWebRTC = useCallback((stream: MediaStream) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // Add local tracks to PeerConnection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Handle remote tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to remote peer via signaling server
        console.log('New ICE candidate:', event.candidate);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          setCallState('Connected');
          break;
        case 'disconnected':
        case 'failed':
        case 'closed':
          setCallState('Disconnected');
          break;
        default:
          break;
      }
    };
  }, [setRemoteStream, setCallState]);

  const mediaRequestedRef = useRef(false);

  useEffect(() => {
    // Media access initialization
    const init = async () => {
      if (!localStream && !mediaRequestedRef.current) {
        mediaRequestedRef.current = true;
        await startMedia();
      }
    };
    init();

    return () => {
      // Do not stop the localStream tracks here because this hook triggers re-renders 
      // natively on context changes (like mic or video toggle), which would kill the stream.
      // We only clean up the peer connection dynamically.
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [localStream, startMedia]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // Toggle: if currently muted (isMuted true), we want to enable (true)
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

  const endCall = () => {
    peerConnectionRef.current?.close();
    setCallState('Disconnected');
    setRemoteStream(null);
  };

  const initiateCall = () => {
    if (localStream) {
      setCallState('Calling');
      initWebRTC(localStream);
      // Logic for creating offer will go here
      // peerConnectionRef.current.createOffer().then(offer => {
      //   return peerConnectionRef.current?.setLocalDescription(offer);
      // }).then(() => {
      //   console.log('Offer created and set as local description');
      // })
    }
  };

  return {
    toggleMute,
    toggleVideo,
    endCall,
    initiateCall,
  };
};
