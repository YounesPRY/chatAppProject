// Constants
export const MESSAGE_SENDER = {
  CURRENT_USER: "current-user",
  OTHER_USER: "other-user"
};

// Helper constants
const MS_IN_DAY = 24 * 60 * 60 * 1000;

// Helper functions
export const flagIsTrue = (val) => {
  if (val === true) return true;
  if (typeof val === "string") return val.toLowerCase() === "yes" || val.toLowerCase() === "true";
  return false;
};

export const formatAsDayMonthYear = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export const formatMessageTimestamp = (dateString) => {
  if (!dateString) return "";

  // parse safely, normalize "YYYY/MM/DD" to "YYYY-MM-DD"
  let messageDate = new Date(dateString);
  if (Number.isNaN(messageDate.getTime()) && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) {
    const parts = dateString.split("/");
    messageDate = new Date(`${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}T00:00:00`);
  }
  if (Number.isNaN(messageDate.getTime())) return dateString;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const diffDays = Math.floor((startOfToday - startOfMessageDay) / MS_IN_DAY);

  if (diffDays < 0) {
    return formatAsDayMonthYear(messageDate);
  }
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return messageDate.toLocaleDateString(undefined, { weekday: "long" });
  return formatAsDayMonthYear(messageDate);
};

export const isMessageReceivedByMe = (msg = {}) => {
  if (msg.sender === MESSAGE_SENDER.CURRENT_USER) return false;
  if (msg.sender === MESSAGE_SENDER.OTHER_USER) return true;

  const messageState = typeof msg.messageState === "string" ? msg.messageState.toLowerCase() : "";
  if (messageState.includes("sent")) return false;
  if (messageState.includes("recieved") || messageState.includes("received")) return true;

  if (msg.direction) return msg.direction.toLowerCase() === "in" || msg.direction.toLowerCase() === "incoming";
  if (msg.fromMe !== undefined) return !flagIsTrue(msg.fromMe);
  if (msg.isIncoming !== undefined) return flagIsTrue(msg.isIncoming);

  return false;
};

export const isUnreadForMe = (msg = {}) => {
  if (!isMessageReceivedByMe(msg)) return false;

  // if explicit boolean provided:
  if (typeof msg.isRead === "boolean") return !msg.isRead;

  // check common legacy fields
  if (msg.readedByMe !== undefined) return !flagIsTrue(msg.readedByMe);
  if (msg.readedByUser !== undefined) return !flagIsTrue(msg.readedByUser);

  // fallback: assume unread until flagged
  return true;
};

export const getLastMessageFromArray = (messagesArray = []) => {
  if (!messagesArray || !messagesArray.length) return null;
  // Handle both createdAt (legacy) and timestamp (Spring Boot) fields
  const sorted = [...messagesArray].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.timestamp);
    const dateB = new Date(b.createdAt || b.timestamp);
    return dateB - dateA;
  });
  return sorted[0];
};

// Mark all received messages as read
export const markMessagesAsRead = (messages) => {
  return messages.map(msg => {
    if (isMessageReceivedByMe(msg) && !flagIsTrue(msg.readedByMe)) {
      return {
        ...msg,
        readedByMe: "yes"
      };
    }
    return msg;
  });
};

