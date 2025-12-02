# Backend Integration Guide

This guide explains how to prepare and integrate your chat app with a backend server and WebSockets.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Setup](#environment-setup)
3. [API Integration](#api-integration)
4. [WebSocket Integration](#websocket-integration)
5. [Backend Requirements](#backend-requirements)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)

---

## 🏗️ Architecture Overview

The app is now structured to support both **mock data** (for development) and **real backend integration**:

```
Frontend (React)
├── API Client (HTTP requests)
├── WebSocket Service (Real-time updates)
├── Socket Context (Global WebSocket state)
└── useChats Hook (Unified chat management)
```

### Key Components

- **`src/api/client.js`**: HTTP API client for REST endpoints
- **`src/services/websocket.js`**: WebSocket service for real-time messaging
- **`src/contexts/SocketContext.jsx`**: React context for WebSocket state
- **`src/hooks/useChats.js`**: Custom hook for chat management
- **`src/config/environment.js`**: Environment configuration

---

## ⚙️ Environment Setup

### 1. Configure Environment Variables

Edit `.env` file in the project root:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# Environment
VITE_ENV=development
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_WS_URL=wss://your-api.com
VITE_ENV=production
```

### 2. Access Configuration

```javascript
import config from './config/environment';

console.log(config.apiBaseUrl); // http://localhost:3000/api
console.log(config.wsUrl);      // ws://localhost:3000
```

---

## 🔌 API Integration

### Using the API Client

The API client (`src/api/client.js`) provides methods for all backend operations:

#### Authentication

```javascript
import apiClient from './api/client';

// Login
const response = await apiClient.login({
  email: 'user@example.com',
  password: 'password123'
});
// Token is automatically stored

// Register
await apiClient.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
const user = await apiClient.getCurrentUser();

// Logout
await apiClient.logout();
```

#### Chat Operations

```javascript
// Get all chats
const chats = await apiClient.getChats();

// Get specific chat
const chat = await apiClient.getChat(chatId);

// Create new chat
const newChat = await apiClient.createChat({ userId: 'user123' });

// Delete chat
await apiClient.deleteChat(chatId);
```

#### Message Operations

```javascript
// Get messages
const messages = await apiClient.getMessages(chatId, {
  limit: 50,
  offset: 0
});

// Send message
const message = await apiClient.sendMessage(chatId, {
  text: 'Hello!'
});

// Edit message
await apiClient.editMessage(chatId, messageId, {
  text: 'Updated text'
});

// Delete message
await apiClient.deleteMessage(chatId, messageId);

// Mark as read
await apiClient.markMessagesAsRead(chatId);
```

#### User Operations

```javascript
// Search users
const users = await apiClient.searchUsers('john');

// Get user
const user = await apiClient.getUser(userId);

// Update profile
await apiClient.updateProfile({
  name: 'New Name',
  bio: 'My bio'
});

// Upload avatar
const file = document.querySelector('input[type="file"]').files[0];
await apiClient.uploadAvatar(file);
```

---

## 🔄 WebSocket Integration

### Using Socket Context

Wrap your app with `SocketProvider`:

```javascript
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <SocketProvider>
      {/* Your app components */}
    </SocketProvider>
  );
}
```

### Using the useSocket Hook

```javascript
import { useSocket } from './contexts/SocketContext';

function ChatComponent() {
  const socket = useSocket();

  useEffect(() => {
    // Subscribe to new messages
    const unsubscribe = socket.on('message:new', (data) => {
      console.log('New message:', data);
    });

    return unsubscribe; // Cleanup
  }, [socket]);

  // Send message via WebSocket
  const handleSend = () => {
    socket.sendMessage({
      chatId: 'chat123',
      text: 'Hello!'
    });
  };

  return (
    <div>
      <p>Connected: {socket.isConnected ? 'Yes' : 'No'}</p>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### WebSocket Events

#### Outgoing Events (Client → Server)

```javascript
// Send message
socket.sendMessage({ chatId, text });

// Edit message
socket.editMessage({ chatId, messageId, text });

// Delete message
socket.deleteMessage({ chatId, messageId });

// Mark as read
socket.markAsRead({ chatId });

// Typing indicator
socket.sendTyping({ chatId, isTyping: true });

// Update status
socket.updateStatus('online'); // 'online' | 'away' | 'offline'

// Subscribe to presence
socket.subscribeToPresence(['user1', 'user2']);
```

#### Incoming Events (Server → Client)

```javascript
// New message received
socket.on('message:new', ({ chatId, message }) => {
  // Handle new message
});

// Message edited
socket.on('message:edited', ({ chatId, messageId, text }) => {
  // Handle edit
});

// Message deleted
socket.on('message:deleted', ({ chatId, messageId }) => {
  // Handle deletion
});

// Messages marked as read
socket.on('message:read', ({ chatId }) => {
  // Update read status
});

// User typing
socket.on('typing', ({ chatId, userId, isTyping }) => {
  // Show typing indicator
});

// User status changed
socket.on('status:updated', ({ userId, status }) => {
  // Update user status
});

// Connection events
socket.on('connected', () => {
  console.log('Connected to WebSocket');
});

socket.on('disconnected', ({ code, reason }) => {
  console.log('Disconnected:', code, reason);
});

socket.on('reconnecting', ({ attempt, delay }) => {
  console.log(`Reconnecting... attempt ${attempt}`);
});
```

---

## 🖥️ Backend Requirements

Your backend server should implement the following:

### REST API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Chats
- `GET /api/chats` - Get all chats
- `GET /api/chats/:chatId` - Get specific chat
- `POST /api/chats` - Create new chat
- `DELETE /api/chats/:chatId` - Delete chat

#### Messages
- `GET /api/chats/:chatId/messages` - Get messages
- `POST /api/chats/:chatId/messages` - Send message
- `PUT /api/chats/:chatId/messages/:messageId` - Edit message
- `DELETE /api/chats/:chatId/messages/:messageId` - Delete message
- `POST /api/chats/:chatId/read` - Mark messages as read

#### Users
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/:userId` - Get user
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar

### WebSocket Events

Your WebSocket server should handle:

#### Client → Server
- `message:send` - Send new message
- `message:edit` - Edit message
- `message:delete` - Delete message
- `message:read` - Mark as read
- `typing` - Typing indicator
- `status:update` - Update user status
- `presence:subscribe` - Subscribe to user presence
- `ping` - Heartbeat ping

#### Server → Client
- `message:new` - Broadcast new message
- `message:edited` - Broadcast message edit
- `message:deleted` - Broadcast message deletion
- `message:read` - Broadcast read status
- `typing` - Broadcast typing status
- `status:updated` - Broadcast status update
- `pong` - Heartbeat pong

### Data Models

#### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatarUrl": "string",
  "status": "online|away|offline",
  "bio": "string",
  "createdAt": "ISO8601 date"
}
```

#### Chat
```json
{
  "_id": "string",
  "user": {
    "id": "string",
    "name": "string",
    "status": "online|away|offline",
    "avatarUrl": "string"
  },
  "messages": [],
  "createdAt": "ISO8601 date",
  "updatedAt": "ISO8601 date"
}
```

#### Message
```json
{
  "id": "string",
  "chatId": "string",
  "sender": "CURRENT_USER|OTHER_USER",
  "text": "string",
  "createdAt": "ISO8601 date",
  "messageState": "sent|received",
  "readedByUser": "yes|no",
  "readedByMe": "yes|no",
  "isEdited": false
}
```

---

## 💡 Usage Examples

### Example 1: Using with Backend

```javascript
import { SocketProvider } from './contexts/SocketContext';
import { useChats } from './hooks/useChats';

function App() {
  return (
    <SocketProvider>
      <ChatApp />
    </SocketProvider>
  );
}

function ChatApp() {
  // Enable backend integration
  const {
    chats,
    loading,
    error,
    sendMessage,
    editMessage,
    deleteMessage
  } = useChats(true); // true = use backend

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {chats.map(chat => (
        <ChatItem key={chat._id} chat={chat} />
      ))}
    </div>
  );
}
```

### Example 2: Using with Mock Data (Development)

```javascript
function ChatApp() {
  // Use mock data (no backend required)
  const { chats, sendMessage } = useChats(false); // false = use mock data

  return (
    <div>
      {chats.map(chat => (
        <ChatItem key={chat._id} chat={chat} />
      ))}
    </div>
  );
}
```

### Example 3: Switching Between Mock and Backend

```javascript
function ChatApp() {
  const useBackend = import.meta.env.VITE_ENV === 'production';
  const { chats, sendMessage } = useChats(useBackend);

  // Rest of your component
}
```

---

## 🧪 Testing

### Test WebSocket Connection

```javascript
import wsService from './services/websocket';

// Connect
wsService.connect('your-auth-token');

// Listen for connection
wsService.on('connected', () => {
  console.log('✅ WebSocket connected');
});

// Test sending message
wsService.sendMessage({
  chatId: 'test-chat',
  text: 'Test message'
});
```

### Test API Client

```javascript
import apiClient from './api/client';

// Set token
apiClient.setToken('your-auth-token');

// Test getting chats
const chats = await apiClient.getChats();
console.log('Chats:', chats);

// Test sending message
const message = await apiClient.sendMessage('chat-id', {
  text: 'Test message'
});
console.log('Message sent:', message);
```

---

## 🚀 Next Steps

1. **Set up your backend server** with the required endpoints
2. **Update `.env`** with your backend URLs
3. **Enable backend mode** in your components: `useChats(true)`
4. **Test the integration** with real data
5. **Handle errors** and edge cases appropriately

---

## 📝 Notes

- The app works with **mock data by default** (`useChats(false)`)
- WebSocket automatically **reconnects** on connection loss
- **Authentication tokens** are stored in localStorage
- All API calls include **error handling**
- WebSocket includes **heartbeat mechanism** to detect dead connections

---

## 🔧 Troubleshooting

### WebSocket won't connect
- Check if backend WebSocket server is running
- Verify `VITE_WS_URL` in `.env`
- Check browser console for errors
- Ensure authentication token is valid

### API calls failing
- Verify `VITE_API_BASE_URL` in `.env`
- Check if backend server is running
- Verify authentication token
- Check CORS settings on backend

### Messages not updating in real-time
- Ensure WebSocket is connected (`socket.isConnected`)
- Verify backend is broadcasting events correctly
- Check browser console for WebSocket errors

---

For more information, see the individual file documentation in:
- `src/api/client.js`
- `src/services/websocket.js`
- `src/contexts/SocketContext.jsx`
- `src/hooks/useChats.js`
