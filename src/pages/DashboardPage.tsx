import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  List,
  Layers,
  CircleDot,
  Plus,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Database
} from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { LinkedListService, StackService, QueueService } from '../services/dataStructureService';

interface Session {
  id: string;
  sessionId: string;
  userId: string;
  name: string;
  type: 'linkedlist' | 'stack' | 'queue';
  createdAt: string;
  updatedAt: string;
  size: number;
  elements: any[];
}

/**
 * Dashboard Page Component
 * Main dashboard with sidebar navigation and session management
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug authentication state
  useEffect(() => {
    console.log('🔐 Auth Debug:', {
      user,
      token: localStorage.getItem('token'),
      userFromStorage: localStorage.getItem('user')
    });
  }, [user]);

  // Fetch user sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Fetching user sessions...');

        // Create service instances
        const linkedListService = new LinkedListService();
        const stackService = new StackService();
        const queueService = new QueueService();

        // Fetch sessions from all data structure services
        console.log('📡 Calling API endpoints...');
        const [linkedListResponse, stackResponse, queueResponse] = await Promise.allSettled([
          linkedListService.getSessions(),
          stackService.getSessions(),
          queueService.getSessions()
        ]);

        console.log('📊 API Responses:', {
          linkedList: linkedListResponse,
          stack: stackResponse,
          queue: queueResponse
        });

        // Extract data from API responses and combine sessions
        const allSessions: Session[] = [];
        
        // Handle LinkedList sessions
        if (linkedListResponse.status === 'fulfilled' && linkedListResponse.value.success && linkedListResponse.value.data) {
          const linkedListSessions = linkedListResponse.value.data.map((s: any) => ({ 
            id: s.id || s.sessionId, // Use MongoDB id for navigation
            sessionId: s.sessionId, // Keep sessionId for API calls
            userId: s.userId,
            type: 'linkedlist' as const,
            name: s.sessionId || 'LinkedList Session',
            createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
            size: s.size || 0,
            elements: s.elements || []
          }));
          allSessions.push(...linkedListSessions);
          console.log('✅ LinkedList sessions loaded:', linkedListSessions.length);
        } else if (linkedListResponse.status === 'fulfilled') {
          console.log('⚠️ LinkedList API response:', linkedListResponse.value);
        } else {
          console.error('❌ LinkedList API failed:', linkedListResponse.reason);
        }
        
        // Handle Stack sessions
        if (stackResponse.status === 'fulfilled' && stackResponse.value.success && stackResponse.value.data) {
          const stackSessions = stackResponse.value.data.map((s: any) => ({ 
            id: s.id || s.sessionId, // Use MongoDB id for navigation
            sessionId: s.sessionId, // Keep sessionId for API calls
            userId: s.userId,
            type: 'stack' as const,
            name: s.sessionId || 'Stack Session',
            createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
            size: s.currentSize || s.size || 0,
            elements: s.elements || []
          }));
          allSessions.push(...stackSessions);
          console.log('✅ Stack sessions loaded:', stackSessions.length);
        } else if (stackResponse.status === 'fulfilled') {
          console.log('⚠️ Stack API response:', stackResponse.value);
        } else {
          console.error('❌ Stack API failed:', stackResponse.reason);
        }
        
        // Handle Queue sessions
        if (queueResponse.status === 'fulfilled' && queueResponse.value.success && queueResponse.value.data) {
          const queueSessions = queueResponse.value.data.map((s: any) => ({ 
            id: s.id || s.sessionId, // Use MongoDB id for navigation
            sessionId: s.sessionId, // Keep sessionId for API calls
            userId: s.userId,
            type: 'queue' as const,
            name: s.sessionId || 'Queue Session',
            createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
            size: s.currentSize || s.size || 0,
            elements: s.elements || []
          }));
          allSessions.push(...queueSessions);
          console.log('✅ Queue sessions loaded:', queueSessions.length);
        } else if (queueResponse.status === 'fulfilled') {
          console.log('⚠️ Queue API response:', queueResponse.value);
        } else {
          console.error('❌ Queue API failed:', queueResponse.reason);
        }

        // Sort by updated date (newest first)
        allSessions.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        console.log('📋 Total sessions loaded:', allSessions.length);
        setSessions(allSessions);
        
        // Set specific error message if all APIs failed
        const allFailed = [linkedListResponse, stackResponse, queueResponse].every(r => 
          r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
        );
        
        if (allFailed) {
          setError('Failed to load sessions. Please check your connection and try again.');
        }
        
      } catch (err: any) {
        console.error('❌ Failed to fetch sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true }); // Redirect to landing page
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const handleCreateSession = (type: 'linkedlist' | 'stack' | 'queue') => {
    navigate(`/${type}`);
  };

  const handleOpenSession = (session: Session) => {
    // Navigate to the specific data structure page with the sessionId
    navigate(`/${session.type}?sessionId=${session.sessionId}`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'linkedlist':
        return <List className="h-5 w-5" />;
      case 'stack':
        return <Layers className="h-5 w-5" />;
      case 'queue':
        return <CircleDot className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const getSessionTypeName = (type: string) => {
    switch (type) {
      case 'linkedlist':
        return 'Linked List';
      case 'stack':
        return 'Stack';
      case 'queue':
        return 'Queue';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="h-screen bg-dark-950 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-dark-900 to-dark-950 border-r border-gray-700 shadow-2xl transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">AlgoPulse</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-4">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Navigation
            </div>
            <button className="w-full flex items-center space-x-4 px-4 py-3 text-teal-400 bg-gradient-to-r from-teal-600/20 to-teal-500/10 rounded-xl border border-teal-500/20">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-medium">Dashboard</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 mt-8">
              Data Structures
            </div>
            <button
              onClick={() => handleCreateSession('linkedlist')}
              className="w-full flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 rounded-xl transition-all duration-200 hover:border hover:border-gray-600/30 group"
            >
              <List className="h-6 w-6 group-hover:text-teal-400 transition-colors" />
              <span className="font-medium">Linked Lists</span>
            </button>
            <button
              onClick={() => handleCreateSession('stack')}
              className="w-full flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 rounded-xl transition-all duration-200 hover:border hover:border-gray-600/30 group"
            >
              <Layers className="h-6 w-6 group-hover:text-teal-400 transition-colors" />
              <span className="font-medium">Stacks</span>
            </button>
            <button
              onClick={() => handleCreateSession('queue')}
              className="w-full flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 rounded-xl transition-all duration-200 hover:border hover:border-gray-600/30 group"
            >
              <CircleDot className="h-6 w-6 group-hover:text-teal-400 transition-colors" />
              <span className="font-medium">Queues</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-gray-100 truncate">
                {user?.username}
              </div>
              <div className="text-sm text-gray-400">Learning Dashboard</div>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-4 px-4 py-3 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-screen">
        {/* Header */}
        <header className="h-20 bg-gradient-to-r from-dark-900 to-dark-950 border-b border-gray-700 flex items-center justify-between px-6 lg:px-8 shadow-lg">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your learning sessions</p>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-dark-950 via-dark-950 to-dark-900">
          {/* Quick actions */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-100 mb-3">Create New Session</h2>
              <p className="text-lg text-gray-400">Choose a data structure to start your interactive learning journey</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <button
                onClick={() => handleCreateSession('linkedlist')}
                className="relative group bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 text-left transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl group-hover:from-teal-500/30 group-hover:to-teal-600/30 transition-all duration-300">
                      <List className="h-8 w-8 text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <span className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">Linked List</span>
                  </div>
                  <p className="text-base text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">Create and visualize linked list operations with dynamic node management</p>
                  <div className="flex items-center text-teal-400 text-base font-medium group-hover:text-teal-300 transition-colors">
                    <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start new session
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCreateSession('stack')}
                className="relative group bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 text-left transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl group-hover:from-teal-500/30 group-hover:to-teal-600/30 transition-all duration-300">
                      <Layers className="h-8 w-8 text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <span className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">Stack</span>
                  </div>
                  <p className="text-base text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">Explore LIFO operations with interactive push and pop visualizations</p>
                  <div className="flex items-center text-teal-400 text-base font-medium group-hover:text-teal-300 transition-colors">
                    <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start new session
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCreateSession('queue')}
                className="relative group bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 text-left transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl group-hover:from-teal-500/30 group-hover:to-teal-600/30 transition-all duration-300">
                      <CircleDot className="h-8 w-8 text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <span className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">Queue</span>
                  </div>
                  <p className="text-base text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">Learn FIFO operations with engaging enqueue and dequeue animations</p>
                  <div className="flex items-center text-teal-400 text-base font-medium group-hover:text-teal-300 transition-colors">
                    <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start new session
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent sessions */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-100 mb-3">Recent Sessions</h2>
              <p className="text-lg text-gray-400">Continue where you left off or explore your learning history</p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading sessions...</div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 bg-dark-900/50 rounded-lg border border-gray-800">
                <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No sessions yet</h3>
                <p className="text-gray-400 mb-4">Create your first data structure session to get started</p>
                <Button
                  onClick={() => handleCreateSession('linkedlist')}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleOpenSession(session)}
                    className="p-4 bg-dark-900 border border-gray-800 rounded-lg hover:border-teal-600/50 transition-colors text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-teal-400 group-hover:text-teal-300">
                        {getSessionIcon(session.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-100 truncate">
                          {session.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {getSessionTypeName(session.type)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {formatDate(session.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};