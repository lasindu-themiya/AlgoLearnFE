import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play,
  RotateCcw,
  Search,
  AlertCircle,
  CheckCircle,
  Target,
  Clock,
  BarChart3,
  Eye,
  Shuffle,
  TrendingUp
} from 'lucide-react';
import { Button, Input, LoadingSpinner, ArrayNode, Modal } from '../components/ui';
import { searchingService } from '../services/searchingService';
import { SearchSession, SearchStep } from '../types';

interface AlgorithmInfo {
  name: string;
  key: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  requirements: string;
}

const SEARCH_ALGORITHMS: AlgorithmInfo[] = [
  {
    name: 'Linear Search',
    key: 'linear',
    description: 'Sequentially searches through each element of the array until the target is found or the end is reached.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    requirements: 'None'
  },
  {
    name: 'Binary Search',
    key: 'binary',
    description: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    requirements: 'Sorted Array'
  }
];

/**
 * Searching Page Component
 * Main page for searching algorithms visualization
 */
export const SearchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State management
  const [session, setSession] = useState<SearchSession | null>(null);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [targetValue, setTargetValue] = useState<number>(25);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Algorithm and input states
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('linear');
  const [arrayInput, setArrayInput] = useState('11,12,22,25,34,64,90');
  const [targetInput, setTargetInput] = useState('25');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Modal states
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  
  // Animation states
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [searchRange, setSearchRange] = useState<{ left: number; right: number; mid?: number }>({ left: -1, right: -1 });

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

  // Initialize page
  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    if (sessionId) {
      loadExistingSession(sessionId);
    } else {
      // Initialize with default array
      const defaultArray = parseArrayInput(arrayInput);
      setCurrentArray(defaultArray);
      setTargetValue(parseInt(targetInput) || 25);
    }
  }, [searchParams]);

  // Load existing session
  const loadExistingSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await searchingService.getSession(sessionId);
      if (response.success && response.session) {
        setSession(response.session);
        setCurrentArray(response.session.array); // Use 'array' field from API response
        setTargetValue(response.session.target);
        setSteps(response.session.steps || []);
        setSelectedAlgorithm(response.session.algorithm);
        setFoundIndex(response.session.found ? response.session.foundIndex : -1);
        setSuccess('Session loaded successfully!');
      } else {
        setError(response.message || 'Failed to load session');
      }
    } catch (err) {
      setError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse array input
  const parseArrayInput = (input: string): number[] => {
    try {
      return input
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    } catch {
      return [];
    }
  };

  // Generate random array
  const generateRandomArray = (size: number = 8, max: number = 100, sorted: boolean = false): void => {
    let array = Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
    
    if (sorted) {
      array = array.sort((a, b) => a - b);
    }
    
    const arrayString = array.join(',');
    setArrayInput(arrayString);
    setCurrentArray(array);
    setSteps([]);
    setCurrentStep(0);
    setSession(null);
    setFoundIndex(-1);
    setCurrentIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    
    // Set a random target from the array
    if (array.length > 0) {
      const randomTarget = array[Math.floor(Math.random() * array.length)];
      setTargetInput(randomTarget.toString());
      setTargetValue(randomTarget);
    }
  };

  // Start searching
  const startSearching = async (): Promise<void> => {
    const array = parseArrayInput(arrayInput);
    const target = parseInt(targetInput);
    
    if (array.length === 0) {
      setError('Please enter a valid array');
      return;
    }

    if (isNaN(target)) {
      setError('Please enter a valid target value');
      return;
    }

    if (array.length > 15) {
      setError('Array size cannot exceed 15 elements for better visualization');
      return;
    }

    // Check if binary search requires sorted array
    if (selectedAlgorithm === 'binary') {
      const isSorted = array.every((val, index) => index === 0 || array[index - 1] <= val);
      if (!isSorted) {
        setError('Binary search requires a sorted array. Please sort the array first or use linear search.');
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchingService.search(selectedAlgorithm, {
        array: array,
        target: target
      });

      if (response.success) {
        setSession(response.session!);
        setSteps(response.steps || []);
        setCurrentStep(0);
        setCurrentArray(array);
        setTargetValue(target);
        setFoundIndex(-1);
        setCurrentIndex(-1);
        setSearchRange({ left: -1, right: -1 });
        
        const resultMessage = response.found 
          ? `Target ${target} found at index ${response.foundIndex}! Comparisons: ${response.comparisons}`
          : `Target ${target} not found. Comparisons: ${response.comparisons}`;
        
        setSuccess(resultMessage);
        
        // Auto-start animation
        if (response.steps && response.steps.length > 0) {
          setIsPlaying(true);
          playAnimation(response.steps);
        }
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (err) {
      setError('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  // Play animation
  const playAnimation = async (stepsToAnimate?: SearchStep[]): Promise<void> => {
    const animationSteps = stepsToAnimate || steps;
    if (animationSteps.length === 0) return;

    setIsAnimating(true);
    setIsPlaying(true);
    
    for (let i = 0; i < animationSteps.length; i++) {
      const step = animationSteps[i];
      
      // Update current step
      setCurrentStep(i);
      
      // Update visualization based on step data
      setCurrentIndex(step.currentIndex);
      
      if (step.match) {
        setFoundIndex(step.currentIndex);
      }
      
      // For binary search, update the range
      if (selectedAlgorithm === 'binary' && step.left >= 0 && step.right >= 0) {
        setSearchRange({
          left: step.left,
          right: step.right,
          mid: step.mid >= 0 ? step.mid : undefined
        });
      }
      
      // Pause between steps
      await new Promise(resolve => setTimeout(resolve, step.match ? 1500 : 1200));
    }
    
    setIsAnimating(false);
    setIsPlaying(false);
  };

  // Reset visualization
  const resetVisualization = (): void => {
    setCurrentStep(0);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setSearchRange({ left: -1, right: -1 });
    setIsPlaying(false);
    setIsAnimating(false);
  };

  // Step through animation manually
  const stepForward = (): void => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      const step = steps[nextStep];
      
      setCurrentStep(nextStep);
      setCurrentIndex(step.currentIndex);
      
      if (step.match) {
        setFoundIndex(step.currentIndex);
      }
      
      if (selectedAlgorithm === 'binary' && step.left >= 0 && step.right >= 0) {
        setSearchRange({
          left: step.left,
          right: step.right,
          mid: step.mid >= 0 ? step.mid : undefined
        });
      }
    }
  };

  const stepBackward = (): void => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const step = steps[prevStep];
      
      setCurrentStep(prevStep);
      setCurrentIndex(step.currentIndex);
      
      if (!step.match) {
        setFoundIndex(-1);
      }
      
      if (selectedAlgorithm === 'binary' && step.left >= 0 && step.right >= 0) {
        setSearchRange({
          left: step.left,
          right: step.right,
          mid: step.mid >= 0 ? step.mid : undefined
        });
      }
    }
  };

  // Get node state for visualization
  const getNodeState = (index: number) => {
    const isFound = foundIndex === index;
    const isCurrent = currentIndex === index;
    const isInRange = selectedAlgorithm === 'binary' && 
      searchRange.left >= 0 && searchRange.right >= 0 && 
      index >= searchRange.left && index <= searchRange.right;
    const isMid = selectedAlgorithm === 'binary' && searchRange.mid === index;
    
    return {
      isFound,
      isHighlighted: isCurrent || isMid,
      isComparing: isInRange && !isCurrent && !isMid && !isFound
    };
  };

  const currentAlgorithm = SEARCH_ALGORITHMS.find(a => a.key === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-dark-900 to-dark-950 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-gray-600" />
              <h1 className="text-xl font-bold text-white flex items-center">
                <Search className="w-6 h-6 mr-2 text-teal-400" />
                Searching Algorithms
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAlgorithmInfo(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Algorithm Info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSessionHistory(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-800 text-green-300 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg text-gray-300">Processing search algorithm...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Controls */}
            <div className="bg-gradient-to-b from-dark-900 to-dark-950 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Algorithm Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Select Algorithm
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={isAnimating}
                    title="Select search algorithm"
                  >
                    {SEARCH_ALGORITHMS.map((algo) => (
                      <option key={algo.key} value={algo.key} className="bg-dark-800 text-white">
                        {algo.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Array Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Array Elements (comma-separated)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={arrayInput}
                      onChange={(e) => setArrayInput(e.target.value)}
                      placeholder="11,12,22,25,34,64,90"
                      className="flex-1 bg-dark-800 border-gray-600 text-white placeholder-gray-400"
                      disabled={isAnimating}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => generateRandomArray(8, 100, false)}
                      disabled={isAnimating}
                      title="Generate Random Array"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Target Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Target Value
                  </label>
                  <Input
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    placeholder="25"
                    type="number"
                    className="bg-dark-800 border-gray-600 text-white placeholder-gray-400"
                    disabled={isAnimating}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Actions
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={startSearching}
                      disabled={isAnimating || !arrayInput.trim() || !targetInput.trim()}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetVisualization}
                      disabled={isAnimating}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generate Sorted Array Button for Binary Search */}
              {selectedAlgorithm === 'binary' && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => generateRandomArray(8, 100, true)}
                    disabled={isAnimating}
                    className="mr-3"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Sorted Array
                  </Button>
                  <span className="text-sm text-gray-400">
                    Binary search requires a sorted array
                  </span>
                </div>
              )}

              {/* Algorithm Description */}
              {currentAlgorithm && (
                <div className="mt-6 p-4 bg-teal-900/20 border border-teal-800 rounded-lg">
                  <h3 className="font-medium text-teal-300 mb-2">{currentAlgorithm.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{currentAlgorithm.description}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-gray-300">Best: </span>
                      <span className="text-green-400">{currentAlgorithm.timeComplexity.best}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Average: </span>
                      <span className="text-yellow-400">{currentAlgorithm.timeComplexity.average}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Worst: </span>
                      <span className="text-red-400">{currentAlgorithm.timeComplexity.worst}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Space: </span>
                      <span className="text-blue-400">{currentAlgorithm.spaceComplexity}</span>
                    </div>
                    <div>
                      <span className="font-medium">Requirements: </span>
                      <span className="text-purple-700">{currentAlgorithm.requirements}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Array Visualization */}
            <div className="bg-gradient-to-b from-dark-900 to-dark-950 rounded-lg shadow-lg border border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Array Visualization
                  {targetValue !== undefined && (
                    <span className="ml-4 text-sm text-teal-400">
                      Target: {targetValue}
                    </span>
                  )}
                </h3>
                {session && (
                  <div className="text-sm text-gray-300">
                    Comparisons: {session.comparisons}
                    {session.found && (
                      <span className="ml-4 text-green-400">
                        Found at index {session.foundIndex}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {currentArray.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {currentArray.map((value, index) => {
                    const nodeState = getNodeState(index);
                    return (
                      <ArrayNode
                        key={`${index}-${value}`}
                        value={value}
                        index={index}
                        isComparing={nodeState.isComparing}
                        isHighlighted={nodeState.isHighlighted}
                        isFound={nodeState.isFound}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Enter an array to start search visualization
                </div>
              )}

              {/* Search Range Indicator for Binary Search */}
              {selectedAlgorithm === 'binary' && searchRange.left >= 0 && searchRange.right >= 0 && (
                <div className="mb-4 text-center">
                  <div className="text-sm text-gray-600">
                    Search Range: [{searchRange.left}, {searchRange.right}]
                    {searchRange.mid !== undefined && (
                      <span className="ml-4 text-blue-600">
                        Mid: {searchRange.mid}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step Controls */}
              {steps.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={stepBackward}
                        disabled={currentStep === 0 || isAnimating}
                      >
                        ←
                      </Button>
                      <span className="text-sm text-gray-600">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={stepForward}
                        disabled={currentStep >= steps.length - 1 || isAnimating}
                      >
                        →
                      </Button>
                    </div>

                    <Button
                      onClick={() => playAnimation()}
                      disabled={isAnimating || steps.length === 0}
                      variant="secondary"
                    >
                      {isPlaying ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Play Animation
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Current Step Description */}
                  {steps[currentStep] && (
                    <div className="bg-dark-800 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        <p className="text-sm text-gray-300">
                          {steps[currentStep].description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Algorithm Info Modal */}
      {showAlgorithmInfo && (
        <Modal
          isOpen={showAlgorithmInfo}
          onClose={() => setShowAlgorithmInfo(false)}
          title="Searching Algorithms"
          size="xl"
        >
          <div className="space-y-6">
            {SEARCH_ALGORITHMS.map((algo) => (
              <div key={algo.key} className="border border-gray-600 rounded-lg p-4 bg-dark-800">
                <h3 className="font-semibold text-lg mb-2 text-white">{algo.name}</h3>
                <p className="text-gray-300 mb-4">{algo.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-200">Time Complexity:</h4>
                    <ul className="space-y-1">
                      <li className="text-gray-300">Best: <span className="text-green-400">{algo.timeComplexity.best}</span></li>
                      <li className="text-gray-300">Average: <span className="text-yellow-400">{algo.timeComplexity.average}</span></li>
                      <li className="text-gray-300">Worst: <span className="text-red-400">{algo.timeComplexity.worst}</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-gray-200">Space Complexity:</h4>
                    <p className="text-blue-400">{algo.spaceComplexity}</p>
                    <h4 className="font-medium mt-4 mb-2 text-gray-200">Requirements:</h4>
                    <p className="text-purple-400">{algo.requirements}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Session History Modal - Placeholder */}
      {showSessionHistory && (
        <Modal
          isOpen={showSessionHistory}
          onClose={() => setShowSessionHistory(false)}
          title="Search Sessions"
        >
          <div className="text-center py-8 text-gray-400">
            Session history feature coming soon...
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SearchingPage;