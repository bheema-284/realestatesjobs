'use client'
import { createContext, useState, useCallback, useEffect } from "react";
import { contextObject } from "./contextobject";

export const RootContext = createContext();

export const RootContextProvider = ({ children }) => {
    const [rootContext, setRootContext] = useState(contextObject);

    // Initialize user data from localStorage
    useEffect(() => {
        const user_details = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user_details"));
        const updatedContext = {
            ...rootContext,
            loader: false
        };

        if (user_details) {
            updatedContext.authenticated = true;
            updatedContext.user = { ...updatedContext.user, ...user_details };
        } else {
            updatedContext.authenticated = false;
        }

        setRootContext(updatedContext);
    }, []);

    // Function to mark notification as read
    const markNotificationAsRead = useCallback((notificationId) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                items: prev.notifications.items.map(item =>
                    item.id === notificationId ? { ...item, read: true } : item
                ),
                unreadCount: Math.max(0, prev.notifications.unreadCount - 1)
            }
        }));
    }, []);

    // Function to mark all notifications as read
    const markAllNotificationsAsRead = useCallback(() => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                items: prev.notifications.items.map(item => ({ ...item, read: true })),
                unreadCount: 0
            }
        }));
    }, []);

    // Function to remove notification
    const removeNotification = useCallback((notificationId) => {
        setRootContext(prev => {
            const notification = prev.notifications.items.find(n => n.id === notificationId);
            const newUnreadCount = notification && !notification.read
                ? Math.max(0, prev.notifications.unreadCount - 1)
                : prev.notifications.unreadCount;

            return {
                ...prev,
                notifications: {
                    ...prev.notifications,
                    items: prev.notifications.items.filter(n => n.id !== notificationId),
                    unreadCount: newUnreadCount
                }
            };
        });
    }, []);

    // Function to clear all notifications
    const clearAllNotifications = useCallback(() => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                items: [],
                unreadCount: 0,
                isDropdownOpen: false,
                lastChecked: new Date().toISOString(),
                isLoading: false,
                error: null
            }
        }));
    }, []);

    // Function to toggle notification dropdown
    const toggleNotificationDropdown = useCallback((isOpen) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                isDropdownOpen: isOpen !== undefined ? isOpen : !prev.notifications.isDropdownOpen
            }
        }));
    }, []);

    // Function to set notifications loading state
    const setNotificationsLoading = useCallback((isLoading) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                isLoading
            }
        }));
    }, []);

    // Function to set notifications error state
    const setNotificationsError = useCallback((error) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                error,
                isLoading: false
            }
        }));
    }, []);

    // Function to update notifications with new data
    const updateNotifications = useCallback(({ items, unreadCount }) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                items: items || prev.notifications.items,
                unreadCount: unreadCount !== undefined ? unreadCount : prev.notifications.unreadCount,
                lastChecked: new Date().toISOString(),
                isLoading: false,
                error: null
            }
        }));
    }, []);

    // Function to refresh user data
    const refreshUserData = useCallback(async () => {
        const userId = rootContext?.user?.id ||
            (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);

        if (!userId) {
            console.log('❌ No user ID found for refresh');
            return null;
        }

        try {
            setNotificationsLoading(true);

            const response = await fetch(`/api/users?id=${userId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }

            const userData = await response.json();

            // Update user data in context
            setRootContext(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    name: userData.name || prev.user.name,
                    email: userData.email || prev.user.email,
                    mobile: userData.mobile || prev.user.mobile,
                    role: userData.role || prev.user.role,
                    id: userData._id?.$oid || userData._id || userData.id || prev.user.id
                }
            }));

            setNotificationsLoading(false);
            return userData;

        } catch (error) {
            console.error('❌ Error refreshing user data:', error);
            setNotificationsError(error.message);
            return null;
        }
    }, [rootContext?.user?.id, setNotificationsLoading, setNotificationsError]);

    // Logout function
    const logOut = useCallback(() => {
        localStorage.clear();
        setRootContext({
            ...contextObject,
            authenticated: false,
            loader: false
        });
    }, []);

    const value = {
        rootContext,
        setRootContext,
        // Notification functions
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearAllNotifications,
        toggleNotificationDropdown,
        setNotificationsLoading,
        setNotificationsError,
        updateNotifications,
        refreshUserData,
        // User management functions
        logOut
    };

    return (
        <RootContext.Provider value={value}>
            {children}
        </RootContext.Provider>
    );
};

export default RootContext;