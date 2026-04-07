import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { logout, getCurrentUser } from '../services/auth.service';
import { getApplications, updateApplication, deleteApplication } from '../services/application.service';
import type { Application } from '../services/application.service';
import AddApplicationModal from '../components/AddApplicationModal';

const columns = [
  { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'phone-screen', title: 'Phone Screen', color: 'bg-yellow-500' },
  { id: 'interview', title: 'Interview', color: 'bg-purple-500' },
  { id: 'offer', title: 'Offer', color: 'bg-green-500' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-500' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    
    // Update local state
    setApplications(prev =>
      prev.map(app =>
        app._id === draggableId ? { ...app, status: newStatus } : app
      )
    );
    
    // Update backend
    try {
      await updateApplication(draggableId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchApplications(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this application?')) {
      try {
        await deleteApplication(id);
        fetchApplications();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Job Application Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Application
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="bg-gray-800 rounded-lg p-4">
                <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  {column.title}
                  <span className="text-gray-400 text-sm ml-auto">
                    {getApplicationsByStatus(column.id).length}
                  </span>
                </h2>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px]"
                    >
                      {getApplicationsByStatus(column.id).map((app, index) => (
                        <Draggable key={app._id} draggableId={app._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition group"
                            >
                              <h3 className="text-white font-medium text-sm">{app.role}</h3>
                              <p className="text-gray-400 text-xs">{app.company}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                Applied: {new Date(app.dateApplied).toLocaleDateString()}
                              </p>
                              <button
                                onClick={() => handleDelete(app._id)}
                                className="text-red-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No applications yet. Click "Add Application" to get started.</p>
          </div>
        )}
      </main>

      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchApplications}
      />
    </div>
  );
}