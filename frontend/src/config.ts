/**
 * Frontend Configuration
 * 
 * Centralizes environment-specific configuration for the frontend application.
 * Uses environment variables to determine API endpoints and WebSocket URLs.
 */

interface Config {
  apiUrl: string;
  wsUrl: string;
  environment: string;
}

/**
 * Get the API base URL based on environment
 */
const getApiUrl = (): string => {
  // Check if REACT_APP_API_URL is set (production)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Development fallback - use proxy or localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Production fallback - use relative URLs (assumes same domain)
  return '';
};

/**
 * Get the WebSocket URL based on environment
 */
const getWsUrl = (): string => {
  const apiUrl = getApiUrl();
  
  // If using relative URLs, construct WebSocket URL from current location
  if (!apiUrl) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  
  // Convert HTTP(S) URL to WS(S) URL
  return apiUrl.replace(/^http/, 'ws');
};

/**
 * Application configuration
 */
export const config: Config = {
  apiUrl: getApiUrl(),
  wsUrl: getWsUrl(),
  environment: process.env.NODE_ENV || 'development',
};

/**
 * Helper to construct full API endpoint URL
 */
export const getApiEndpoint = (path: string): string => {
  const baseUrl = config.apiUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Helper to construct WebSocket URL
 */
export const getWebSocketUrl = (path: string): string => {
  const baseUrl = config.wsUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default config;
