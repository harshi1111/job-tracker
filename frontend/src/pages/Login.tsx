import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { login } from '../services/auth.service';
import api from '../services/api';
import Hyperspeed from '../components/Hyperspeed';
// @ts-ignore
import ShapeGrid from '../components/ShapeGrid';
import { X, Shield, Key, ArrowLeft } from 'lucide-react';

const BlurText = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(' ');
  
  return (
    <div className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'question' | 'newPassword'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateReset = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email');
      return;
    }
    
    setResetLoading(true);
    setResetError('');
    
    try {
      const response = await api.post('/auth/initiate-reset', { email: resetEmail });
      setSecurityQuestion(response.data.securityQuestion);
      setResetStep('question');
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Failed to initiate password reset');
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyAnswer = async () => {
    if (!securityAnswer) {
      setResetError('Please answer the security question');
      return;
    }
    
    setResetLoading(true);
    setResetError('');
    
    try {
      await api.post('/auth/verify-answer', { 
        email: resetEmail, 
        securityAnswer,
        newPassword: '' // We'll send password in next step
      });
      setResetStep('newPassword');
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Incorrect answer');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setResetError('Please fill both password fields');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match');
      return;
    }
    
    
    
    setResetLoading(true);
    setResetError('');
    
    try {
      await api.post('/auth/verify-answer', { 
        email: resetEmail, 
        securityAnswer,
        newPassword
      });
      setResetSuccess('Password reset successfully! You can now login.');
      setTimeout(() => {
        setShowForgotModal(false);
        setResetStep('email');
        setResetEmail('');
        setSecurityQuestion('');
        setSecurityAnswer('');
        setNewPassword('');
        setConfirmNewPassword('');
        setResetSuccess('');
      }, 2000);
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const closeModal = () => {
    setShowForgotModal(false);
    setResetStep('email');
    setResetEmail('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden relative">
      
      {/* ShapeGrid Background */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'auto' }}>
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#6366f1"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* Hyperspeed Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Hyperspeed />
      </div>

      {/* Animated cursor glow */}
      <motion.div
        className="fixed w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none z-0"
        animate={{ x: mousePosition.x - 100, y: mousePosition.y - 100 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      />

      {/* Content wrapper */}
      <div className="relative z-10" style={{ pointerEvents: 'none' }}>
        
        <motion.div 
          style={{ opacity }}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Side - Branding */}
            <div className="flex-1 text-center lg:text-left" style={{ pointerEvents: 'none' }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                className="flex items-center justify-center lg:justify-start mb-8"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#010101] border border-indigo-500 shadow-xl shadow-indigo-500/20">
                  <img 
                    src="/logoalone.png" 
                    alt="PATHGRID Logo" 
                    className="w-16 h-16 object-contain"
                  />
                  <img 
                    src="/textonly.png" 
                    alt="PATHGRID" 
                    className="h-12 object-contain"
                  />
                </div>
              </motion.div>

              <div className="mb-4">
                <BlurText 
                  text="Welcome Back to Your Career Grid"
                  className="text-4xl md:text-5xl font-bold text-white"
                />
              </div>

              <div className="mb-8">
                <BlurText 
                  text="Sign in to continue tracking your applications, get AI-powered resume suggestions, and land your dream job faster."
                  className="text-lg text-gray-400"
                />
              </div>

              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {[
                  { value: 'AI', label: 'Powered Parsing' },
                  { value: '5', label: 'Pipeline Stages' },
                  { value: '100%', label: 'Free Forever' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 200 }}
                    className="text-center lg:text-left group cursor-pointer"
                  >
                    <div className="text-2xl font-bold transition-colors duration-300 group-hover:text-indigo-500 text-cyan-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Login Card */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0" style={{ pointerEvents: 'auto' }}>
              <div className="relative rounded-2xl p-8 bg-[#1a1a2e]/50 backdrop-blur-sm border border-gray-700 shadow-xl">
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />

                <div className="relative">
                  <h2 className="text-2xl font-bold mb-2 text-white">Sign In</h2>
                  <p className="text-sm mb-6 text-gray-400">Enter your credentials to access your account</p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-950/20 border border-red-800 rounded-xl text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 via-cyan-500 via-blue-500 to-purple-600 bg-[length:200%_200%] animate-gradient text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-60 relative overflow-hidden group"
                    >
                      <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Don't have an account?{' '}
                      <a href="/register" className="text-cyan-400 hover:underline font-semibold">
                        Create Account
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={closeModal} 
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
                    <Key className="w-5 h-5 text-cyan-500" />
                    Reset Password
                  </h2>
                  <button 
                    onClick={closeModal} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {resetSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                    {resetSuccess}
                  </div>
                )}

                {resetError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {resetError}
                  </div>
                )}

                {resetStep === 'email' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter your email address and we'll verify your identity using your security question.
                    </p>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button
                      onClick={handleInitiateReset}
                      disabled={resetLoading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {resetLoading ? 'Verifying...' : 'Continue'}
                    </button>
                  </div>
                )}

                {resetStep === 'question' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-cyan-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Security Verification</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Security Question</label>
                      <p className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        {securityQuestion}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Your Answer</label>
                      <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Your answer"
                      />
                      <p className="text-xs text-gray-400 mt-1">Not case sensitive</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setResetStep('email')}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleVerifyAnswer}
                        disabled={resetLoading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {resetLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {resetStep === 'newPassword' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set a new password for your account.
                    </p>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setResetStep('question')}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleSetNewPassword}
                        disabled={resetLoading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {resetLoading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}