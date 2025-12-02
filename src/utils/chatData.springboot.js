/**
 * Spring Boot Compatible Chat Dataset
 * 
 * This dataset is structured to match Spring Boot WebSocket/STOMP backend DTOs:
 * - chatId instead of _id
 * - messageId instead of id
 * - timestamp instead of createdAt
 * - status instead of messageState
 * - senderId with actual user IDs (currentUserId or other user ID)
 * - Uniform status values: "sent", "received", "read"
 * - Fully JSON serializable
 */

import image from "../assets/react.svg";
import myImg from "../assets/me.png";
import vite from "../assets/vite.svg";

// Current user ID - this would typically come from authentication
export const CURRENT_USER_ID = "currentUser";

/**
 * Message Status Constants
 * Matches Spring Boot backend enum values
 */
export const MESSAGE_STATUS = {
    SENT: "sent",
    RECEIVED: "received",
    READ: "read"
};

/**
 * User Status Constants
 */
export const USER_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    AWAY: "away"
};

/**
 * Initial Chats Dataset - Spring Boot Compatible
 * 
 * Structure matches backend DTOs:
 * - ChatDTO: { chatId, participants, messages, createdAt, updatedAt }
 * - MessageDTO: { messageId, chatId, senderId, recipientId, content, timestamp, status }
 * - UserDTO: { userId, username, status, avatarUrl }
 */
