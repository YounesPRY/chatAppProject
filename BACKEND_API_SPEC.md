# Backend API Specification

This document specifies the expected backend API structure for the chat application.

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 📡 REST API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": null,
    "status": "online",
    "createdAt": "2025-12-02T19:30:00Z"
  }
}
```

---

#### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://example.com/avatar.jpg",
    "status": "online"
  }
}
```

---

#### POST /api/auth/logout
Logout user (requires authentication).

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /api/auth/me
Get current authenticated user (requires authentication).

**Response (200):**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatarUrl": "https://example.com/avatar.jpg",
  "status": "online",
  "bio": "Software developer",
  "createdAt": "2025-12-02T19:30:00Z"
}
```

---

### Chats

#### GET /api/chats
Get all chats for the authenticated user.

**Response (200):**
```json
[
  {
    "_id": "chat123",
    "user": {
      "id": "user456",
      "name": "Jane Smith",
      "status": "online",
      "avatarUrl": "https://example.com/jane.jpg"
    },
    "messages": [
      {
        "id": "msg1",
        "sender": "CURRENT_USER",
        "text": "Hello!",
        "createdAt": "2025-12-02T19:30:00Z",
        "messageState": "sent",
        "readedByUser": "yes"
      }
    ],
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-02T19:30:00Z"
  }
]
```

---

#### GET /api/chats/:chatId
Get a specific chat by ID.

**Response (200):**
```json
{
  "_id": "chat123",
  "user": {
    "id": "user456",
    "name": "Jane Smith",
    "status": "online",
    "avatarUrl": "https://example.com/jane.jpg"
  },
  "messages": [...],
  "createdAt": "2025-12-01T10:00:00Z",
  "updatedAt": "2025-12-02T19:30:00Z"
}
```

---

#### POST /api/chats
Create a new chat with a user.

**Request Body:**
```json
{
  "userId": "user456"
}
```

**Response (201):**
```json
{
  "_id": "chat789",
  "user": {
    "id": "user456",
    "name": "Jane Smith",
    "status": "online",
    "avatarUrl": "https://example.com/jane.jpg"
  },
  "messages": [],
  "createdAt": "2025-12-02T19:30:00Z",
  "updatedAt": "2025-12-02T19:30:00Z"
}
```

---

#### DELETE /api/chats/:chatId
Delete a chat.

**Response (200):**
```json
{
  "message": "Chat deleted successfully"
}
```

---

### Messages

#### GET /api/chats/:chatId/messages
Get messages for a chat with pagination.

**Query Parameters:**
- `limit` (optional, default: 50) - Number of messages to return
- `offset` (optional, default: 0) - Offset for pagination

**Example:** `/api/chats/chat123/messages?limit=20&offset=0`

**Response (200):**
```json
[
  {
    "id": "msg1",
    "chatId": "chat123",
    "sender": "CURRENT_USER",
    "text": "Hello!",
    "createdAt": "2025-12-02T19:30:00Z",
    "messageState": "sent",
    "readedByUser": "yes",
    "isEdited": false
  },
  {
    "id": "msg2",
    "chatId": "chat123",
    "sender": "OTHER_USER",
    "text": "Hi there!",
    "createdAt": "2025-12-02T19:31:00Z",
    "messageState": "received",
    "readedByMe": "yes",
    "isEdited": false
  }
]
```

---

#### POST /api/chats/:chatId/messages
Send a new message.

**Request Body:**
```json
{
  "text": "Hello, how are you?"
}
```

**Response (201):**
```json
{
  "id": "msg123",
  "chatId": "chat123",
  "sender": "CURRENT_USER",
  "text": "Hello, how are you?",
  "createdAt": "2025-12-02T19:30:00Z",
  "messageState": "sent",
  "readedByUser": "no",
  "isEdited": false
}
```

---

#### PUT /api/chats/:chatId/messages/:messageId
Edit a message.

**Request Body:**
```json
{
  "text": "Updated message text"
}
```

**Response (200):**
```json
{
  "id": "msg123",
  "chatId": "chat123",
  "sender": "CURRENT_USER",
  "text": "Updated message text",
  "createdAt": "2025-12-02T19:30:00Z",
  "messageState": "sent",
  "readedByUser": "yes",
  "isEdited": true
}
```

---

#### DELETE /api/chats/:chatId/messages/:messageId
Delete a message.

**Response (200):**
```json
{
  "message": "Message deleted successfully"
}
```

---

#### POST /api/chats/:chatId/read
Mark all messages in a chat as read.

**Response (200):**
```json
{
  "message": "Messages marked as read"
}
```

---

### Users

#### GET /api/users/search
Search for users by name or email.

**Query Parameters:**
- `q` (required) - Search query

**Example:** `/api/users/search?q=john`

**Response (200):**
```json
[
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://example.com/john.jpg",
    "status": "online"
  },
  {
    "id": "user456",
    "name": "Johnny Smith",
    "email": "johnny@example.com",
    "avatarUrl": null,
    "status": "offline"
  }
]
```

---

#### GET /api/users/:userId
Get user by ID.

**Response (200):**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatarUrl": "https://example.com/john.jpg",
  "status": "online",
  "bio": "Software developer",
  "createdAt": "2025-12-01T10:00:00Z"
}
```

