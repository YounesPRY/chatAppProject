# Quick Start: Migrating to Backend

This guide shows you how to quickly migrate from mock data to backend integration.

## 🚀 Quick Migration Steps

### Step 1: Update App.jsx

Replace your current `App.jsx` with the backend-ready version:

```bash
# Backup current App.jsx
cp src/App.jsx src/App.backup.jsx

# Use backend-ready version
cp src/App.backend-ready.jsx src/App.jsx
```

Or manually add the SocketProvider wrapper:

```javascript
import { SocketProvider } from "./contexts/SocketContext";

function AppWithProviders() {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  );
}

export default AppWithProviders;
```

### Step 2: Update Sidebar Component

Modify `src/components/SideBar/SideBar.jsx` to use the `useChats` hook:

```javascript
import { useChats } from "../../hooks/useChats";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";

export default function Sidebar({ onSelectedChatChange, onMessageSentHandler, selectedChat: parentSelectedChat }) {
  // Toggle this flag to enable/disable backend
  const USE_BACKEND = false; // Set to true when backend is ready
  
  const {
    chats: backendChats,
    loading,
    error,
    sendMessage: backendSendMessage,
    editMessage: backendEditMessage,
    deleteMessage: backendDeleteMessage,
    markChatAsRead
  } = useChats(USE_BACKEND);

  // Use backend chats if enabled, otherwise use initialChats
  const [chats, setChats] = useState(USE_BACKEND ? [] : initialChats);
  
  useEffect(() => {
    if (USE_BACKEND) {
      setChats(backendChats);
    }
  }, [USE_BACKEND, backendChats]);

  // ... rest of your component
}
```

### Step 3: Configure Environment

Update `.env` with your backend URLs:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENV=development
```

### Step 4: Enable Backend Mode

When your backend is ready, simply change:

```javascript
const USE_BACKEND = true; // Enable backend integration
```

## 📦 Alternative: Feature Flag Approach

Create a feature flag configuration:

```javascript
// src/config/features.js
export const features = {
  useBackend: import.meta.env.VITE_USE_BACKEND === 'true',
  enableWebSocket: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
};
```

Update `.env`:

```env
VITE_USE_BACKEND=false
VITE_ENABLE_WEBSOCKET=false
```

Use in components:

```javascript
import { features } from '../../config/features';
import { useChats } from '../../hooks/useChats';

function Sidebar() {
  const { chats, sendMessage } = useChats(features.useBackend);
  // ...
}
```

## 🔄 Gradual Migration

You can migrate gradually by feature:

### Phase 1: API Only (No WebSocket)
```javascript
const USE_BACKEND = true;
const USE_WEBSOCKET = false;

// In SocketProvider, conditionally connect
if (USE_WEBSOCKET && token) {
  wsService.connect(token);
}
```

### Phase 2: Add WebSocket
```javascript
const USE_BACKEND = true;
const USE_WEBSOCKET = true;
```

## 🧪 Testing Backend Integration

### Test 1: API Connection

```javascript
// src/test-api.js
import apiClient from './api/client';

async function testAPI() {
  try {
    // Test login
    const response = await apiClient.login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', response);

    // Test getting chats
    const chats = await apiClient.getChats();
    console.log('✅ Chats fetched:', chats);

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();
```

Run: `node src/test-api.js`

### Test 2: WebSocket Connection

```javascript
// src/test-websocket.js
import wsService from './services/websocket';

wsService.on('connected', () => {
  console.log('✅ WebSocket connected');
});

wsService.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

wsService.connect('your-token-here');
```

## 📊 Migration Checklist

- [ ] Backend server is running
- [ ] Environment variables configured
- [ ] App wrapped with SocketProvider
- [ ] Sidebar updated to use useChats hook
- [ ] ChatWindow updated (if needed)
- [ ] API connection tested
- [ ] WebSocket connection tested
- [ ] Message sending works
- [ ] Message editing works
- [ ] Message deletion works
- [ ] Real-time updates working
- [ ] Error handling implemented
- [ ] Loading states handled

## 🐛 Common Issues

### Issue: "useSocket must be used within a SocketProvider"
**Solution**: Ensure App is wrapped with SocketProvider

### Issue: WebSocket not connecting
**Solution**: 
1. Check backend WebSocket server is running
2. Verify VITE_WS_URL in .env
3. Check browser console for errors

### Issue: API calls return 401 Unauthorized
**Solution**: 
1. Ensure user is logged in
2. Check token is stored: `localStorage.getItem('auth_token')`
3. Verify token is valid

### Issue: Messages not updating in real-time
**Solution**:
1. Check WebSocket is connected: `socket.isConnected`
2. Verify backend is broadcasting events
3. Check event names match between client and server

## 🎯 Next Steps

1. **Implement Authentication**: Add login/register pages
2. **Add Loading States**: Show spinners during API calls
3. **Error Handling**: Display user-friendly error messages
4. **Offline Support**: Handle offline mode gracefully
5. **Optimistic Updates**: Update UI before server confirms

## 📚 Resources

- [Backend Integration Guide](./BACKEND_INTEGRATION.md) - Full documentation
- [API Client](./src/api/client.js) - API methods reference
- [WebSocket Service](./src/services/websocket.js) - WebSocket methods
- [useChats Hook](./src/hooks/useChats.js) - Chat management hook
