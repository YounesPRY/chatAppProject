import { useState } from "react";
import PropTypes from "prop-types";
import "./ForwardDialog.css";

function ForwardDialog({ isOpen, message, chats, onForward, onCancel }) {
    const [selectedChats, setSelectedChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    if (!isOpen || !message) return null;

    const handleToggleChat = (chatId) => {
        setSelectedChats(prev =>
            prev.includes(chatId)
                ? prev.filter(id => id !== chatId)
                : [...prev, chatId]
        );
    };

    const handleForward = () => {
        if (selectedChats.length > 0) {
            onForward(message, selectedChats);
            setSelectedChats([]);
            setSearchTerm("");
        }
    };

    const handleCancel = () => {
        setSelectedChats([]);
        setSearchTerm("");
        onCancel();
    };

    const filteredChats = chats.filter(chat =>
        chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="forward-dialog-overlay" onClick={handleCancel}>
            <div className="forward-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="forward-dialog-header">
                    <h3>Forward Message</h3>
                    <button
                        className="forward-dialog-close"
                        onClick={handleCancel}
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="forward-message-preview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 10 20 15 15 20"></polyline>
                        <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                    </svg>
                    <span>{message.text}</span>
                </div>

                <div className="forward-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="forward-chat-list">
                    {filteredChats.length === 0 ? (
                        <div className="forward-no-chats">
                            <p>No chats found</p>
                        </div>
                    ) : (
                        filteredChats.map(chat => (
                            <div
                                key={chat._id}
                                className={`forward-chat-item ${selectedChats.includes(chat._id) ? 'selected' : ''}`}
                                onClick={() => handleToggleChat(chat._id)}
                            >
                                <div className="forward-chat-avatar">
                                    {chat.user.avatarUrl ? (
                                        <img src={chat.user.avatarUrl} alt={chat.user.name} />
                                    ) : (
                                        <div className="forward-chat-avatar-placeholder">
                                            {chat.user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="forward-chat-info">
                                    <span className="forward-chat-name">{chat.user.name}</span>
                                </div>
                                <div className="forward-chat-checkbox">
                                    {selectedChats.includes(chat._id) && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="forward-dialog-actions">
                    <button className="forward-cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        className="forward-send-btn"
                        onClick={handleForward}
                        disabled={selectedChats.length === 0}
                    >
                        Forward {selectedChats.length > 0 && `(${selectedChats.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}

ForwardDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.object,
    chats: PropTypes.arrayOf(PropTypes.object).isRequired,
    onForward: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ForwardDialog;
