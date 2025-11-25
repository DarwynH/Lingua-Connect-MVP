import { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface CallState {
  isActive: boolean;
  callType: 'voice' | 'video' | null;
  otherUser: User | null;
  isIncoming: boolean;
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
}

export const useCall = () => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    callType: null,
    otherUser: null,
    isIncoming: false,
    status: 'idle',
  });

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const startCall = async (user: User, type: 'voice' | 'video') => {
    try {
      // Request media permissions
      const constraints = {
        audio: true,
        video: type === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      setCallState({
        isActive: true,
        callType: type,
        otherUser: user,
        isIncoming: false,
        status: 'calling',
      });

      // In a real implementation, you would:
      // 1. Send call invitation to the other user via WebSocket/SignalR
      // 2. Set up WebRTC peer connection
      // 3. Handle ICE candidates and SDP exchange
      
      // For demo purposes, simulate call connection
      setTimeout(() => {
        setCallState(prev => ({ ...prev, status: 'connected' }));
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      // Handle permission denied or other errors
    }
  };

  const endCall = () => {
    // Clean up media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }

    setCallState({
      isActive: false,
      callType: null,
      otherUser: null,
      isIncoming: false,
      status: 'ended',
    });

    // Reset status after a brief delay
    setTimeout(() => {
      setCallState(prev => ({ ...prev, status: 'idle' }));
    }, 1000);
  };

  const acceptCall = () => {
    setCallState(prev => ({ ...prev, status: 'connected' }));
  };

  const declineCall = () => {
    endCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  // Simulate incoming call (for demo purposes)
  const simulateIncomingCall = (user: User, type: 'voice' | 'video') => {
    setCallState({
      isActive: true,
      callType: type,
      otherUser: user,
      isIncoming: true,
      status: 'ringing',
    });
  };

  return {
    callState,
    startCall,
    endCall,
    acceptCall,
    declineCall,
    toggleMute,
    toggleVideo,
    simulateIncomingCall,
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current,
  };
};