---

#### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Senior Software Developer"
}
```

**Response (200):**
```json
{
  "id": "user123",
  "name": "John Updated",
  "email": "john@example.com",
  "avatarUrl": "https://example.com/john.jpg",
  "status": "online",
  "bio": "Senior Software Developer"
}
```

---

#### POST /api/users/avatar
Upload user avatar.

**Request:** Multipart form data with `avatar` file field

**Response (200):**
```json
{
  "avatarUrl": "https://example.com/avatars/user123.jpg"
}
```

---

## 🔌 WebSocket Events

WebSocket connection URL: `ws://localhost:3000?token=<jwt_token>`

### Client → Server Events

#### message:send
Send a new message.

**Payload:**
```json
{
  "chatId": "chat123",
  "text": "Hello!"
}
```

---

#### message:edit
Edit a message.

**Payload:**
```json
{
  "chatId": "chat123",
  "messageId": "msg123",
  "text": "Updated text"
}
```

---

#### message:delete
Delete a message.

**Payload:**
```json
{
  "chatId": "chat123",
  "messageId": "msg123"
}
```

---

#### message:read
Mark messages as read.

**Payload:**
```json
{
  "chatId": "chat123"
}
```

---

#### typing
Send typing indicator.

**Payload:**
```json
{
  "chatId": "chat123",
  "isTyping": true
}
```

---

#### status:update
Update user status.

**Payload:**
```json
{
  "status": "online"
}
```

Values: `"online"`, `"away"`, `"offline"`

---

#### presence:subscribe
Subscribe to user presence updates.

**Payload:**
```json
{
  "userIds": ["user123", "user456"]
}
```

---

#### ping
Heartbeat ping.

**Payload:** `{}`

---

### Server → Client Events

#### message:new
New message received.

**Payload:**
```json
{
  "chatId": "chat123",
  "message": {
    "id": "msg123",
    "sender": "OTHER_USER",
    "text": "Hello!",
    "createdAt": "2025-12-02T19:30:00Z",
    "messageState": "received",
    "readedByMe": "no"
  }
}
```

---

#### message:edited
Message was edited.

**Payload:**
```json
{
  "chatId": "chat123",
  "messageId": "msg123",
  "text": "Updated text"
}
```

---

#### message:deleted
Message was deleted.

**Payload:**
```json
{
  "chatId": "chat123",
  "messageId": "msg123"
}
```

---

#### message:read
Messages were marked as read.

**Payload:**
```json
{
  "chatId": "chat123"
}
```

---

#### typing
User is typing.

**Payload:**
```json
{
  "chatId": "chat123",
  "userId": "user456",
  "isTyping": true
}
```

---

#### status:updated
User status changed.

**Payload:**
```json
{
  "userId": "user456",
  "status": "online"
}
```

---

#### pong
Heartbeat response.

**Payload:** `{}`

---

## 🔒 Error Responses

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `500` - Internal Server Error

### Example Error Response

```json
{
  "error": "ValidationError",
  "message": "Email is required"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Message `sender` field uses `"CURRENT_USER"` or `"OTHER_USER"` relative to the authenticated user
3. WebSocket events should be broadcast to all relevant connected clients
4. Implement proper authentication and authorization checks
5. Use HTTPS/WSS in production
6. Implement rate limiting to prevent abuse
7. Store passwords securely (bcrypt/argon2)
8. Validate all input data
9. Implement proper CORS settings

---

## 🛠️ Implementation Tips

### Database Schema Suggestions

**Users Table:**
- id (primary key)
- name
- email (unique)
- password_hash
- avatar_url
- status
- bio
- created_at
- updated_at

**Chats Table:**
- id (primary key)
- user1_id (foreign key)
- user2_id (foreign key)
- created_at
- updated_at

**Messages Table:**
- id (primary key)
- chat_id (foreign key)
- sender_id (foreign key)
- text
- is_edited
- created_at
- updated_at

**Message_Reads Table:**
- message_id (foreign key)
- user_id (foreign key)
- read_at

### WebSocket Connection Management

- Store active WebSocket connections in memory (Map/Dictionary)
- Associate connections with user IDs
- Clean up connections on disconnect
- Implement reconnection logic
- Handle heartbeat/ping-pong

### Security Considerations

- Validate JWT tokens on every request
- Ensure users can only access their own chats
- Sanitize message content (prevent XSS)
- Implement rate limiting
- Use prepared statements (prevent SQL injection)
- Validate file uploads (avatars)

---

For implementation examples, see:
- [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- [Quick Start Guide](./QUICK_START_BACKEND.md)
