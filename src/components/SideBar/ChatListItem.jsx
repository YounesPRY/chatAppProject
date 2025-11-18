
/**
 * ChatListItem
 * - chat: { _id, name, avatarUrl, lastMessage: { text, createdAt }, unreadCount }
 * - onSelect(chat) called when user activates the item (click or Enter/Space)
 * - active boolean
 *
 * This component is intentionally small and pure. It does not fetch data.
//  */

function ChatListItem({chat}) {
  return (
    <>
        <div className="chat_container">
            <div className="avatar">
                {chat.user.avatarUrl === null || chat.user.avatarUrl == "" ? chat.user.name[0] : <img src={chat.user.avatarUrl} alt={chat.user.name[0]} loading="lazy" className="avatarImg"></img>}
                <span className={`status-dot ${chat.user.status === "online" ? "online" : "offline"}`}></span>
            </div>
            <div className="chat_infos">
                <div className="name_lastmsg">
                    <div className="name">
                        {chat.user.name}
                    </div>
                    {chat.lastMessage ? (
                      <div className="lastMsg">
                        {chat.lastMessage.text}
                      </div>
                    ) : null}
                </div>
                <div className="time_count">
                    {chat.lastMessage ? (
                      <div className="time">
                        {chat.lastMessage.displayTime || chat.lastMessage.createdAt}
                      </div>
                    ) : null}
                    {chat.unreadCount === 0 ? "" :  <div className="count">{chat.unreadCount}</div>}
                </div>
            </div>
        </div>
    </>
  );
}

export default ChatListItem;