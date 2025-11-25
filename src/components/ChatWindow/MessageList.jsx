import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble";
import MessageDateSeparator from "./MessageDateSeparator";
import { MESSAGE_SENDER } from "../../utils/chatHelpers";
import "./MessageList.css";

function MessageList({ messages = [], searchTerm = "", userStatus, messagesEndRef, onMessageEdit, onMessageDelete }) {
  const internalEndRef = useRef(null);
  const endRef = messagesEndRef || internalEndRef;
  const listRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const previousMessageCountRef = useRef(messages.length);

  // Filter messages based on search term
  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter((message) =>
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  // Scroll to bottom only when NEW messages are added (not on edit/delete)
  useEffect(() => {
    const currentCount = filteredMessages.length;
    const previousCount = previousMessageCountRef.current;

    // Only scroll if message count increased (new message added)
    if (currentCount > previousCount) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Update the ref for next comparison
    previousMessageCountRef.current = currentCount;
  }, [filteredMessages, endRef]);

  const handleScrollPosition = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 80;
    setShowScrollButton(!isAtBottom);
  }, []);

  useEffect(() => {
    handleScrollPosition();
  }, [filteredMessages, handleScrollPosition]);

  // Group messages by day
  const groupMessagesByDay = (messages) => {
    if (!messages || messages.length === 0) return [];

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const groups = [];
    let currentGroup = null;

    sortedMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      if (Number.isNaN(messageDate.getTime())) return;

      const dayKey = messageDate.toDateString();

      if (!currentGroup || currentGroup.dayKey !== dayKey) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          dayKey,
          date: message.createdAt,
          messages: []
        };
      }

      currentGroup.messages.push(message);
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessagesByDay(filteredMessages);

  if (messageGroups.length === 0) {
    return (
      <div className="message-list-empty">
        <p>
          {searchTerm
            ? `No messages found for "${searchTerm}"`
            : "No messages yet. Start the conversation!"}
        </p>
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
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSent={isSent}
                  userStatus={userStatus}
                  onEdit={(newText) => onMessageEdit && onMessageEdit(message.id, newText)}
                  onDelete={() => onMessageDelete && onMessageDelete(message.id)}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div ref={endRef} />
      {filteredMessages.length > 0 && showScrollButton && (
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
  onMessageDelete: PropTypes.func
};

export default MessageList;

