import { apiClient } from './api';
import { ApiResponse, LinkedListSession, StackSession, QueueSession } from '../types';

/**
 * LinkedList Service
 * Handles all LinkedList operations with backend API integration
 */
export class LinkedListService {
  
  /**
   * Create a new LinkedList session
   */
  async createSession(type: 'singly' | 'doubly', sessionId?: string): Promise<ApiResponse<LinkedListSession>> {
    try {
      const response = await apiClient.post<ApiResponse<LinkedListSession>>(`/api/linkedlist/${type}`, {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create LinkedList session'
      };
    }
  }

  /**
   * Get all user sessions
   */
  async getSessions(): Promise<ApiResponse<LinkedListSession[]>> {
    try {
      const response = await apiClient.get<ApiResponse<LinkedListSession[]>>('/api/linkedlist/sessions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  }

  /**
   * Insert element at front
   */
  async insertFront(sessionId: string, data: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/insert-head', {
        sessionId,
        data
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to insert at front'
      };
    }
  }

  /**
   * Insert element at rear
   */
  async insert(sessionId: string, data: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/insert-tail', {
        sessionId,
        data
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to insert element'
      };
    }
  }

  /**
   * Insert element at specific index (for doubly linked list)
   */
  async insertAtIndex(sessionId: string, data: any, index: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/insert-at-index', {
        sessionId,
        value: data,
        index
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to insert at index'
      };
    }
  }

  /**
   * Remove element from front
   */
  async removeFront(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/delete-head', {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from front'
      };
    }
  }

  /**
   * Remove element from rear
   */
  async remove(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/delete-tail', {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove element'
      };
    }
  }

  /**
   * Remove element at specific index
   */
  async removeAtIndex(sessionId: string, index: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/remove-at-index', {
        sessionId,
        index
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove at index'
      };
    }
  }

  /**
   * Search for element
   */
  async search(sessionId: string, data: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/search', {
        sessionId,
        data
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search element'
      };
    }
  }

  /**
   * View current LinkedList state
   */
  async view(sessionId: string): Promise<ApiResponse<LinkedListSession>> {
    try {
      const response = await apiClient.get<ApiResponse<LinkedListSession>>(`/api/linkedlist/view?sessionId=${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to view LinkedList'
      };
    }
  }

  /**
   * Clear/Reset LinkedList (remove all elements)
   */
  async clear(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/linkedlist/clear', {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear LinkedList'
      };
    }
  }
}

/**
 * Stack Service
 * Handles all Stack operations with backend API integration
 */
export class StackService {
  
  /**
   * Create a new Stack session
   */
  async createSession(type: 'static' | 'dynamic', maxSize?: number, sessionId?: string): Promise<ApiResponse<StackSession>> {
    try {
      const response = await apiClient.post<ApiResponse<StackSession>>(`/api/stack/${type}`, {
        maxSize,
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create Stack session'
      };
    }
  }

  /**
   * Get all user sessions
   */
  async getSessions(): Promise<ApiResponse<StackSession[]>> {
    try {
      const response = await apiClient.get<ApiResponse<StackSession[]>>('/api/stack/sessions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  }

  /**
   * Push element to stack
   */
  async push(sessionId: string, data: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/stack/push', {
        sessionId,
        data
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to push element'
      };
    }
  }

  /**
   * Pop element from stack
   */
  async pop(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/stack/pop', {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to pop element'
      };
    }
  }

  /**
   * Peek top element
   */
  async peek(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(`/api/stack/peek?sessionId=${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to peek element'
      };
    }
  }

  /**
   * View current Stack state
   */
  async view(sessionId: string): Promise<ApiResponse<StackSession>> {
    try {
      const response = await apiClient.get<ApiResponse<StackSession>>(`/api/stack/view?sessionId=${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to view Stack'
      };
    }
  }
}

/**
 * Queue Service
 * Handles all Queue operations with backend API integration
 */
export class QueueService {
  
  /**
   * Create a new Queue session
   */
  async createSession(type: 'static' | 'dynamic', maxSize?: number, sessionId?: string): Promise<ApiResponse<QueueSession>> {
    try {
      const response = await apiClient.post<ApiResponse<QueueSession>>(`/api/queue/${type}`, {
        maxSize,
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create Queue session'
      };
    }
  }

  /**
   * Get all user sessions
   */
  async getSessions(): Promise<ApiResponse<QueueSession[]>> {
    try {
      const response = await apiClient.get<ApiResponse<QueueSession[]>>('/api/queue/sessions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  }

  /**
   * Enqueue element to queue
   */
  async enqueue(sessionId: string, data: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/queue/enqueue', {
        sessionId,
        data
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to enqueue element'
      };
    }
  }

  /**
   * Dequeue element from queue
   */
  async dequeue(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/api/queue/dequeue', {
        sessionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to dequeue element'
      };
    }
  }

  /**
   * Peek front element
   */
  async peek(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(`/api/queue/peek?sessionId=${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to peek element'
      };
    }
  }

  /**
   * View current Queue state
   */
  async view(sessionId: string): Promise<ApiResponse<QueueSession>> {
    try {
      const response = await apiClient.get<ApiResponse<QueueSession>>(`/api/queue/view?sessionId=${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to view Queue'
      };
    }
  }
}

// Export singleton instances
export const linkedListService = new LinkedListService();
export const stackService = new StackService();
export const queueService = new QueueService();