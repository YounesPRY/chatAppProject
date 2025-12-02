import config from '../config/environment';

/**
 * API Client for making HTTP requests to the backend
 * Handles authentication, error handling, and request/response formatting
 */

class ApiClient {
    constructor() {
        this.baseUrl = config.apiBaseUrl;
        this.token = null;
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    /**
     * Get authentication token
     * @returns {string|null}
     */
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    /**
     * Build headers for requests
     * @param {Object} customHeaders - Additional headers
     * @returns {Object}
     */
    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.headers),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>}
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>}
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>}
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise<Object>}
     */
    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>}
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // ==================== Auth Endpoints ====================

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>}
     */
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    /**
     * Register new user
     * @param {Object} userData - { name, email, password }
     * @returns {Promise<Object>}
     */
    async register(userData) {
        const response = await this.post('/auth/register', userData);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    /**
     * Logout user
     */
    async logout() {
        await this.post('/auth/logout', {});
        this.setToken(null);
    }

    /**
     * Get current user profile
     * @returns {Promise<Object>}
     */
    async getCurrentUser() {
        return this.get('/auth/me');
    }

    // ==================== Chat Endpoints ====================

    /**
     * Get all chats for current user
     * @returns {Promise<Array>}
     */
    async getChats() {
        return this.get('/chats');
    }

    /**
     * Get a specific chat by ID
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>}
     */
    async getChat(chatId) {
        return this.get(`/chats/${chatId}`);
    }

    /**
     * Create a new chat
     * @param {Object} chatData - { userId } - ID of user to chat with
     * @returns {Promise<Object>}
     */
    async createChat(chatData) {
        return this.post('/chats', chatData);
    }

    /**
     * Delete a chat
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>}
     */
    async deleteChat(chatId) {
        return this.delete(`/chats/${chatId}`);
    }

    // ==================== Message Endpoints ====================

    /**
     * Get messages for a chat
     * @param {string} chatId - Chat ID
     * @param {Object} params - Query parameters { limit, offset }
     * @returns {Promise<Array>}
     */
    async getMessages(chatId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/chats/${chatId}/messages${queryString ? `?${queryString}` : ''}`;
        return this.get(endpoint);
    }

    /**
     * Send a message
     * @param {string} chatId - Chat ID
     * @param {Object} messageData - { text }
     * @returns {Promise<Object>}
     */
    async sendMessage(chatId, messageData) {
        return this.post(`/chats/${chatId}/messages`, messageData);
    }

    /**
     * Edit a message
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @param {Object} messageData - { text }
     * @returns {Promise<Object>}
     */
    async editMessage(chatId, messageId, messageData) {
        return this.put(`/chats/${chatId}/messages/${messageId}`, messageData);
    }

    /**
     * Delete a message
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>}
     */
    async deleteMessage(chatId, messageId) {
        return this.delete(`/chats/${chatId}/messages/${messageId}`);
    }

    /**
     * Mark messages as read
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>}
     */
    async markMessagesAsRead(chatId) {
        return this.post(`/chats/${chatId}/read`, {});
    }

    // ==================== User Endpoints ====================

    /**
     * Search users
     * @param {string} query - Search query
     * @returns {Promise<Array>}
     */
    async searchUsers(query) {
        return this.get(`/users/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async getUser(userId) {
        return this.get(`/users/${userId}`);
    }

    /**
     * Update user profile
     * @param {Object} userData - User data to update
     * @returns {Promise<Object>}
     */
    async updateProfile(userData) {
        return this.put('/users/profile', userData);
    }

    /**
     * Upload avatar
     * @param {File} file - Avatar file
     * @returns {Promise<Object>}
     */
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const url = `${this.baseUrl}/users/avatar`;
        const token = this.getToken();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to upload avatar');
        }

        return data;
    }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
