import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MessageDateSeparator from "./MessageDateSeparator";
import "./MessageList.css";

const MESSAGE_SENDER = {
  CURRENT_USER: "current-user",
  OTHER_USER: "other-user"
};

function MessageList({ messages = [], searchTerm = "", userStatus }) {
  const messagesEndRef = useRef(null);

  // Filter messages based on search term
  const filteredMessages = searchTerm
    ? messages.filter((message) =>
        message.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

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

  return (
    <div className="message-list">
      {messageGroups.map((group, groupIndex) => (
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
                />
              );
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

