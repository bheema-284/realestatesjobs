// utils/notificationUtils.js

// Generate truly unique IDs for notifications
export const generateUniqueNotificationId = (chat) => {
    const chatId = chat.chatId?.$oid || chat.chatId;
    const timestamp = chat.lastUpdated || new Date().toISOString();
    const randomSuffix = Math.random().toString(36).substr(2, 9);
    return `chat-${chatId}-${timestamp}-${randomSuffix}`.replace(/[^a-zA-Z0-9-_]/g, '');
};

// Alternative: Simple counter-based ID (guaranteed unique)
let notificationCounter = 0;
export const generateSimpleUniqueId = (chat) => {
    notificationCounter++;
    const chatId = chat.chatId?.$oid || chat.chatId;
    return `chat-${chatId}-${Date.now()}-${notificationCounter}`;
};