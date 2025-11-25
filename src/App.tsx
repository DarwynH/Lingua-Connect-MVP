import React, { useState } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { AuthForm } from './components/Auth/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MatchList } from './components/Matches/MatchList';
import { ChatContainer } from './components/Chat/ChatContainer';
import { ProfileForm } from './components/Profile/ProfileForm';

function App() {
  const auth = useAuthProvider();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'matches' | 'chats' | 'profile'>('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const handleStartChat = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage('chats');
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LinguaConnect...</p>
        </div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <AuthContext.Provider value={auth}>
        <AuthForm />
      </AuthContext.Provider>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'matches':
        return <MatchList onStartChat={handleStartChat} />;
      case 'chats':
        return <ChatContainer selectedUserId={selectedUserId} />;
      case 'profile':
        return <ProfileForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;