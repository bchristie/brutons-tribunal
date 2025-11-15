import type { 
  GetUpdatesOptions, 
  UpdatesResponse, 
  ApiMethods 
} from './api.types';

// Base API configuration
const API_BASE_URL = '/api';

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
}

// Updates API functions
async function getUpdates(options: GetUpdatesOptions = {}): Promise<UpdatesResponse> {
  const searchParams = new URLSearchParams();
  
  if (options.limit) searchParams.set('limit', options.limit.toString());
  if (options.offset) searchParams.set('offset', options.offset.toString());
  if (options.type) searchParams.set('type', options.type);
  if (options.featured) searchParams.set('featured', 'true');
  if (options.search) searchParams.set('search', options.search);
  if (options.includeAuthor) searchParams.set('includeAuthor', 'true');

  const queryString = searchParams.toString();
  const endpoint = `/updates${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<UpdatesResponse>(endpoint);
}

// Export API methods object
export const apiMethods: ApiMethods = {
  getUpdates,
  // Future CRUD operations will be added here
};

// Export individual functions for direct use
export {
  getUpdates,
};