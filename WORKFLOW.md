# Chat Application Workflow & Architecture

This document outlines the entire workflow of the Chat Application, explaining the component interactions, data flow, and state management.

## 1. Architecture Overview

The application follows a standard React component structure with a clear separation of concerns between the Sidebar (navigation/list) and the ChatWindow (conversation view).

### Core Components

*   **`App`**: The root component that acts as the central state manager and orchestrator.
*   **`Sidebar`**: Manages the list of chats, search functionality, and chat selection.
*   **`ChatWindow`**: Displays the active conversation, handles message input, and message actions.

## 2. Data Flow & State Management

The application uses a "lifted state" approach where the `App` component holds the shared state, but the `Sidebar` also maintains the source of truth for the chat list.

### State Distribution

1.  **`Sidebar` State**:
    *   `chats`: The complete list of all conversations. Initialized from `initialChats` (mock data).
    *   `selectedChatId`: The ID of the currently active chat.
    *   `filteredChats`: A subset of `chats` based on the search query.

2.  **`App` State**:
    *   `selectedChat`: The full object of the currently selected chat.
    *   `chats`: A mirror of the sidebar's chat list, passed down to `ChatWindow` for features like forwarding.

3.  **`ChatWindow` State**:
    *   `searchTerm`: Local state for searching within a conversation.
    *   `replyToMessage`: The message currently being replied to.
    *   `forwardMessage`: The message currently being forwarded.

### Data Synchronization

*   **Sidebar -> App**: When a user selects a chat or when the chat list updates (e.g., new message), `Sidebar` notifies `App` via callbacks (`onSelectedChatChange`, `onChatsUpdate`).
*   **App -> ChatWindow**: `App` passes the `selectedChat` and the full `chats` list to `ChatWindow`.
*   **ChatWindow -> App -> Sidebar**: When a message is sent/edited/deleted in `ChatWindow`, it calls a handler passed from `App`. `App` then delegates this to `Sidebar` (via a Ref) to update the master `chats` state.

## 3. Component Interactions

### 3.1 Selecting a Chat
1.  User clicks a chat in `Sidebar`.
2.  `Sidebar` updates its `selectedChatId`.
3.  `Sidebar` calls `onSelectedChatChange` prop.
4.  `App` receives the new chat object and updates its `selectedChat` state.
5.  `App` re-renders, passing the new `chat` to `ChatWindow`.
6.  `ChatWindow` resets its local state (search, reply, etc.) and displays the new conversation.

### 3.2 Sending a Message
1.  User types in `ChatInput` (inside `ChatWindow`) and hits send.
2.  `ChatWindow` calls `onMessageSent` (passed from `App`).
3.  `App` calls `handleMessageSent`.
4.  `App` uses `messageHandlersRef` to call `Sidebar`'s `handleMessageSent`.
5.  `Sidebar` updates its `chats` state by appending the new message to the correct chat.
6.  `Sidebar` triggers `onChatsUpdate` to sync `App`'s state.
7.  If the updated chat is the currently selected one, `Sidebar` also triggers `onSelectedChatChange` to update the view in `ChatWindow`.

### 3.3 Editing/Deleting a Message
*   **Edit**: User clicks "Edit" on a message bubble -> `MessageBubble` enters edit mode -> User saves -> `ChatWindow` calls `onMessageEdit` -> `App` -> `Sidebar` updates state.
*   **Delete**: User clicks "Delete" -> `ConfirmDialog` appears -> User confirms -> `ChatWindow` calls `onMessageDelete` -> `App` -> `Sidebar` updates state.

### 3.4 Message Search
*   **Global Search (Sidebar)**: Filters the list of chats based on contact name. Managed entirely within `Sidebar`.
*   **In-Chat Search (ChatWindow)**:
    1.  User toggles search icon in `ChatHeader`.
    2.  `ChatWindow` updates `searchTerm`.
    3.  `MessageList` receives `searchTerm`.
    4.  `MessageList` scrolls to and highlights the first matching message.

### 3.5 Forwarding a Message
1.  User selects "Forward" on a message.
2.  `ChatWindow` opens `ForwardDialog`, passing the list of *other* chats (received from `App`).
3.  User selects destination chats and confirms.
4.  For each selected chat, `ChatWindow` calls `onMessageSent` (simulating a new message in that chat).
5.  The flow continues as a normal "Send Message" operation for each target chat.

## 4. File Structure

*   **`src/App.jsx`**: Main controller.
*   **`src/components/Sidebar/`**:
    *   `Sidebar.jsx`: Chat list logic.
    *   `ChatListItem.jsx`: Individual chat row.
    *   `SearchChats.jsx`: Filter input.
*   **`src/components/ChatWindow/`**:
    *   `ChatWindow.jsx`: Conversation view container.
    *   `MessageList.jsx`: Renders the list of messages (grouped by date).
    *   `MessageBubble.jsx`: Individual message component (handles display, menu, edit).
    *   `ChatInput.jsx`: Input field for new messages.
    *   `ChatHeader.jsx`: Top bar with user info and actions.
*   **`src/utils/`**:
    *   `chatDataAdapter.js`: Adapts raw data to component format.
    *   `chatHelpers.js`: Utility functions (timestamps, status checks).

## 5. Future Backend Integration
The app is designed to be backend-ready.
*   `App.backend-ready.jsx` shows how to wrap the app with `SocketProvider`.
*   Data fetching logic in `Sidebar` can be replaced with API calls.
*   `onMessageSent` handlers can be replaced with Socket.io emissions.
