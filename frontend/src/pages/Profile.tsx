import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout } from '../services/auth.service';
import { getApplications } from '../services/application.service';
import { User, Mail, Calendar, Briefcase, Award, TrendingUp, Settings, LogOut, Camera, Save, X } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = getCurrentUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    github: '',
    linkedin: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    acceptanceRate: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchApplications();
    loadProfilePic();
    loadProfileData();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
      const total = data.length;
      const applied = data.filter((a: any) => a.status === 'applied').length;
      const interview = data.filter((a: any) => a.status === 'interview').length;
      const offer = data.filter((a: any) => a.status === 'offer').length;
      const acceptanceRate = total > 0 ? Math.round((offer / total) * 100) : 0;
      setStats({ total, applied, interview, offer, acceptanceRate });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const loadProfilePic = () => {
    const saved = localStorage.getItem('profile_pic');
    if (saved) setProfilePic(saved);
  };

  const loadProfileData = () => {
    const savedBio = localStorage.getItem('user_bio');
    const savedLocation = localStorage.getItem('user_location');
    const savedGithub = localStorage.getItem('user_github');
    const savedLinkedin = localStorage.getItem('user_linkedin');
    if (savedBio) setFormData(prev => ({ ...prev, bio: savedBio }));
    if (savedLocation) setFormData(prev => ({ ...prev, location: savedLocation }));
    if (savedGithub) setFormData(prev => ({ ...prev, github: savedGithub }));
    if (savedLinkedin) setFormData(prev => ({ ...prev, linkedin: savedLinkedin }));
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePic(base64);
        localStorage.setItem('profile_pic', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('user_bio', formData.bio);
    localStorage.setItem('user_location', formData.location);
    localStorage.setItem('user_github', formData.github);
    localStorage.setItem('user_linkedin', formData.linkedin);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#12121a] transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-2xl font-bold bg-transparent border-b border-indigo-400 dark:border-indigo-500 outline-none text-gray-900 dark:text-white mb-1"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              )}
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Member since {new Date().toLocaleDateString()}</p>
            </div>

            {/* Stats Badge */}
            <div className="text-center">
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.acceptanceRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Offer Rate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Briefcase className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Applications</p>
          </div>
          <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <TrendingUp className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interview}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Interviews</p>
          </div>
          <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Award className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.offer}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Offers</p>
          </div>
          <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.applied}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </motion.div>

        {/* Bio & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
            {isEditing && (
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="I'm a passionate developer..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{formData.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Chennai, India"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{formData.location || 'Not specified'}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://github.com/username"
                />
              ) : (
                <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {formData.github || 'Not added'}
                </a>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {formData.linkedin || 'Not added'}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}