import { apiClient } from './api';
import { ApiResponse, SortingSession, SortingRequest, SortingResponse } from '../types';

/**
 * Sorting Service
 * Handles all sorting algorithm operations with backend API integration
 */
export class SortingService {
  
  /**
   * Bubble Sort
   */
  async bubbleSort(request: SortingRequest): Promise<SortingResponse> {
    try {
      const response = await apiClient.post<SortingResponse>('/api/sort/bubble', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform bubble sort'
      };
    }
  }

  /**
   * Insertion Sort
   */
  async insertionSort(request: SortingRequest): Promise<SortingResponse> {
    try {
      const response = await apiClient.post<SortingResponse>('/api/sort/insertion', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform insertion sort'
      };
    }
  }

  /**
   * Selection Sort
   */
  async selectionSort(request: SortingRequest): Promise<SortingResponse> {
    try {
      const response = await apiClient.post<SortingResponse>('/api/sort/selection', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform selection sort'
      };
    }
  }

  /**
   * Min Sort
   */
  async minSort(request: SortingRequest): Promise<SortingResponse> {
    try {
      const response = await apiClient.post<SortingResponse>('/api/sort/min', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform min sort'
      };
    }
  }

  /**
   * Optimized Bubble Sort
   */
  async optimizedBubbleSort(request: SortingRequest): Promise<SortingResponse> {
    try {
      const response = await apiClient.post<SortingResponse>('/api/sort/optimized-bubble', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform optimized bubble sort'
      };
    }
  }

  /**
   * Get all user sorting sessions
   */
  async getSessions(): Promise<{ success: boolean; sessions?: any[]; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; sessions: any[] }>('/api/sort/sessions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sorting sessions'
      };
    }
  }

  /**
   * Get specific sorting session details
   */
  async getSession(sessionId: string): Promise<{ success: boolean; session?: any; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; session: any }>(`/api/sort/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sorting session'
      };
    }
  }

  /**
   * Delete sorting session
   */
  async deleteSession(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/api/sort/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete sorting session'
      };
    }
  }

  /**
   * Perform sorting algorithm based on algorithm type
   */
  async sort(algorithm: string, request: SortingRequest): Promise<SortingResponse> {
    switch (algorithm.toLowerCase()) {
      case 'bubble':
        return this.bubbleSort(request);
      case 'insertion':
        return this.insertionSort(request);
      case 'selection':
        return this.selectionSort(request);
      case 'min':
        return this.minSort(request);
      case 'optimized-bubble':
        return this.optimizedBubbleSort(request);
      default:
        return {
          success: false,
          message: `Unsupported algorithm: ${algorithm}`
        };
    }
  }
}

// Export singleton instance
export const sortingService = new SortingService();
export default sortingService;