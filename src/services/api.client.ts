/**
 * ============================================================================
 * API CLIENT SERVICE
 * ============================================================================
 * Centralized API communication layer for all frontend requests
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { ApiResponse, ApiErrorResponse } from '@/types';

class ApiClient {
  private instance: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from storage
    this.loadTokensFromStorage();

    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      response => response,
      error => this.handleResponseError(error)
    );
  }

  /**
   * Load tokens from browser storage
   */
  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;

    const storageType = process.env.NEXT_PUBLIC_TOKEN_STORAGE || 'localStorage';
    const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;

    this.accessToken = storage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'chancen_access_token');
    this.refreshToken = storage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'chancen_refresh_token');
  }

  /**
   * Save tokens to browser storage
   */
  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    const storageType = process.env.NEXT_PUBLIC_TOKEN_STORAGE || 'localStorage';
    const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;

    storage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'chancen_access_token', accessToken);
    storage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'chancen_refresh_token', refreshToken);

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  /**
   * Clear tokens from storage and memory
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;

    const storageType = process.env.NEXT_PUBLIC_TOKEN_STORAGE || 'localStorage';
    const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;

    storage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'chancen_access_token');
    storage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'chancen_refresh_token');

    this.accessToken = null;
    this.refreshToken = null;
  }

  /**
   * Handle response errors and token refresh
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as any;

    // Token expired - attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.instance(originalRequest));
            },
            onFailure: (err: AxiosError) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const response = await this.instance.post('/auth/refresh', {}, {
          headers: {
            Authorization: `Bearer ${this.refreshToken}`,
          },
        });

        const { access_token } = response.data.data;
        this.accessToken = access_token;
        this.saveTokensToStorage(access_token, this.refreshToken!);

        // Process queued requests
        this.failedQueue.forEach(({ onSuccess }) => onSuccess(access_token));
        this.failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return this.instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        this.clearTokens();
        this.failedQueue.forEach(({ onFailure }) => onFailure(refreshError as AxiosError));
        this.failedQueue = [];

        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }

  /**
   * Perform GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Perform POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Perform PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Perform PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Perform DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: e => {
          if (onProgress && e.total) {
            onProgress((e.loaded / e.total) * 100);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    this.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  /**
   * Parse error response
   */
  private parseError(error: any): Error {
    if (error.response?.data) {
      const data = error.response.data as ApiErrorResponse;
      return new Error(data.error || 'An error occurred');
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for use in services
export default apiClient;
