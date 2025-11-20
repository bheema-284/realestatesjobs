import { useEffect, useCallback, useContext } from 'react';
import RootContext from '@/components/config/rootcontext';
import { Mutated, useSWRFetch } from '../config/useswrfetch';
import { generateUniqueNotificationId } from '../lib/notificationid';

export const useNotificationService = () => {
    const {
        rootContext,
        setRootContext
    } = useContext(RootContext);

    // Get user ID
    const getUserId = useCallback(() => {
        if (rootContext?.user?.id) {
            return rootContext.user.id;
        }

        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    return parsedUser.id;
                } catch (error) {
                    console.error('Error parsing user data from localStorage:', error);
                }
            }
        }

        return null;
    }, [rootContext]);

    const userId = getUserId();

    const { data: userData, error, isLoading } = useSWRFetch(userId ? `/api/users?id=${userId}` : null);
    const mutated = Mutated(userId ? `/api/users?id=${userId}` : null);

    // Process notifications when user data changes
    useEffect(() => {
        if (!userData || !rootContext?.authenticated) {
            return;
        }

        // Extract unread messages from user data
        const unreadMessages = userData.chats?.reduce((acc, chat) => {
            const unreadChatMessages = chat.messages?.filter(message =>
                message.read === false &&
                message.senderType !== userData.role
            ) || [];

            if (unreadChatMessages.length > 0) {

                acc.push({
                    chatId: chat.chatId?.$oid || chat.chatId,
                    jobId: chat.jobId,
                    jobTitle: chat.jobTitle || 'Unknown Job',
                    applicantId: chat.applicantId?.$oid || chat.applicantId,
                    companyId: chat.companyId?.$oid || chat.companyId,
                    unreadCount: unreadChatMessages.length,
                    messages: unreadChatMessages,
                    lastMessage: chat.lastMessage,
                    lastUpdated: chat.updatedAt?.$date || chat.updatedAt
                });
            }
            return acc;
        }, []) || [];

        const totalUnreadCount = unreadMessages.reduce((total, chat) => total + chat.unreadCount, 0);

        console.log('📊 Unread messages summary:', {
            totalUnreadCount,
            chatCount: unreadMessages.length
        });

        // Create notification items with TRULY UNIQUE IDs
        const notificationItems = unreadMessages.map(chat => {
            const uniqueId = generateUniqueNotificationId(chat);
            return {
                id: uniqueId,
                type: 'chat',
                title: `New message from ${chat.lastMessage?.senderName || userData.role === "company" ? 'Applicant' : "Company"}`,
                message: chat.lastMessage?.content || `You have ${chat.unreadCount} unread message${chat.unreadCount !== 1 ? 's' : ''}`,
                timestamp: chat.lastUpdated || new Date().toISOString(),
                read: false,
                meta: chat.jobTitle,
                chatId: chat.chatId,
                applicantId: chat.applicantId,
                companyId: chat.companyId,
                jobId: chat.jobId,
                unreadCount: chat.unreadCount,
                onClick: () => {
                    console.log('Notification clicked - Chat:', chat);
                }
            };
        });

        // Log all IDs to check for duplicates
        const allIds = notificationItems.map(item => item.id);
        const uniqueIds = new Set(allIds);

        if (allIds.length !== uniqueIds.size) {
            console.error('❌ DUPLICATE IDs FOUND:', {
                total: allIds.length,
                unique: uniqueIds.size,
                duplicates: allIds.filter((id, index) => allIds.indexOf(id) !== index)
            });
        } else {
            console.log('✅ All notification IDs are unique');
        }

        // Update context with new notifications
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                items: notificationItems,
                unreadCount: totalUnreadCount,
                lastChecked: new Date().toISOString(),
                isLoading: false
            }
        }));

        console.log('✅ Notifications updated in context');

    }, [userData, rootContext?.authenticated, setRootContext]);

    // Update loading state
    useEffect(() => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                isLoading: isLoading && rootContext?.authenticated
            }
        }));
    }, [isLoading, rootContext?.authenticated, setRootContext]);

    // Update error state
    useEffect(() => {
        if (error) {
            setRootContext(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    error: error.message,
                    isLoading: false
                }
            }));
        }
    }, [error, setRootContext]);

    // Manual refresh
    const refreshNotifications = useCallback(() => {
        console.log('🔄 Manual refresh triggered');
        if (userId) {
            mutated();
        }
    }, [mutated, userId]);

    return {
        isLoading: isLoading && rootContext?.authenticated,
        error,
        refreshNotifications,
        mutated
    };
};