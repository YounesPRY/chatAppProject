import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";

function ChatWindow({ chat, onMessageSent, onCloseChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset search when chat changes
  useEffect(() => {
    setSearchTerm("");
    setIsSearchActive(false);
  }, [chat]);

  const handleSendMessage = (newMessage) => {
    if (!chat) return;

    // Notify parent to update the chat in the main chats array
    // The parent will update and normalize, which will trigger useEffect to update chatMessages
    if (onMessageSent) {
      onMessageSent(chat._id, newMessage);
    }
  };

  if (!chat) {
    return (
      <div className="chat-window-empty">
        <div className="chat-window-empty-content">
          <p>Younes's Chat App is here 🔥</p>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchTerm("");
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="chat-window">
      <ChatHeader 
        chat={chat}
        isSearchActive={isSearchActive}
        searchTerm={searchTerm}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
        onCloseChat={onCloseChat}
      />
      <MessageList 
        messages={chat.messages || []} 
        searchTerm={searchTerm} 
        userStatus={chat.user.status}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

ChatWindow.propTypes = {
  chat: PropTypes.object,
  onMessageSent: PropTypes.func.isRequired,
  onCloseChat: PropTypes.func.isRequired
};

export default ChatWindow;

