import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout } from '../services/auth.service';
import { getApplications } from '../services/application.service';
import api from '../services/api';
import { 
  User, Mail, Calendar, Briefcase, Award, TrendingUp, Settings, 
  LogOut, Camera, Save, X, Github, Linkedin, Twitter, Globe, 
  Lock, Eye, EyeOff, CheckCircle 
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = getCurrentUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
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
    const savedTwitter = localStorage.getItem('user_twitter');
    const savedWebsite = localStorage.getItem('user_website');
    if (savedBio) setFormData(prev => ({ ...prev, bio: savedBio }));
    if (savedLocation) setFormData(prev => ({ ...prev, location: savedLocation }));
    if (savedGithub) setFormData(prev => ({ ...prev, github: savedGithub }));
    if (savedLinkedin) setFormData(prev => ({ ...prev, linkedin: savedLinkedin }));
    if (savedTwitter) setFormData(prev => ({ ...prev, twitter: savedTwitter }));
    if (savedWebsite) setFormData(prev => ({ ...prev, website: savedWebsite }));
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
    localStorage.setItem('user_twitter', formData.twitter);
    localStorage.setItem('user_website', formData.website);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // In a real app, call API to change password
      // For now, simulate success
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const socialLinks = [
    { key: 'github', icon: Github, color: '#333', placeholder: 'https://github.com/username', label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, color: '#0077b5', placeholder: 'https://linkedin.com/in/username', label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, color: '#1da1f2', placeholder: 'https://twitter.com/username', label: 'Twitter' },
    { key: 'website', icon: Globe, color: '#6366f1', placeholder: 'https://yourwebsite.com', label: 'Website' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#12121a] transition-colors duration-300">
      
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
            <div className="flex gap-2">
              {isEditing && (
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              )}
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <Lock className="w-4 h-4" /> Change Password
              </button>
            </div>
          </div>

          {/* Change Password Modal */}
          {isChangingPassword && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Change Password</h3>
              {passwordError && <p className="text-sm text-rose-500 mb-3">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-emerald-500 mb-3 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {passwordSuccess}</p>}
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError('');
                      setPasswordSuccess('');
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
            {socialLinks.map((social) => (
              <div key={social.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <social.icon className="w-4 h-4" style={{ color: social.color }} />
                  {social.label}
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData[social.key as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [social.key]: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder={social.placeholder}
                  />
                ) : (
                  <a
                    href={formData[social.key as keyof typeof formData] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {formData[social.key as keyof typeof formData] || 'Not added'}
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}