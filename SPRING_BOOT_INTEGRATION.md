# Spring Boot WebSocket/STOMP Integration Guide

This guide explains how to integrate your React chat app with a Spring Boot backend using WebSocket/STOMP protocol.

## 📋 Table of Contents

1. [Data Structure Changes](#data-structure-changes)
2. [Spring Boot Compatible Dataset](#spring-boot-compatible-dataset)
3. [Backend DTO Structure](#backend-dto-structure)
4. [WebSocket/STOMP Configuration](#websocketstom-configuration)
5. [Frontend Integration](#frontend-integration)
6. [Message Flow](#message-flow)
7. [Code Examples](#code-examples)

---

## 🔄 Data Structure Changes

### Old Structure (Legacy)
```javascript
{
  _id: 1,
  user: { id: "u1", name: "Younes", status: "online", avatarUrl: "..." },
  messages: [
    {
      id: "m1",
      sender: MESSAGE_SENDER.CURRENT_USER, // "current-user" or "other-user"
      text: "message1",
      createdAt: "2025-10-16T14:30:00",
      messageState: "sent", // or "recieved"
      readedByUser: "yes"
    }
  ]
}
```

### New Structure (Spring Boot Compatible)
```javascript
{
  chatId: "chat-1",
  participants: [
    { userId: "currentUser", username: "Me", status: "online", avatarUrl: null },
    { userId: "u1", username: "Younes", status: "online", avatarUrl: "..." }
  ],
  messages: [
    {
      messageId: "msg-1-1",
      chatId: "chat-1",
      senderId: "currentUser",
      recipientId: "u1",
      content: "message1",
      timestamp: "2025-10-16T14:30:00Z",
      status: "sent" // "sent", "received", or "read"
    }
  ],
  createdAt: "2025-10-16T14:30:00Z",
  updatedAt: "2025-11-16T22:30:00Z"
}
```

### Key Changes

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `_id` | `chatId` | String format, e.g., "chat-1" |
| `user` | `participants` | Array of participant objects |
| `messages[].id` | `messages[].messageId` | Consistent naming |
| `messages[].text` | `messages[].content` | Standard DTO field |
| `messages[].createdAt` | `messages[].timestamp` | ISO 8601 with 'Z' |
| `messages[].sender` | `messages[].senderId` | Actual user ID |
| `messages[].messageState` | `messages[].status` | Uniform values |
| N/A | `messages[].recipientId` | Added for clarity |
| N/A | `createdAt` | Chat creation timestamp |
| N/A | `updatedAt` | Last message timestamp |

---

## 📦 Spring Boot Compatible Dataset

The new dataset is available in `src/utils/chatData.springboot.js`:

```javascript
import { 
  initialChats, 
  CURRENT_USER_ID,
  MESSAGE_STATUS,
  USER_STATUS,
  convertToLegacyFormat,
  convertToSpringBootFormat
} from './utils/chatData.springboot';

// Use Spring Boot format directly
const chats = initialChats;

// Or convert from legacy format
const springBootChats = convertToSpringBootFormat(legacyChats);

// Or convert to legacy format for backward compatibility
const legacyChats = convertToLegacyFormat(springBootChats);
```

---

## 🏗️ Backend DTO Structure

### ChatDTO.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {
    private String chatId;
    private List<UserDTO> participants;
    private List<MessageDTO> messages;
    private String createdAt;
    private String updatedAt;
}
```

### MessageDTO.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private String messageId;
    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;
    private String timestamp;
    private MessageStatus status; // enum: SENT, RECEIVED, READ
}
```

### MessageStatus.java (Enum)
```java
public enum MessageStatus {
    SENT,
    RECEIVED,
    READ
}
```

### UserDTO.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String userId;
    private String username;
    private UserStatus status; // enum: ONLINE, OFFLINE, AWAY
    private String avatarUrl;
}
```

### UserStatus.java (Enum)
```java
public enum UserStatus {
    ONLINE,
    OFFLINE,
    AWAY
}
```

---

## 🔌 WebSocket/STOMP Configuration

### Spring Boot Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // Your React app URL
                .withSockJS();
    }
}
```

### Message Controller

```java
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public MessageDTO sendMessage(@Payload MessageDTO message) {
        // Save message to database
        message.setTimestamp(Instant.now().toString());
        message.setStatus(MessageStatus.SENT);
        
        // Broadcast to recipient
        messagingTemplate.convertAndSendToUser(
            message.getRecipientId(),
            "/queue/messages",
            message
        );
        
        return message;
    }

    @MessageMapping("/chat.updateStatus")
    public void updateMessageStatus(@Payload MessageStatusUpdate update) {
        // Update message status in database
        
        // Notify sender
        messagingTemplate.convertAndSendToUser(
            update.getSenderId(),
            "/queue/status",
            update
        );
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicator indicator) {
        messagingTemplate.convertAndSendToUser(
            indicator.getRecipientId(),
            "/queue/typing",
            indicator
        );
    }
}
```

---

## ⚛️ Frontend Integration

### Install STOMP Client

```bash
npm install @stomp/stompjs sockjs-client
```

### WebSocket Service (STOMP)

Create `src/services/websocket.stomp.js`:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import config from '../config/environment';

class StompWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(userId, token) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${config.apiBaseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('STOMP Connected');
      this.connected = true;
      
      // Subscribe to personal message queue
      this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
        const data = JSON.parse(message.body);
        this.emit('message:new', data);
      });

      // Subscribe to status updates
      this.client.subscribe(`/user/${userId}/queue/status`, (message) => {
        const data = JSON.parse(message.body);
        this.emit('message:status', data);
      });

      // Subscribe to typing indicators
      this.client.subscribe(`/user/${userId}/queue/typing`, (message) => {
        const data = JSON.parse(message.body);
        this.emit('typing', data);
      });

      // Subscribe to public topic
      this.client.subscribe('/topic/public', (message) => {
        const data = JSON.parse(message.body);
        this.emit('message:broadcast', data);
      });

      this.emit('connected', {});
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.emit('error', frame);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  sendMessage(message) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
    }
  }

  updateMessageStatus(statusUpdate) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.updateStatus',
        body: JSON.stringify(statusUpdate)
      });
    }
  }

  sendTypingIndicator(indicator) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify(indicator)
      });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export default new StompWebSocketService();
