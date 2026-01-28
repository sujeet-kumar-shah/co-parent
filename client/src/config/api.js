/**
 * API Configuration
 * Central place to manage API URLs for different environments
 */

// Get API base URL from environment variable, fallback to localhost or current origin
export const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

/**
 * Helper function to construct full API endpoint URLs
 * @param {string} endpoint - API endpoint path (e.g., '/api/listings')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
};

/**
 * Helper function to construct URLs for uploaded files
 * @param {string} filename - Name of the uploaded file
 * @returns {string} Full URL to the uploaded file
 */
export const getUploadUrl = (filename) => {
    if (!filename) return '';
    return `${API_BASE_URL}/uploads/${filename}`;
};

// Export environment info for debugging
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
