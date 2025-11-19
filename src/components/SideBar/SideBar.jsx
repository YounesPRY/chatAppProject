import ChatListItem from "./ChatListItem"; 
import SearchChats from "./SearchChats";
import image from "../../assets/react.svg";
import myImg from "../../assets/me.png";
import vite from "../../assets/vite.svg";
import { useState } from "react";

const MESSAGE_SENDER = {
  CURRENT_USER: "current-user",
  OTHER_USER: "other-user"
};

/* ---------------------- Helpers ---------------------- */

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const formatAsDayMonthYear = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const formatMessageTimestamp = (dateString) => {
  if (!dateString) return "";

  // parse safely, normalize "YYYY/MM/DD" to "YYYY-MM-DD"
  let messageDate = new Date(dateString);
  if (Number.isNaN(messageDate.getTime()) && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) {
    const parts = dateString.split("/");
    messageDate = new Date(`${parts[0]}-${parts[1].padStart(2,"0")}-${parts[2].padStart(2,"0")}T00:00:00`);
  }
  if (Number.isNaN(messageDate.getTime())) return dateString;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const diffDays = Math.floor((startOfToday - startOfMessageDay) / MS_IN_DAY);

  if (diffDays < 0) {
    return formatAsDayMonthYear(messageDate);
  }
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return messageDate.toLocaleDateString(undefined, { weekday: "long" });
  return formatAsDayMonthYear(messageDate);
};

const flagIsTrue = (val) => {
  if (val === true) return true;
  if (typeof val === "string") return val.toLowerCase() === "yes" || val.toLowerCase() === "true";
  return false;
};

const isMessageReceivedByMe = (msg = {}) => {
  if (msg.sender === MESSAGE_SENDER.CURRENT_USER) return false;
  if (msg.sender === MESSAGE_SENDER.OTHER_USER) return true;

  const messageState = typeof msg.messageState === "string" ? msg.messageState.toLowerCase() : "";
  if (messageState.includes("sent")) return false;
  if (messageState.includes("recieved") || messageState.includes("received")) return true;

  if (msg.direction) return msg.direction.toLowerCase() === "in" || msg.direction.toLowerCase() === "incoming";
  if (msg.fromMe !== undefined) return !flagIsTrue(msg.fromMe);
  if (msg.isIncoming !== undefined) return flagIsTrue(msg.isIncoming);

  return false;
};

const isUnreadForMe = (msg = {}) => {
  if (!isMessageReceivedByMe(msg)) return false;

  // if explicit boolean provided:
  if (typeof msg.isRead === "boolean") return !msg.isRead;

  // check common legacy fields
  if (msg.readedByMe !== undefined) return !flagIsTrue(msg.readedByMe);
  if (msg.readedByUser !== undefined) return !flagIsTrue(msg.readedByUser);

  // fallback: assume unread until flagged
  return true;
};

const getLastMessageFromArray = (messagesArray = []) => {
  if (!messagesArray || !messagesArray.length) return null;
  const sorted = [...messagesArray].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sorted[0];
};

/* ---------------------- Chats (messages as arrays) ---------------------- */

