// components/common/NotificationDropdown.js
"use client";

import {
    ChatBubbleOvalLeftEllipsisIcon,
    XMarkIcon,
    CheckIcon,
    TrashIcon,
    EnvelopeIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const NotificationDropdown = ({
    notifications,
    unreadCount,
    onCloseNotification,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    onCloseDropdown,
    onNotificationClick
}) => {
    const handleNotificationClick = (notification) => {
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
        // Mark as read when clicked
        if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
    };

    const handleCloseNotification = (e, notificationId) => {
        e.stopPropagation();
        if (onCloseNotification) {
            onCloseNotification(notificationId);
        }
    };

    const handleMarkAllAsRead = (e) => {
        e.stopPropagation();
        if (onMarkAllAsRead) {
            onMarkAllAsRead();
        }
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        if (onClearAll) {
            onClearAll();
        }
    };

    // Group notifications by chat
    const groupNotificationsByChat = () => {
        const grouped = {};
        notifications.forEach(notification => {
            const chatId = notification.chatId;
            if (!grouped[chatId]) {
                grouped[chatId] = [];
            }
            grouped[chatId].push(notification);
        });
        return grouped;
    };

    const groupedNotifications = groupNotificationsByChat();

    return (
        <div className="fixed inset-0 z-40" onClick={onCloseDropdown}>
            <div
                className="absolute top-16 right-4 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-200 opacity-100 scale-100 max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Messages</h3>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600">
                                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                title="Mark all as read"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Clear all"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onCloseDropdown}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium mb-2">No messages</p>
                            <p className="text-gray-400 text-sm">New messages will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {Object.entries(groupedNotifications).map(([chatId, chatNotifications]) => {
                                const latestNotification = chatNotifications[0];
                                const unreadCountInChat = chatNotifications.filter(n => !n.read).length;

                                return (
                                    <div
                                        key={chatId}
                                        className={`p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-l-4 ${unreadCountInChat > 0 ? 'border-l-blue-500 bg-blue-25' : 'border-l-transparent'
                                            }`}
                                        onClick={() => handleNotificationClick(latestNotification)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                <UserIcon className="w-5 h-5 text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {latestNotification.title}
                                                        </p>
                                                        {unreadCountInChat > 0 && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                                {unreadCountInChat}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleCloseNotification(e, latestNotification.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <XMarkIcon className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Latest Message */}
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {latestNotification.message}
                                                </p>

                                                {/* Message List for this chat */}
                                                {chatNotifications.length > 1 && (
                                                    <div className="space-y-1 mb-2">
                                                        {chatNotifications.slice(0, 3).map((notification, index) => (
                                                            <div
                                                                key={notification.id}
                                                                className={`flex items-center gap-2 text-xs ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                <div className={`w-1.5 h-1.5 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'
                                                                    }`}></div>
                                                                <span className="line-clamp-1">
                                                                    {notification.message}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {chatNotifications.length > 3 && (
                                                            <div className="text-xs text-gray-400 pl-3">
                                                                +{chatNotifications.length - 3} more messages
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(latestNotification.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {latestNotification.meta && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                            {latestNotification.meta}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                {notifications.length} message{notifications.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500">
                                    {unreadCount} unread
                                </span>
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-[-1]"></div>
        </div>
    );
};

export default NotificationDropdown;