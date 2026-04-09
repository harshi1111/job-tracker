import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ApplicationChartProps {
  applications: any[];
}

export default function ApplicationChart({ applications }: ApplicationChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    if (timeRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(2020, 0, 1);
    }
    
    const filteredApps = applications.filter(app => new Date(app.dateApplied) >= startDate);
    
    const groupedByDate: Record<string, number> = {};
    filteredApps.forEach(app => {
      const date = new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      groupedByDate[date] = (groupedByDate[date] || 0) + 1;
    });
    
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    const labels = sortedDates.slice(-10);
    const counts = labels.map(label => groupedByDate[label]);
    
    return { labels, counts, total: filteredApps.length };
  }, [applications, timeRange]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Applications',
        data: chartData.counts,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
          color: '#6b7280', 
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#9ca3af',
        borderColor: '#6366f1',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.raw} application${context.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Number of Applications',
          color: '#9ca3af',
          font: { size: 10 },
        },
        ticks: { color: '#9ca3af', stepSize: 1 },
        grid: { color: 'rgba(156, 163, 175, 0.1)', drawBorder: true },
      },
      x: {
        title: {
          display: true,
          text: 'Date Applied',
          color: '#9ca3af',
          font: { size: 10 },
        },
        ticks: { color: '#9ca3af', maxRotation: 45, minRotation: 45 },
        grid: { display: false },
      },
    },
  };

  const getTimeRangeColor = (range: string) => {
    if (timeRange === range) {
      return 'bg-indigo-600 text-white';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-indigo-200 dark:border-gray-700 shadow-md h-full">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              Application Timeline
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTimeRangeColor('week')}`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTimeRangeColor('month')}`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getTimeRangeColor('all')}`}
            >
              All time
            </button>
          </div>
        </div>
        
        {chartData.total === 0 ? (
          <div className="h-64 flex items-center justify-center flex-col gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No applications in this period</p>
            <p className="text-xs text-gray-400">Add applications to see your timeline</p>
          </div>
        ) : (
          <>
            <div className="h-64">
              <Bar data={data} options={options} />
            </div>
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              Total applications in this period: <span className="font-bold text-indigo-600 dark:text-indigo-400">{chartData.total}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}