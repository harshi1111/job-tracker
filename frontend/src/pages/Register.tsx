import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { register } from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';
import Hyperspeed from '../components/Hyperspeed';
import ShapeGrid from '../components/ShapeGrid';

// Blur Text Component
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
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden relative ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]' 
        : 'bg-gray-50'
    }`}>
      
      {/* ShapeGrid Background - BRIGHTER LINES */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'auto' }}>
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor={theme === 'dark' ? '#6a5a8a' : '#6666aa'}
          hoverFillColor={theme === 'dark' ? '#a0a0ff' : '#4f46e5'}
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* Hyperspeed Background */}
      {theme === 'dark' && (
        <div className="fixed inset-0 z-0 opacity-10">
          <Hyperspeed />
        </div>
      )}

      {/* Animated cursor glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      />

      {/* Main Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side - Branding with Blur Text */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo with solid #010101 background - SAME AS LOGIN */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              className="flex items-center justify-center lg:justify-start mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#010101] border border-cyan-500 shadow-xl shadow-cyan-500/20">
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

            {/* Blur Text Headline */}
            <div className="mb-4">
              <BlurText 
                text="Join the PATHGRID Community"
                className={`text-4xl md:text-5xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              />
            </div>

            {/* Blur Text Description */}
            <div className="mb-8">
              <BlurText 
                text="Start tracking your job applications with AI-powered insights and never lose sight of your career goals."
                className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              />
            </div>

            {/* Stats - Numbers turn indigo on hover */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-gray-200 dark:border-gray-800"
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
                  <div className={`text-2xl font-bold transition-colors duration-300 group-hover:text-indigo-500 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Register Card */}
          <motion.div
            className="flex-1 w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={`relative rounded-2xl p-8 ${
              theme === 'dark' 
                ? 'bg-[#1a1a2e]/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white/50 backdrop-blur-sm border border-gray-200'
            } shadow-xl`}>
              
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />

              <div className="relative">
                <h2 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Create Account</h2>
                <p className={`text-sm mb-6 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Start your journey with PATHGRID</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-[#0a0a0f] text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 via-indigo-500 to-purple-600 bg-[length:200%_200%] animate-gradient text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-60 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Already have an account?{' '}
                    <a href="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}