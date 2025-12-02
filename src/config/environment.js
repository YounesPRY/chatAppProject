/**
 * Environment configuration
 * Centralizes all environment variables for easy access
 */

export const config = {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',

    // Environment
    env: import.meta.env.VITE_ENV || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};

export default config;
