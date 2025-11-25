import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { User } from '../../types';

interface CallInterfaceProps {
  isActive: boolean;
  callType: 'voice' | 'video';
  otherUser: User;
  onEndCall: () => void;
  isIncoming?: boolean;
  onAcceptCall?: () => void;
  onDeclineCall?: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  isActive,
  callType,
  otherUser,
  onEndCall,
  isIncoming = false,
  onAcceptCall,
  onDeclineCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'incoming'>
    (isIncoming ? 'incoming' : 'connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) return;

    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, callStatus]);

  useEffect(() => {
    if (isActive && !isIncoming) {
      // Simulate connection delay
      const timer = setTimeout(() => {
        setCallStatus('connected');
        callStartTime.current = Date.now();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, isIncoming]);

  const handleAcceptCall = () => {
    if (onAcceptCall) {
      onAcceptCall();
      setCallStatus('connected');
      callStartTime.current = Date.now();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {otherUser.fullName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{otherUser.fullName}</h3>
              <p className="text-sm text-gray-300">
                {callStatus === 'incoming' && 'Incoming call...'}
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'connected' && formatDuration(callDuration)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300 capitalize">{callType} call</span>
            {callStatus === 'connected' && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {callType === 'video' && isVideoEnabled ? (
          <>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
          </>
        ) : (
          /* Voice Call or Video Disabled */
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-4xl">
                  {otherUser.fullName.charAt(0)}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {otherUser.fullName}
              </h2>
              <p className="text-gray-300">{otherUser.institution}</p>
              
              {callStatus === 'connecting' && (
                <div className="mt-6">
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-gray-400 mt-2">Connecting...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6">
        {callStatus === 'incoming' ? (
          /* Incoming Call Controls */
          <div className="flex justify-center space-x-8">
            <button
              onClick={onDeclineCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              <PhoneOff className="h-8 w-8 text-white" />
            </button>
            <button
              onClick={handleAcceptCall}
              className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
            >
              <Phone className="h-8 w-8 text-white" />
            </button>
          </div>
        ) : (
          /* Active Call Controls */
          <div className="flex justify-center space-x-4">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Speaker Button (Voice calls only) */}
            {callType === 'voice' && (
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isSpeakerOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isSpeakerOn ? (
                  <Volume2 className="h-6 w-6 text-white" />
                ) : (
                  <VolumeX className="h-6 w-6 text-white" />
                )}
              </button>
            )}

            {/* Video Toggle (Video calls only) */}
            {callType === 'video' && (
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="h-6 w-6 text-white" />
                ) : (
                  <VideoOff className="h-6 w-6 text-white" />
                )}
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              <PhoneOff className="h-8 w-8 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};