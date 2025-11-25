import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { Chat, ChatMessage, User } from '../../types';
import { LANGUAGES } from '../../data/languages';
import { CallInterface } from './CallInterface';

interface ChatWindowProps {
  chat: Chat | null;
  messages: ChatMessage[];
  otherUser: User | null;
  currentUserId: string;
  onSendMessage: (content: string, language: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  otherUser,
  currentUserId,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    isIncoming: boolean;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage.trim(), selectedLanguage);
    setNewMessage('');
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setActiveCall({ type, isIncoming: false });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleAcceptCall = () => {
    // Handle accepting incoming call
    console.log('Call accepted');
  };

  const handleDeclineCall = () => {
    setActiveCall(null);
  };

  if (!chat || !otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-600">Choose a language partner to start practicing</p>
        </div>
      </div>
    );
  }

  const getLanguageInfo = (code: string) => 
    LANGUAGES.find(lang => lang.code === code) || { code, name: code, flag: '🌐' };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {otherUser.fullName.charAt(0)}
                </span>
              </div>
              {otherUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.fullName}</h3>
              <p className="text-sm text-gray-600">
                {otherUser.isOnline ? 'Online' : 'Last seen recently'} • {otherUser.institution}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleStartCall('voice')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voice call"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleStartCall('video')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Video call"
            >
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Info className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          const isOwnMessage = message.senderId === currentUserId;
          const messageLanguage = getLanguageInfo(message.language);
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {messageLanguage.flag} {messageLanguage.name}
                  </span>
                  <span className={`text-xs ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSend} className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <label className="text-sm text-gray-600">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Call Interface */}
      {activeCall && otherUser && (
        <CallInterface
          isActive={true}
          callType={activeCall.type}
          otherUser={otherUser}
          onEndCall={handleEndCall}
          isIncoming={activeCall.isIncoming}
          onAcceptCall={handleAcceptCall}
          onDeclineCall={handleDeclineCall}
        />
      )}
    </div>
  );
};