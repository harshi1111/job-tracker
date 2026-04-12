import { useEffect, useState, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface KanbanTourProps {
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}

export default function KanbanTour({ showTour, setShowTour }: KanbanTourProps) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: 'Welcome to PATHGRID',
      content: 'Your AI-powered job tracking companion. Let us walk you through the key features.',
      target: null,
      position: 'center',
    },
    {
      title: 'Daily Inspiration',
      content: 'Stay motivated with curated quotes about careers and perseverance.',
      target: '.flex-shrink-0.border',
      position: 'bottom',
    },
    {
      title: 'Your Progress Dashboard',
      content: 'See your application counts at a glance. The numbers roll up smoothly as you add more jobs.',
      target: '.grid-cols-5',
      position: 'bottom',
    },
    {
      title: 'Application Timeline',
      content: 'Visualize your job search journey. Filter by week, month, or see your entire history.',
      target: '.h-full.border.rounded-xl.overflow-hidden:has(canvas)',
      position: 'bottom',
    },
    {
      title: 'Smart Reminders',
      content: 'Never miss a follow-up! Set reminder dates for each application. Overdue items will be highlighted in red.',
      target: '.mb-6 > div:first-child',
      position: 'bottom',
    },
    {
      title: 'Drag & Drop Kanban',
      content: 'Move cards between columns as you progress. Get a celebration when you land an offer!',
      target: '.grid-cols-1.md\\:grid-cols-5',
      position: 'top',
    },
    {
      title: 'AI-Powered Application',
      content: 'Click here to add a job. Paste any description and our AI will extract company, role, and skills instantly.',
      target: '.bg-gradient-to-r.from-indigo-600.to-purple-600',
      position: 'bottom',
    },
    {
      title: 'Search & Filter',
      content: 'Quickly find applications by company or role. Filter by date range to focus on recent activity.',
      target: '.relative.border',
      position: 'bottom',
    },
    {
      title: 'Export Your Data',
      content: 'Download all your applications as a CSV file. Perfect for sharing or backup.',
      target: '.bg-gray-100',
      position: 'bottom',
    },
    {
      title: 'Dark Mode',
      content: 'Switch between light and dark themes for comfortable viewing anytime.',
      target: '.p-2.rounded-xl',
      position: 'bottom',
    },
    {
      title: 'Your Profile',
      content: 'Click your avatar to access Profile settings. Here you can change password, set security question, manage social links, and store your resumes.',
      target: '.w-8.h-8.rounded-lg',
      position: 'bottom',
    },
    {
      title: 'Resume Storage',
      content: 'Upload up to 6 resumes for different roles. Download, edit titles, or delete them anytime. All resumes are safely stored in the cloud.',
      target: '.bg-white\\/90.dark\\:bg-\\[\\#1a1a2e\\]\\/90.rounded-2xl.border.border-gray-200.dark\\:border-gray-700.p-6:last-child',
      position: 'top',
    },
    {
      title: 'Sign Out',
      content: 'Click here to securely sign out of your account. Your data is always saved.',
      target: '.p-2.rounded-xl.bg-gray-100',
      position: 'bottom',
    },
  ];

  // Auto-show tour for new users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('kanbanTourCompleted');
    if (!hasSeenTour && !showTour) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showTour, setShowTour]);

  // Update target rect when step changes
  useEffect(() => {
    if (showTour && steps[step].target) {
      let selector = steps[step].target!;
      
      // For timeline, use a more specific approach
      if (step === 3) {
        const allContainers = document.querySelectorAll('.h-full.border.rounded-xl.overflow-hidden');
        const targetElement = allContainers[1] as HTMLElement;
        
        if (targetElement) {
          document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
          });
          targetElement.classList.add('tour-highlight');
          targetElement.style.position = 'relative';
          targetElement.style.zIndex = '1001';
          const rect = targetElement.getBoundingClientRect();
          setTargetRect(rect);
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      
      // For Profile avatar (step 10)
      if (step === 10) {
        const avatarElement = document.querySelector('.w-8.h-8.rounded-lg') as HTMLElement;
        if (avatarElement) {
          document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
          });
          avatarElement.classList.add('tour-highlight');
          avatarElement.style.position = 'relative';
          avatarElement.style.zIndex = '1001';
          const rect = avatarElement.getBoundingClientRect();
          setTargetRect(rect);
          avatarElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      
      // For Resume Storage (step 11)
      if (step === 11) {
        const resumeSection = document.querySelector('.bg-white\\/90.dark\\:bg-\\[\\#1a1a2e\\]\\/90.rounded-2xl.border.border-gray-200.dark\\:border-gray-700.p-6:last-child') as HTMLElement;
        if (resumeSection) {
          document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
          });
          resumeSection.classList.add('tour-highlight');
          resumeSection.style.position = 'relative';
          resumeSection.style.zIndex = '1001';
          const rect = resumeSection.getBoundingClientRect();
          setTargetRect(rect);
          resumeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      
      // For Sign Out button (step 12)
      if (step === 12) {
        const signOutButton = document.querySelector('.p-2.rounded-xl.bg-gray-100') as HTMLElement;
        if (signOutButton) {
          document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
          });
          signOutButton.classList.add('tour-highlight');
          signOutButton.style.position = 'relative';
          signOutButton.style.zIndex = '1001';
          const rect = signOutButton.getBoundingClientRect();
          setTargetRect(rect);
          signOutButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      
      const element = document.querySelector(selector) as HTMLElement;
      
      if (element) {
        document.querySelectorAll('.tour-highlight').forEach(el => {
          el.classList.remove('tour-highlight');
        });
        element.classList.add('tour-highlight');
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn(`Element not found for selector: ${selector}`);
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
    
    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        (el as HTMLElement).style.position = '';
        (el as HTMLElement).style.zIndex = '';
      });
    };
  }, [step, showTour, steps]);

  useEffect(() => {
    const updatePosition = () => {
      if (showTour && tourRef.current) {
        let targetElement = null;
        
        if (step === 3) {
          const allContainers = document.querySelectorAll('.h-full.border.rounded-xl.overflow-hidden');
          targetElement = allContainers[1] as HTMLElement;
        } else if (step === 10) {
          targetElement = document.querySelector('.w-8.h-8.rounded-lg') as HTMLElement;
        } else if (step === 11) {
          targetElement = document.querySelector('.bg-white\\/90.dark\\:bg-\\[\\#1a1a2e\\]\\/90.rounded-2xl.border.border-gray-200.dark\\:border-gray-700.p-6:last-child') as HTMLElement;
        } else if (step === 12) {
          targetElement = document.querySelector('.p-2.rounded-xl.bg-gray-100') as HTMLElement;
        } else if (steps[step].target) {
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
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
    });
    setShowTour(false);
    localStorage.setItem('kanbanTourCompleted', 'true');
    setStep(0);
    setTargetRect(null);
  };

  if (!showTour) return null;

  const currentStep = steps[step];

  return (
    <>
      <style>{`
        .tour-highlight {
          position: relative !important;
          animation: tourPulse 1s ease-in-out infinite;
          box-shadow: 0 0 0 4px #6366f1, 0 0 0 8px rgba(99, 102, 241, 0.3) !important;
          border-radius: 0.75rem !important;
          z-index: 1001 !important;
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
      
      {/* SVG Blur Overlay with Cutout */}
      <svg 
        className="fixed inset-0 w-full h-full z-50 pointer-events-none"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <mask id="tourMask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                fill="black"
                rx="12"
              />
            )}
          </mask>
        </defs>
        
        <rect 
          width="100%" 
          height="100%" 
          fill="black" 
          fillOpacity="0.5"
          mask="url(#tourMask)"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      </svg>
      
      {/* Tour Card */}
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
            <span className="text-white text-sm font-bold">
              {step + 1}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {currentStep.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentStep.content}
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
                'Got it'
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