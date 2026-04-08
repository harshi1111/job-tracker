import { useEffect, useState, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface KanbanTourProps {
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}

export default function KanbanTour({ showTour, setShowTour }: KanbanTourProps) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tourRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: '✨ Welcome to JobTrackAI!',
      content: 'Let us show you around. This guided tour will help you get started with tracking your job applications.',
      target: null,
      position: 'center',
    },
    {
      title: '📊 Your Stats at a Glance',
      content: 'See your application progress with these quick stats.',
      target: '.grid-cols-5.gap-3',
      position: 'bottom',
    },
    {
      title: '📈 Application Timeline',
      content: 'Track when you applied to jobs over time.',
      target: '.rounded-2xl.p-5',
      position: 'bottom',
    },
    {
      title: '🎯 Drag & Drop Kanban Board',
      content: 'Drag and drop cards between columns to update status.',
      target: '.grid-cols-1.md\\:grid-cols-5',
      position: 'top',
    },
    {
      title: '➕ Add New Applications',
      content: 'Click here to add a job application with AI parsing.',
      target: '.bg-gradient-to-r.from-indigo-600.to-purple-600',
      position: 'bottom',
    },
    {
      title: '🔍 Search & Filter',
      content: 'Search by company or role, and filter by date.',
      target: '.max-w-md.relative',
      position: 'bottom',
    },
    {
      title: '🌙 Dark Mode',
      content: 'Toggle between light and dark mode.',
      target: '.p-1.5.rounded-xl:last-of-type',
      position: 'bottom',
    },
  ];

  useEffect(() => {
    if (showTour && steps[step].target) {
      // Remove highlight from previous element
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      // Add highlight to current element
      const element = document.querySelector(steps[step].target!);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tour-highlight');
        
        // Calculate position for tour box
        const rect = element.getBoundingClientRect();
        const tourRect = tourRef.current?.getBoundingClientRect();
        
        if (tourRect) {
          let top = 0;
          let left = rect.left + rect.width / 2 - tourRect.width / 2;
          
          if (steps[step].position === 'bottom') {
            top = rect.bottom + 16;
          } else if (steps[step].position === 'top') {
            top = rect.top - tourRect.height - 16;
          } else {
            top = window.innerHeight / 2 - tourRect.height / 2;
            left = window.innerWidth / 2 - tourRect.width / 2;
          }
          
          // Ensure tour box stays within viewport
          top = Math.max(16, Math.min(top, window.innerHeight - tourRect.height - 16));
          left = Math.max(16, Math.min(left, window.innerWidth - tourRect.width - 16));
          
          setPosition({ top, left });
        }
      }
    }
    
    return () => {
      // Cleanup - don't remove highlights immediately to avoid flicker
    };
  }, [step, showTour, steps]);

  // Update position on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (showTour && steps[step].target && tourRef.current) {
        const element = document.querySelector(steps[step].target!);
        if (element) {
          const rect = element.getBoundingClientRect();
          const tourRect = tourRef.current.getBoundingClientRect();
          
          let top = 0;
          let left = rect.left + rect.width / 2 - tourRect.width / 2;
          
          if (steps[step].position === 'bottom') {
            top = rect.bottom + 16;
          } else if (steps[step].position === 'top') {
            top = rect.top - tourRect.height - 16;
          }
          
          top = Math.max(16, Math.min(top, window.innerHeight - tourRect.height - 16));
          left = Math.max(16, Math.min(left, window.innerWidth - tourRect.width - 16));
          
          setPosition({ top, left });
        }
      }
    };
    
    if (showTour) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showTour, step, steps]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    // Remove all highlights first
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    // Close the tour
    setShowTour(false);
    localStorage.setItem('kanbanTourCompleted', 'true');
    setStep(0);
  };

  if (!showTour) return null;

  return (
    <>
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 1001;
          animation: tourPulse 1s ease-in-out infinite;
          box-shadow: 0 0 0 4px #6366f1, 0 0 0 8px rgba(99, 102, 241, 0.3);
          border-radius: 0.75rem;
        }
        
        @keyframes tourPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px #6366f1, 0 0 0 8px rgba(99, 102, 241, 0.3);
          }
          50% {
            box-shadow: 0 0 0 6px #6366f1, 0 0 0 12px rgba(99, 102, 241, 0.5);
          }
        }
        
        /* Blur everything except highlighted element */
        .tour-blur {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
        }
      `}</style>
      
      {/* Blur overlay */}
      <div className="tour-blur" onClick={handleClose} />
      
      <div
        ref={tourRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: 'all 0.3s ease',
          zIndex: 1002,
        }}
        className="w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2">
            <span className="text-lg">
              {step === 0 ? '✨' : step === 1 ? '📊' : step === 2 ? '📈' : step === 3 ? '🎯' : step === 4 ? '➕' : step === 5 ? '🔍' : '🌙'}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {steps[step].title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {steps[step].content}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === step 
                    ? 'w-4 bg-indigo-500' 
                    : idx < step 
                    ? 'w-1 bg-indigo-300' 
                    : 'w-1 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
            >
              {step === steps.length - 1 ? (
                'Got it! ✨'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}