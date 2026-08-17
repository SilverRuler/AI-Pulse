// API Base URL
// - When deployed on Vercel: Uses VITE_API_BASE_URL if configured (e.g., https://api.yourserver.com or http://123.45.67.89)
// - When running locally: Defaults to '' (relative path /api/...)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
