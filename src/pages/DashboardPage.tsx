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
  Database,
  TrendingUp,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LinkedListService, StackService, QueueService } from '../services/dataStructureService';
import { sortingService } from '../services/sortingService';
import { searchingService } from '../services/searchingService';

interface Session {
  id: string;
  sessionId: string;
  userId: string;
  name: string;
  type: 'linkedlist' | 'stack' | 'queue' | 'sorting' | 'searching';
  algorithm?: string; // For sorting and searching sessions
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
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');

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

        // Fetch sessions from all services (data structures + algorithms)
        console.log('📡 Calling API endpoints...');
        const [linkedListResponse, stackResponse, queueResponse, sortingResponse, searchingResponse] = await Promise.allSettled([
          linkedListService.getSessions(),
          stackService.getSessions(),
          queueService.getSessions(),
          sortingService.getSessions(),
          searchingService.getSessions()
        ]);

        console.log('📊 API Responses:', {
          linkedList: linkedListResponse,
          stack: stackResponse,
          queue: queueResponse,
          sorting: sortingResponse,
          searching: searchingResponse
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

        // Handle Sorting sessions
        if (sortingResponse.status === 'fulfilled' && sortingResponse.value.success && sortingResponse.value.sessions) {
          const sortingSessions = sortingResponse.value.sessions.map((s: any) => ({ 
            id: s.sessionId, // Use sessionId as id
            sessionId: s.sessionId,
            userId: 'current-user', // Default user
            type: 'sorting' as const,
            algorithm: s.algorithm,
            name: `${s.algorithm.charAt(0).toUpperCase() + s.algorithm.slice(1)} Sort`,
            createdAt: s.createdAt || new Date().toISOString(),
            updatedAt: s.createdAt || new Date().toISOString(),
            size: 0, // We'll get this from individual session details
            elements: []
          }));
          allSessions.push(...sortingSessions);
          console.log('✅ Sorting sessions loaded:', sortingSessions.length);
        } else if (sortingResponse.status === 'fulfilled') {
          console.log('⚠️ Sorting API response:', sortingResponse.value);
        } else {
          console.error('❌ Sorting API failed:', sortingResponse.reason);
        }

        // Handle Searching sessions
        if (searchingResponse.status === 'fulfilled' && searchingResponse.value.success && searchingResponse.value.sessions) {
          const searchingSessions = searchingResponse.value.sessions.map((s: any) => ({ 
            id: s.sessionId, // Use sessionId as id
            sessionId: s.sessionId,
            userId: 'current-user', // Default user
            type: 'searching' as const,
            algorithm: s.algorithm,
            name: `${s.algorithm.charAt(0).toUpperCase() + s.algorithm.slice(1)} Search`,
            createdAt: s.createdAt || new Date().toISOString(),
            updatedAt: s.createdAt || new Date().toISOString(),
            size: 0, // We'll get this from individual session details
            elements: []
          }));
          allSessions.push(...searchingSessions);
          console.log('✅ Searching sessions loaded:', searchingSessions.length);
        } else if (searchingResponse.status === 'fulfilled') {
          console.log('⚠️ Searching API response:', searchingResponse.value);
        } else {
          console.error('❌ Searching API failed:', searchingResponse.reason);
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
        const allFailed = [linkedListResponse, stackResponse, queueResponse, sortingResponse, searchingResponse].every(r => 
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

  const filteredSessions = React.useMemo(() => {
    return sessions.filter(session => {
      const typeMatch = filterType === 'all' || session.type === filterType;
      
      let dateMatch = true;
      if (filterDate) {
        // Create a Date object from the session's UTC createdAt string
        const sessionDate = new Date(session.createdAt);
        
        // Get the year, month, and day from the session's date *in UTC*
        const year = sessionDate.getUTCFullYear();
        const month = (sessionDate.getUTCMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
        const day = sessionDate.getUTCDate().toString().padStart(2, '0');
        
        // Form a YYYY-MM-DD string from the UTC date parts
        const sessionDateString = `${year}-${month}-${day}`;
        
        // Compare this string with the filterDate from the input
        dateMatch = sessionDateString === filterDate;
      }

      return typeMatch && dateMatch;
    });
  }, [sessions, filterType, filterDate]);

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

  const handleCreateAlgorithmSession = (type: 'sorting' | 'searching') => {
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
      case 'sorting':
        return <TrendingUp className="h-5 w-5" />;
      case 'searching':
        return <Search className="h-5 w-5" />;
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
      case 'sorting':
        return 'Sorting';
      case 'searching':
        return 'Searching';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="h-screen bg-dark-950 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-dark-900 to-dark-950 border-r border-gray-700 shadow-2xl transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700 flex-shrink-0">
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

        {/* Scrollable navigation area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll">
          <nav className="px-6 py-8 space-y-4">
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

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 mt-8">
                Algorithms
              </div>
              <button
                onClick={() => handleCreateAlgorithmSession('sorting')}
                className="w-full flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 rounded-xl transition-all duration-200 hover:border hover:border-gray-600/30 group"
              >
                <TrendingUp className="h-6 w-6 group-hover:text-teal-400 transition-colors" />
                <span className="font-medium">Sorting</span>
              </button>
              <button
                onClick={() => handleCreateAlgorithmSession('searching')}
                className="w-full flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 rounded-xl transition-all duration-200 hover:border hover:border-gray-600/30 group"
              >
                <Search className="h-6 w-6 group-hover:text-teal-400 transition-colors" />
                <span className="font-medium">Searching</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Fixed bottom section with user info and logout */}
        <div className="p-6 border-t border-gray-700 flex-shrink-0">
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

          {/* Algorithms section */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-100 mb-3">Algorithm Visualization</h2>
              <p className="text-lg text-gray-400">Explore sorting and searching algorithms with step-by-step visualization</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <button
                onClick={() => handleCreateAlgorithmSession('sorting')}
                className="relative group bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 text-left transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                      <TrendingUp className="h-8 w-8 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <span className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">Sorting Algorithms</span>
                  </div>
                  <p className="text-base text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">Visualize bubble sort, insertion sort, selection sort, and more with interactive step-by-step animations</p>
                  <div className="flex items-center text-purple-400 text-base font-medium group-hover:text-purple-300 transition-colors">
                    <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start sorting visualization
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCreateAlgorithmSession('searching')}
                className="relative group bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 text-left transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                      <Search className="h-8 w-8 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <span className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">Searching Algorithms</span>
                  </div>
                  <p className="text-base text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">Explore linear search and binary search algorithms with visual feedback and performance comparisons</p>
                  <div className="flex items-center text-blue-400 text-base font-medium group-hover:text-blue-300 transition-colors">
                    <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start search visualization
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-100 mb-3">Recent Sessions</h2>
                <p className="text-lg text-gray-400">Continue your learning where you left off</p>
              </div>
              {/* Filter controls */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-dark-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="linkedlist">Linked List</option>
                    <option value="stack">Stack</option>
                    <option value="queue">Queue</option>
                    <option value="sorting">Sorting</option>
                    <option value="searching">Searching</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-dark-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
                  />
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading sessions...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-6 rounded-xl text-center">
                <h3 className="font-bold text-lg mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && filteredSessions.length === 0 && (
              <div className="text-center py-12 bg-dark-900/50 rounded-2xl border border-gray-800">
                <Database className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-300 mb-3">No Sessions Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {sessions.length > 0 ? "No sessions match your current filters. Try adjusting your filter settings." : "You haven't started any sessions yet. Create one above to begin!"}
                </p>
              </div>
            )}

            {!isLoading && !error && filteredSessions.length > 0 && (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleOpenSession(session)}
                    className="bg-gradient-to-r from-dark-900/70 to-dark-800/60 border border-gray-700 rounded-2xl p-6 flex items-center justify-between hover:bg-dark-800/80 hover:border-teal-500/40 transition-all duration-200 cursor-pointer group transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl group-hover:from-teal-600/20 group-hover:to-teal-500/10 transition-all duration-300">
                        {getSessionIcon(session.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-teal-400 transition-colors">
                          {session.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {getSessionTypeName(session.type)}
                          {session.algorithm && ` - ${session.algorithm}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-300">{formatDate(session.updatedAt)}</p>
                      <p className="text-xs text-gray-500">Last updated</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};