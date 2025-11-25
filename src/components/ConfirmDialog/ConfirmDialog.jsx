import { useEffect } from "react";
import PropTypes from "prop-types";
import "./ConfirmDialog.css";

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-dialog-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-dialog-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-dialog-footer">
                    <button className="confirm-dialog-btn cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-dialog-btn confirm-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

ConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;
