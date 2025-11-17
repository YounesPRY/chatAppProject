import ChatListItem from "./ChatListItem"; // adjust path if needed
import image from "../../assets/react.svg";
import myImg from "../../assets/me.jpeg";
import SearchChats from "./SearchChats";
import { useState } from "react";

export default function Sidebar() {


// fake data , just for frontent tesing , i will add rel msgs from  backend later 
const chats = [
    {
    _id:1,
    name : "Younes",
    avatarUrl: myImg,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:1
    },
    {
    _id:2,
    name : "Youssef",
    avatarUrl: image,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:2
    },
    {
    _id:3,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:4,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:5,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"Ok" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:6,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:7,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    },{
    _id:8,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    }, {
    _id:9,
    name : "Ali",
    avatarUrl: null,
    lastMessage :{text:"lest go for it tomorrow" , createdAt:"2025/04/11"},
    unreadCount:0
    }
];

const [filteredChats , setFilteredChats] = useState(chats);


  return (

    <div className="sidebar">
      <SearchChats chats={chats} onFilter={setFilteredChats} />
      {filteredChats.map(chat => (
        <ChatListItem
          key={chat._id}
          chat={chat}
        />
      ))}
    </div>
  );
}
