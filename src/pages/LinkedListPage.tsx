import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Search, 
  Eye, 
  Play,
  RotateCcw,
  List,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button, Input, LoadingSpinner, Node, Modal } from '../components/ui';
import { LinkedListService } from '../services/dataStructureService';
import { LinkedListSession, ApiResponse } from '../types';

interface LinkedListNode {
  data: any;
  next?: string;
  prev?: string;
  index: number;
}

interface OperationHistory {
  operation: string;
  data?: any;
  index?: number;
  success: boolean;
  message: string;
  timestamp: number;
}

/**
 * LinkedList Page Component
 * Main page for LinkedList operations and visualization
 */
export const LinkedListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkedListService = new LinkedListService();
  
  // State management
  const [session, setSession] = useState<LinkedListSession | null>(null);
  const [nodes, setNodes] = useState<LinkedListNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Operation states
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [insertAtIndexValue, setInsertAtIndexValue] = useState('');
  const [removeIndex, setRemoveIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [searchingNodes, setSearchingNodes] = useState<number[]>([]);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOperationHistory, setShowOperationHistory] = useState(false);
  const [sessionType, setSessionType] = useState<'singly' | 'doubly'>('singly');
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
      const response = await linkedListService.view(sessionId);
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
  const updateVisualization = (sessionData: LinkedListSession) => {
    if (sessionData?.elements && Array.isArray(sessionData.elements)) {
      const nodesList: LinkedListNode[] = sessionData.elements.map((element: any, index: number) => ({
        data: element,
        index,
        next: index < sessionData.elements.length - 1 ? `node-${index + 1}` : undefined,
        prev: sessionData.type === 'doubly' && index > 0 ? `node-${index - 1}` : undefined
      }));
      setNodes(nodesList);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionType) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.createSession(
        sessionType, 
        customSessionId || undefined
      );
      
      if (response.success && response.data) {
        setSession(response.data);
        setShowCreateModal(false);
        setSuccess(`${sessionType} linked list session created successfully!`);
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
    if (!session) {
      console.log('🚫 RefreshView: No session available');
      return;
    }
    
    console.log('🔄 RefreshView: Starting refresh for session:', session.sessionId);
    setIsLoading(true);
    try {
      const response = await linkedListService.view(session.sessionId);
      console.log('📡 RefreshView: API response:', response);
      
      if (response.success && response.data) {
        console.log('✅ RefreshView: Setting session data:', response.data);
        setSession(response.data);
        
        // Convert session data to nodes
        if (response.data?.elements && Array.isArray(response.data.elements)) {
          const elements = response.data.elements;
          const nodesList: LinkedListNode[] = elements.map((element: any, index: number) => ({
            data: element,
            index,
            next: index < elements.length - 1 ? `node-${index + 1}` : undefined,
            prev: session.type === 'doubly' && index > 0 ? `node-${index - 1}` : undefined
          }));
          console.log('🎨 RefreshView: Setting nodes:', nodesList);
          setNodes(nodesList);
        } else {
          console.log('📋 RefreshView: No elements found, clearing nodes');
          setNodes([]);
        }
      } else {
        console.error('❌ RefreshView: API failed:', response.message);
      }
    } catch (err) {
      console.error('💥 RefreshView: Error refreshing view:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertFront = async () => {
    if (!session || !insertValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.insertFront(session.sessionId, insertValue.trim());
      handleOperationResponse(response, 'Insert Front', insertValue.trim());
      setInsertValue('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertRear = async () => {
    if (!session || !insertValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.insert(session.sessionId, insertValue.trim());
      handleOperationResponse(response, 'Insert Rear', insertValue.trim());
      setInsertValue('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertAtIndex = async () => {
    if (!session || !insertAtIndexValue.trim() || !insertIndex.trim()) return;
    
    const index = parseInt(insertIndex);
    if (isNaN(index) || index < 0) {
      setError('Please enter a valid index (0 or greater)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.insertAtIndex(session.sessionId, insertAtIndexValue.trim(), index);
      handleOperationResponse(response, 'Insert At Index', `${insertAtIndexValue.trim()} at index ${index}`);
      setInsertAtIndexValue('');
      setInsertIndex('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFront = async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.removeFront(session.sessionId);
      handleOperationResponse(response, 'Remove Front');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRear = async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.remove(session.sessionId);
      handleOperationResponse(response, 'Remove Rear');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAtIndex = async () => {
    if (!session || !removeIndex.trim()) return;
    
    const index = parseInt(removeIndex);
    if (isNaN(index) || index < 0) {
      setError('Please enter a valid index (0 or greater)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.removeAtIndex(session.sessionId, index);
      handleOperationResponse(response, 'Remove At Index', `index ${index}`);
      setRemoveIndex('');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!session || !searchValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchingNodes([]);
    
    try {
      const response = await linkedListService.search(session.sessionId, searchValue.trim());
      
      if (response.success) {
        // Animate search process
        const searchAnimation = async () => {
          for (let i = 0; i < nodes.length; i++) {
            setSearchingNodes([i]);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (nodes[i].data.toString() === searchValue.trim()) {
              setHighlightedNodes([i]);
              setSearchingNodes([]);
              setSuccess(`Found "${searchValue.trim()}" at index ${i}`);
              return;
            }
          }
          setSearchingNodes([]);
          setError(`"${searchValue.trim()}" not found in the list`);
        };
        
        await searchAnimation();
      } else {
        setError(response.message);
      }
      
      setSearchValue('');
    } catch (err) {
      setError('Network error occurred');
      setSearchingNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperationResponse = async (response: ApiResponse, operation: string, data?: string) => {
    console.log('🔧 HandleOperationResponse:', { operation, data, response });
    
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
      
      console.log('✅ Operation successful, calling refreshView');
      await refreshView();
    } else {
      console.error('❌ Operation failed:', response.message);
      setError(response.message || `${operation} failed`);
    }
  };

  const handleReset = async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await linkedListService.clear(session.sessionId);
      if (response.success) {
        setNodes([]);
        setHighlightedNodes([]);
        setSearchingNodes([]);
        setInsertValue('');
        setInsertIndex('');
        setInsertAtIndexValue('');
        setRemoveIndex('');
        setSearchValue('');
        setSuccess('LinkedList cleared successfully');
        
        // Add to operation history
        const operation: OperationHistory = {
          operation: 'Clear',
          data: 'All elements',
          success: true,
          message: 'LinkedList cleared successfully',
          timestamp: Date.now()
        };
        setOperationHistory(prev => [operation, ...prev]);
      } else {
        setError(response.message || 'Failed to clear LinkedList');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (showCreateModal) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <Modal
          isOpen={showCreateModal}
          onClose={() => navigate('/dashboard')}
          title="Create LinkedList Session"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                LinkedList Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSessionType('singly')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    sessionType === 'singly'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium">Singly Linked</div>
                  <div className="text-xs text-gray-400 mt-1">One direction links</div>
                </button>
                <button
                  onClick={() => setSessionType('doubly')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    sessionType === 'doubly'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium">Doubly Linked</div>
                  <div className="text-xs text-gray-400 mt-1">Bidirectional links</div>
                </button>
              </div>
            </div>

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
      <header className="bg-dark-900 border-b border-gray-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <List className="h-6 w-6 text-teal-400" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {session?.type === 'singly' ? 'Singly' : 'Doubly'} Linked List
                </h1>
                <p className="text-sm text-gray-400">
                  Session: {session?.sessionId} | Size: {session?.size || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-3 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 px-6 py-3 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Operations Panel */}
        <div className="w-80 bg-dark-900 border-r border-gray-800 p-6 space-y-6 overflow-y-auto flex-shrink-0">
          {/* Insert Operations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Insert Operations</h3>
            
            <div className="space-y-3">
              <Input
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                placeholder="Enter value to insert..."
                className="w-full"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleInsertFront}
                  size="sm"
                  disabled={isLoading || !insertValue.trim()}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Front</span>
                </Button>
                <Button
                  onClick={handleInsertRear}
                  size="sm"
                  disabled={isLoading || !insertValue.trim()}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Rear</span>
                </Button>
              </div>

              {session?.type === 'doubly' && (
                <div className="space-y-2">
                  <Input
                    value={insertAtIndexValue}
                    onChange={(e) => setInsertAtIndexValue(e.target.value)}
                    placeholder="Value to insert..."
                    className="w-full"
                  />
                  <Input
                    value={insertIndex}
                    onChange={(e) => setInsertIndex(e.target.value)}
                    placeholder="Index for insertion..."
                    type="number"
                    min="0"
                    className="w-full"
                  />
                  <Button
                    onClick={handleInsertAtIndex}
                    size="sm"
                    disabled={isLoading || !insertAtIndexValue.trim() || !insertIndex.trim()}
                    className="w-full flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Insert at Index</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Remove Operations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Remove Operations</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleRemoveFront}
                variant="secondary"
                size="sm"
                disabled={isLoading || !nodes.length}
                className="flex items-center space-x-1"
              >
                <Minus className="h-4 w-4" />
                <span>Front</span>
              </Button>
              <Button
                onClick={handleRemoveRear}
                variant="secondary"
                size="sm"
                disabled={isLoading || !nodes.length}
                className="flex items-center space-x-1"
              >
                <Minus className="h-4 w-4" />
                <span>Rear</span>
              </Button>
            </div>

            {session?.type === 'doubly' && (
              <div className="space-y-2">
                <Input
                  value={removeIndex}
                  onChange={(e) => setRemoveIndex(e.target.value)}
                  placeholder="Index to remove..."
                  type="number"
                  min="0"
                  className="w-full"
                />
                <Button
                  onClick={handleRemoveAtIndex}
                  variant="secondary"
                  size="sm"
                  disabled={isLoading || !nodes.length || !removeIndex.trim()}
                  className="w-full flex items-center justify-center space-x-1"
                >
                  <Minus className="h-4 w-4" />
                  <span>Remove at Index</span>
                </Button>
              </div>
            )}
          </div>

          {/* Search Operation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Search Operation</h3>
            
            <div className="space-y-2">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter value to search..."
                className="w-full"
              />
              <Button
                onClick={handleSearch}
                variant="secondary"
                size="sm"
                disabled={isLoading || !searchValue.trim() || !nodes.length}
                className="w-full flex items-center justify-center space-x-1"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          {/* Session Info */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300">Session Info</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Type: {session?.type}</div>
              <div>Size: {session?.size || 0}</div>
              <div>ID: {session?.sessionId}</div>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 p-8 flex flex-col min-h-0">
          <div className="bg-dark-900 rounded-lg border border-gray-800 p-8 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-white">Visualization</h2>
              {isLoading && <LoadingSpinner size="sm" />}
            </div>

            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>LinkedList is empty</p>
                  <p className="text-sm mt-2">Add some elements to see the visualization</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 justify-center">
                {nodes.map((node, index) => (
                  <div key={index} className="flex items-center">
                    <Node
                      value={node.data}
                      index={index}
                      isHighlighted={highlightedNodes.includes(index)}
                      isSearching={searchingNodes.includes(index)}
                      showArrow={index < nodes.length - 1}
                      className="transition-all duration-300"
                    />
                    {session?.type === 'doubly' && index > 0 && (
                      <div className="text-teal-400 text-lg mx-2">⟵</div>
                    )}
                  </div>
                ))}
              </div>
            )}
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