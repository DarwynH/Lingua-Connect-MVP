import React from 'react';
import { Search, MessageCircle, Clock } from 'lucide-react';
import { Chat, User } from '../../types';

interface ChatListProps {
  chats: Chat[];
  users: { [key: string]: User };
  currentUserId: string;
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  users,
  currentUserId,
  selectedChatId,
  onChatSelect,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const getOtherParticipant = (chat: Chat) => {
    const otherUserId = chat.participants.find(id => id !== currentUserId);
    return otherUserId ? users[otherUserId] : null;
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherParticipant(chat);
    return otherUser?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start by finding language partners!</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map(chat => {
              const otherUser = getOtherParticipant(chat);
              if (!otherUser) return null;

              const isSelected = selectedChatId === chat.id;
              const isOnline = otherUser.isOnline;

              return (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {otherUser.fullName.charAt(0)}
                        </span>
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium truncate ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {otherUser.fullName}
                        </h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(chat.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage?.content || 'Start a conversation...'}
                      </p>
                      
                      <div className="flex items-center mt-1 space-x-1">
                        <span className="text-xs text-gray-500">{otherUser.institution}</span>
                        {isOnline && (
                          <span className="text-xs text-green-600 font-medium">• Online</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};