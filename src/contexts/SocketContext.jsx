import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import wsService from '../services/websocket';
import apiClient from '../api/client';

const SocketContext = createContext(null);

/**
 * Socket Provider Component
 * Manages WebSocket connection and provides socket functionality to children
 */
export function SocketProvider({ children }) {
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    // Initialize WebSocket connection
    useEffect(() => {
        const token = apiClient.getToken();

        if (token) {
            wsService.connect(token);
        }

        // Setup event listeners
        const unsubscribeConnected = wsService.on('connected', () => {
            setIsConnected(true);
            setIsReconnecting(false);
            setConnectionError(null);
            console.log('Socket connected');
        });

        const unsubscribeDisconnected = wsService.on('disconnected', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        const unsubscribeReconnecting = wsService.on('reconnecting', ({ attempt }) => {
            setIsReconnecting(true);
            console.log(`Reconnecting... attempt ${attempt}`);
        });

        const unsubscribeReconnectFailed = wsService.on('reconnect_failed', () => {
            setIsReconnecting(false);
            setConnectionError('Failed to reconnect to server');
            console.error('Reconnection failed');
        });

        const unsubscribeError = wsService.on('error', (error) => {
            setConnectionError(error.message || 'WebSocket error');
            console.error('Socket error:', error);
        });

        // Cleanup on unmount
        return () => {
            unsubscribeConnected();
            unsubscribeDisconnected();
            unsubscribeReconnecting();
            unsubscribeReconnectFailed();
            unsubscribeError();
            wsService.disconnect();
        };
    }, []);

    // Connect to WebSocket
    const connect = useCallback((token) => {
        wsService.connect(token);
    }, []);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        wsService.disconnect();
        setIsConnected(false);
    }, []);

    // Subscribe to events
    const on = useCallback((event, callback) => {
        return wsService.on(event, callback);
    }, []);

    // Unsubscribe from events
    const off = useCallback((event, callback) => {
        wsService.off(event, callback);
    }, []);

    // Send message
    const sendMessage = useCallback((messageData) => {
        wsService.sendMessage(messageData);
    }, []);

    // Edit message
    const editMessage = useCallback((editData) => {
        wsService.editMessage(editData);
    }, []);

    // Delete message
    const deleteMessage = useCallback((deleteData) => {
        wsService.deleteMessage(deleteData);
    }, []);

    // Mark messages as read
    const markAsRead = useCallback((readData) => {
        wsService.markAsRead(readData);
    }, []);

    // Send typing indicator
    const sendTyping = useCallback((typingData) => {
        wsService.sendTyping(typingData);
    }, []);

    // Update user status
    const updateStatus = useCallback((status) => {
        wsService.updateStatus(status);
    }, []);

    // Subscribe to user presence
    const subscribeToPresence = useCallback((userIds) => {
        wsService.subscribeToPresence(userIds);
    }, []);

    // Unsubscribe from user presence
    const unsubscribeFromPresence = useCallback((userIds) => {
        wsService.unsubscribeFromPresence(userIds);
    }, []);

    const value = {
        // Connection state
        isConnected,
        isReconnecting,
        connectionError,

        // Connection methods
        connect,
        disconnect,

        // Event subscription
        on,
        off,

        // Message methods
        sendMessage,
        editMessage,
        deleteMessage,
        markAsRead,
        sendTyping,

        // Presence methods
        updateStatus,
        subscribeToPresence,
        unsubscribeFromPresence,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use Socket context
 * @returns {Object} Socket context value
 */
export function useSocket() {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
}

export default SocketContext;
