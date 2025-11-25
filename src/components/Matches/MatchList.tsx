import React, { useState } from 'react';
import { Search, Filter, Users, Sparkles } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { User } from '../../types';
import { LANGUAGES, PROFICIENCY_LEVELS } from '../../data/languages';

interface MatchListProps {
  onStartChat: (userId: string) => void;
}

export const MatchList: React.FC<MatchListProps> = ({ onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // Mock data for demonstration
  const mockMatches: Array<User & { matchScore: number; sharedLanguages: string[] }> = [
    {
      id: '2',
      email: 'maria@example.com',
      fullName: 'Maria González',
      institution: 'Universidad de Barcelona',
      nativeLanguages: ['es'],
      learningLanguages: ['en', 'fr'],
      proficiencyLevels: { en: 'intermediate', fr: 'beginner' },
      bio: '¡Hola! I\'m a psychology student from Barcelona. I love discussing books, travel, and different cultures. Looking to improve my English conversation skills!',
      avatar: null,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
      matchScore: 95,
      sharedLanguages: ['es', 'en'],
    },
    {
      id: '3',
      email: 'jean@example.com',
      fullName: 'Jean Dupont',
      institution: 'Sorbonne Université',
      nativeLanguages: ['fr'],
      learningLanguages: ['en', 'it'],
      proficiencyLevels: { en: 'advanced', it: 'intermediate' },
      bio: 'Salut! I\'m studying international relations in Paris. I enjoy philosophy, art, and cooking. Always happy to help with French in exchange for English practice.',
      avatar: null,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      matchScore: 88,
      sharedLanguages: ['fr', 'en'],
    },
    {
      id: '4',
      email: 'yuki@example.com',
      fullName: 'Yuki Tanaka',
      institution: 'Tokyo University',
      nativeLanguages: ['ja'],
      learningLanguages: ['en', 'ko'],
      proficiencyLevels: { en: 'intermediate', ko: 'beginner' },
      bio: 'こんにちは! Computer science student from Tokyo. Love anime, gaming, and technology. Want to practice English for my upcoming exchange program.',
      avatar: null,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
      matchScore: 72,
      sharedLanguages: ['en'],
    },
    {
      id: '5',
      email: 'anna@example.com',
      fullName: 'Anna Müller',
      institution: 'Humboldt-Universität Berlin',
      nativeLanguages: ['de'],
      learningLanguages: ['en', 'es'],
      proficiencyLevels: { en: 'advanced', es: 'intermediate' },
      bio: 'Hallo! I\'m an art history student in Berlin. Passionate about museums, photography, and traveling. Happy to help with German!',
      avatar: null,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      matchScore: 83,
      sharedLanguages: ['de', 'en', 'es'],
    },
  ];

  const filteredMatches = mockMatches.filter(match => {
    const matchesSearch = match.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = !filterLanguage || 
                           match.nativeLanguages.includes(filterLanguage) ||
                           match.learningLanguages.includes(filterLanguage);
    
    const matchesLevel = !filterLevel || 
                        Object.values(match.proficiencyLevels).includes(filterLevel);
    
    return matchesSearch && matchesLanguage && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
            Find Language Partners
          </h1>
          <p className="text-gray-600 mt-1">Connect with fellow students to practice languages together</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            {filteredMatches.length} potential matches
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">All Languages</option>
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              {PROFICIENCY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              user={match}
              matchScore={match.matchScore}
              sharedLanguages={match.sharedLanguages}
              onStartChat={onStartChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};