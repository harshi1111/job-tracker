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
      title: '✨ Welcome to PATHGRID!',
      content: 'Let us show you around. This guided tour will help you get started with tracking your job applications.',
      target: null,
      position: 'center',
    },
    {
      title: '📊 Your Stats at a Glance',
      content: 'See your application progress with these quick stats. Numbers roll up automatically!',
      target: '.grid-cols-5',
      position: 'bottom',
    },
    {
      title: '📈 Application Timeline',
      content: 'Track when you applied to jobs over time. Filter by week, month, or all time.',
      target: '.rounded-xl.p-5',
      position: 'bottom',
    },
    {
      title: '🎯 Drag & Drop Kanban Board',
      content: 'Drag and drop cards between columns to update status. Move to "Offer" for a celebration!',
      target: '.grid-cols-1.md\\:grid-cols-5',
      position: 'top',
    },
    {
      title: '➕ Add New Applications',
      content: 'Click here to add a job application. AI will parse the job description for you!',
      target: '.bg-gradient-to-r.from-indigo-600.to-purple-600',
      position: 'bottom',
    },
    {
      title: '🔍 Search & Filter',
      content: 'Search by company or role, and filter by date range.',
      target: '.max-w-md.relative',
      position: 'bottom',
    },
    {
      title: '🌙 Dark Mode',
      content: 'Toggle between light and dark mode for comfortable viewing.',
      target: '.p-2.rounded-xl',
      position: 'bottom',
    },
  ];

  // Highlight current element
  useEffect(() => {
    if (showTour) {
      // Remove all existing highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      // Add highlight to current target
      if (steps[step].target) {
        const element = document.querySelector(steps[step].target!);
        if (element) {
          element.classList.add('tour-highlight');
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [step, showTour, steps]);

  // Update position for tour box
  useEffect(() => {
    const updatePosition = () => {
      if (showTour && tourRef.current) {
        let targetElement = null;
        
        if (steps[step].target) {
          targetElement = document.querySelector(steps[step].target!);
        }
        
        const tourRect = tourRef.current.getBoundingClientRect();
        let top = window.innerHeight / 2 - tourRect.height / 2;
        let left = window.innerWidth / 2 - tourRect.width / 2;
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          
          if (steps[step].position === 'bottom') {
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2 - tourRect.width / 2;
          } else if (steps[step].position === 'top') {
            top = rect.top - tourRect.height - 20;
            left = rect.left + rect.width / 2 - tourRect.width / 2;
          }
          
          // Keep within viewport
          top = Math.max(20, Math.min(top, window.innerHeight - tourRect.height - 20));
          left = Math.max(20, Math.min(left, window.innerWidth - tourRect.width - 20));
        }
        
        setPosition({ top, left });
      }
    };
    
    updatePosition();
    
    if (showTour) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [step, showTour, steps]);

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
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
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
      `}</style>
      
      {/* Semi-transparent overlay - NOT full blur to avoid blank screen */}
      <div 
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleClose}
      />
      
      <div
        ref={tourRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: 'all 0.3s ease',
          zIndex: 1002,
        }}
        className="w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 border-2 border-indigo-500"
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