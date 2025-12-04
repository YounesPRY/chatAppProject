import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble";
import MessageDateSeparator from "./MessageDateSeparator";
import { MESSAGE_SENDER } from "../../utils/chatHelpers";
import "./MessageList.css";

function MessageList({ messages = [], searchTerm = "", userStatus, messagesEndRef, onMessageEdit, onMessageDelete, onMessageCopy, onMessageReply, onMessageForward }) {
  const internalEndRef = useRef(null);
  const endRef = messagesEndRef || internalEndRef;
  const listRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const previousMessageCountRef = useRef(messages.length);

  // Group messages by date
  const messageGroups = useMemo(() => {
    const groups = {};

    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateKey = date.toLocaleDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          messages: []
        };
      }
      groups[dateKey].messages.push(message);
    });

    return Object.keys(groups).map(key => ({
      dayKey: key,
      date: groups[key].date,
      messages: groups[key].messages
    })).sort((a, b) => a.date - b.date);
  }, [messages]);

  // Handle search scrolling
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      // Find first matching message
      const matchingMessage = messages.find(msg =>
        msg.text.toLowerCase().includes(lowerTerm)
      );

      if (matchingMessage) {
        const element = document.getElementById(`msg-${matchingMessage.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Add a temporary highlight class
          element.classList.add('message-highlight');
          setTimeout(() => element.classList.remove('message-highlight'), 2000);
        }
      }
    }
  }, [searchTerm, messages]);

  // Scroll to bottom on new messages if no search term is active
  useEffect(() => {
    if (!searchTerm && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchTerm, messagesEndRef]);

  const handleScrollPosition = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 80;
    setShowScrollButton(!isAtBottom);
  }, []);

  useEffect(() => {
    handleScrollPosition();
  }, [messages, handleScrollPosition]);

  if (messageGroups.length === 0) {
    return (
      <div className="message-list-empty">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const handleScrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    setShowScrollButton(false);
  };

  return (
    <div className="message-list" ref={listRef} onScroll={handleScrollPosition}>
      {messageGroups.map((group) => (
        <div key={group.dayKey} className="message-group">
          <MessageDateSeparator date={group.date} />
          <div className="message-group-content">
            {group.messages.map((message) => {
              const isSent = message.sender === MESSAGE_SENDER.CURRENT_USER;
              const isLast = message.id === messages[messages.length - 1].id;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSent={isSent}
                  isLast={isLast}
                  userStatus={userStatus}
                  onEdit={(newText) => onMessageEdit && onMessageEdit(message.id, newText)}
                  onDelete={() => onMessageDelete && onMessageDelete(message.id)}
                  onCopy={(msg) => onMessageCopy && onMessageCopy(msg)}
                  onReply={(msg) => onMessageReply && onMessageReply(msg)}
                  onForward={(msg) => onMessageForward && onMessageForward(msg)}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div ref={endRef} />
      {messages.length > 0 && showScrollButton && (
        <button
          type="button"
          className="scroll-to-bottom-btn message-list-scroll-btn"
          onClick={handleScrollToBottom}
          aria-label="Scroll to latest message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  searchTerm: PropTypes.string,
  userStatus: PropTypes.string,
  messagesEndRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  onMessageEdit: PropTypes.func,
  onMessageDelete: PropTypes.func,
  onMessageCopy: PropTypes.func,
  onMessageReply: PropTypes.func,
  onMessageForward: PropTypes.func
};

export default MessageList;

