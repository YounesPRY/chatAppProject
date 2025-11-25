import { MESSAGE_SENDER } from "./chatHelpers";
import image from "../assets/react.svg";
import myImg from "../assets/me.png";
import vite from "../assets/vite.svg";

export const initialChats = [
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
      { id: "m4", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m5", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m6", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m10", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m11", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m12", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m13", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" },
      { id: "m14", sender: MESSAGE_SENDER.OTHER_USER, text: "message4", createdAt: "2025-11-17T13:50:00", messageState: "recieved", readedByMe: "no" }
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

