import "./MessageBubble.css";

function MessageBubble({ message, isSent, userStatus }) {
  if (!message) return null;

  // Format time for message bubble (just time, not full timestamp)
  const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const messageTime = formatMessageTime(message.createdAt);

  // Determine read receipt status
  const getReadReceiptStatus = () => {
    if (!isSent) return null; // Only show for sent messages

    // Check if user is offline
    if (userStatus === "offline") {
      return "single-gray";
    }

    // Check read status
    const isRead = message.readedByUser === "yes" || message.readedByUser === true;
    const isReceived = message.readedByUser !== null && message.readedByUser !== undefined;

    if (isRead) {
      return "double-blue";
    } else if (isReceived) {
      return "double-gray";
    } else {
      return "single-gray";
    }
  };

  const receiptStatus = getReadReceiptStatus();

  return (
    <div className={`message-bubble ${isSent ? "message-sent" : "message-received"}`}>
      <div className="message-content">
        <p className="message-text">{message.text}</p>
        <div className="message-footer">
          <span className="message-time">{messageTime}</span>
          {receiptStatus && (
            <span className={`message-receipt message-receipt-${receiptStatus}`}>
              {receiptStatus === "single-gray" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 20 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
                  <path d="M17.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L6.22 9.28a.75.75 0 0 1 1.06-1.06L10 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;

