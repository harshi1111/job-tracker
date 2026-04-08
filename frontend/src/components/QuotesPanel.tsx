import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const motivationalQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Your work is to discover your work and then give yourself to it.",
    author: "Buddha",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
];

export default function QuotesPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsVisible(true);
      }, 500);
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = motivationalQuotes[currentIndex];

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-xl overflow-hidden border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm h-full">
      <div className="p-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 leading-relaxed mb-3 font-medium">
              "{currentQuote.text}"
            </p>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              — {currentQuote.author}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center gap-1.5 mt-4">
          {motivationalQuotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentIndex(idx);
                  setIsVisible(true);
                }, 300);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex 
                  ? 'w-6 h-1.5 bg-indigo-500 dark:bg-indigo-400' 
                  : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}