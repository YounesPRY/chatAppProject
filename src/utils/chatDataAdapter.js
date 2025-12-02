/**
 * Data Adapter for Spring Boot Format
 * 
 * This adapter converts Spring Boot compatible data to the format
 * expected by existing components, ensuring backward compatibility.
 */

import {
    initialChats as springBootChats,
    CURRENT_USER_ID,
    MESSAGE_STATUS,
    convertToLegacyFormat
} from './chatData.springboot';

/**
 * Convert Spring Boot format to component-compatible format
 * This ensures existing components work without modification
 */
export function adaptSpringBootData(springBootChats) {
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
                messageState: msg.status,
                readedByUser: msg.status === MESSAGE_STATUS.READ && msg.senderId === CURRENT_USER_ID ? "yes" : "no",
                readedByMe: msg.status === MESSAGE_STATUS.READ && msg.senderId !== CURRENT_USER_ID ? "yes" : "no",
                isEdited: msg.isEdited || false
            }))
        };
    });
}

/**
 * Get initial chats in component-compatible format
 */
export const initialChats = adaptSpringBootData(springBootChats);

/**
 * Export for backward compatibility
 */
export default initialChats;
