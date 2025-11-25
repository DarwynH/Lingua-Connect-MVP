import React from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { User } from '../../types';

interface IncomingCallNotificationProps {
  caller: User;
  callType: 'voice' | 'video';
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  caller,
  callType,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-2xl border p-6 z-50 min-w-80">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {caller.fullName.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{caller.fullName}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            {callType === 'video' ? (
              <Video className="h-4 w-4 mr-1" />
            ) : (
              <Phone className="h-4 w-4 mr-1" />
            )}
            Incoming {callType} call
          </p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onDecline}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <Phone className="h-4 w-4 mr-2" />
          Accept
        </button>
      </div>
    </div>
  );
};