import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication for demonstration
export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('linguaconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock login - in real app, this would call your auth API
    const mockUser: User = {
      id: '1',
      email,
      fullName: 'Demo User',
      institution: 'Demo University',
      nativeLanguages: ['en'],
      learningLanguages: ['es', 'fr'],
      proficiencyLevels: { es: 'intermediate', fr: 'beginner' },
      bio: 'Excited to practice languages with fellow students!',
      avatar: null,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    
    localStorage.setItem('linguaconnect_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      fullName: userData.fullName!,
      institution: userData.institution!,
      nativeLanguages: userData.nativeLanguages || [],
      learningLanguages: userData.learningLanguages || [],
      proficiencyLevels: userData.proficiencyLevels || {},
      bio: userData.bio || '',
      avatar: null,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    
    localStorage.setItem('linguaconnect_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('linguaconnect_user');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('linguaconnect_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };
};

export { AuthContext };