```

### Using STOMP in Components

```javascript
import stompService from '../services/websocket.stomp';
import { CURRENT_USER_ID, MESSAGE_STATUS } from '../utils/chatData.springboot';

function ChatComponent() {
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    stompService.connect(CURRENT_USER_ID, token);

    const unsubscribe = stompService.on('message:new', (message) => {
      console.log('New message:', message);
      // Update UI
    });

    return () => {
      unsubscribe();
      stompService.disconnect();
    };
  }, []);

  const sendMessage = (chatId, content, recipientId) => {
    const message = {
      messageId: `msg-${Date.now()}`,
      chatId,
      senderId: CURRENT_USER_ID,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      status: MESSAGE_STATUS.SENT
    };

    stompService.sendMessage(message);
  };

  return (
    // Your component JSX
  );
}
```

---

## 🔄 Message Flow

### Sending a Message

```
Frontend                    Backend                     Database
   |                           |                            |
   |--sendMessage()----------->|                            |
   |   (STOMP /app/chat.send)  |                            |
   |                           |--save()------------------>|
   |                           |                            |
   |                           |--broadcast()------------->|
   |<--message:new-------------|   (to recipient)           |
   |   (/queue/messages)       |                            |
```

### Updating Message Status

```
Frontend                    Backend                     Database
   |                           |                            |
   |--updateStatus()---------->|                            |
   |   (READ)                  |                            |
   |                           |--update()---------------->|
   |                           |                            |
   |                           |--notify()---------------->|
   |<--message:status----------|   (to sender)              |
   |   (/queue/status)         |                            |
```

---

## 💻 Code Examples

### Example 1: Send Message

```javascript
import stompService from './services/websocket.stomp';
import { CURRENT_USER_ID, MESSAGE_STATUS } from './utils/chatData.springboot';

const handleSendMessage = (chatId, content, recipientId) => {
  const message = {
    messageId: `msg-${Date.now()}`,
    chatId,
    senderId: CURRENT_USER_ID,
    recipientId,
    content,
    timestamp: new Date().toISOString(),
    status: MESSAGE_STATUS.SENT
  };

  stompService.sendMessage(message);
};
```

### Example 2: Mark as Read

```javascript
const markAsRead = (messageId, senderId) => {
  stompService.updateMessageStatus({
    messageId,
    status: MESSAGE_STATUS.READ,
    senderId
  });
};
```

### Example 3: Typing Indicator

```javascript
const handleTyping = (chatId, recipientId, isTyping) => {
  stompService.sendTypingIndicator({
    chatId,
    senderId: CURRENT_USER_ID,
    recipientId,
    isTyping
  });
};
```

### Example 4: Listen for Messages

```javascript
useEffect(() => {
  const unsubscribe = stompService.on('message:new', (message) => {
    setMessages(prev => [...prev, message]);
  });

  return unsubscribe;
}, []);
```

---

## 🔧 Environment Configuration

Update `.env`:

```env
# Spring Boot Backend
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws

# Environment
VITE_ENV=development
```

---

## 📝 Migration Checklist

- [ ] Install STOMP dependencies (`@stomp/stompjs`, `sockjs-client`)
- [ ] Update dataset to Spring Boot format
- [ ] Create STOMP WebSocket service
- [ ] Update components to use new data structure
- [ ] Configure Spring Boot backend
- [ ] Implement DTOs in backend
- [ ] Create WebSocket controller
- [ ] Test message sending
- [ ] Test message receiving
- [ ] Test status updates
- [ ] Test typing indicators
- [ ] Deploy and test in production

---

## 🎯 Summary

Your chat app is now ready for Spring Boot WebSocket/STOMP integration with:

✅ **Spring Boot compatible data structure**  
✅ **Consistent field naming** (chatId, messageId, timestamp, status)  
✅ **Uniform status values** (sent, received, read)  
✅ **Actual user IDs** instead of generic sender types  
✅ **Full JSON serialization** support  
✅ **Conversion helpers** for backward compatibility  
✅ **STOMP WebSocket service** implementation  
✅ **Complete documentation** and examples  

The dataset in `chatData.springboot.js` is production-ready and can be directly used with your Spring Boot backend!
