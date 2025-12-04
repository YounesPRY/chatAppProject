import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ForwardDialog from "../ForwardDialog/ForwardDialog";
import { MESSAGE_SENDER } from "../../utils/chatHelpers";
import "./ChatWindow.css";

function ChatWindow({ chat, chats = [], onMessageSent, onMessageEdit, onMessageDelete, onCloseChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
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

  const handleMessageEdit = (messageId, newText) => {
    if (onMessageEdit && chat) {
      onMessageEdit(chat._id, messageId, newText);
    }
  };

  const handleMessageDelete = (messageId) => {
    if (onMessageDelete && chat) {
      onMessageDelete(chat._id, messageId);
    }
  };

  const handleMessageCopy = (message) => {
    // Show copy notification
    setCopyNotification(true);
    setTimeout(() => {
      setCopyNotification(false);
    }, 2000);
  };

  const handleMessageReply = (message) => {
    setReplyToMessage(message);
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  const handleMessageForward = (message) => {
    setForwardMessage(message);
    setShowForwardDialog(true);
  };

  const handleForward = (message, selectedChatIds) => {
    // Forward the message to selected chats
    selectedChatIds.forEach(chatId => {
      const forwardedMessage = {
        id: `m${Date.now()}_${chatId}`,
        sender: MESSAGE_SENDER.CURRENT_USER,
        text: message.text,
        createdAt: new Date().toISOString(),
        messageState: "sent",
        readedByUser: "no",
        isForwarded: true
      };

      if (onMessageSent) {
        onMessageSent(chatId, forwardedMessage);
      }
    });

    setShowForwardDialog(false);
    setForwardMessage(null);
  };

  const handleCancelForward = () => {
    setShowForwardDialog(false);
    setForwardMessage(null);
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
        onMessageEdit={handleMessageEdit}
        onMessageDelete={handleMessageDelete}
        onMessageCopy={handleMessageCopy}
        onMessageReply={handleMessageReply}
        onMessageForward={handleMessageForward}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={handleCancelReply}
      />

      {/* Copy notification toast */}
      {copyNotification && (
        <div className="copy-notification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Message copied!</span>
        </div>
      )}

      {/* Forward dialog */}
      <ForwardDialog
        isOpen={showForwardDialog}
        message={forwardMessage}
        chats={chats.filter(c => c._id !== chat._id)}
        onForward={handleForward}
        onCancel={handleCancelForward}
      />
    </div>
  );
}

ChatWindow.propTypes = {
  chat: PropTypes.object,
  chats: PropTypes.arrayOf(PropTypes.object),
  onMessageSent: PropTypes.func.isRequired,
  onMessageEdit: PropTypes.func,
  onMessageDelete: PropTypes.func,
  onCloseChat: PropTypes.func.isRequired
};

export default ChatWindow;

