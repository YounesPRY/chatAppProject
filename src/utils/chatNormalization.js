import {
  formatMessageTimestamp,
  getLastMessageFromArray,
  isUnreadForMe
} from "./chatHelpers";

export const normalizeChats = (chats) => {
  return chats.map((chat) => {
    // Add displayTime to each message
    // Handle both createdAt (legacy) and timestamp (Spring Boot) fields
    const messages = chat.messages.map((m) => ({
      ...m,
      displayTime: formatMessageTimestamp(m.createdAt || m.timestamp)
    }));

    const lastMessage = getLastMessageFromArray(messages) || null;
    const unreadCount = messages.reduce((acc, m) => (isUnreadForMe(m) ? acc + 1 : acc), 0);

    return {
      ...chat,
      messages,
      lastMessage: lastMessage ? { ...lastMessage } : null,
      unreadCount
    };
  });
};

