import config from '../config/environment';

/**
 * WebSocket Service for real-time messaging
 * Handles WebSocket connection, reconnection, and message handling
 */

class WebSocketService {
    constructor() {
        this.ws = null;
        this.url = config.wsUrl;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second
        this.maxReconnectDelay = 30000; // Max 30 seconds
        this.listeners = new Map();
        this.isIntentionallyClosed = false;
        this.heartbeatInterval = null;
        this.heartbeatTimeout = null;
    }

    /**
     * Connect to WebSocket server
     * @param {string} token - Authentication token
     */
    connect(token) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        this.isIntentionallyClosed = false;
        const wsUrl = token ? `${this.url}?token=${token}` : this.url;

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.handleReconnect();
        }
    }

    /**
     * Setup WebSocket event handlers
     */
    setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.emit('connected', {});
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket disconnected', event.code, event.reason);
            this.stopHeartbeat();
            this.emit('disconnected', { code: event.code, reason: event.reason });

            if (!this.isIntentionallyClosed) {
                this.handleReconnect();
            }
        };
    }

    /**
     * Handle incoming WebSocket messages
     * @param {Object} data - Message data
     */
    handleMessage(data) {
        const { type, payload } = data;

        // Handle heartbeat pong
        if (type === 'pong') {
            this.resetHeartbeatTimeout();
            return;
        }

        // Emit event to listeners
        this.emit(type, payload);
    }

    /**
     * Send message through WebSocket
     * @param {string} type - Message type
     * @param {Object} payload - Message payload
     */
    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            this.ws.send(message);
        } else {
            console.warn('WebSocket is not connected. Message not sent:', type, payload);
        }
    }

    /**
     * Subscribe to WebSocket events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    /**
     * Unsubscribe from WebSocket events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Emit event to all listeners
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    /**
     * Handle reconnection logic
     */
    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            this.emit('reconnect_failed', {});
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(
            this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
            this.maxReconnectDelay
        );

        console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

        setTimeout(() => {
            const token = localStorage.getItem('auth_token');
            this.connect(token);
        }, delay);
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send('ping', {});
                this.setHeartbeatTimeout();
            }
        }, 30000); // Send ping every 30 seconds
    }

    /**
     * Set timeout for heartbeat response
     */
    setHeartbeatTimeout() {
        this.heartbeatTimeout = setTimeout(() => {
            console.warn('Heartbeat timeout - closing connection');
            this.ws?.close();
        }, 5000); // Wait 5 seconds for pong
    }

    /**
     * Reset heartbeat timeout
     */
    resetHeartbeatTimeout() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        this.resetHeartbeatTimeout();
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        this.isIntentionallyClosed = true;
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /**
     * Check if WebSocket is connected
     * @returns {boolean}
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    // ==================== Message Events ====================

    /**
     * Send a chat message
     * @param {Object} messageData - { chatId, text }
     */
    sendMessage(messageData) {
        this.send('message:send', messageData);
    }

    /**
     * Edit a message
     * @param {Object} editData - { chatId, messageId, text }
     */
    editMessage(editData) {
        this.send('message:edit', editData);
    }

    /**
     * Delete a message
     * @param {Object} deleteData - { chatId, messageId }
     */
    deleteMessage(deleteData) {
        this.send('message:delete', deleteData);
    }

    /**
     * Mark messages as read
     * @param {Object} readData - { chatId }
     */
    markAsRead(readData) {
        this.send('message:read', readData);
    }

    /**
     * Send typing indicator
     * @param {Object} typingData - { chatId, isTyping }
     */
    sendTyping(typingData) {
        this.send('typing', typingData);
    }

    // ==================== Presence Events ====================

    /**
     * Update user status
     * @param {string} status - 'online' | 'away' | 'offline'
     */
    updateStatus(status) {
        this.send('status:update', { status });
    }

    /**
     * Subscribe to user presence
     * @param {Array<string>} userIds - Array of user IDs
     */
    subscribeToPresence(userIds) {
        this.send('presence:subscribe', { userIds });
    }

    /**
     * Unsubscribe from user presence
     * @param {Array<string>} userIds - Array of user IDs
     */
    unsubscribeFromPresence(userIds) {
        this.send('presence:unsubscribe', { userIds });
    }
}

// Export singleton instance
const wsService = new WebSocketService();
export default wsService;
