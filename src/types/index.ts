// Authentication types
export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Data Structure types
export interface DataStructureSession {
  sessionId: string;
  userId: string;
  type: string;
  createdAt: string;
  size: number;
  elements: any[];
}

export interface LinkedListSession extends DataStructureSession {
  type: 'singly' | 'doubly';
}

export interface StackSession extends DataStructureSession {
  type: 'static' | 'dynamic';
  maxSize?: number;
  isFull: boolean;
  isEmpty: boolean;
}

export interface QueueSession extends DataStructureSession {
  type: 'static' | 'dynamic';
  maxSize?: number;
  front: number;
  rear: number;
  isFull: boolean;
  isEmpty: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  session?: T;
  sessions?: T[];
}

// Operation types
export interface DataStructureOperation {
  type: 'insert' | 'remove' | 'search' | 'push' | 'pop' | 'peek' | 'enqueue' | 'dequeue';
  data?: any;
  index?: number;
  position?: 'front' | 'rear';
}

// Animation types
export interface AnimationState {
  isAnimating: boolean;
  highlightedNodes: number[];
  searchingNodes: number[];
  operation: string | null;
}