import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/SideBar/SideBar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { SocketProvider } from "./contexts/SocketContext";
import "./components/SideBar/chatListItem.css";
import "./components/SideBar/searchInputStyle.css";
import "./App.css";

/**
 * Main App Component
 * 
 * To enable backend integration:
 * 1. Wrap with SocketProvider (already done)
 * 2. Update Sidebar and ChatWindow to use useChats hook
 * 3. Set useBackend flag based on environment
 */
function App() {
    const [selectedChat, setSelectedChat] = useState(null);
    const messageHandlersRef = useRef({
        handleMessageSent: null,
        handleMessageEdit: null,
        handleMessageDelete: null
    });

    // Handle selected chat change from Sidebar
    const handleSelectedChatChange = (chat) => {
        setSelectedChat(chat);
    };

    // Handle close chat - clear selected chat
    const handleCloseChat = () => {
        setSelectedChat(null);
    };

    // Handle message sent - call Sidebar's handler
    const handleMessageSent = (chatId, newMessage) => {
        if (messageHandlersRef.current.handleMessageSent) {
            messageHandlersRef.current.handleMessageSent(chatId, newMessage);
        }
    };

    // Handle message edit - call Sidebar's handler
    const handleMessageEdit = (chatId, messageId, newText) => {
        if (messageHandlersRef.current.handleMessageEdit) {
            messageHandlersRef.current.handleMessageEdit(chatId, messageId, newText);
        }
    };

    // Handle message delete - call Sidebar's handler
    const handleMessageDelete = (chatId, messageId) => {
        if (messageHandlersRef.current.handleMessageDelete) {
            messageHandlersRef.current.handleMessageDelete(chatId, messageId);
        }
    };

    // Store message handlers from Sidebar
    const handleMessageHandlers = (handlers) => {
        messageHandlersRef.current = handlers;
    };

    return (
        <div className="app-container">
            <Sidebar
                onSelectedChatChange={handleSelectedChatChange}
                onMessageSentHandler={handleMessageHandlers}
                selectedChat={selectedChat}
            />
            <ChatWindow
                chat={selectedChat}
                onMessageSent={handleMessageSent}
                onMessageEdit={handleMessageEdit}
                onMessageDelete={handleMessageDelete}
                onCloseChat={handleCloseChat}
            />
        </div>
    );
}

/**
 * App wrapper with providers
 */
function AppWithProviders() {
    return (
        <SocketProvider>
            <App />
        </SocketProvider>
    );
}

export default AppWithProviders;