export const initialChats = [
    {
        chatId: "chat-1",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u1", username: "Younes", status: USER_STATUS.ONLINE, avatarUrl: myImg }
        ],
        messages: [
            {
                messageId: "msg-1-1",
                chatId: "chat-1",
                senderId: CURRENT_USER_ID,
                recipientId: "u1",
                content: "Hey Younes! How are you doing?",
                timestamp: "2025-10-16T14:30:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-1-2",
                chatId: "chat-1",
                senderId: "u1",
                recipientId: CURRENT_USER_ID,
                content: "I'm doing great! Thanks for asking.",
                timestamp: "2025-10-17T14:35:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-1-3",
                chatId: "chat-1",
                senderId: CURRENT_USER_ID,
                recipientId: "u1",
                content: "That's awesome! Want to grab coffee later?",
                timestamp: "2025-10-17T17:55:15Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-1-4",
                chatId: "chat-1",
                senderId: "u1",
                recipientId: CURRENT_USER_ID,
                content: "Sure! What time works for you?",
                timestamp: "2025-11-16T22:30:00Z",
                status: MESSAGE_STATUS.RECEIVED
            }
        ],
        createdAt: "2025-10-16T14:30:00Z",
        updatedAt: "2025-11-16T22:30:00Z"
    },
    {
        chatId: "chat-2",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u2", username: "Youssef", status: USER_STATUS.ONLINE, avatarUrl: image }
        ],
        messages: [
            {
                messageId: "msg-2-1",
                chatId: "chat-2",
                senderId: "u2",
                recipientId: CURRENT_USER_ID,
                content: "Did you finish the project?",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-2-2",
                chatId: "chat-2",
                senderId: CURRENT_USER_ID,
                recipientId: "u2",
                content: "Yes, just submitted it!",
                timestamp: "2025-10-17T14:40:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-2-3",
                chatId: "chat-2",
                senderId: "u2",
                recipientId: CURRENT_USER_ID,
                content: "Great job! Let me know if you need any help.",
                timestamp: "2025-11-12T15:33:45Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-2-4",
                chatId: "chat-2",
                senderId: "u2",
                recipientId: CURRENT_USER_ID,
                content: "Are you free this weekend?",
                timestamp: "2025-11-18T11:41:00Z",
                status: MESSAGE_STATUS.RECEIVED
            }
        ],
        createdAt: "2025-10-17T14:40:00Z",
        updatedAt: "2025-11-18T11:41:00Z"
    },
    {
        chatId: "chat-3",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u3", username: "Salim", status: USER_STATUS.OFFLINE, avatarUrl: vite }
        ],
        messages: [
            {
                messageId: "msg-3-1",
                chatId: "chat-3",
                senderId: CURRENT_USER_ID,
                recipientId: "u3",
                content: "Hey Salim, long time no see!",
                timestamp: "2025-11-01T14:30:00Z",
                status: MESSAGE_STATUS.SENT
            },
            {
                messageId: "msg-3-2",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Yeah! Been busy with work.",
                timestamp: "2025-11-05T18:15:50Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-3-3",
                chatId: "chat-3",
                senderId: CURRENT_USER_ID,
                recipientId: "u3",
                content: "I understand. Let's catch up soon!",
                timestamp: "2025-11-12T15:01:02Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-3-4",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Definitely! I'll let you know when I'm free.",
                timestamp: "2025-11-17T13:50:00Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-5",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "How about next week?",
                timestamp: "2025-11-17T13:50:05Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-6",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Tuesday works for me.",
                timestamp: "2025-11-17T13:50:10Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-7",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "What do you think?",
                timestamp: "2025-11-17T13:50:15Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-8",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Let me know!",
                timestamp: "2025-11-17T13:50:20Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-9",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "I'm waiting for your response.",
                timestamp: "2025-11-17T13:50:25Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-10",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Hello?",
                timestamp: "2025-11-17T13:50:30Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-3-11",
                chatId: "chat-3",
                senderId: "u3",
                recipientId: CURRENT_USER_ID,
                content: "Are you there?",
                timestamp: "2025-11-17T13:50:35Z",
                status: MESSAGE_STATUS.RECEIVED
            }
        ],
        createdAt: "2025-11-01T14:30:00Z",
        updatedAt: "2025-11-17T13:50:35Z"
    },
    {
        chatId: "chat-4",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u4", username: "Yassine", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-4-1",
                chatId: "chat-4",
                senderId: "u4",
                recipientId: CURRENT_USER_ID,
                content: "Can you help me with the assignment?",
                timestamp: "2025-11-10T14:22:22Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-4-2",
                chatId: "chat-4",
                senderId: CURRENT_USER_ID,
                recipientId: "u4",
                content: "Of course! What do you need help with?",
                timestamp: "2025-11-11T14:25:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-4-3",
                chatId: "chat-4",
                senderId: "u4",
                recipientId: CURRENT_USER_ID,
                content: "I'm stuck on question 3.",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-4-4",
                chatId: "chat-4",
                senderId: CURRENT_USER_ID,
                recipientId: "u4",
                content: "Let me take a look and get back to you.",
                timestamp: "2025-11-17T14:30:05Z",
                status: MESSAGE_STATUS.SENT
            }
        ],
        createdAt: "2025-11-10T14:22:22Z",
        updatedAt: "2025-11-17T14:30:05Z"
    },
    {
        chatId: "chat-5",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u5", username: "Said", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-5-1",
                chatId: "chat-5",
                senderId: CURRENT_USER_ID,
                recipientId: "u5",
                content: "Happy birthday, Said!",
                timestamp: "2025-09-28T22:33:00Z",
                status: MESSAGE_STATUS.SENT
            },
            {
                messageId: "msg-5-2",
                chatId: "chat-5",
                senderId: "u5",
                recipientId: CURRENT_USER_ID,
                content: "Thank you so much!",
                timestamp: "2025-10-01T14:44:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-5-3",
                chatId: "chat-5",
                senderId: "u5",
                recipientId: CURRENT_USER_ID,
                content: "Want to join the celebration?",
                timestamp: "2025-10-03T08:10:00Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-5-4",
                chatId: "chat-5",
                senderId: CURRENT_USER_ID,
                recipientId: "u5",
                content: "I'd love to! When and where?",
                timestamp: "2025-10-17T15:30:00Z",
                status: MESSAGE_STATUS.READ
            }
        ],
        createdAt: "2025-09-28T22:33:00Z",
        updatedAt: "2025-10-17T15:30:00Z"
    },
    {
        chatId: "chat-6",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u6", username: "Hassane", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-6-1",
                chatId: "chat-6",
                senderId: "u6",
                recipientId: CURRENT_USER_ID,
                content: "Did you see the game last night?",
                timestamp: "2025-11-10T14:25:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-6-2",
                chatId: "chat-6",
                senderId: CURRENT_USER_ID,
                recipientId: "u6",
                content: "Yes! It was incredible!",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-6-3",
                chatId: "chat-6",
                senderId: "u6",
                recipientId: CURRENT_USER_ID,
                content: "That last-minute goal was amazing!",
                timestamp: "2025-11-17T14:30:05Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-6-4",
                chatId: "chat-6",
                senderId: CURRENT_USER_ID,
                recipientId: "u6",
                content: "I couldn't believe it! Best game this season.",
                timestamp: "2025-11-17T14:30:10Z",
                status: MESSAGE_STATUS.SENT
            }
        ],
        createdAt: "2025-11-10T14:25:00Z",
        updatedAt: "2025-11-17T14:30:10Z"
    },
    {
        chatId: "chat-7",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u7", username: "Mohammed", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-7-1",
                chatId: "chat-7",
                senderId: CURRENT_USER_ID,
                recipientId: "u7",
                content: "Mohammed, can we reschedule our meeting?",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-7-2",
                chatId: "chat-7",
                senderId: "u7",
                recipientId: CURRENT_USER_ID,
                content: "Sure, when works for you?",
                timestamp: "2025-11-17T14:30:05Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-7-3",
                chatId: "chat-7",
                senderId: CURRENT_USER_ID,
                recipientId: "u7",
                content: "How about Friday at 3 PM?",
                timestamp: "2025-11-17T14:30:10Z",
                status: MESSAGE_STATUS.SENT
            },
            {
                messageId: "msg-7-4",
                chatId: "chat-7",
                senderId: "u7",
                recipientId: CURRENT_USER_ID,
                content: "Perfect! See you then.",
                timestamp: "2025-11-17T14:30:15Z",
                status: MESSAGE_STATUS.RECEIVED
            }
        ],
        createdAt: "2025-11-17T14:30:00Z",
        updatedAt: "2025-11-17T14:30:15Z"
    },
    {
        chatId: "chat-8",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u8", username: "Amin", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-8-1",
                chatId: "chat-8",
                senderId: "u8",
                recipientId: CURRENT_USER_ID,
                content: "Check out this new restaurant!",
                timestamp: "2025-11-17T23:32:00Z",
                status: MESSAGE_STATUS.RECEIVED
            },
            {
                messageId: "msg-8-2",
                chatId: "chat-8",
                senderId: CURRENT_USER_ID,
                recipientId: "u8",
                content: "Looks amazing! We should go there.",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-8-3",
                chatId: "chat-8",
                senderId: "u8",
                recipientId: CURRENT_USER_ID,
                content: "I already made a reservation for Saturday!",
                timestamp: "2025-11-17T14:30:05Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-8-4",
                chatId: "chat-8",
                senderId: CURRENT_USER_ID,
                recipientId: "u8",
                content: "Great! Can't wait!",
                timestamp: "2025-11-17T14:30:10Z",
                status: MESSAGE_STATUS.SENT
            }
        ],
        createdAt: "2025-11-17T14:30:00Z",
        updatedAt: "2025-11-17T14:30:10Z"
    },
    {
        chatId: "chat-9",
        participants: [
            { userId: CURRENT_USER_ID, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            { userId: "u9", username: "Karime", status: USER_STATUS.OFFLINE, avatarUrl: null }
        ],
        messages: [
            {
                messageId: "msg-9-1",
                chatId: "chat-9",
                senderId: CURRENT_USER_ID,
                recipientId: "u9",
                content: "Karime, do you have the notes from yesterday?",
                timestamp: "2025-11-17T14:30:00Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-9-2",
                chatId: "chat-9",
                senderId: "u9",
                recipientId: CURRENT_USER_ID,
                content: "Yes, I'll send them to you.",
                timestamp: "2025-11-17T14:30:05Z",
                status: MESSAGE_STATUS.READ
            },
            {
                messageId: "msg-9-3",
                chatId: "chat-9",
                senderId: CURRENT_USER_ID,
                recipientId: "u9",
                content: "Thanks! I really appreciate it.",
                timestamp: "2025-11-17T14:30:10Z",
                status: MESSAGE_STATUS.SENT
            },
            {
                messageId: "msg-9-4",
                chatId: "chat-9",
                senderId: "u9",
                recipientId: CURRENT_USER_ID,
                content: "No problem! Just sent them via email.",
                timestamp: "2025-11-17T14:30:15Z",
                status: MESSAGE_STATUS.RECEIVED
            }
        ],
        createdAt: "2025-11-17T14:30:00Z",
        updatedAt: "2025-11-17T14:30:15Z"
    }
];

