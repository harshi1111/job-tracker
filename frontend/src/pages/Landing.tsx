import { useRef } from 'react'; // Remove useEffect
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, Brain, Clock, Shield } from 'lucide-react';
import ThreeDBackground from '../components/ThreeDBackground';
import MagneticCursor from '../components/MagneticCursor';

export default function Landing() {
  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div ref={targetRef} className="relative min-h-screen overflow-hidden">
      <ThreeDBackground />
      <MagneticCursor />
      
      {/* Hero Section */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Job Tracking
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let AI parse job descriptions, generate tailored resume suggestions, 
            and track your applications with our intelligent Kanban board.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto"
        >
          {[
            { icon: Brain, title: "AI Parsing", desc: "Auto-extract company, role, and skills from job descriptions" },
            { icon: Briefcase, title: "Kanban Board", desc: "Drag & drop applications across 5 pipeline stages" },
            { icon: Clock, title: "Smart Analytics", desc: "Track your progress with interactive charts" },
            { icon: Shield, title: "Resume Tips", desc: "Get AI-generated bullet points tailored to each role" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}