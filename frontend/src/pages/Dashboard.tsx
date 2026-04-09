import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { logout, getCurrentUser } from '../services/auth.service';
import { getApplications, updateApplication, deleteApplication } from '../services/application.service';
import type { Application } from '../services/application.service';
import AddApplicationModal from '../components/AddApplicationModal';
import EditApplicationModal from '../components/EditApplicationModal';
import ApplicationChart from '../components/ApplicationChart';
import QuotesPanel from '../components/QuotesPanel';
import StatsCards from '../components/StatsCards';
import ReminderPanel from '../components/ReminderPanel';
import { Download, Sun, Moon, Sparkles, Plus, Search, LogOut, ChevronDown, Calendar, Filter, X, HelpCircle, Edit3, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import KanbanTour from '../components/KanbanTour';
import Iridescence from '../components/Iridescence';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const jobTitles = [
  "Frontend Developer", "Full Stack Engineer", "Data Scientist", 
  "Product Manager", "UI/UX Designer", "DevOps Engineer",
  "Backend Developer", "ML Engineer", "Software Architect",
  "iOS Developer", "Android Developer", "Cloud Engineer"
];

const columns = [
  { id: 'applied', title: 'Applied', color: 'text-indigo-600 dark:text-indigo-400', hoverColor: 'hover:text-indigo-700 dark:hover:text-indigo-300' },
  { id: 'phone-screen', title: 'Phone Screen', color: 'text-amber-600 dark:text-amber-400', hoverColor: 'hover:text-amber-700 dark:hover:text-amber-300' },
  { id: 'interview', title: 'Interview', color: 'text-purple-600 dark:text-purple-400', hoverColor: 'hover:text-purple-700 dark:hover:text-purple-300' },
  { id: 'offer', title: 'Offer', color: 'text-emerald-600 dark:text-emerald-400', hoverColor: 'hover:text-emerald-700 dark:hover:text-emerald-300' },
  { id: 'rejected', title: 'Rejected', color: 'text-rose-600 dark:text-rose-400', hoverColor: 'hover:text-rose-700 dark:hover:text-rose-300' },
];

// Helper function to check if an application's follow-up is overdue
const isOverdue = (app: Application) => {
  if (!app.followUpDate) return false;
  if (app.status === 'offer' || app.status === 'rejected') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(app.followUpDate);
  followUp.setHours(0, 0, 0, 0);
  return followUp < today;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [celebration, setCelebration] = useState<{ show: boolean; company: string; role: string }>({ show: false, company: '', role: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; company: string; role: string } | null>(null);
  const [customDate, setCustomDate] = useState('');
  
  const kanbanRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { theme, toggleTheme } = useTheme();
  const user = getCurrentUser();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!loading && applications.length >= 0) {
      const hasSeenTour = localStorage.getItem('kanbanTourCompleted');
      if (!hasSeenTour && !showTour) {
        setTimeout(() => setShowTour(true), 1000);
      }
    }
  }, [loading, applications.length]);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColumnBorderColor = (columnId: string) => {
    switch(columnId) {
      case 'applied':
        return 'border-indigo-500';
      case 'phone-screen':
        return 'border-amber-500';
      case 'interview':
        return 'border-purple-500';
      case 'offer':
        return 'border-emerald-500';
      case 'rejected':
        return 'border-rose-500';
      default:
        return 'border-gray-500';
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const movedApp = applications.find(app => app._id === draggableId);
    
    setApplications(prev => prev.map(app => app._id === draggableId ? { ...app, status: newStatus } : app));
    
    // Celebration effect when moved to Offer - ONLY CONFETTI
    if (newStatus === 'offer' && movedApp && movedApp.status !== 'offer') {
      setCelebration({ show: true, company: movedApp.company, role: movedApp.role });
      setTimeout(() => setCelebration({ show: false, company: '', role: '' }), 3000);
    }
    
    try {
      await updateApplication(draggableId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchApplications();
    }
  };

  const handleDeleteClick = (id: string, company: string, role: string) => {
    setDeleteTarget({ id, company, role });
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (deleteTarget) {
        try {
            await deleteApplication(deleteTarget.id);
            fetchApplications();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
        setDeleteTarget(null);
    }
  };

  const handleCardClick = (app: Application) => {
    setSelectedApplication(app);
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const exportToCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Date Applied', 'Notes', 'Salary Range', 'Follow-up Date', 'Reminder Notes'];
    const rows = applications.map(app => [
      app.company, app.role, app.status,
      new Date(app.dateApplied).toLocaleDateString(),
      app.notes || '', app.salaryRange || '',
      app.followUpDate ? new Date(app.followUpDate).toLocaleDateString() : '',
      app.reminderNotes || '',
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredApplicationsByStatus = (status: string) => {
    let filtered = applications.filter(app => app.status === status);
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(app => {
        const appDate = new Date(app.dateApplied);
        if (dateFilter === 'week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return appDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return appDate >= monthAgo;
        } else if (dateFilter === 'year') {
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          return appDate >= yearAgo;
        }
        return true;
      });
    }
    return filtered;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      if (kanbanRef.current && e.target.value) {
        kanbanRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setCustomDate('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleHelpClick = () => setShowTour(true);

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDate(value);
  };

  const applyCustomDate = () => {
    if (customDate) {
      setShowDateFilter(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#12121a] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-[#12121a] transition-colors duration-300 relative">
      
      {/* Iridescence Background - ONLY in light mode */}
      {theme === 'light' && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.35 }}>
          <Iridescence /> 
        </div>
      )}
      
      {/* Subtle Mesh Gradient Background - ONLY in light mode */}
      {theme === 'light' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Base soft gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 via-white/30 to-cyan-100/60" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-200/30 to-transparent" />
        </div>
      )}
      
      {/* Celebration Effect - ONLY CONFETTI */}
      <AnimatePresence>
        {celebration.show && (
          <>
            <div className="fixed inset-0 z-50 pointer-events-none">
              {Array.from({ length: 120 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: 360 * (Math.random() * 3 + 1),
                    scale: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 1.5,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden py-2 bg-white/30 dark:bg-black/20 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...jobTitles, ...jobTitles].map((title, i) => (
            <span key={i} className="text-xs text-gray-600 dark:text-gray-400">
              {title}
              <span className="mx-4 text-indigo-400">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all ${
        theme === 'dark' 
          ? 'bg-[#0a0a0f]/80 border-gray-800' 
          : 'bg-gradient-to-r from-white via-white/95 to-indigo-100/90 border-indigo-100'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            {theme === 'dark' ? (
                <>
                  <img src="/logoalone.png" alt="PATHGRID Logo" className="w-10 h-10 object-contain" />
                  <img src="/textonly.png" alt="PATHGRID" className="h-6 object-contain" />
                </>
            ) : (
                <>
                  <img src="/logoalonewhite.png" alt="PATHGRID Logo" className="w-10 h-10 object-contain" />
                  <img src="/textonlywhite.png" alt="PATHGRID" className="h-6 object-contain" />
                </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1a1a2e] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#22223b] transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#1a1a2e] hover:bg-gray-200 dark:hover:bg-[#22223b] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1a2e] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-gray-500 hidden md:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 relative z-10">
        
        <div className="mb-6 rounded-xl border border-indigo-300 dark:border-gray-600 overflow-hidden">
          <ReminderPanel 
            applications={applications} 
            onApplicationClick={(app) => {
              setSelectedApplication(app);
              setIsEditModalOpen(true);
            }} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white/90 dark:bg-transparent backdrop-blur-sm">
              <QuotesPanel />
            </div>
            <div className="flex-1 my-4">
              <StatsCards applications={applications} />
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="relative border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white/90 dark:bg-transparent backdrop-blur-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by company or role..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-24 py-3 bg-white/90 dark:bg-[#1a1a2e] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-400"
                  >
                    <Filter className="w-3 h-3" />
                    {dateFilter !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {showDateFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a2e] border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-30 p-3"
                    >
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Date Range</div>
                      <div className="space-y-1">
                        {[
                          { value: 'all', label: 'All time' },
                          { value: 'week', label: 'Last 7 days' },
                          { value: 'month', label: 'Last 30 days' },
                          { value: 'year', label: 'Last year' },
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setDateFilter(option.value as any);
                              setShowDateFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              dateFilter === option.value 
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Custom Date</div>
                        <div className="flex gap-2">
                          <input
                            ref={dateInputRef}
                            type="date"
                            value={customDate}
                            onChange={handleCustomDateChange}
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="YYYY-MM-DD"
                          />
                          <button
                            onClick={applyCustomDate}
                            className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-600 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      {(searchTerm || dateFilter !== 'all') && (
                        <button
                          onClick={clearFilters}
                          className="w-full mt-3 text-center text-xs text-rose-500 hover:text-rose-600 py-2 border-t border-gray-200 dark:border-gray-700"
                        >
                          Clear all filters
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="h-full border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white/90 dark:bg-transparent backdrop-blur-sm">
            <ApplicationChart applications={applications} />
          </div>
        </div>

        {(searchTerm || dateFilter !== 'all') && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                {dateFilter === 'week' ? 'Last 7 days' : dateFilter === 'month' ? 'Last 30 days' : 'Last year'}
                <button onClick={() => setDateFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-rose-500 hover:text-rose-600 ml-2">Clear all</button>
          </div>
        )}

        <div ref={kanbanRef} className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Track your jobs here</h2>
              <button
                onClick={handleHelpClick}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition-colors" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Drag and drop cards to move between stages</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {columns.map((column) => {
                const cards = getFilteredApplicationsByStatus(column.id);
                return (
                  <div key={column.id} className="flex flex-col">
                    <div className={`bg-gray-100/50 dark:bg-[#1a1a2e]/50 rounded-xl px-3 py-2 mb-3 flex items-center justify-between border-l-4 ${getColumnBorderColor(column.id)}`}>
                      <button
                        className={`text-sm font-semibold transition-colors ${column.color} ${column.hoverColor}`}
                      >
                        {column.title}
                      </button>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded-lg px-2 py-0.5">{cards.length}</span>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[320px] rounded-xl p-1 transition-all ${snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
                        >
                          {cards.map((app, index) => (
                            <Draggable key={app._id} draggableId={app._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleCardClick(app)}
                                  className="relative"
                                >
                                  <motion.div
                                    className={`bg-white/95 dark:bg-[#1a1a2e] border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group ${
                                      snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                                    } ${
                                      isOverdue(app) 
                                        ? 'border-rose-400 dark:border-rose-600 shadow-rose-500/20' 
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                    layout
                                    transition={{ duration: 0.15 }}
                                    style={{ willChange: 'transform' }}
                                  >
                                    {isOverdue(app) && (
                                      <div className="absolute -top-2 -right-2 z-10">
                                        <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                                          <Bell className="w-2.5 h-2.5" />
                                          Overdue
                                        </div>
                                      </div>
                                    )}
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{app.role}</h3>
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{app.company}</p>
                                        </div>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(app._id, app.company, app.role); }}
                                          className="text-xs text-rose-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                          <Calendar className="w-2.5 h-2.5" />
                                          {new Date(app.dateApplied).toLocaleDateString()}
                                        </span>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleCardClick(app); }}
                                          className="text-[10px] text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                                        >
                                          <Edit3 className="w-2.5 h-2.5" />
                                          Edit
                                        </button>
                                      </div>
                                      {app.followUpDate && !isOverdue(app) && (
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1 pt-1">
                                          <Bell className="w-2.5 h-2.5" />
                                          Follow-up: {new Date(app.followUpDate).toLocaleDateString()}
                                        </div>
                                      )}
                                      {app.followUpDate && isOverdue(app) && (
                                        <div className="text-[10px] text-rose-500 flex items-center gap-1 pt-1 font-medium">
                                          <Bell className="w-2.5 h-2.5" />
                                          Follow-up: {new Date(app.followUpDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>

          {applications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No applications yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add your first application to get started</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Job
              </button>
            </div>
          )}
        </div>
      </main>

      <KanbanTour showTour={showTour} setShowTour={setShowTour} />
      <AddApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchApplications} theme={theme} />
      <EditApplicationModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchApplications} application={selectedApplication} />
      
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        companyName={deleteTarget?.company || ''}
        roleName={deleteTarget?.role || ''}
      />
    </div>
  );
}