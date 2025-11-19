import { useState, useEffect, useRef } from "react";
import "./ChatHeader.css";

function ChatHeader({ chat, isSearchActive, searchTerm, onSearchToggle, onSearchChange }) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  if (!chat) return null;

  const handleSearchClick = () => {
    onSearchToggle();
  };

  const handleSearchInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleCloseSearch = () => {
    onSearchChange("");
    onSearchToggle();
  };

  return (
    <div className="chat-header">
      {!isSearchActive ? (
        <>
          <div className="chat-header-user">
            <div className="chat-header-avatar">
              {chat.user.avatarUrl ? (
                <img src={chat.user.avatarUrl} alt={chat.user.name} />
              ) : (
                <div className="chat-header-avatar-placeholder">
                  {chat.user.name[0].toUpperCase()}
                </div>
              )}
              {chat.user.status === "online" && (
                <span className="chat-header-status-dot"></span>
              )}
            </div>
            <div className="chat-header-name">{chat.user.name}</div>
          </div>
          <button 
            className="chat-header-search-btn"
            onClick={handleSearchClick}
            aria-label="Search messages"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </>
      ) : (
        <div className="chat-header-search-container">
          <div className="chat-header-search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chat-header-search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="chat-header-search-input"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
          <button 
            className="chat-header-close-search-btn"
            onClick={handleCloseSearch}
            aria-label="Close search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatHeader;

