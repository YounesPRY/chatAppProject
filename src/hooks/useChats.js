import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useSocket } from '../contexts/SocketContext';
import { normalizeChats } from '../utils/chatNormalization';
import { markMessagesAsRead } from '../utils/chatHelpers';

/**
 * Custom hook for managing chats with backend integration
 * Handles both HTTP API calls and WebSocket real-time updates
 * 
 * @param {boolean} useBackend - Whether to use backend or mock data
 * @returns {Object} Chat management methods and state
 */
export function useChats(useBackend = false) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const socket = useSocket();

    /**
     * Fetch chats from backend
     */
    const fetchChats = useCallback(async () => {
        if (!useBackend) return;

        setLoading(true);
        setError(null);

        try {
            const data = await apiClient.getChats();
            setChats(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching chats:', err);
        } finally {
            setLoading(false);
        }
    }, [useBackend]);

    /**
     * Fetch messages for a specific chat
     */
    const fetchMessages = useCallback(async (chatId, params = {}) => {
        if (!useBackend) return;

        try {
            const messages = await apiClient.getMessages(chatId, params);

            // Update chat with fetched messages
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, messages }
                        : chat
                )
            );

            return messages;
        } catch (err) {
            console.error('Error fetching messages:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Send a message
     */
    const sendMessage = useCallback(async (chatId, messageData) => {
        try {
            if (useBackend) {
                // Send via HTTP API (WebSocket will handle real-time update)
                const message = await apiClient.sendMessage(chatId, messageData);

                // Optimistically update UI
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? { ...chat, messages: [...(chat.messages || []), message] }
                            : chat
                    )
                );

                return message;
            } else {
                // Mock implementation for local development
                const newMessage = {
                    id: `m${Date.now()}`,
                    text: messageData.text,
                    sender: 'CURRENT_USER',
                    createdAt: new Date().toISOString(),
                    messageState: 'sent',
                    readedByUser: 'no',
                };

                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? { ...chat, messages: [...(chat.messages || []), newMessage] }
                            : chat
                    )
                );

                return newMessage;
            }
        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Edit a message
     */
    const editMessage = useCallback(async (chatId, messageId, newText) => {
        try {
            if (useBackend) {
                const updatedMessage = await apiClient.editMessage(chatId, messageId, { text: newText });

                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? {
                                ...chat,
                                messages: chat.messages.map(msg =>
                                    msg.id === messageId ? updatedMessage : msg
                                )
                            }
                            : chat
                    )
                );

                return updatedMessage;
            } else {
                // Mock implementation
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? {
                                ...chat,
                                messages: chat.messages.map(msg =>
                                    msg.id === messageId
                                        ? { ...msg, text: newText, isEdited: true }
                                        : msg
                                )
                            }
                            : chat
                    )
                );
            }
        } catch (err) {
            console.error('Error editing message:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Delete a message
     */
    const deleteMessage = useCallback(async (chatId, messageId) => {
        try {
            if (useBackend) {
                await apiClient.deleteMessage(chatId, messageId);

                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? {
                                ...chat,
                                messages: chat.messages.filter(msg => msg.id !== messageId)
                            }
                            : chat
                    )
                );
            } else {
                // Mock implementation
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === chatId
                            ? {
                                ...chat,
                                messages: chat.messages.filter(msg => msg.id !== messageId)
                            }
                            : chat
                    )
                );
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Mark messages as read
     */
    const markChatAsRead = useCallback(async (chatId) => {
        try {
            if (useBackend) {
                await apiClient.markMessagesAsRead(chatId);
            }

            // Update local state
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, messages: markMessagesAsRead(chat.messages) }
                        : chat
                )
            );
        } catch (err) {
            console.error('Error marking messages as read:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Create a new chat
     */
    const createChat = useCallback(async (userId) => {
        if (!useBackend) return;

        try {
            const newChat = await apiClient.createChat({ userId });
            setChats(prevChats => [...prevChats, newChat]);
            return newChat;
        } catch (err) {
            console.error('Error creating chat:', err);
            throw err;
        }
    }, [useBackend]);

    /**
     * Delete a chat
     */
    const deleteChat = useCallback(async (chatId) => {
        try {
            if (useBackend) {
                await apiClient.deleteChat(chatId);
            }

            setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        } catch (err) {
            console.error('Error deleting chat:', err);
            throw err;
        }
    }, [useBackend]);

    // Setup WebSocket event listeners
    useEffect(() => {
        if (!useBackend || !socket) return;

        // Handle new message received
        const unsubscribeMessage = socket.on('message:new', (data) => {
            const { chatId, message } = data;

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, messages: [...(chat.messages || []), message] }
                        : chat
                )
            );
        });

        // Handle message edited
        const unsubscribeEdit = socket.on('message:edited', (data) => {
            const { chatId, messageId, text } = data;

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? {
                            ...chat,
                            messages: chat.messages.map(msg =>
                                msg.id === messageId
                                    ? { ...msg, text, isEdited: true }
                                    : msg
                            )
                        }
                        : chat
                )
            );
        });

        // Handle message deleted
        const unsubscribeDelete = socket.on('message:deleted', (data) => {
            const { chatId, messageId } = data;

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? {
                            ...chat,
                            messages: chat.messages.filter(msg => msg.id !== messageId)
                        }
                        : chat
                )
            );
        });

        // Handle message read status
        const unsubscribeRead = socket.on('message:read', (data) => {
            const { chatId } = data;

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, messages: markMessagesAsRead(chat.messages) }
                        : chat
                )
            );
        });

        // Handle user status update
        const unsubscribeStatus = socket.on('status:updated', (data) => {
            const { userId, status } = data;

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.user.id === userId
                        ? { ...chat, user: { ...chat.user, status } }
                        : chat
                )
            );
        });

        // Cleanup
        return () => {
            unsubscribeMessage();
            unsubscribeEdit();
            unsubscribeDelete();
            unsubscribeRead();
            unsubscribeStatus();
        };
    }, [useBackend, socket]);

    // Fetch chats on mount
    useEffect(() => {
        if (useBackend) {
            fetchChats();
        }
    }, [useBackend, fetchChats]);

    // Normalize chats
    const normalizedChats = normalizeChats(chats);

    return {
        chats: normalizedChats,
        loading,
        error,
        fetchChats,
        fetchMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        markChatAsRead,
        createChat,
        deleteChat,
    };
}

export default useChats;
