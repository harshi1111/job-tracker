import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface KanbanTourProps {
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}

export default function KanbanTour({ showTour, setShowTour }: KanbanTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  const [waitingForNavigation, setWaitingForNavigation] = useState(false);

  const steps = [
    // Dashboard steps (0-10)
    {
      title: 'Welcome to PATHGRID',
      content: 'Your AI-powered job tracking companion. Let us walk you through all the features.',
      target: null,
      position: 'center',
      page: 'dashboard',
    },
    {
      title: 'Daily Inspiration',
      content: 'Stay motivated with curated quotes about careers and perseverance.',
      target: '.flex-shrink-0.border',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Your Progress Dashboard',
      content: 'See your application counts at a glance. The numbers roll up smoothly as you add more jobs.',
      target: '.grid-cols-5',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Application Timeline',
      content: 'Visualize your job search journey. Filter by week, month, or see your entire history.',
      target: '.h-full.border.rounded-xl.overflow-hidden:has(canvas)',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Smart Reminders',
      content: 'Never miss a follow-up! Set reminder dates for each application. Overdue items will be highlighted in red.',
      target: '.mb-6 > div:first-child',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Drag & Drop Kanban',
      content: 'Move cards between columns as you progress. Get a celebration when you land an offer!',
      target: '.grid-cols-1.md\\:grid-cols-5',
      position: 'top',
      page: 'dashboard',
    },
    {
      title: 'AI-Powered Application',
      content: 'Click here to add a job. Paste any description and our AI will extract company, role, and skills instantly.',
      target: '.bg-gradient-to-r.from-indigo-600.to-purple-600',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Search & Filter',
      content: 'Quickly find applications by company or role. Filter by date range to focus on recent activity.',
      target: '.relative.border',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Export Your Data',
      content: 'Download all your applications as a CSV file. Perfect for sharing or backup.',
      target: '.bg-gray-100',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Dark Mode',
      content: 'Switch between light and dark themes for comfortable viewing anytime.',
      target: '.p-2.rounded-xl.bg-gray-100:has(.w-5.h-5)',
      position: 'bottom',
      page: 'dashboard',
    },
    {
      title: 'Help & Support',
      content: 'Need help? Click the question mark button or use the floating chat button at the bottom right for FAQs and feedback.',
      target: '.fixed.bottom-6.right-6',
      position: 'top',
      page: 'dashboard',
    },
    // Profile steps (11-16) - will navigate to Profile
    {
      title: 'Your Profile',
      content: 'Click your avatar to go to Profile page where you can manage your account settings.',
      target: '.w-8.h-8.rounded-lg',
      position: 'bottom',
      page: 'dashboard',
      navigateTo: '/profile',
    },
    {
      title: 'Change Password',
      content: 'On your Profile page, click "Change Password" to update your password anytime.',
      target: '.text-sm.text-indigo-600',
      position: 'bottom',
      page: 'profile',
    },
    {
      title: 'Security Question',
      content: 'Set a security question to recover your password if you forget it. This is optional but recommended.',
      target: '.text-sm.text-emerald-600',
      position: 'bottom',
      page: 'profile',
    },
    {
      title: 'Social Links',
      content: 'Add your GitHub, LinkedIn, Twitter, or custom social links to showcase your professional presence.',
      target: '.text-lg.font-semibold.text-gray-900',
      position: 'bottom',
      page: 'profile',
    },
    {
      title: 'Resume Storage',
      content: 'Upload up to 6 resumes for different roles. Download, edit titles, or delete them anytime.',
      target: '.bg-white\\/90.dark\\:bg-\\[\\#1a1a2e\\]\\/90.rounded-2xl.border.border-gray-200.dark\\:border-gray-700.p-6:last-child',
      position: 'top',
      page: 'profile',
    },
    // Login step (16)
    {
      title: 'Forgot Password',
      content: 'On the Login page, click "Forgot Password?" and answer your security question to reset your password.',
      target: null,
      position: 'center',
      page: 'login',
    },
    // Sign Out step (17)
    {
      title: 'Sign Out',
      content: 'Click the Logout button to securely sign out of your account. Your data is always saved.',
      target: '.p-2.rounded-xl.bg-gray-100',
      position: 'bottom',
      page: 'dashboard',
    },
  ];

  // Check if we're on the right page for current step
  const getCurrentPage = () => {
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/login') return 'login';
    return 'dashboard';
  };

  // Handle navigation when needed
  useEffect(() => {
    if (waitingForNavigation) {
      const currentPage = getCurrentPage();
      const requiredPage = steps[step]?.page;
      
      if (currentPage === requiredPage) {
        setWaitingForNavigation(false);
        // Small delay to let page render
        setTimeout(() => {
          updateTargetAndPosition();
        }, 500);
      }
    }
  }, [location.pathname, waitingForNavigation, step]);

  const updateTargetAndPosition = () => {
    const currentStep = steps[step];
    if (!currentStep.target) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(currentStep.target) as HTMLElement;
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
    }
  };

  // Update target rect when step changes
  useEffect(() => {
    if (showTour && !waitingForNavigation) {
      const currentPage = getCurrentPage();
      const requiredPage = steps[step]?.page;
      
      if (requiredPage && currentPage !== requiredPage) {
        // Don't show highlight, just wait
        setTargetRect(null);
        return;
      }
      
      updateTargetAndPosition();
    }
    
    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        (el as HTMLElement).style.position = '';
        (el as HTMLElement).style.zIndex = '';
      });
    };
  }, [step, showTour, location.pathname]);

  useEffect(() => {
    const updatePosition = () => {
      if (showTour && tourRef.current && !waitingForNavigation) {
        const currentStep = steps[step];
        const currentPage = getCurrentPage();
        const requiredPage = currentStep?.page;
        
        if (requiredPage && currentPage !== requiredPage) {
          // Center the tour card
          const tourRect = tourRef.current.getBoundingClientRect();
          setPosition({
            top: window.innerHeight / 2 - tourRect.height / 2,
            left: window.innerWidth / 2 - tourRect.width / 2,
          });
          return;
        }
        
        let targetElement = null;
        if (currentStep.target) {
          targetElement = document.querySelector(currentStep.target) as HTMLElement;
        }
        
        const tourRect = tourRef.current.getBoundingClientRect();
        let top = window.innerHeight / 2 - tourRect.height / 2;
        let left = window.innerWidth / 2 - tourRect.width / 2;
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          
          if (currentStep.position === 'bottom') {
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2 - tourRect.width / 2;
          } else if (currentStep.position === 'top') {
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
  }, [step, showTour, waitingForNavigation, location.pathname]);

  const handleNext = () => {
    const currentStep = steps[step];
    
    // Check if we need to navigate
    if (currentStep.navigateTo) {
      setWaitingForNavigation(true);
      navigate(currentStep.navigateTo);
      setStep(step + 1);
      return;
    }
    
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
    setWaitingForNavigation(false);
  };

  if (!showTour) return null;

  const currentStep = steps[step];
  const currentPage = getCurrentPage();
  const requiredPage = currentStep?.page;
  const isOnWrongPage = requiredPage && currentPage !== requiredPage && !waitingForNavigation;

  // If on wrong page and not waiting for navigation, show waiting message
  if (isOnWrongPage) {
    return (
      <div
        ref={tourRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1002,
        }}
        className="w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 border-2 border-indigo-500"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2">
            <span className="text-white text-sm font-bold">{step + 1}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {currentStep.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentStep.content}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            ⚡ Navigate to {requiredPage === 'profile' ? 'Profile' : requiredPage} page to continue...
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full ${idx === step ? 'w-4 bg-indigo-500' : idx < step ? 'w-1 bg-indigo-300' : 'w-1 bg-gray-300'}`} />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-3 py-1 text-xs font-medium bg-gray-500 text-white rounded-lg"
            >
              Skip Tour
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-white text-sm font-bold">{step + 1}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {currentStep.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentStep.content}
          </p>
          {currentStep.navigateTo && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
              👆 Click Next to go to Profile page
            </p>
          )}
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