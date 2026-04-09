import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import ShapeGrid from '../components/ShapeGrid';

export default function Landing() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalJobs: 0,
    aiAccuracy: 95,
    freeForever: '100%'
  });
  const [loading, setLoading] = useState(true);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats({
          totalJobs: response.data.totalApplications || 0,
          aiAccuracy: response.data.aiAccuracy || 95,
          freeForever: '100%'
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          totalJobs: 0,
          aiAccuracy: 95,
          freeForever: '100%'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const features = [
    { icon: '🤖', title: 'AI-Powered Parsing', desc: 'Paste any job description - AI extracts company, role, and skills instantly', color: 'from-cyan-500 to-blue-500' },
    { icon: '📋', title: 'Kanban Pipeline', desc: 'Drag & drop applications across 5 stages: Applied → Phone → Interview → Offer → Rejected', color: 'from-indigo-500 to-purple-500' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Track your progress with interactive charts and stats that update in real-time', color: 'from-emerald-500 to-teal-500' },
    { icon: '✨', title: 'Resume Suggestions', desc: 'Get AI-generated, role-specific bullet points you can copy to your resume', color: 'from-amber-500 to-orange-500' },
    { icon: '🔍', title: 'Search & Filter', desc: 'Find any application instantly with powerful search and date filters', color: 'from-pink-500 to-rose-500' },
    { icon: '📤', title: 'Export Data', desc: 'Export all your applications to CSV for sharing or backup', color: 'from-violet-500 to-purple-500' },
  ];

  const displayStats = [
    { value: stats.totalJobs + '+', label: 'Jobs Tracked' },
    { value: stats.aiAccuracy + '%', label: 'AI Accuracy' },
    { value: stats.freeForever, label: 'Free Forever' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden relative ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]' 
        : 'bg-gray-50'
    }`}>
      
      {/* ShapeGrid Background - Full screen, receives mouse events */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'auto' }}>
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor={theme === 'dark' ? '#271E37' : '#ccccdd'}
          hoverFillColor={theme === 'dark' ? '#6366f1' : '#818cf8'}
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* Content wrapper - allows mouse events to pass through to grid */}
      <div className="relative z-10" style={{ pointerEvents: 'none' }}>
        
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center px-4 pt-20"
        >
          <div className="text-center max-w-5xl mx-auto relative z-10" style={{ pointerEvents: 'auto' }}>
            {/* Animated logo - Using your images */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-4 mb-8"
              style={{ pointerEvents: 'none' }}
            >
              <img 
                src={theme === 'dark' ? '/logoalone.png' : '/logoalonewhite.png'} 
                alt="Logo" 
                className="w-16 h-16 object-contain"
              />
              <img 
                src={theme === 'dark' ? '/textonly.png' : '/textonlywhite.png'} 
                alt="PATHGRID" 
                className="h-10 object-contain"
              />
            </motion.div>

            {/* Headline - Added pointerEvents: 'none' so hover effect shows through */}
            <motion.h1 
              style={{ pointerEvents: 'none' }}
              className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Navigate Your
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent block">
                Career Path
              </span>
            </motion.h1>

            {/* Description - Added pointerEvents: 'none' so hover effect shows through */}
            <motion.p 
              style={{ pointerEvents: 'none' }}
              className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AI-powered job tracking that helps you organize applications, 
              generate tailored resume suggestions, and land your dream job faster.
            </motion.p>

            {/* Buttons - Keep clickable (no change) */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started Free</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all ${
                  theme === 'dark' 
                    ? 'border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-400' 
                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600'
                }`}
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Stats - Added pointerEvents: 'none' so hover effect shows through */}
            <motion.div 
              style={{ pointerEvents: 'none' }}
              className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {displayStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + idx * 0.1, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <div className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {loading && stat.label !== 'Free Forever' ? '...' : stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={featuresRef}
          className="py-20 px-4 relative"
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className={`text-3xl md:text-4xl font-bold text-center mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ y: 50, opacity: 0 }}
              animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              Everything you need to
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"> track smarter</span>
            </motion.h2>
            
            <motion.p 
              className={`text-center mb-12 max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
              initial={{ y: 30, opacity: 0 }}
              animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              From application tracking to resume optimization - PATHGRID streamlines your entire job search
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                    theme === 'dark' 
                      ? 'bg-[#1a1a2e]/50 border-gray-700 hover:border-cyan-500/50' 
                      : 'bg-white/50 border-gray-200 hover:border-cyan-300'
                  } shadow-lg hover:shadow-xl`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{feature.title}</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          ref={ctaRef}
          className="py-20 px-4 text-center relative"
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0, y: 50 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to transform your job search?
            </h2>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join thousands of job seekers who use PATHGRID to track, optimize, and succeed.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Start Your Journey →</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
            </motion.button>
          </div>
        </motion.section>
        
      </div>
    </div>
  );
}