/**
 * Helper function to convert Spring Boot format to legacy format
 * Use this if you need backward compatibility with existing components
 */
export function convertToLegacyFormat(springBootChats) {
    return springBootChats.map(chat => {
        // Get the other participant (not current user)
        const otherParticipant = chat.participants.find(p => p.userId !== CURRENT_USER_ID);

        return {
            _id: chat.chatId,
            user: {
                id: otherParticipant.userId,
                name: otherParticipant.username,
                status: otherParticipant.status,
                avatarUrl: otherParticipant.avatarUrl
            },
            messages: chat.messages.map(msg => ({
                id: msg.messageId,
                sender: msg.senderId === CURRENT_USER_ID ? "current-user" : "other-user",
                text: msg.content,
                createdAt: msg.timestamp,
                messageState: msg.status === MESSAGE_STATUS.READ ? "read" :
                    msg.status === MESSAGE_STATUS.RECEIVED ? "received" : "sent",
                readedByUser: msg.status === MESSAGE_STATUS.READ ? "yes" : "no",
                readedByMe: msg.senderId !== CURRENT_USER_ID && msg.status === MESSAGE_STATUS.READ ? "yes" : "no"
            }))
        };
    });
}

/**
 * Helper function to convert legacy format to Spring Boot format
 * Use this when sending data to the backend
 */
