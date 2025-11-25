import React, { useState, useEffect } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { Chat, ChatMessage, User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ChatContainerProps {
  selectedUserId?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ selectedUserId }) => {
  const { user: currentUser } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>({});
  const [users, setUsers] = useState<{ [userId: string]: User }>({});

  // Mock data for demonstration
  useEffect(() => {
    if (!currentUser) return;

    const mockUsers: { [userId: string]: User } = {
      '2': {
        id: '2',
        email: 'maria@example.com',
        fullName: 'Maria González',
        institution: 'Universidad de Barcelona',
        nativeLanguages: ['es'],
        learningLanguages: ['en', 'fr'],
        proficiencyLevels: { en: 'intermediate', fr: 'beginner' },
        bio: '¡Hola! Psychology student from Barcelona.',
        avatar: null,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      },
      '3': {
        id: '3',
        email: 'jean@example.com',
        fullName: 'Jean Dupont',
        institution: 'Sorbonne Université',
        nativeLanguages: ['fr'],
        learningLanguages: ['en', 'it'],
        proficiencyLevels: { en: 'advanced', it: 'intermediate' },
        bio: 'Salut! International relations student.',
        avatar: null,
        isOnline: false,
        lastSeen: new Date(),
        createdAt: new Date(),
      },
    };

    const mockChats: Chat[] = [
      {
        id: 'chat1',
        participants: [currentUser.id, '2'],
        isActive: true,
        createdAt: new Date(),
        lastMessage: {
          id: 'msg1',
          chatId: 'chat1',
          senderId: '2',
          content: '¡Hola! How are you today?',
          type: 'text',
          language: 'en',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
      },
      {
        id: 'chat2',
        participants: [currentUser.id, '3'],
        isActive: true,
        createdAt: new Date(),
        lastMessage: {
          id: 'msg2',
          chatId: 'chat2',
          senderId: currentUser.id,
          content: 'Merci beaucoup pour la leçon!',
          type: 'text',
          language: 'fr',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
      },
    ];

    const mockMessages: { [chatId: string]: ChatMessage[] } = {
      'chat1': [
        {
          id: 'msg1-1',
          chatId: 'chat1',
          senderId: '2',
          content: '¡Hola! Nice to meet you. I saw you\'re learning Spanish!',
          type: 'text',
          language: 'en',
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
        },
        {
          id: 'msg1-2',
          chatId: 'chat1',
          senderId: currentUser.id,
          content: '¡Hola Maria! Sí, estoy aprendiendo español. ¿Puedes ayudarme?',
          type: 'text',
          language: 'es',
          createdAt: new Date(Date.now() - 1000 * 60 * 50),
        },
        {
          id: 'msg1-3',
          chatId: 'chat1',
          senderId: '2',
          content: '¡Por supuesto! Your Spanish is very good already. What would you like to practice?',
          type: 'text',
          language: 'en',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
      ],
      'chat2': [
        {
          id: 'msg2-1',
          chatId: 'chat2',
          senderId: '3',
          content: 'Bonjour! I\'m happy to help you with French. Comment ça va?',
          type: 'text',
          language: 'en',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
        {
          id: 'msg2-2',
          chatId: 'chat2',
          senderId: currentUser.id,
          content: 'Ça va bien, merci! J\'aimerais pratiquer la conversation en français.',
          type: 'text',
          language: 'fr',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        },
        {
          id: 'msg2-3',
          chatId: 'chat2',
          senderId: currentUser.id,
          content: 'Merci beaucoup pour la leçon!',
          type: 'text',
          language: 'fr',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
      ],
    };

    setUsers(mockUsers);
    setChats(mockChats);
    setMessages(mockMessages);

    // Auto-select chat if a user was selected
    if (selectedUserId) {
      const targetChat = mockChats.find(chat => 
        chat.participants.includes(selectedUserId)
      );
      if (targetChat) {
        setSelectedChatId(targetChat.id);
      }
    }
  }, [currentUser, selectedUserId]);

  const handleSendMessage = (content: string, language: string) => {
    if (!currentUser || !selectedChatId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChatId,
      senderId: currentUser.id,
      content,
      type: 'text',
      language,
      createdAt: new Date(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));

    // Update last message in chat
    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;
  const otherUser = selectedChat 
    ? users[selectedChat.participants.find(id => id !== currentUser?.id) || '']
    : null;

  if (!currentUser) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="w-80 flex-shrink-0">
        <ChatList
          chats={chats}
          users={users}
          currentUserId={currentUser.id}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
        />
      </div>
      
      <ChatWindow
        chat={selectedChat}
        messages={messages[selectedChatId || ''] || []}
        otherUser={otherUser || null}
        currentUserId={currentUser.id}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};