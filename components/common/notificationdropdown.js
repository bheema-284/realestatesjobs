// components/common/NotificationDropdown.js
"use client";

import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

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
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
    };

    const handleCloseNotification = (e, notificationId) => {
        e.stopPropagation();
        onCloseNotification(notificationId);
    };

    return (
        <div className="fixed inset-0 z-40" onClick={onCloseDropdown}>
            <div
                className="absolute top-16 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 transform transition-all duration-200 opacity-100 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                title="Mark all as read"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={onClearAll}
                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                title="Clear all"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onCloseDropdown}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${!notification.read ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={(e) => handleCloseNotification(e, notification.id)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-start gap-3 pr-6">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'chat' ? 'bg-blue-100' : 'bg-green-100'
                                            }`}>
                                            <ChatBubbleOvalLeftEllipsisIcon className={`w-5 h-5 ${notification.type === 'chat' ? 'text-blue-600' : 'text-green-600'
                                                }`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <span className="bg-blue-500 w-2 h-2 rounded-full flex-shrink-0 mt-1"></span>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(notification.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {notification.meta && (
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {notification.meta}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-500 text-center">
                            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;