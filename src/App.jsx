import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/SideBar/SideBar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import "./App.css";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const messageHandlersRef = useRef({
    handleMessageSent: null,
    handleMessageEdit: null,
    handleMessageDelete: null
  });

  // Handle selected chat change from Sidebar
  const handleSelectedChatChange = (chat) => {
    setSelectedChat(chat);
  };

  // Handle chats update from Sidebar
  const handleChatsUpdate = (updatedChats) => {
    setChats(updatedChats);
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
        onChatsUpdate={handleChatsUpdate}
        selectedChat={selectedChat}
      />
      <ChatWindow
        chat={selectedChat}
        chats={chats}
        onMessageSent={handleMessageSent}
        onMessageEdit={handleMessageEdit}
        onMessageDelete={handleMessageDelete}
        onCloseChat={handleCloseChat}
      />
    </div>
  );
}

export default App;
