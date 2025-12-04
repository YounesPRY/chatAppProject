import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./MessageBubble.css";

function MessageBubble({ message, isSent, isLast, userStatus, onEdit, onDelete, onCopy, onReply, onForward }) {
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
      return "double-dark-blue";
    } else if (isReceived) {
      return "double-gray";
    } else {
      return "single-gray";
    }
  };

  const receiptStatus = getReadReceiptStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditContent(message.text);
  }, [message.text]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.text);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.text) {
      if (onEdit) {
        onEdit(editContent);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      if (onCopy) {
        onCopy(message);
      }
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = message.text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        if (onCopy) {
          onCopy(message);
        }
      } catch (fallbackErr) {
        console.error('Failed to copy message:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleForwardClick = () => {
    if (onForward) {
      onForward(message);
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const onActionClick = (action) => {
    setShowMenu(false);
    action();
  };

  return (
    <div id={`msg-${message.id}`} className={`message-bubble ${isSent ? "message-sent" : "message-received"} ${showMenu ? "menu-open" : ""} ${isLast ? "message-last" : ""}`}>
      <div className="message-content">
        {!isEditing && (
          <div className="message-actions-menu-container" ref={menuRef}>
            <button
              className={`message-menu-btn ${showMenu ? 'active' : ''}`}
              onClick={handleMenuToggle}
              aria-label="Message options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>

            {showMenu && (
              <div className={`message-dropdown-menu ${isLast ? "dropdown-up" : ""}`}>
                <button className="dropdown-item" onClick={() => onActionClick(handleReplyClick)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 14 4 9 9 4"></polyline>
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                  </svg>
                  <span>Reply</span>
                </button>

                <button className="dropdown-item" onClick={() => onActionClick(handleCopyClick)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy</span>
                </button>

                <button className="dropdown-item" onClick={() => onActionClick(handleForwardClick)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 10 20 15 15 20"></polyline>
                    <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                  </svg>
                  <span>Forward</span>
                </button>

                {isSent && (
                  <>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => onActionClick(handleEditClick)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button className="dropdown-item delete" onClick={() => onActionClick(handleDeleteClick)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="message-edit-container">
            <textarea
              className="message-edit-input"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="message-edit-actions">
              <button className="message-edit-cancel" onClick={handleCancelEdit}>Cancel</button>
              <button className="message-edit-save" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        ) : (
          <>
            {/* Show reply context if this message is a reply */}
            {message.replyTo && (
              <div className="message-reply-context">
                <div className="message-reply-bar"></div>
                <div className="message-reply-content">
                  <span className="message-reply-text">{message.replyTo.text}</span>
                </div>
              </div>
            )}

            <p className="message-text">
              {message.isForwarded && <span className="message-forwarded-label">↗ Forwarded</span>}
              {message.text}
              {message.isEdited && <span className="message-edited-label"> (edited)</span>}
            </p>
          </>
        )}

        <div className="message-footer">
          <span className="message-time">{messageTime}</span>
          {receiptStatus && (
            <span className={`message-receipt message-receipt-${receiptStatus}`}>
              {receiptStatus === "single-gray" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 20 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  <path d="M17.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L6.22 9.28a.75.75 0 0 1 1.06-1.06L10 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div >
  );
}

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isSent: PropTypes.bool.isRequired,
  isLast: PropTypes.bool,
  userStatus: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCopy: PropTypes.func,
  onReply: PropTypes.func,
  onForward: PropTypes.func
};

export default MessageBubble;
