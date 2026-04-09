import type { Application } from './application.service';

export interface OverdueReminder {
  applicationId: string;
  company: string;
  role: string;
  followUpDate: string;
  daysOverdue: number;
  reminderNotes?: string;
}

export const getOverdueReminders = (applications: Application[]): OverdueReminder[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return applications
    .filter(app => {
      if (!app.followUpDate) return false;
      if (app.status === 'offer' || app.status === 'rejected') return false;
      const followUp = new Date(app.followUpDate);
      followUp.setHours(0, 0, 0, 0);
      return followUp < today;
    })
    .map(app => {
      const followUp = new Date(app.followUpDate!);
      const diffTime = today.getTime() - followUp.getTime();
      const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        applicationId: app._id,
        company: app.company,
        role: app.role,
        followUpDate: app.followUpDate!,
        daysOverdue,
        reminderNotes: app.reminderNotes,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
};

export const getUpcomingReminders = (applications: Application[], daysAhead: number = 3): OverdueReminder[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysAhead);
  
  return applications
    .filter(app => {
      if (!app.followUpDate) return false;
      if (app.status === 'offer' || app.status === 'rejected') return false;
      const followUp = new Date(app.followUpDate);
      followUp.setHours(0, 0, 0, 0);
      return followUp >= today && followUp <= futureDate;
    })
    .map(app => {
      const followUp = new Date(app.followUpDate!);
      const diffTime = followUp.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        applicationId: app._id,
        company: app.company,
        role: app.role,
        followUpDate: app.followUpDate!,
        daysOverdue: -daysUntil,
        reminderNotes: app.reminderNotes,
      };
    });
};