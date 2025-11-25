import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./MessageBubble.css";

function MessageBubble({ message, isSent, userStatus, onEdit, onDelete }) {
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

  return (
    <div className={`message-bubble ${isSent ? "message-sent" : "message-received"}`}>
      <div className="message-content">
        {isSent && !isEditing && (
          <div className="message-actions">
            <button
              className="message-action-btn edit-btn"
              onClick={handleEditClick}
              aria-label="Edit message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              className="message-action-btn delete-btn"
              onClick={handleDeleteClick}
              aria-label="Delete message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
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
          <p className="message-text">
            {message.text}
            {message.isEdited && <span className="message-edited-label"> (edited)</span>}
          </p>
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
    </div>
  );
}

export default MessageBubble;

