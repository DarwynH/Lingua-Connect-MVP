import React, { useState } from 'react';
import { User, Building, MessageCircle, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LANGUAGES, PROFICIENCY_LEVELS } from '../../data/languages';

export const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    institution: user?.institution || '',
    bio: user?.bio || '',
    nativeLanguages: user?.nativeLanguages || [],
    learningLanguages: user?.learningLanguages || [],
    proficiencyLevels: user?.proficiencyLevels || {},
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      // Show success message (you could add a toast here)
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageToggle = (languageCode: string, type: 'native' | 'learning') => {
    if (type === 'native') {
      const newNative = formData.nativeLanguages.includes(languageCode)
        ? formData.nativeLanguages.filter(lang => lang !== languageCode)
        : [...formData.nativeLanguages, languageCode];
      
      setFormData(prev => ({ ...prev, nativeLanguages: newNative }));
    } else {
      const newLearning = formData.learningLanguages.includes(languageCode)
        ? formData.learningLanguages.filter(lang => lang !== languageCode)
        : [...formData.learningLanguages, languageCode];
      
      setFormData(prev => ({ ...prev, learningLanguages: newLearning }));
    }
  };

  const setProficiencyLevel = (languageCode: string, level: string) => {
    setFormData(prev => ({
      ...prev,
      proficiencyLevels: { ...prev.proficiencyLevels, [languageCode]: level }
    }));
  };

  const getLanguageInfo = (code: string) => 
    LANGUAGES.find(lang => lang.code === code) || { code, name: code, flag: '🌐' };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Update your information and language preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Institution"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  placeholder="Tell others about yourself and your language learning goals..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Native Languages</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <label key={`native-${lang.code}`} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.nativeLanguages.includes(lang.code)}
                        onChange={() => handleLanguageToggle(lang.code, 'native')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{lang.flag} {lang.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Learning Languages</h3>
                <div className="space-y-3">
                  {LANGUAGES.map(lang => (
                    <div key={`learning-${lang.code}`} className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.learningLanguages.includes(lang.code)}
                          onChange={() => handleLanguageToggle(lang.code, 'learning')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm">{lang.flag} {lang.name}</span>
                      </label>
                      
                      {formData.learningLanguages.includes(lang.code) && (
                        <select
                          value={formData.proficiencyLevels[lang.code] || 'beginner'}
                          onChange={(e) => setProficiencyLevel(lang.code, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Summary</h3>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-2xl">
                  {formData.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900">{formData.fullName || 'Your Name'}</h4>
              <p className="text-sm text-gray-600">{formData.institution || 'Your Institution'}</p>
            </div>

            {formData.bio && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Bio</h5>
                <p className="text-sm text-gray-600">{formData.bio}</p>
              </div>
            )}

            {formData.nativeLanguages.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Native Languages</h5>
                <div className="flex flex-wrap gap-1">
                  {formData.nativeLanguages.map(langCode => {
                    const lang = getLanguageInfo(langCode);
                    return (
                      <span key={langCode} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {lang.flag} {lang.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.learningLanguages.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Languages</h5>
                <div className="space-y-1">
                  {formData.learningLanguages.map(langCode => {
                    const lang = getLanguageInfo(langCode);
                    const level = formData.proficiencyLevels[langCode] || 'beginner';
                    return (
                      <div key={langCode} className="flex items-center justify-between">
                        <span className="text-xs">{lang.flag} {lang.name}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-medium text-blue-900 mb-2">Profile Tips</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Add a detailed bio to attract compatible language partners</li>
              <li>• Be specific about your learning goals</li>
              <li>• Update your proficiency levels regularly</li>
              <li>• Keep your profile information current</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};