import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Phone, Target, Trophy, X } from 'lucide-react';

interface StatsCardsProps {
  applications: any[];
}

// Rolling number component
const RollingNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function StatsCards({ applications }: StatsCardsProps) {
  const stats = {
    total: applications.length,
    phoneScreen: applications.filter(a => a.status === 'phone-screen').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const cards = [
    { label: 'Total', value: stats.total, icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400', bgLight: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'Phone', value: stats.phoneScreen, icon: Phone, color: 'text-amber-600 dark:text-amber-400', bgLight: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Interview', value: stats.interview, icon: Target, color: 'text-purple-600 dark:text-purple-400', bgLight: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Offer', value: stats.offer, icon: Trophy, color: 'text-emerald-600 dark:text-emerald-400', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Rejected', value: stats.rejected, icon: X, color: 'text-rose-600 dark:text-rose-400', bgLight: 'bg-rose-50 dark:bg-rose-950/30' },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-indigo-200 dark:border-gray-700 shadow-md h-full">
      <div className="grid grid-cols-5 h-full">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center justify-center ${
              idx < cards.length - 1 ? 'border-r border-gray-200 dark:border-gray-700' : ''
            }`}
          >
            <div className="text-center py-4">
              <div className={`w-10 h-10 ${card.bgLight} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <card.icon className={`w-5 h-5 ${card.color}`} strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <RollingNumber value={card.value} />
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}