import ChatListItem from "./ChatListItem"; 
import SearchChats from "./SearchChats";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { initialChats } from "../../utils/chatData";
import { normalizeChats } from "../../utils/chatNormalization";
import { markMessagesAsRead } from "../../utils/chatHelpers";

// Re-export for backward compatibility
export { MESSAGE_SENDER, formatMessageTimestamp, getLastMessageFromArray, isUnreadForMe, isMessageReceivedByMe } from "../../utils/chatHelpers";
export { normalizeChats };

/* ---------------------- Component ---------------------- */

export default function Sidebar({ onSelectedChatChange, onMessageSentHandler, selectedChat: parentSelectedChat }) {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
  const isInternalChangeRef = useRef(false);
  const isMessageUpdateRef = useRef(false);

  // Normalize chats with displayTime, lastMessage, and unreadCount
  const normalizedChats = useMemo(() => normalizeChats(chats), [chats]);

  // Update filtered chats when normalized chats change
  useEffect(() => {
    setFilteredChats(normalizedChats);
  }, [normalizedChats]);

  // Helper: Update chat messages to mark as read
  const updateChatMessagesAsRead = useCallback((chatId) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat._id === chatId 
          ? { ...chat, messages: markMessagesAsRead(chat.messages) }
          : chat
      )
    );
  }, []);

  // Sync selectedChatId with parent's selectedChat (only when change comes from parent)
  useEffect(() => {
    if (isInternalChangeRef.current) {
      return; // Skip sync if change came from internal user interaction
    }
    
    const parentId = parentSelectedChat?._id || null;
    if (parentId !== selectedChatId) {
      setSelectedChatId(parentId);
      if (parentId) {
        updateChatMessagesAsRead(parentId);
      }
    }
  }, [parentSelectedChat, selectedChatId, updateChatMessagesAsRead]);

  // Get selected chat
  const selectedChat = useMemo(() => 
    normalizedChats.find(chat => chat._id === selectedChatId) || null,
    [normalizedChats, selectedChatId]
  );

  // Notify parent when selected chat changes from user interaction
  useEffect(() => {
    if (isInternalChangeRef.current && onSelectedChatChange) {
      const parentId = parentSelectedChat?._id || null;
      if (selectedChatId !== parentId) {
        onSelectedChatChange(selectedChat);
      }
      isInternalChangeRef.current = false;
    }
  }, [selectedChat, selectedChatId, parentSelectedChat, onSelectedChatChange]);

  // Update parent when messages are added to selected chat
  useEffect(() => {
    if (isMessageUpdateRef.current && selectedChat && selectedChatId && onSelectedChatChange) {
      const parentId = parentSelectedChat?._id || null;
      if (selectedChatId === parentId) {
        onSelectedChatChange(selectedChat);
      }
      isMessageUpdateRef.current = false;
    }
  }, [selectedChat, selectedChatId, parentSelectedChat, onSelectedChatChange]);

  // Handle chat selection
  const handleChatSelect = useCallback((chat) => {
    isInternalChangeRef.current = true;
    setSelectedChatId(chat._id);
    updateChatMessagesAsRead(chat._id);
  }, [updateChatMessagesAsRead]);

  // Handle new message sent - update chats state
  const handleMessageSent = useCallback((chatId, newMessage) => {
    isMessageUpdateRef.current = true;
    setChats(prevChats => 
      prevChats.map(chat => 
        chat._id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  }, []);

  // Expose handleMessageSent to parent
  useEffect(() => {
    if (onMessageSentHandler) {
      onMessageSentHandler(handleMessageSent);
    }
  }, [onMessageSentHandler, handleMessageSent]);

  return (
    <div className="sidebar">
      <SearchChats chats={normalizedChats} onFilter={setFilteredChats} />
      {filteredChats.map(chat => (
        <ChatListItem 
          key={chat._id} 
          chat={chat}
          isSelected={selectedChatId === chat._id}
          onSelect={() => handleChatSelect(chat)}
        />
      ))}
    </div>
  );
}

Sidebar.propTypes = {
  onSelectedChatChange: PropTypes.func,
  onMessageSentHandler: PropTypes.func,
  selectedChat: PropTypes.object
};
