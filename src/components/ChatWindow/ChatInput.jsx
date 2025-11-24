import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import EmojiPicker from "emoji-picker-react";
import { MESSAGE_SENDER } from "../../utils/chatHelpers";
import "./ChatInput.css";

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-picker-button")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const newMessage = {
      id: `m${Date.now()}`,
      sender: MESSAGE_SENDER.CURRENT_USER,
      text: trimmedMessage,
      createdAt: new Date().toISOString(),
      messageState: "sent",
      readedByUser: "no"
    };

    onSendMessage(newMessage);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="emoji-picker-wrapper">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height="350px"
          />
        </div>
      )}
      <div className="chat-input-wrapper">
        <button
          className="emoji-picker-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Toggle emoji picker"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired
};

export default ChatInput;

