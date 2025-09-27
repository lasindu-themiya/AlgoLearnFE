import { apiClient } from './api';
import { ApiResponse, SearchSession, SearchRequest, SearchResponse } from '../types';

/**
 * Searching Service
 * Handles all searching algorithm operations with backend API integration
 */
export class SearchingService {
  
  /**
   * Linear Search
   */
  async linearSearch(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await apiClient.post<SearchResponse>('/api/search/linear', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform linear search'
      };
    }
  }

  /**
   * Binary Search
   */
  async binarySearch(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await apiClient.post<SearchResponse>('/api/search/binary', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to perform binary search'
      };
    }
  }

  /**
   * Get all user search sessions
   */
  async getSessions(): Promise<{ success: boolean; sessions?: any[]; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; sessions: any[] }>('/api/search/sessions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch search sessions'
      };
    }
  }

  /**
   * Get specific search session details
   */
  async getSession(sessionId: string): Promise<{ success: boolean; session?: any; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; session: any }>(`/api/search/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch search session'
      };
    }
  }

  /**
   * Delete search session
   */
  async deleteSession(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`/api/search/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete search session'
      };
    }
  }

  /**
   * Perform search algorithm based on algorithm type
   */
  async search(algorithm: string, request: SearchRequest): Promise<SearchResponse> {
    switch (algorithm.toLowerCase()) {
      case 'linear':
        return this.linearSearch(request);
      case 'binary':
        return this.binarySearch(request);
      default:
        return {
          success: false,
          message: `Unsupported algorithm: ${algorithm}`
        };
    }
  }
}

// Export singleton instance
export const searchingService = new SearchingService();
export default searchingService;