import React from 'react';
import { MessageCircle, MapPin, Clock, Users } from 'lucide-react';
import { User } from '../../types';
import { LANGUAGES } from '../../data/languages';

interface MatchCardProps {
  user: User;
  matchScore: number;
  sharedLanguages: string[];
  onStartChat: (userId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  user, 
  matchScore, 
  sharedLanguages, 
  onStartChat 
}) => {
  const getLanguageInfo = (code: string) => 
    LANGUAGES.find(lang => lang.code === code) || { code, name: code, flag: '🌐' };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {user.institution}
            </p>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(matchScore)}`}>
          {matchScore}% match
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {user.bio || 'No bio available'}
      </p>

      {/* Languages */}
      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Native Languages
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.nativeLanguages.map(langCode => {
              const lang = getLanguageInfo(langCode);
              const isShared = sharedLanguages.includes(langCode);
              return (
                <span 
                  key={langCode}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isShared 
                      ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {lang.flag} {lang.name}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Learning Languages
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.learningLanguages.map(langCode => {
              const lang = getLanguageInfo(langCode);
              const level = user.proficiencyLevels[langCode] || 'beginner';
              const isShared = sharedLanguages.includes(langCode);
              
              return (
                <span 
                  key={langCode}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isShared 
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {lang.flag} {lang.name} ({level})
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center text-xs text-gray-500 space-x-3">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {user.isOnline ? 'Online' : 'Last seen recently'}
          </span>
          <span className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {Math.floor(Math.random() * 20) + 5} mutual connections
          </span>
        </div>
        
        <button
          onClick={() => onStartChat(user.id)}
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Connect</span>
        </button>
      </div>
    </div>
  );
};