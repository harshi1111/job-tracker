import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { Application } from '../services/application.service';
import { getOverdueReminders, getUpcomingReminders } from '../services/reminder.service';
import type { OverdueReminder } from '../services/reminder.service';

interface ReminderPanelProps {
  applications: Application[];
  onApplicationClick: (app: Application) => void;
}

export default function ReminderPanel({ applications, onApplicationClick }: ReminderPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [overdue, setOverdue] = useState<OverdueReminder[]>([]);
  const [upcoming, setUpcoming] = useState<OverdueReminder[]>([]);
  
  useEffect(() => {
    setOverdue(getOverdueReminders(applications));
    setUpcoming(getUpcomingReminders(applications, 7));
  }, [applications]);
  
  const totalReminders = overdue.length + upcoming.length;
  
  if (totalReminders === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Bell className="w-4 h-4" />
          <span className="text-sm">No pending reminders</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white dark:bg-[#1a1a2e] rounded-xl border ${
      overdue.length > 0 
        ? 'border-rose-300 dark:border-rose-800 shadow-lg shadow-rose-500/10' 
        : 'border-amber-300 dark:border-amber-800'
    } transition-all`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {overdue.length > 0 ? (
            <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
          ) : (
            <Bell className="w-5 h-5 text-amber-500" />
          )}
          <span className="font-semibold text-gray-900 dark:text-white">
            {overdue.length > 0 ? 'Overdue Follow-ups' : 'Upcoming Follow-ups'}
          </span>
          {overdue.length > 0 && (
            <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold">
              {overdue.length} overdue
            </span>
          )}
          {upcoming.length > 0 && overdue.length === 0 && (
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full text-xs">
              {upcoming.length} upcoming
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              {overdue.map(reminder => {
                const app = applications.find(a => a._id === reminder.applicationId);
                return (
                  <div
                    key={reminder.applicationId}
                    onClick={() => app && onApplicationClick(app)}
                    className="p-3 rounded-xl cursor-pointer transition-all hover:shadow-md bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {reminder.company}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{reminder.role}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-rose-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Due: {new Date(reminder.followUpDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-500" />
                            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                              {reminder.daysOverdue} day{reminder.daysOverdue !== 1 ? 's' : ''} overdue
                            </span>
                          </div>
                        </div>
                        {reminder.reminderNotes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            📝 {reminder.reminderNotes}
                          </p>
                        )}
                      </div>
                      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
              
              {upcoming.map(reminder => {
                const app = applications.find(a => a._id === reminder.applicationId);
                return (
                  <div
                    key={reminder.applicationId}
                    onClick={() => app && onApplicationClick(app)}
                    className="p-3 rounded-xl cursor-pointer transition-all hover:shadow-md bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {reminder.company}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{reminder.role}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(reminder.followUpDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              in {-reminder.daysOverdue} day{-reminder.daysOverdue !== -1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        {reminder.reminderNotes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            📝 {reminder.reminderNotes}
                          </p>
                        )}
                      </div>
                      <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}