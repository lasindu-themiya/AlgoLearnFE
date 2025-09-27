import React from 'react';
import { cn } from '../../utils/cn';

interface NodeProps {
  value: any;
  index: number;
  isHighlighted?: boolean;
  isSearching?: boolean;
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Node Component for Data Structure Visualization
 * Animated node block with different states
 */
export const Node: React.FC<NodeProps> = ({
  value,
  index,
  isHighlighted = false,
  isSearching = false,
  showArrow = false,
  onClick,
  className
}) => {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          'relative cursor-pointer transition-all duration-300 animate-fade-in group',
          className
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            'relative flex items-center justify-center min-w-[80px] h-16 text-lg font-bold bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105',
            isHighlighted && 'ring-4 ring-teal-400 ring-opacity-75 bg-gradient-to-br from-teal-800/50 to-teal-900/50 border-teal-400 shadow-2xl shadow-teal-400/25 scale-110',
            isSearching && 'ring-4 ring-orange-400 ring-opacity-75 bg-gradient-to-br from-orange-800/50 to-orange-900/50 border-orange-400 shadow-2xl shadow-orange-400/25 animate-pulse'
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
          <span className={cn(
            'relative z-10 text-gray-100 select-none',
            isHighlighted && 'text-teal-100 font-extrabold',
            isSearching && 'text-orange-100 font-extrabold'
          )}>{value}</span>
          
          {/* Glow effects */}
          {isHighlighted && (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-2xl blur-sm"></div>
          )}
          {isSearching && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-2xl blur-sm"></div>
          )}
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <span className="text-sm text-gray-500 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">{index}</span>
          </div>
          
          {/* Subtle hover animation */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      
      {showArrow && (
        <div className="arrow mx-4 text-teal-400 text-2xl font-bold animate-pulse">
          →
        </div>
      )}
    </div>
  );
};

interface StackNodeProps extends NodeProps {
  stackIndex?: number;
}

/**
 * Stack Node Component - Specifically for Stack visualization
 */
export const StackNode: React.FC<StackNodeProps> = ({
  value,
  stackIndex,
  isHighlighted,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'group relative w-28 h-16 mb-3 flex items-center justify-center text-lg font-bold bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in transform hover:scale-105',
        isHighlighted && 'ring-4 ring-teal-400 ring-opacity-75 bg-gradient-to-br from-teal-800/50 to-teal-900/50 border-teal-400 shadow-2xl shadow-teal-400/25 scale-110',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
      <span className={cn(
        'relative z-10 text-gray-100 select-none',
        isHighlighted && 'text-teal-100 font-extrabold'
      )}>{value}</span>
      
      {/* Glow effect for highlighted nodes */}
      {isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-xl blur-sm"></div>
      )}
      
      {stackIndex !== undefined && (
        <div className="absolute -right-10 top-1/2 transform -translate-y-1/2">
          <span className="text-sm text-gray-500 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">{stackIndex}</span>
        </div>
      )}
      
      {/* Subtle animation */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

interface QueueNodeProps extends NodeProps {
  position?: 'front' | 'rear' | 'middle';
}

/**
 * Queue Node Component - Specifically for Queue visualization
 */
export const QueueNode: React.FC<QueueNodeProps> = ({
  value,
  index,
  position,
  isHighlighted,
  showArrow = true,
  className,
  ...props
}) => {
  const getPositionColor = () => {
    switch (position) {
      case 'front':
        return 'from-blue-800/50 to-blue-900/50 border-blue-400 text-blue-100 shadow-blue-400/25';
      case 'rear':
        return 'from-purple-800/50 to-purple-900/50 border-purple-400 text-purple-100 shadow-purple-400/25';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={cn(
          'group relative w-20 h-14 flex items-center justify-center text-lg font-bold bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in transform hover:scale-105',
          isHighlighted && 'ring-4 ring-teal-400 ring-opacity-75 bg-gradient-to-br from-teal-800/50 to-teal-900/50 border-teal-400 shadow-2xl shadow-teal-400/25 scale-110',
          position && `bg-gradient-to-br ${getPositionColor()}`,
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
        <span className={cn(
          'relative z-10 text-gray-100 select-none',
          isHighlighted && 'text-teal-100 font-extrabold',
          position === 'front' && 'text-blue-100',
          position === 'rear' && 'text-purple-100'
        )}>{value}</span>
        
        {/* Glow effects */}
        {isHighlighted && (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-xl blur-sm"></div>
        )}
        {position === 'front' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-xl blur-sm"></div>
        )}
        {position === 'rear' && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-xl blur-sm"></div>
        )}
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-sm text-gray-500 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">{index}</span>
        </div>
        
        {position && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <span className={cn(
              'text-sm font-bold px-2 py-1 rounded-lg',
              position === 'front' && 'text-blue-300 bg-blue-900/30',
              position === 'rear' && 'text-purple-300 bg-purple-900/30',
              !position && 'text-amber-300 bg-amber-900/30'
            )}>{position}</span>
          </div>
        )}
        
        {/* Subtle hover animation */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {showArrow && (
        <div className="arrow mx-3 text-teal-400 text-xl font-bold animate-pulse">
          →
        </div>
      )}
    </div>
  );
};