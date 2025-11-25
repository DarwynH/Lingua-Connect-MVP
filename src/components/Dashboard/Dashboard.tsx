import React from 'react';
import { Users, MessageCircle, Globe, TrendingUp, Clock, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LANGUAGES } from '../../data/languages';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Matches', value: '3', icon: Users, color: 'blue' },
    { label: 'Messages Today', value: '12', icon: MessageCircle, color: 'green' },
    { label: 'Languages Practicing', value: user?.learningLanguages.length || 0, icon: Globe, color: 'purple' },
    { label: 'Hours This Week', value: '4.5', icon: Clock, color: 'orange' },
  ];

  const recentActivity = [
    { type: 'match', message: 'New match with Maria from Spain', time: '2 hours ago' },
    { type: 'message', message: 'Practice session with Jean completed', time: '1 day ago' },
    { type: 'achievement', message: 'Reached 10 hours of Spanish practice!', time: '2 days ago' },
  ];

  const getLanguageInfo = (code: string) => 
    LANGUAGES.find(lang => lang.code === code) || { code, name: code, flag: '🌐' };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100 mb-6">
          Ready to continue your language learning journey?
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h3 className="font-medium mb-2">Native Languages</h3>
            <div className="flex flex-wrap gap-2">
              {user?.nativeLanguages.map(langCode => {
                const lang = getLanguageInfo(langCode);
                return (
                  <span key={langCode} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {lang.flag} {lang.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h3 className="font-medium mb-2">Learning Languages</h3>
            <div className="flex flex-wrap gap-2">
              {user?.learningLanguages.map(langCode => {
                const lang = getLanguageInfo(langCode);
                const level = user?.proficiencyLevels[langCode] || 'beginner';
                return (
                  <span key={langCode} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {lang.flag} {lang.name} ({level})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
          }[stat.color];
          
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {user?.learningLanguages.map(langCode => {
              const lang = getLanguageInfo(langCode);
              const level = user?.proficiencyLevels[langCode] || 'beginner';
              const progress = { beginner: 25, intermediate: 50, advanced: 75, native: 100 }[level];
              
              return (
                <div key={langCode} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {lang.flag} {lang.name}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">{level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const iconMap = {
                match: Users,
                message: MessageCircle,
                achievement: Star,
              };
              const Icon = iconMap[activity.type as keyof typeof iconMap];
              const colorMap = {
                match: 'text-blue-500 bg-blue-50',
                message: 'text-green-500 bg-green-50',
                achievement: 'text-yellow-500 bg-yellow-50',
              };
              const iconColor = colorMap[activity.type as keyof typeof colorMap];
              
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Find New Partners</h3>
            <p className="text-sm text-gray-600">Connect with students learning your native language</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left">
            <MessageCircle className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Start Conversation</h3>
            <p className="text-sm text-gray-600">Practice with your existing language partners</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left">
            <Globe className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Join Group Chat</h3>
            <p className="text-sm text-gray-600">Practice in topic-based discussion groups</p>
          </button>
        </div>
      </div>
    </div>
  );
};