import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Play,
  RotateCcw,
  CircleDot,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeftRight
} from 'lucide-react';
import { Button, Input, LoadingSpinner, QueueNode, Modal } from '../components/ui';
import { QueueService } from '../services/dataStructureService';
import { QueueSession, ApiResponse } from '../types';

interface OperationHistory {
  operation: string;
  data?: any;
  success: boolean;
  message: string;
  timestamp: number;
}

/**
 * Queue Page Component
 * Main page for Queue operations and visualization
 */
export const QueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queueService = new QueueService();
  
  // State management
  const [session, setSession] = useState<QueueSession | null>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Operation states
  const [enqueueValue, setEnqueueValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [frontElement, setFrontElement] = useState<any>(null);
  
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
      const response = await queueService.view(sessionId);
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
  const updateVisualization = (sessionData: QueueSession) => {
    if (sessionData?.elements && Array.isArray(sessionData.elements)) {
      setElements(sessionData.elements);
      setFrontElement(sessionData.elements.length > 0 ? sessionData.elements[0] : null);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionType) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const maxSizeNum = sessionType === 'static' ? parseInt(maxSize) : undefined;
      if (sessionType === 'static' && (isNaN(maxSizeNum!) || maxSizeNum! <= 0)) {
        setError('Please enter a valid maximum size for static queue');
        setIsLoading(false);
        return;
      }

      const response = await queueService.createSession(sessionType, maxSizeNum);
      
      if (response.success && response.data) {
        setSession(response.data);
        setShowCreateModal(false);
        setSuccess(`${sessionType} queue session created successfully!`);
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
      const response = await queueService.view(session.sessionId);
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

  const handleEnqueue = async () => {
    if (!session || !enqueueValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await queueService.enqueue(session.sessionId, enqueueValue.trim());
      await handleOperationResponse(response, 'Enqueue', enqueueValue.trim());
      
      if (response.success) {
        // Animate enqueue operation - highlight the rear
        setHighlightedIndex(elements.length);
        setTimeout(() => setHighlightedIndex(null), 1000);
      }
      
      setEnqueueValue('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDequeue = async () => {
    if (!session || elements.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Animate dequeue operation - highlight the front
      setHighlightedIndex(0);
      
      const response = await queueService.dequeue(session.sessionId);
      await handleOperationResponse(response, 'Dequeue');
      
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
      const response = await queueService.peek(session.sessionId);
      
      if (response.success) {
        setFrontElement(elements[0]);
        setHighlightedIndex(0);
        setSuccess(`Front element: ${elements[0]}`);
        
        // Clear highlight after animation
        setTimeout(() => {
          setHighlightedIndex(null);
          setFrontElement(null);
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
    setFrontElement(null);
    setEnqueueValue('');
    setError(null);
    setSuccess(null);
  };

  const getQueueInfo = () => {
    if (!session) return null;
    
    return {
      size: elements.length,
      maxSize: session.maxSize,
      isEmpty: elements.length === 0,
      isFull: session.type === 'static' && session.maxSize ? elements.length >= session.maxSize : false,
      frontElement: elements.length > 0 ? elements[0] : null,
      rearElement: elements.length > 0 ? elements[elements.length - 1] : null,
      front: session.front || 0,
      rear: session.rear || (elements.length > 0 ? elements.length - 1 : -1)
    };
  };

  const queueInfo = getQueueInfo();

  if (showCreateModal) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <Modal
          isOpen={showCreateModal}
          onClose={() => navigate('/dashboard')}
          title="Create Queue Session"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Queue Type
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
                  <div className="font-medium">Static Queue</div>
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
                  <div className="font-medium">Dynamic Queue</div>
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
                <CircleDot className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {session?.type === 'static' ? 'Static' : 'Dynamic'} Queue
                </h1>
                <p className="text-base text-gray-400">
                  Session: {session?.sessionId} | Size: {queueInfo?.size || 0}
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
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>History</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button
              onClick={refreshView}
              size="sm"
              className="flex items-center space-x-2"
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
          {/* Enqueue Operation */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <ArrowRight className="h-6 w-6 text-purple-400" />
              <span>Enqueue Operation</span>
            </h3>
            
            <div className="space-y-4">
              <Input
                value={enqueueValue}
                onChange={(e) => setEnqueueValue(e.target.value)}
                placeholder="Enter value to enqueue..."
                className="w-full text-lg py-3"
                onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
              />
              
              <Button
                onClick={handleEnqueue}
                disabled={isLoading || !enqueueValue.trim() || queueInfo?.isFull}
                className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                <ArrowRight className="h-5 w-5" />
                <span>Enqueue to Rear</span>
              </Button>
              
              {queueInfo?.isFull && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-3">Queue is full!</p>
              )}
            </div>
          </div>

          {/* Dequeue Operation */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <ArrowLeftRight className="h-6 w-6 text-orange-400" />
              <span>Dequeue Operation</span>
            </h3>
            
            <Button
              onClick={handleDequeue}
              variant="secondary"
              disabled={isLoading || queueInfo?.isEmpty}
              className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold hover:bg-orange-600/20 hover:border-orange-500/50"
            >
              <ArrowLeftRight className="h-5 w-5" />
              <span>Dequeue from Front</span>
            </Button>
            
            {queueInfo?.isEmpty && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-3">Queue is empty!</p>
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
              disabled={isLoading || queueInfo?.isEmpty}
              className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold hover:bg-blue-600/20 hover:border-blue-500/50"
            >
              <Eye className="h-4 w-4" />
              <span>Peek Front</span>
            </Button>
            
            {frontElement !== null && (
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-600/50 rounded-xl">
                <p className="text-base text-blue-300 font-medium">Front Element: <span className="text-blue-100 font-bold">{frontElement}</span></p>
              </div>
            )}
          </div>

          {/* Queue Info */}
          <div className="space-y-6 bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-gray-700 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-100">Queue Information</h4>
            <div className="space-y-4 text-base text-gray-300">
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Type:</span>
                <span className="text-white font-semibold capitalize">{session?.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Current Size:</span>
                <span className="text-white font-semibold">{queueInfo?.size || 0}</span>
              </div>
              {session?.type === 'static' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="font-medium">Max Size:</span>
                  <span className="text-white font-semibold">{session.maxSize}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Front Index:</span>
                <span className="text-white font-semibold">{queueInfo?.front ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Rear Index:</span>
                <span className="text-white font-semibold">{queueInfo?.rear ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="font-medium">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                  queueInfo?.isEmpty ? 'text-red-300 bg-red-900/30' : 
                  queueInfo?.isFull ? 'text-yellow-300 bg-yellow-900/30' : 'text-green-300 bg-green-900/30'
                }`}>
                  {queueInfo?.isEmpty ? 'Empty' : 
                   queueInfo?.isFull ? 'Full' : 'Available'}
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
          <div className="bg-gradient-to-br from-dark-900/80 to-dark-900/40 border border-gray-700 rounded-3xl p-10 h-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Queue Visualization</h2>
                <p className="text-lg text-gray-400">Interactive FIFO (First In, First Out) Operations</p>
              </div>
              {isLoading && <LoadingSpinner size="lg" />}
            </div>

            {elements.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>
                    <CircleDot className="relative h-24 w-24 mx-auto opacity-60 text-purple-400" />
                  </div>
                  <p className="text-2xl font-semibold mb-3">Queue is empty</p>
                  <p className="text-lg text-gray-500">Enqueue some elements to see the interactive visualization</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Direction indicators */}
                <div className="flex justify-between items-center mb-8 text-base text-gray-300">
                  <div className="flex items-center space-x-3 bg-blue-900/20 border border-blue-700 rounded-xl px-4 py-2">
                    <ArrowLeftRight className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">Front (Dequeue)</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-purple-900/20 border border-purple-700 rounded-xl px-4 py-2">
                    <span className="font-medium">Rear (Enqueue)</span>
                    <ArrowRight className="h-5 w-5 text-purple-400" />
                  </div>
                </div>

                {/* Queue Elements - with horizontal scrolling */}
                <div className="flex-1 queue-container overflow-x-auto overflow-y-hidden pb-6">
                  <div className="flex items-center space-x-6 justify-start min-w-max px-4 py-8">
                    {elements.map((element, index) => (
                      <QueueNode
                        key={index}
                        value={element}
                        index={index}
                        position={
                          index === 0 ? 'front' : 
                          index === elements.length - 1 ? 'rear' : 'middle'
                        }
                        isHighlighted={highlightedIndex === index}
                        showArrow={index < elements.length - 1}
                        className="transition-all duration-500 ease-in-out"
                      />
                    ))}
                  </div>
                </div>

                {/* Queue Position Labels */}
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <div className="text-center">
                    <div className="font-medium text-blue-400">FRONT</div>
                    <div>Index: {queueInfo?.front}</div>
                    <div>Element: {queueInfo?.frontElement}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-400">REAR</div>
                    <div>Index: {queueInfo?.rear}</div>
                    <div>Element: {queueInfo?.rearElement}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Queue Operations Legend */}
            <div className="mt-8 p-4 bg-dark-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Operations Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3 text-teal-400" />
                  <span><strong>Enqueue:</strong> Add element to rear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="h-3 w-3 text-red-400" />
                  <span><strong>Dequeue:</strong> Remove front element</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-3 w-3 text-blue-400" />
                  <span><strong>Peek:</strong> View front element</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p><strong>FIFO:</strong> First In, First Out - Elements are removed in the same order they were added</p>
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