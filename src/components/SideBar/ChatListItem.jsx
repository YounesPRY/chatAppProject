
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
                {chat.avatarUrl === null || chat.avatarUrl == "" ? chat.name[0] : <img src={chat.avatarUrl} alt={chat.name[0]}></img>}
            </div>
            <div className="chat_infos">
                <div className="name_lastmsg">
                    <div className="name">
                        {chat.name}
                    </div>
                    <div className="lastMsg">
                        {chat.lastMessage.text}
                    </div>
                </div>
                <div className="time_count">
                    <div className="time">
                        {chat.lastMessage.createdAt}
                    </div>
                    {chat.unreadCount === 0 ? "" :  <div className="count">{chat.unreadCount}</div>}
                </div>
            </div>
        </div>
    </>
  );
}

export default ChatListItem;