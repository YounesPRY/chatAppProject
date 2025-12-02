/**
 * Usage Examples for Backend Integration
 * 
 * This file contains practical examples of how to use the API client
 * and WebSocket service in your components.
 */

// ============================================================================
// Example 1: Authentication Flow
// ============================================================================

import apiClient from './api/client';
import { useSocket } from './contexts/SocketContext';

// Login Component Example
function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Login via API
            const response = await apiClient.login({ email, password });

            // Token is automatically stored by apiClient
            console.log('Logged in:', response.user);

            // Connect WebSocket with the token
            socket.connect(response.token);

            // Redirect to chat or update app state
            // navigate('/chat');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
}

// ============================================================================
// Example 2: Using the useChats Hook
// ============================================================================

import { useChats } from './hooks/useChats';

function ChatListComponent() {
    // Enable backend integration
    const {
        chats,
        loading,
        error,
        sendMessage,
        editMessage,
        deleteMessage,
        markChatAsRead
    } = useChats(true); // true = use backend

    // Handle sending a message
    const handleSendMessage = async (chatId, text) => {
        try {
            await sendMessage(chatId, { text });
            console.log('Message sent!');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    // Handle editing a message
    const handleEditMessage = async (chatId, messageId, newText) => {
        try {
            await editMessage(chatId, messageId, newText);
            console.log('Message edited!');
        } catch (err) {
            console.error('Failed to edit message:', err);
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (chatId, messageId) => {
        try {
            await deleteMessage(chatId, messageId);
            console.log('Message deleted!');
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    if (loading) return <div>Loading chats...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {chats.map(chat => (
                <div key={chat._id}>
                    <h3>{chat.user.name}</h3>
                    <button onClick={() => markChatAsRead(chat._id)}>
                        Mark as Read
                    </button>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// Example 3: Real-time Updates with WebSocket
// ============================================================================

function ChatWindowComponent({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const socket = useSocket();

    useEffect(() => {
        // Subscribe to new messages
        const unsubscribeMessage = socket.on('message:new', (data) => {
            if (data.chatId === chatId) {
                setMessages(prev => [...prev, data.message]);
            }
        });

        // Subscribe to message edits
        const unsubscribeEdit = socket.on('message:edited', (data) => {
            if (data.chatId === chatId) {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === data.messageId
                            ? { ...msg, text: data.text, isEdited: true }
                            : msg
                    )
                );
            }
        });

        // Subscribe to message deletions
        const unsubscribeDelete = socket.on('message:deleted', (data) => {
            if (data.chatId === chatId) {
                setMessages(prev =>
                    prev.filter(msg => msg.id !== data.messageId)
                );
            }
        });

        // Subscribe to typing indicators
        const unsubscribeTyping = socket.on('typing', (data) => {
            if (data.chatId === chatId) {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    if (data.isTyping) {
                        newSet.add(data.userId);
                    } else {
                        newSet.delete(data.userId);
                    }
                    return newSet;
                });
            }
        });

        // Cleanup subscriptions
        return () => {
            unsubscribeMessage();
            unsubscribeEdit();
            unsubscribeDelete();
            unsubscribeTyping();
        };
    }, [chatId, socket]);

    // Send typing indicator
    const handleTyping = (isTyping) => {
        socket.sendTyping({ chatId, isTyping });
    };

    return (
        <div>
            <div className="messages">
                {messages.map(msg => (
                    <div key={msg.id}>{msg.text}</div>
                ))}
            </div>
            {typingUsers.size > 0 && (
                <div className="typing-indicator">
                    Someone is typing...
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Example 4: Connection Status Indicator
// ============================================================================

function ConnectionStatusComponent() {
    const socket = useSocket();

    return (
        <div className="connection-status">
            {socket.isConnected ? (
                <span className="status-online">● Connected</span>
            ) : socket.isReconnecting ? (
                <span className="status-reconnecting">⟳ Reconnecting...</span>
            ) : (
                <span className="status-offline">○ Offline</span>
            )}
            {socket.connectionError && (
                <span className="error">{socket.connectionError}</span>
            )}
        </div>
    );
}

// ============================================================================
// Example 5: User Search
// ============================================================================

function UserSearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const users = await apiClient.searchUsers(searchQuery);
            setResults(users);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
            />
            {loading && <div>Searching...</div>}
            <div className="results">
                {results.map(user => (
                    <div key={user.id}>
                        <img src={user.avatarUrl} alt={user.name} />
                        <span>{user.name}</span>
                        <span className={`status-${user.status}`}>
                            {user.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Example 6: Avatar Upload
// ============================================================================

function AvatarUploadComponent() {
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const response = await apiClient.uploadAvatar(file);
            setAvatarUrl(response.avatarUrl);
            console.log('Avatar uploaded:', response.avatarUrl);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
            />
            {uploading && <div>Uploading...</div>}
            {avatarUrl && (
                <img src={avatarUrl} alt="Avatar" width="100" height="100" />
            )}
        </div>
    );
}

// ============================================================================
// Example 7: Optimistic UI Updates
// ============================================================================

function OptimisticMessageComponent({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const socket = useSocket();

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // Create optimistic message
        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            text: inputText,
            sender: 'CURRENT_USER',
            createdAt: new Date().toISOString(),
            messageState: 'sending',
            isOptimistic: true
        };

        // Add to UI immediately
        setMessages(prev => [...prev, optimisticMessage]);
        setInputText('');

        try {
            // Send to backend
            const response = await apiClient.sendMessage(chatId, {
                text: optimisticMessage.text
            });

            // Replace optimistic message with real one
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === optimisticMessage.id ? response : msg
                )
            );
        } catch (err) {
            console.error('Failed to send message:', err);

            // Mark message as failed
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === optimisticMessage.id
                        ? { ...msg, messageState: 'failed' }
                        : msg
                )
            );
        }
    };

    return (
        <div>
            <div className="messages">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={msg.isOptimistic ? 'optimistic' : ''}
                    >
                        {msg.text}
                        {msg.messageState === 'sending' && ' (Sending...)'}
                        {msg.messageState === 'failed' && ' (Failed)'}
                    </div>
                ))}
            </div>
            <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

// ============================================================================
// Example 8: Error Handling with Retry
// ============================================================================

function ErrorHandlingComponent() {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchChats = async () => {
        try {
            setError(null);
            const data = await apiClient.getChats();
            setChats(data);
            setRetryCount(0);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch chats:', err);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        fetchChats();
    };

    useEffect(() => {
        fetchChats();
    }, []);

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={handleRetry}>
                    Retry {retryCount > 0 && `(${retryCount})`}
                </button>
            </div>
        );
    }

    return (
        <div>
            {chats.map(chat => (
                <div key={chat._id}>{chat.user.name}</div>
            ))}
        </div>
    );
}

// ============================================================================
// Example 9: Feature Flag Toggle
// ============================================================================

function FeatureFlagExample() {
    const [useBackend, setUseBackend] = useState(false);
    const { chats, loading } = useChats(useBackend);

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={useBackend}
                    onChange={(e) => setUseBackend(e.target.checked)}
                />
                Use Backend (currently: {useBackend ? 'ON' : 'OFF'})
            </label>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {chats.map(chat => (
                        <div key={chat._id}>{chat.user.name}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Example 10: Complete Chat Component with Backend
// ============================================================================

function CompleteChatComponent() {
    const socket = useSocket();
    const {
        chats,
        loading,
        error,
        sendMessage,
        editMessage,
        deleteMessage,
        markChatAsRead
    } = useChats(true);

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageText, setMessageText] = useState('');

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = socket.on('message:new', (data) => {
            console.log('New message received:', data);
        });

        return unsubscribe;
    }, [socket]);

    const handleSendMessage = async () => {
        if (!selectedChatId || !messageText.trim()) return;

        try {
            await sendMessage(selectedChatId, { text: messageText });
            setMessageText('');
        } catch (err) {
            alert('Failed to send message');
        }
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        markChatAsRead(chatId);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const selectedChat = chats.find(c => c._id === selectedChatId);

    return (
        <div className="chat-app">
            <div className="sidebar">
                {chats.map(chat => (
                    <div
                        key={chat._id}
                        onClick={() => handleSelectChat(chat._id)}
                        className={selectedChatId === chat._id ? 'selected' : ''}
                    >
                        <h4>{chat.user.name}</h4>
                        <p>{chat.lastMessage?.text}</p>
                        {chat.unreadCount > 0 && (
                            <span className="badge">{chat.unreadCount}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="messages">
                            {selectedChat.messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.sender}`}>
                                    <p>{msg.text}</p>
                                    {msg.isEdited && <span>(edited)</span>}
                                </div>
                            ))}
                        </div>
                        <div className="input-area">
                            <input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        Select a chat to start messaging
                    </div>
                )}
            </div>

            <ConnectionStatusComponent />
        </div>
    );
}

export {
    LoginComponent,
    ChatListComponent,
    ChatWindowComponent,
    ConnectionStatusComponent,
    UserSearchComponent,
    AvatarUploadComponent,
    OptimisticMessageComponent,
    ErrorHandlingComponent,
    FeatureFlagExample,
    CompleteChatComponent
};
