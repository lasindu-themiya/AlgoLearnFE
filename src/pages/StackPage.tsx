import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Play,
  RotateCcw,
  Layers,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button, Input, LoadingSpinner, StackNode, Modal } from '../components/ui';
import { StackService } from '../services/dataStructureService';
import { StackSession, ApiResponse } from '../types';

interface OperationHistory {
  operation: string;
  data?: any;
  success: boolean;
  message: string;
  timestamp: number;
}

/**
 * Stack Page Component
 * Main page for Stack operations and visualization
 */
export const StackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stackService = new StackService();
  
  // State management
  const [session, setSession] = useState<StackSession | null>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Operation states
  const [pushValue, setPushValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [topElement, setTopElement] = useState<any>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOperationHistory, setShowOperationHistory] = useState(false);
  const [sessionType, setSessionType] = useState<'static' | 'dynamic'>('static');
  const [maxSize, setMaxSize] = useState('10');
  const [customSessionId, setCustomSessionId] = useState('');
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>([]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Initialize page - check for existing sessionId from URL params
  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      // Load existing session
      loadExistingSession(sessionId);
    } else {
      // Show create modal for new session
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Load existing session
  const loadExistingSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await stackService.view(sessionId);
      if (response.success && response.data) {
        setSession(response.data);
        updateVisualization(response.data);
        setSuccess('Session loaded successfully!');
      } else {
        setError(response.message || 'Failed to load session');
        setShowCreateModal(true);
      }
    } catch (err) {
      setError('Failed to load session');
      setShowCreateModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Update visualization with session data
  const updateVisualization = (sessionData: StackSession) => {
    if (sessionData?.elements && Array.isArray(sessionData.elements)) {
      setElements(sessionData.elements);
      setTopElement(sessionData.elements.length > 0 ? sessionData.elements[sessionData.elements.length - 1] : null);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionType) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const maxSizeNum = sessionType === 'static' ? parseInt(maxSize) : undefined;
      if (sessionType === 'static' && (isNaN(maxSizeNum!) || maxSizeNum! <= 0)) {
        setError('Please enter a valid maximum size for static stack');
        setIsLoading(false);
        return;
      }

      const response = await stackService.createSession(sessionType, maxSizeNum, customSessionId.trim() || undefined);
      
      if (response.success && response.data) {
        setSession(response.data);
        setShowCreateModal(false);
        const sessionIdInfo = customSessionId.trim() ? ` with ID: ${response.data.sessionId}` : '';
        setSuccess(`${sessionType} stack session created successfully${sessionIdInfo}!`);
        setCustomSessionId(''); // Clear for next use
        await refreshView();
      } else {
        setError(response.message || 'Failed to create session');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshView = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const response = await stackService.view(session.sessionId);
      if (response.success && response.data) {
        setSession(response.data);
        setElements(response.data.elements || []);
      }
    } catch (err) {
      console.error('Error refreshing view:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePush = async () => {
    if (!session || !pushValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await stackService.push(session.sessionId, pushValue.trim());
      await handleOperationResponse(response, 'Push', pushValue.trim());
      
      if (response.success) {
        // Animate push operation
        setHighlightedIndex(elements.length);
        setTimeout(() => setHighlightedIndex(null), 1000);
      }
      
      setPushValue('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePop = async () => {
    if (!session || elements.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Animate pop operation
      setHighlightedIndex(elements.length - 1);
      
      const response = await stackService.pop(session.sessionId);
      await handleOperationResponse(response, 'Pop');
      
      setTimeout(() => setHighlightedIndex(null), 1000);
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeek = async () => {
    if (!session || elements.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await stackService.peek(session.sessionId);
      
      if (response.success) {
        setTopElement(elements[elements.length - 1]);
        setHighlightedIndex(elements.length - 1);
        setSuccess(`Top element: ${elements[elements.length - 1]}`);
        
        // Clear highlight after animation
        setTimeout(() => {
          setHighlightedIndex(null);
          setTopElement(null);
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperationResponse = async (response: ApiResponse, operation: string, data?: string) => {
    if (response.success) {
      setSuccess(`${operation} ${data ? `(${data})` : ''} completed successfully`);
      // Add to operation history
      const historyEntry: OperationHistory = {
        operation,
        data,
        success: true,
        message: response.message,
        timestamp: Date.now()
      };
      setOperationHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 operations
      await refreshView();
    } else {
      setError(response.message || `${operation} failed`);
    }
  };

  const handleReset = () => {
    setHighlightedIndex(null);
    setTopElement(null);
    setPushValue('');
    setError(null);
    setSuccess(null);
  };

  const getStackInfo = () => {
    if (!session) return null;
    
    return {
      size: elements.length,
      maxSize: session.maxSize,
      isEmpty: elements.length === 0,
      isFull: session.type === 'static' && session.maxSize ? elements.length >= session.maxSize : false,
      topElement: elements.length > 0 ? elements[elements.length - 1] : null
    };
  };

  const stackInfo = getStackInfo();

  if (showCreateModal) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <Modal
          isOpen={showCreateModal}
          onClose={() => navigate('/dashboard')}
          title="Create Stack Session"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stack Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSessionType('static')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    sessionType === 'static'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium">Static Stack</div>
                  <div className="text-xs text-gray-400 mt-1">Fixed maximum size</div>
                </button>
                <button
                  onClick={() => setSessionType('dynamic')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    sessionType === 'dynamic'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium">Dynamic Stack</div>
                  <div className="text-xs text-gray-400 mt-1">Unlimited size</div>
                </button>
              </div>
            </div>

            {sessionType === 'static' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Size
                </label>
                <Input
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  placeholder="Enter maximum size..."
                  type="number"
                  min="1"
                  max="100"
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Session ID (Optional)
              </label>
              <Input
                value={customSessionId}
                onChange={(e) => setCustomSessionId(e.target.value)}
                placeholder="Enter custom session ID..."
                className="w-full"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSession}
                className="flex-1"
                disabled={isLoading || !sessionType}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Create Session'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="h-screen bg-dark-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-900 to-dark-950 border-b border-gray-700 px-8 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2 hover:bg-gray-800 px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl">
                <Layers className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {session?.type === 'static' ? 'Static' : 'Dynamic'} Stack
                </h1>
                <p className="text-base text-gray-400">
                  Session: {session?.sessionId} | Size: {stackInfo?.size || 0}
                  {session?.type === 'static' && session.maxSize && ` / ${session.maxSize}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowOperationHistory(true)}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Eye className="h-4 w-4" />
              <span>History</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2 px-4 py-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button
              onClick={refreshView}
              size="sm"
              className="flex items-center space-x-2 px-4 py-2"
              disabled={isLoading}
            >
              <Play className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-8 py-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-base">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 px-8 py-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5" />
          <span className="text-base">{success}</span>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Operations Panel */}
        <div className="w-96 bg-gradient-to-b from-dark-900 to-dark-950 border-r border-gray-700 p-8 space-y-8 overflow-y-auto shadow-2xl">
          {/* Push Operation */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <ArrowUp className="h-6 w-6 text-teal-400" />
              <span>Push Operation</span>
            </h3>
            
            <div className="space-y-4">
              <Input
                value={pushValue}
                onChange={(e) => setPushValue(e.target.value)}
                placeholder="Enter value to push..."
                className="w-full text-lg py-3"
                onKeyPress={(e) => e.key === 'Enter' && handlePush()}
              />
              
              <Button
                onClick={handlePush}
                disabled={isLoading || !pushValue.trim() || stackInfo?.isFull}
                className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
              >
                <ArrowUp className="h-5 w-5" />
                <span>Push to Stack</span>
              </Button>
              
              {stackInfo?.isFull && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-3">Stack is full!</p>
              )}
            </div>
          </div>

          {/* Pop Operation */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <ArrowDown className="h-6 w-6 text-orange-400" />
              <span>Pop Operation</span>
            </h3>
            
            <Button
              onClick={handlePop}
              variant="secondary"
              disabled={isLoading || stackInfo?.isEmpty}
              className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold hover:bg-orange-600/20 hover:border-orange-500/50"
            >
              <ArrowDown className="h-5 w-5" />
              <span>Pop from Stack</span>
            </Button>
            
            {stackInfo?.isEmpty && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-3">Stack is empty!</p>
            )}
          </div>

          {/* Peek Operation */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <Eye className="h-6 w-6 text-blue-400" />
              <span>Peek Operation</span>
            </h3>
            
            <Button
              onClick={handlePeek}
              variant="secondary"
              disabled={isLoading || stackInfo?.isEmpty}
              className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold hover:bg-blue-600/20 hover:border-blue-500/50"
            >
              <Eye className="h-5 w-5" />
              <span>Peek Top Element</span>
            </Button>
            
            {topElement !== null && (
              <div className="p-4 bg-gradient-to-r from-teal-900/30 to-teal-800/30 border border-teal-600/50 rounded-xl">
                <p className="text-base text-teal-300 font-medium">Top Element: <span className="text-teal-100 font-bold">{topElement}</span></p>
              </div>
            )}
          </div>

          {/* Stack Info */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-100">Stack Information</h4>
            <div className="space-y-4 text-base text-gray-300">
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Type:</span>
                <span className="text-white font-semibold capitalize">{session?.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Current Size:</span>
                <span className="text-white font-semibold">{stackInfo?.size || 0}</span>
              </div>
              {session?.type === 'static' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="font-medium">Max Size:</span>
                  <span className="text-white font-semibold">{session.maxSize}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                  stackInfo?.isEmpty ? 'text-red-300 bg-red-900/30' : 
                  stackInfo?.isFull ? 'text-yellow-300 bg-yellow-900/30' : 'text-green-300 bg-green-900/30'
                }`}>
                  {stackInfo?.isEmpty ? 'Empty' : 
                   stackInfo?.isFull ? 'Full' : 'Available'}
                </span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="font-medium">Session ID:</span>
                <span className="text-white text-sm break-all font-mono bg-gray-800/50 px-2 py-1 rounded">{session?.sessionId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 p-8 bg-gradient-to-br from-dark-950 via-dark-950 to-dark-900">
          <div className="bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-3xl p-10 h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Stack Visualization</h2>
                <p className="text-lg text-gray-400">Interactive LIFO (Last In, First Out) Operations</p>
              </div>
              {isLoading && <LoadingSpinner size="lg" />}
            </div>

            {elements.length === 0 ? (
              <div className="flex items-center justify-center flex-1 text-gray-400">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>
                    <Layers className="relative h-24 w-24 mx-auto opacity-60 text-teal-400" />
                  </div>
                  <p className="text-2xl font-semibold mb-3">Stack is empty</p>
                  <p className="text-lg text-gray-500">Push some elements to see the interactive visualization</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col items-center justify-start min-h-full space-y-3 py-4">
                  {/* Stack Direction Indicator */}
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                    <ArrowUp className="h-4 w-4" />
                    <span>Top of Stack</span>
                  </div>

                  {/* Stack Elements */}
                  <div className="stack-container space-y-2 flex flex-col-reverse">
                    {elements.map((element, index) => {
                      return (
                        <StackNode
                          key={index}
                          value={element}
                          index={index}
                          stackIndex={index}
                          isHighlighted={highlightedIndex === index}
                          className="transition-all duration-500 ease-in-out"
                        />
                      );
                    })}
                  </div>

                  {/* Stack Base */}
                  <div className="w-32 h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full mt-6 shadow-lg"></div>
                  <div className="text-sm text-gray-400 font-medium">Stack Base</div>
                </div>
              </div>
            )}

            {/* Stack Operations Legend */}
            <div className="mt-8 p-4 bg-dark-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Operations Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <ArrowUp className="h-3 w-3 text-teal-400" />
                  <span><strong>Push:</strong> Add element to top</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowDown className="h-3 w-3 text-red-400" />
                  <span><strong>Pop:</strong> Remove top element</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-3 w-3 text-blue-400" />
                  <span><strong>Peek:</strong> View top element</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operation History Modal */}
      <Modal
        isOpen={showOperationHistory}
        onClose={() => setShowOperationHistory(false)}
        title="Operation History"
        size="lg"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {operationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No operations performed yet</p>
            </div>
          ) : (
            operationHistory.map((op, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  op.success 
                    ? 'border-green-700 bg-green-900/20' 
                    : 'border-red-700 bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {op.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="font-medium text-white">
                      {op.operation} {op.data && `(${op.data})`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(op.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{op.message}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};