const chats = [
  {
    _id: 1,
    user: { id: "u1", name: "Younes", status: "online", avatarUrl: myImg },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.CURRENT_USER, text: "message1", createdAt: "2025-10-16T14:30:00", messageState: "sent", readedByUser: "yes" },
      { id: "m2", sender: MESSAGE_SENDER.OTHER_USER, text: "message2", createdAt: "2025-10-17T14:35:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.CURRENT_USER, text: "message3", createdAt: "2025-10-17T17:55:15", messageState: "sent", readedByUser: "yes" },
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-16T22:30:00", messageState: "recieved", readedByMe: "no" }
    ],
  },
  {
    _id: 2,
    user: { id: "u2", name: "Youssef", status: "online", avatarUrl: image },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.OTHER_USER, text: "message1", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "no" },
      { id: "m2", sender: MESSAGE_SENDER.CURRENT_USER, text: "message2", createdAt: "2025-10-17T14:40:00", messageState: "sent", readedByUser: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.OTHER_USER, text: "message3", createdAt: "2025-11-12T15:33:45", messageState: "recieved", readedByMe: "yes" },
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-18T11:41:00", messageState: "recieved", readedByMe: "no" }
    ]
  },
  {
    _id: 3,
    user: { id: "u3", name: "Salim", status: "offline", avatarUrl: vite },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.CURRENT_USER, text: "message1", createdAt: "2025-11-01T14:30:00", messageState: "sent", readedByUser: "no" },
      { id: "m2", sender: MESSAGE_SENDER.OTHER_USER, text: "message2", createdAt: "2025-11-05T18:15:50", messageState: "recieved", readedByMe: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.CURRENT_USER, text: "message3", createdAt: "2025-11-12T15:01:02", messageState: "sent", readedByUser: "yes" },
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" }
    ]
  },
  {
    _id: 4,
    user: { id: "u4", name: "Yassine", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.OTHER_USER, text: "message1", createdAt: "2025-11-10T14:22:22", messageState: "recieved", readedByMe: "yes" },
      { id: "m2", sender: MESSAGE_SENDER.CURRENT_USER, text: "message2", createdAt: "2025-11-11T14:25:00", messageState: "sent", readedByUser: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.OTHER_USER, text: "message3", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "no" },
      { id: "m4", sender: MESSAGE_SENDER.CURRENT_USER, text: "message4", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "no" }
    ]
  },
  {
    _id: 5,
    user: { id: "u5", name: "Said", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.CURRENT_USER, text: "message1", createdAt: "2025-09-28T22:33:00", messageState: "sent", readedByUser: "no" },
      { id: "m2", sender: MESSAGE_SENDER.OTHER_USER, text: "message2", createdAt: "2025-10-01T14:44:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.OTHER_USER, text: "message3", createdAt: "2025-10-03T08:10:00", messageState: "recieved", readedByMe: "no" },
      { id: "m4", sender: MESSAGE_SENDER.CURRENT_USER, text: "message4", createdAt: "2025-10-17T15:30:00", messageState: "sent", readedByUser: "yes" }
    ]
  },
  {
    _id: 6,
    user: { id: "u6", name: "Hassane", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.OTHER_USER, text: "message1", createdAt: "2025-11-10T14:25:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m2", sender: MESSAGE_SENDER.CURRENT_USER, text: "message2", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.OTHER_USER, text: "message3", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "no" },
      { id: "m4", sender: MESSAGE_SENDER.CURRENT_USER, text: "message4", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "no" }
    ]
  },
  {
    _id: 7,
    user: { id: "u7", name: "Mohammed", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.CURRENT_USER, text: "message1", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "yes" },
      { id: "m2", sender: MESSAGE_SENDER.OTHER_USER, text: "message2", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.CURRENT_USER, text: "message3", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "no" },
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "no" }
    ]
  },
  {
    _id: 8,
    user: { id: "u8", name: "Amin", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.OTHER_USER, text: "message1", createdAt: "2025-11-17T23:32:00", messageState: "recieved", readedByMe: "no" },
      { id: "m2", sender: MESSAGE_SENDER.CURRENT_USER, text: "message2", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.OTHER_USER, text: "message3", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m4", sender: MESSAGE_SENDER.CURRENT_USER, text: "message4", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "no" }
    ]
  },
  {
    _id: 9,
    user: { id: "u9", name: "Karime", status: "offline", avatarUrl: null },
    messages: [
      { id: "m1", sender: MESSAGE_SENDER.CURRENT_USER, text: "message1", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "yes" },
      { id: "m2", sender: MESSAGE_SENDER.OTHER_USER, text: "message2", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "yes" },
      { id: "m3", sender: MESSAGE_SENDER.CURRENT_USER, text: "message3", createdAt: "2025-11-17T14:30:00", messageState: "sent", readedByUser: "no" },
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T14:30:00", messageState: "recieved", readedByMe: "no" }
    ]
  }
];


/* ---------------------- Normalize and annotate ---------------------- */

const normalizedChats = chats.map((chat) => {
  // add displayTime to each message
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

/* ---------------------- Component ---------------------- */

export default function Sidebar() {
  const [filteredChats, setFilteredChats] = useState(normalizedChats);

  return (
    <div className="sidebar">
      <SearchChats chats={normalizedChats} onFilter={setFilteredChats} />
      {filteredChats.map(chat => (
        <ChatListItem key={chat._id} chat={chat} />
      ))}
    </div>
  );
}
