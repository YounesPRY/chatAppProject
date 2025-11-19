import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/SideBar/SideBar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import "./components/SideBar/chatListItem.css";
import "./components/SideBar/searchInputStyle.css";
import "./App.css";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const messageSentHandlerRef = useRef(null);

  // Handle selected chat change from Sidebar
  const handleSelectedChatChange = (chat) => {
    setSelectedChat(chat);
  };

  // Handle message sent - call Sidebar's handler
  const handleMessageSent = (chatId, newMessage) => {
    if (messageSentHandlerRef.current) {
      messageSentHandlerRef.current(chatId, newMessage);
    }
  };

  // Store message sent handler from Sidebar
  const handleMessageSentHandler = (handler) => {
    messageSentHandlerRef.current = handler;
  };

  return (
    <div className="app-container">
      <Sidebar 
        onSelectedChatChange={handleSelectedChatChange}
        onMessageSentHandler={handleMessageSentHandler}
      />
      <ChatWindow 
        chat={selectedChat}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}

export default App;
