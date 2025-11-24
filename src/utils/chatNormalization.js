import {
  formatMessageTimestamp,
  getLastMessageFromArray,
  isUnreadForMe
} from "./chatHelpers";

export const normalizeChats = (chats) => {
  return chats.map((chat) => {
    // Add displayTime to each message
    const messages = chat.messages.map((m) => ({
      ...m,
      displayTime: formatMessageTimestamp(m.createdAt)
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