export function convertToSpringBootFormat(legacyChats, currentUserId = CURRENT_USER_ID) {
    return legacyChats.map(chat => ({
        chatId: String(chat._id),
        participants: [
            { userId: currentUserId, username: "Me", status: USER_STATUS.ONLINE, avatarUrl: null },
            {
                userId: chat.user.id,
                username: chat.user.name,
                status: chat.user.status || USER_STATUS.OFFLINE,
                avatarUrl: chat.user.avatarUrl
            }
        ],
        messages: chat.messages.map(msg => ({
            messageId: msg.id,
            chatId: String(chat._id),
            senderId: msg.sender === "current-user" || msg.sender === "CURRENT_USER" ? currentUserId : chat.user.id,
            recipientId: msg.sender === "current-user" || msg.sender === "CURRENT_USER" ? chat.user.id : currentUserId,
            content: msg.text,
            timestamp: msg.createdAt,
            status: msg.messageState === "read" || msg.readedByUser === "yes" || msg.readedByMe === "yes"
                ? MESSAGE_STATUS.READ
                : msg.messageState === "received" || msg.messageState === "recieved"
                    ? MESSAGE_STATUS.RECEIVED
                    : MESSAGE_STATUS.SENT
        })),
        createdAt: chat.messages[0]?.createdAt || new Date().toISOString(),
        updatedAt: chat.messages[chat.messages.length - 1]?.createdAt || new Date().toISOString()
    }));
}

export default initialChats;
