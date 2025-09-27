import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Shuffle,
  Clock,
  BarChart3,
  Eye
} from 'lucide-react';
import { Button, Input, LoadingSpinner, ArrayNode, Modal } from '../components/ui';
import { sortingService } from '../services/sortingService';
import { SortingSession, SortingStep } from '../types';

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
}

const SORTING_ALGORITHMS: AlgorithmInfo[] = [
  {
    name: 'Bubble Sort',
    key: 'bubble',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    name: 'Insertion Sort',
    key: 'insertion',
    description: 'Builds the final sorted array one item at a time by repeatedly inserting elements into their correct position.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    name: 'Selection Sort',
    key: 'selection',
    description: 'Finds the minimum element from the unsorted portion and places it at the beginning.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    name: 'Min Sort',
    key: 'min',
    description: 'A variation of selection sort that finds the minimum element and places it in correct position.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  },
  {
    name: 'Optimized Bubble Sort',
    key: 'optimized-bubble',
    description: 'An improved version of bubble sort that stops early if the list becomes sorted.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)'
  }
];

/**
 * Sorting Page Component
 * Main page for sorting algorithms visualization
 */
export const SortingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State management
  const [session, setSession] = useState<SortingSession | null>(null);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Algorithm and input states
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubble');
  const [arrayInput, setArrayInput] = useState('64,34,25,12,22,11,90');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Modal states
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  
  // Animation states
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappedIndices, setSwappedIndices] = useState<number[]>([]);

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
      setOriginalArray(defaultArray);
    }
  }, [searchParams]);

  // Load existing session
  const loadExistingSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await sortingService.getSession(sessionId);
      if (response.success && response.session) {
        setSession(response.session);
        // Handle different possible field names from API
        const sessionArray = response.session.currentArray || response.session.array || response.session.originalArray;
        const originalSessionArray = response.session.originalArray || response.session.array;
        
        if (sessionArray) {
          setCurrentArray(sessionArray);
          setOriginalArray(originalSessionArray);
        }
        setSteps(response.session.steps || []);
        setSelectedAlgorithm(response.session.algorithm);
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
  const generateRandomArray = (size: number = 8, max: number = 100): void => {
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
    const arrayString = array.join(',');
    setArrayInput(arrayString);
    setCurrentArray(array);
    setOriginalArray(array);
    setSteps([]);
    setCurrentStep(0);
    setSession(null);
  };

  // Start sorting
  const startSorting = async (): Promise<void> => {
    const array = parseArrayInput(arrayInput);
    
    if (array.length === 0) {
      setError('Please enter a valid array');
      return;
    }

    if (array.length > 15) {
      setError('Array size cannot exceed 15 elements for better visualization');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sortingService.sort(selectedAlgorithm, {
        array: array
      });

      if (response.success) {
        setSession(response.session!);
        setSteps(response.steps || []);
        setCurrentStep(0);
        setCurrentArray(array);
        setOriginalArray(array);
        setSuccess(`${SORTING_ALGORITHMS.find(a => a.key === selectedAlgorithm)?.name} completed! Comparisons: ${response.comparisons}, Swaps: ${response.swaps}`);
        
        // Auto-start animation
        if (response.steps && response.steps.length > 0) {
          setIsPlaying(true);
          playAnimation(response.steps);
        }
      } else {
        setError(response.message || 'Sorting failed');
      }
    } catch (err) {
      setError('Failed to perform sorting');
    } finally {
      setIsLoading(false);
    }
  };

  // Play animation
  const playAnimation = async (stepsToAnimate?: SortingStep[]): Promise<void> => {
    const animationSteps = stepsToAnimate || steps;
    if (animationSteps.length === 0) return;

    setIsAnimating(true);
    setIsPlaying(true);
    
    for (let i = 0; i < animationSteps.length; i++) {
      const step = animationSteps[i];
      
      // Update current step and array
      setCurrentStep(i);
      setCurrentArray([...step.array]);
      
      // Highlight comparing indices
      if (step.compareIndex1 >= 0 && step.compareIndex2 >= 0) {
        setComparingIndices([step.compareIndex1, step.compareIndex2]);
      } else {
        setComparingIndices([]);
      }
      
      // Highlight swapped indices
      if (step.swapped) {
        setSwappedIndices([step.compareIndex1, step.compareIndex2]);
        // Brief pause for swap visualization
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSwappedIndices([]);
      } else {
        setSwappedIndices([]);
      }
      
      // Pause between steps
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    setIsAnimating(false);
    setIsPlaying(false);
    setComparingIndices([]);
    setSwappedIndices([]);
  };

  // Reset visualization
  const resetVisualization = (): void => {
    setCurrentStep(0);
    setCurrentArray(originalArray);
    setComparingIndices([]);
    setSwappedIndices([]);
    setIsPlaying(false);
    setIsAnimating(false);
  };

  // Step through animation manually
  const stepForward = (): void => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      const step = steps[nextStep];
      
      setCurrentStep(nextStep);
      setCurrentArray([...step.array]);
      
      if (step.compareIndex1 >= 0 && step.compareIndex2 >= 0) {
        setComparingIndices([step.compareIndex1, step.compareIndex2]);
      } else {
        setComparingIndices([]);
      }
      
      if (step.swapped) {
        setSwappedIndices([step.compareIndex1, step.compareIndex2]);
        setTimeout(() => setSwappedIndices([]), 1500);
      }
    }
  };

  const stepBackward = (): void => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const step = steps[prevStep];
      
      setCurrentStep(prevStep);
      setCurrentArray([...step.array]);
      
      if (step.compareIndex1 >= 0 && step.compareIndex2 >= 0) {
        setComparingIndices([step.compareIndex1, step.compareIndex2]);
      } else {
        setComparingIndices([]);
      }
    }
  };

  const currentAlgorithm = SORTING_ALGORITHMS.find(a => a.key === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
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
                <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                Sorting Algorithms
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
          <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg text-gray-300">Processing sorting algorithm...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Controls */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Algorithm Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Select Algorithm
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isAnimating}
                    title="Select sorting algorithm"
                  >
                    {SORTING_ALGORITHMS.map((algo) => (
                      <option key={algo.key} value={algo.key}>
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
                      placeholder="64,34,25,12,22,11,90"
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      disabled={isAnimating}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => generateRandomArray()}
                      disabled={isAnimating}
                      title="Generate Random Array"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Actions
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={startSorting}
                      disabled={isAnimating || !arrayInput.trim()}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Sort
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

              {/* Algorithm Description */}
              {currentAlgorithm && (
                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-800">
                  <h3 className="font-medium text-purple-300 mb-2">{currentAlgorithm.name}</h3>
                  <p className="text-sm text-purple-200 mb-3">{currentAlgorithm.description}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
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
                  </div>
                </div>
              )}
            </div>

            {/* Array Visualization */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Array Visualization</h3>
                {session && (
                  <div className="text-sm text-gray-400">
                    Comparisons: {session.comparisons} | Swaps: {session.swaps}
                  </div>
                )}
              </div>

              {currentArray.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {currentArray.map((value, index) => (
                    <ArrayNode
                      key={`${index}-${value}`}
                      value={value}
                      index={index}
                      isComparing={comparingIndices.includes(index)}
                      isSwapped={swappedIndices.includes(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Enter an array to start sorting visualization
                </div>
              )}

              {/* Step Controls */}
              {steps.length > 0 && (
                <div className="border-t border-gray-700 pt-6">
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
                      <span className="text-sm text-gray-400">
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
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
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
          title="Sorting Algorithms"
          size="xl"
        >
          <div className="space-y-6">
            {SORTING_ALGORITHMS.map((algo) => (
              <div key={algo.key} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
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
          title="Sorting Sessions"
        >
          <div className="text-center py-8 text-gray-500">
            Session history feature coming soon...
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SortingPage;