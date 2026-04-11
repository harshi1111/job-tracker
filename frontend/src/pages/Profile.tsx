import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout } from '../services/auth.service';
import { getApplications } from '../services/application.service';
import api from '../services/api';
import { 
  User, Mail, Calendar, Briefcase, Award, TrendingUp, 
  LogOut, Camera, Save, X, Plus, Trash2, Key, AlertCircle
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = getCurrentUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ id: string; platform: string; url: string }[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    acceptanceRate: 0
  });

  const platforms = [
    'GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 
    'Portfolio', 'Medium', 'Dev.to', 'Hashnode', 'Discord', 'Reddit'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchApplications();
    loadProfilePic();
    loadSocialLinks();
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

  const loadSocialLinks = () => {
    const saved = localStorage.getItem('social_links');
    if (saved) {
      setSocialLinks(JSON.parse(saved));
    } else {
      setSocialLinks([]);
    }
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

  const handleSaveLinks = () => {
    localStorage.setItem('social_links', JSON.stringify(socialLinks));
    setIsEditing(false);
  };

  const addSocialLink = () => {
    if (newPlatform && newUrl) {
      setSocialLinks([
        ...socialLinks,
        { id: Date.now().toString(), platform: newPlatform, url: newUrl }
      ]);
      setNewPlatform('');
      setNewUrl('');
    }
  };

  const addCustomLink = () => {
    if (customPlatform && customUrl) {
      setSocialLinks([
        ...socialLinks,
        { id: Date.now().toString(), platform: customPlatform, url: customUrl }
      ]);
      setCustomPlatform('');
      setCustomUrl('');
      setShowCustomInput(false);
    }
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (!newPassword || newPassword.trim() === '') {
      setPasswordError('Password cannot be empty');
      return;
    }
    
    setUpdating(true);
    
    try {
      await api.put('/user/password', { newPassword });
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      await api.delete('/user/account');
      logout();
      navigate('/register');
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#12121a] transition-colors duration-300">
        
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0f]/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
              >
                {isEditing ? 'Cancel' : 'Edit Links'}
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

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" /> Change Password
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Account
                  </button>
                </div>
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
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
              <Briefcase className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Applications</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
              <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.interview}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Interviews</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
              <Award className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.offer}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Offers</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
              <Calendar className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.applied}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
              {isEditing && (
                <button onClick={handleSaveLinks} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                  <Save className="w-4 h-4" /> Save Links
                </button>
              )}
            </div>

            {isEditing && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add New Link</h3>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select Platform</option>
                    {platforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add custom platform not in list
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <input
                      type="text"
                      value={customPlatform}
                      onChange={(e) => setCustomPlatform(e.target.value)}
                      placeholder="Platform name (e.g., Behance, Dribbble)"
                      className="flex-1 px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      onClick={addCustomLink}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Add Custom
                    </button>
                    <button
                      onClick={() => setShowCustomInput(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {socialLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No social links added yet.
                {!isEditing && <p className="text-sm mt-1">Click "Edit Links" to add your profiles.</p>}
              </div>
            ) : (
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{link.platform}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                      >
                        {link.url}
                      </a>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeSocialLink(link.id)}
                        className="p-1 text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Change Password Modal - No Current Password */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowPasswordModal(false)} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-500" />
                    Change Password
                  </h2>
                  <button 
                    onClick={() => setShowPasswordModal(false)} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowDeleteModal(false)} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-rose-600 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Delete Account
                  </h2>
                  <button 
                    onClick={() => setShowDeleteModal(false)} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800">
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    <strong>Warning:</strong> This action is permanent. All your applications, social links, and profile data will be deleted forever.
                  </p>
                </div>

                {deleteError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Type <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      placeholder="DELETE"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteConfirmText !== 'DELETE'}
                      className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}