import React from 'react';
import { cn } from '../../utils/cn';

interface ArrayNodeProps {
  value: number;
  index: number;
  isComparing?: boolean;
  isHighlighted?: boolean;
  isFound?: boolean;
  isSwapped?: boolean;
  className?: string;
  showIndex?: boolean;
}

/**
 * ArrayNode Component
 * Displays a single element in an array visualization with various states
 */
export const ArrayNode: React.FC<ArrayNodeProps> = ({
  value,
  index,
  isComparing = false,
  isHighlighted = false,
  isFound = false,
  isSwapped = false,
  className = '',
  showIndex = true
}) => {
  const getNodeClasses = () => {
    return cn(
      // Base styles
      'flex flex-col items-center justify-center min-w-[60px] h-16 border-2 rounded-lg font-mono font-semibold text-lg transition-all duration-300 select-none',
      
      // Default state
      'bg-white border-gray-300 text-gray-800',
      
      // State-specific styles
      {
        // Comparing state (two elements being compared)
        'bg-yellow-100 border-yellow-400 text-yellow-800 animate-pulse': isComparing,
        
        // Highlighted state (general highlight)
        'bg-blue-100 border-blue-400 text-blue-800': isHighlighted && !isComparing && !isFound && !isSwapped,
        
        // Found state (search result)
        'bg-green-100 border-green-400 text-green-800 animate-bounce': isFound,
        
        // Swapped state (elements that were swapped)
        'bg-red-100 border-red-400 text-red-800 scale-110': isSwapped,
        
        // Hover effect when not in special states
        'hover:bg-gray-50 hover:border-gray-400': !isComparing && !isHighlighted && !isFound && !isSwapped,
      },
      
      className
    );
  };

  const getIndexClasses = () => {
    return cn(
      'text-xs font-medium mt-1 transition-colors duration-300',
      {
        'text-yellow-600': isComparing,
        'text-blue-600': isHighlighted && !isComparing && !isFound && !isSwapped,
        'text-green-600': isFound,
        'text-red-600': isSwapped,
        'text-gray-500': !isComparing && !isHighlighted && !isFound && !isSwapped,
      }
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className={getNodeClasses()}>
        <span className="text-center">
          {value}
        </span>
      </div>
      {showIndex && (
        <div className={getIndexClasses()}>
          [{index}]
        </div>
      )}
    </div>
  );
};

export default ArrayNode;