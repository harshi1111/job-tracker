import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { register } from '../services/auth.service';
import Hyperspeed from '../components/Hyperspeed';
// @ts-ignore
import ShapeGrid from '../components/ShapeGrid';
import { Shield, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

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

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSecurity, setShowSecurity] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

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
      await register({ 
        name, 
        email, 
        password,
        securityQuestion: showSecurity ? securityQuestion : '',
        securityAnswer: showSecurity ? securityAnswer : ''
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
                  text="Join the PATHGRID Community"
                  className="text-4xl md:text-5xl font-bold text-white"
                />
              </div>

              <div className="mb-8">
                <BlurText 
                  text="Start tracking your job applications with AI-powered insights and never lose sight of your career goals."
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

            {/* Right Side - Register Card - SCROLLABLE */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0" style={{ pointerEvents: 'auto' }}>
              <div className="relative rounded-2xl p-8 bg-[#1a1a2e]/50 backdrop-blur-sm border border-gray-700 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />

                <div className="relative">
                  <h2 className="text-2xl font-bold mb-2 text-white">Create Account</h2>
                  <p className="text-sm mb-6 text-gray-400">Start your journey with PATHGRID</p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-950/20 border border-red-800 rounded-xl text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                        placeholder="John Doe"
                        required
                      />
                    </div>

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

                    {/* Collapsible Security Question Section */}
                    <div className="border-t border-gray-700 pt-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowSecurity(!showSecurity)}
                        className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span>Security Question (Optional - for password recovery)</span>
                        </div>
                        {showSecurity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <AnimatePresence>
                        {showSecurity && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 space-y-3">
                              {/* Info Popup Button */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onMouseEnter={() => setShowInfoPopup(true)}
                                  onMouseLeave={() => setShowInfoPopup(false)}
                                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  <Info className="w-3 h-3" />
                                  Why do I need this?
                                </button>

                                {/* Tooltip Popup */}
                                <AnimatePresence>
                                  {showInfoPopup && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      className="absolute z-50 left-0 top-6 w-64 p-3 bg-gray-800 border border-gray-700 rounded-xl shadow-xl"
                                    >
                                      <p className="text-xs text-gray-300 leading-relaxed">
                                        This helps you reset your password if you forget it. Your answer is encrypted and only you know it. You can also set this later in your Profile settings.
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <select
                                value={securityQuestion}
                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                              >
                                <option value="">Select a security question</option>
                                <option value="What was your first pet's name?">What was your first pet's name?</option>
                                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                <option value="What city were you born in?">What city were you born in?</option>
                                <option value="What was your first school?">What was your first school?</option>
                                <option value="What is your favorite book?">What is your favorite book?</option>
                                <option value="What year did you graduate high school?">What year did you graduate high school?</option>
                              </select>

                              <input
                                type="text"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                                placeholder="Your answer (not case sensitive)"
                              />
                              <p className="text-xs text-gray-500">
                                You can also set or update this later in your Profile settings.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 via-cyan-500 via-blue-500 to-purple-600 bg-[length:200%_200%] animate-gradient text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-60 relative overflow-hidden group"
                    >
                      <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Already have an account?{' '}
                      <a href="/login" className="text-cyan-400 hover:underline font-semibold">
                        Sign In
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}