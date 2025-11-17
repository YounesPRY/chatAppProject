import ChatListItem from "./ChatListItem"; // adjust path if needed
import image from "../../assets/react.svg";
import myImg from "../../assets/me.jpeg";
import SearchChats from "./SearchChats";
import { useState } from "react";

export default function Sidebar() {


// fake data , just for frontent tesing , i will add real msgs from backend later 
const chats = [
    {
    _id:1,
    name : "Younes",
    avatarUrl: myImg,
    messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-16T14:30:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-17T14:35:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T17:55:15"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T22:30:00"
      },
    },
    lastMessage :null,
    unreadCount:1
    },
    {
    _id:2,
    name : "Youssef",
    avatarUrl: image,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-17T14:30:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-10-17T14:40:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-12T15:33:45"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T17:41:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025-11-17T17:41:00"},
    unreadCount:2
    },
    {
    _id:3,
    name : "Salim",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-01T14:30:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-05T18:15:50"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-12T15:01:02"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T13:50:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:4,
    name : "Yassine",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-10T14:22:22"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-11T14:25:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T14:30:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T14:30:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:5,
    name : "Said",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-09-28T22:33:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-10-01T14:44:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-10-03T08:10:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-10-17T15:30:00"
      },
    },
    lastMessage :{text:"Ok" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:6,
    name : "Hassane",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-10T14:25:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-17T14:30:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T14:30:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T14:30:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:7,
    name : "Mohammed",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-17T14:30:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-17T14:30:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T14:30:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T14:30:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:8,
    name : "Amin",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-17T23:32:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-17T14:30:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T14:30:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T14:30:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    }, {
    _id:9,
    name : "Karim",
    avatarUrl: null,
     messages : {
      message1:{
        text:"message1",
        createdAt:"2025-11-17T14:30:00"
      },
      message2:{
        text:"message2",
        createdAt:"2025-11-17T14:30:00"
      },
      message3:{
        text:"message3",
        createdAt:"2025-11-17T14:30:00"
      },
      message4:{
        text:"message4",
        createdAt:"2025-11-17T14:30:00"
      },
    },
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    }
];

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const formatMessageTimestamp = (dateString) => {
  if (!dateString) return "";

  const messageDate = new Date(dateString);
  if (Number.isNaN(messageDate.getTime())) {
    return dateString;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffDays = Math.floor((startOfToday - startOfMessageDay) / MS_IN_DAY);

  if (diffDays < 0) {
    return formatAsDayMonthYear(messageDate);
  }

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: "long" });
  }

  return formatAsDayMonthYear(messageDate);
};

const formatAsDayMonthYear = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const normalizeMessages = (messages = {}) => {
  return Object.fromEntries(
    Object.entries(messages).map(([key, message]) => [
      key,
      {
        ...message,
        displayTime: formatMessageTimestamp(message.createdAt),
      },
    ])
  );
};

const getLastMessage = (messages = []) => {
  if (!messages.length) {
    return null;
  }

  const [latest] = [...messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return latest;
};

const normalizedChats = chats.map((chat) => {
  const normalizedMessages = normalizeMessages(chat.messages);
  const lastMessage =
    getLastMessage(Object.values(normalizedMessages)) ||
    (chat.lastMessage
      ? {
          ...chat.lastMessage,
          displayTime: formatMessageTimestamp(chat.lastMessage.createdAt),
        }
      : null);

  return {
    ...chat,
    messages: normalizedMessages,
    lastMessage,
  };
});

const [filteredChats, setFilteredChats] = useState(normalizedChats);

  return (

    <div className="sidebar">
      <SearchChats chats={normalizedChats} onFilter={setFilteredChats} />
      {filteredChats.map(chat => (
        <ChatListItem
          key={chat._id}
          chat={chat}
        />
      ))}
    </div>
  );
}
