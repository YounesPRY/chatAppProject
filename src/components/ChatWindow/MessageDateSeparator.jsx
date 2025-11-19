import "./MessageDateSeparator.css";

function MessageDateSeparator({ date }) {
  if (!date) return null;

  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((startOfToday - messageDate) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays > 1 && diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      return date.toLocaleDateString(undefined, { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    }
  };

  const dateLabel = formatDateLabel(date);

  return (
    <div className="message-date-separator">
      <span className="message-date-label">{dateLabel}</span>
    </div>
  );
}

export default MessageDateSeparator;

