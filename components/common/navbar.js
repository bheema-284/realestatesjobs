"use client";

import { useState, useContext, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, BellIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import AnimatedBorderLoader from "./animatedbutton";
import JobPostingModal from "../createjob";
import RootContext from "@/components/config/rootcontext";
import NotificationDropdown from "./notificationdropdown";

// Separate notification state management - COMPLETELY ISOLATED
const useNotificationSystem = () => {
    const [notifications, setNotifications] = useState({
        items: [],
        unreadCount: 0,
        lastChecked: null
    });

    return { notifications, setNotifications };
};

export const Navbar = ({ rootContext, showLoader, logOut }) => {
    const { setRootContext } = useContext(RootContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const role = rootContext?.user?.role;
    const authenticated = rootContext?.authenticated || false;

    // Use isolated notification state - NO GLOBAL STATE UPDATES
    const { notifications: localNotifications, setNotifications: setLocalNotifications } = useNotificationSystem();

    // Refs for polling - COMPLETELY ISOLATED FROM OTHER COMPONENTS
    const pollingRef = useRef(null);
    const lastPollTimeRef = useRef(0);
    const readChatsRef = useRef(new Set());
    const isProcessingRef = useRef(false);
    const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes - much longer interval

    // Stable user data stored in refs to prevent re-renders
    const stableUserId = useRef(rootContext?.user?.id);
    const stableUserRole = useRef(rootContext?.user?.role);
    const stableAuthenticated = useRef(authenticated);

    useEffect(() => {
        stableUserId.current = rootContext?.user?.id;
        stableUserRole.current = rootContext?.user?.role;
        stableAuthenticated.current = authenticated;
    }, [rootContext?.user?.id, rootContext?.user?.role, authenticated]);

    // Sidebar items based on roles
    const getSidebarItems = () => {
        const baseItems = [
            { label: "Dashboard", link: "/dashboard", roles: ["superadmin", "company", "recruiter"] },
            { label: "Applications", link: "/applications", roles: ["superadmin", "company", "recruiter"] },
            { label: "Candidates", link: "/candidates", roles: ["superadmin", "company", "recruiter"] },
            { label: "Tasks", link: "/tasks", roles: ["superadmin", "company", "recruiter"] },
            { label: "Calendar", link: "/calendar", roles: ["superadmin", "company", "recruiter"] },
            { label: "Analytics", link: "/analytics", roles: ["superadmin", "company", "recruiter"] },
            { label: "Settings", link: "/settings", roles: ["superadmin", "company", "recruiter", "applicant"] },
        ];

        const roleSpecificItems = [
            {
                label: "Profile",
                link: `/details/${rootContext?.user?.id || 1}/${rootContext?.user?.name || ""}`,
                roles: ["superadmin", "company"]
            },
            {
                label: "Add Projects",
                link: "/projects",
                roles: ["superadmin", "company"]
            },
            {
                label: "Add Recruiters",
                link: "/recruiters",
                roles: ["superadmin", "company"]
            },
        ];

        return [...baseItems, ...roleSpecificItems].filter(item =>
            item.roles.includes(role)
        );
    };

    const sidebarItems = getSidebarItems();
    const jobSeekerProfileLink = `/details/${rootContext?.user?.id || 1}/${rootContext?.user?.name || ""}`;

    const linkClasses = (href) => {
        const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

        return `relative flex items-center h-full px-2 font-medium transition ${isActive
            ? "text-purple-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-purple-600"
            : "text-gray-700 hover:text-purple-600"
            }`;
    };

    // COMPLETELY ISOLATED mark chat as read function - NO GLOBAL STATE UPDATES
    const markChatAsRead = useCallback(async (chatId, applicantId, companyId, jobId) => {
        if (!stableAuthenticated.current || !stableUserId.current || !stableUserRole.current) return;

        const chatKey = chatId || `${applicantId}-${companyId}-${jobId}`;

        if (readChatsRef.current.has(chatKey)) {
            return;
        }

        try {
            readChatsRef.current.add(chatKey);

            const response = await fetch('/api/chat/mark-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId,
                    applicantId,
                    companyId,
                    jobId,
                    userId: stableUserId.current,
                    userType: stableUserRole.current
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Chat marked as read successfully');

                // Update LOCAL state only - NO GLOBAL STATE
                setLocalNotifications(prev => {
                    const currentItems = prev.items || [];
                    const updatedItems = currentItems.filter(item =>
                        !(item.chatId === chatId ||
                            (item.applicantId === applicantId &&
                                item.companyId === companyId &&
                                item.jobId === jobId))
                    );

                    const removedCount = currentItems.length - updatedItems.length;
                    const currentUnreadCount = prev.unreadCount || 0;
                    const newUnreadCount = Math.max(0, currentUnreadCount - removedCount);

                    if (removedCount === 0 && currentUnreadCount === newUnreadCount) {
                        return prev;
                    }

                    return {
                        ...prev,
                        items: updatedItems,
                        unreadCount: newUnreadCount
                    };
                });
            } else {
                console.error('❌ Failed to mark chat as read:', result.error);
                readChatsRef.current.delete(chatKey);
            }
        } catch (error) {
            console.error('❌ Error marking chat as read:', error);
            readChatsRef.current.delete(chatKey);
        }
    }, []); // Empty dependencies - completely isolated

    // Stable notification click handler
    const handleNotificationClick = useCallback((notification) => {
        console.log('🔔 Notification clicked:', notification);

        // Mark chat as read when notification is clicked
        if (notification.chatId || (notification.applicantId && notification.companyId && notification.jobId)) {
            markChatAsRead(
                notification.chatId,
                notification.applicantId,
                notification.companyId,
                notification.jobId
            );
        }

        // Navigate based on user role
        if (stableUserRole.current === 'company') {
            router.push('/applications');
        } else if (stableUserRole.current === 'applicant') {
            router.push('/jobs');
        }

        setNotificationsOpen(false);
    }, [router, markChatAsRead]);

    // ULTRA-OPTIMIZED message polling - MINIMAL IMPACT ON OTHER COMPONENTS
    const checkForNewMessages = useCallback(async () => {
        // Prevent any concurrent processing
        if (isProcessingRef.current) {
            return;
        }

        // Very aggressive throttling
        const now = Date.now();
        if (now - lastPollTimeRef.current < 60000) { // 1 minute minimum between polls
            return;
        }

        if (!stableAuthenticated.current || !stableUserId.current || !stableUserRole.current) return;

        try {
            isProcessingRef.current = true;
            lastPollTimeRef.current = now;

            const response = await fetch(`/api/chat/read?userId=${stableUserId.current}&userType=${stableUserRole.current}&timestamp=${now}`);
            const result = await response.json();

            if (result.success) {
                const unreadChats = result.unreadChats || [];
                const totalUnreadCount = result.unreadCount || 0;

                // Filter out already read chats
                const newUnreadChats = unreadChats.filter(chat =>
                    !readChatsRef.current.has(chat.chatId) &&
                    !readChatsRef.current.has(`${chat.applicantId}-${chat.companyId}-${chat.jobId}`)
                );

                if (newUnreadChats.length > 0 || totalUnreadCount !== localNotifications.unreadCount) {
                    console.log('🔔 New unread chats found:', newUnreadChats.length);

                    // Update LOCAL state only - NO GLOBAL STATE
                    setLocalNotifications(prev => {
                        const existingItems = prev.items || [];

                        // Create new notifications
                        const newNotifications = newUnreadChats.map(chat => {
                            const otherUserName = stableUserRole.current === 'company' ? 'Candidate' : 'Company';
                            const latestMessage = chat.messages && chat.messages.length > 0
                                ? chat.messages[chat.messages.length - 1]
                                : chat.lastMessage;

                            return {
                                id: `${chat.chatId}-${Date.now()}-${Math.random()}`,
                                type: 'chat',
                                title: otherUserName,
                                message: latestMessage?.content || 'New message',
                                timestamp: latestMessage?.timestamp || new Date().toISOString(),
                                read: false,
                                meta: chat.jobTitle,
                                chatId: chat.chatId,
                                applicantId: chat.applicantId,
                                companyId: chat.companyId,
                                jobId: chat.jobId,
                                unreadCount: chat.unreadCount,
                                onClick: () => handleNotificationClick({
                                    chatId: chat.chatId,
                                    applicantId: chat.applicantId,
                                    companyId: chat.companyId,
                                    jobId: chat.jobId
                                })
                            };
                        });

                        // Filter out duplicates
                        const uniqueNewNotifications = newNotifications.filter(newNotif =>
                            !existingItems.some(existingNotif =>
                                existingNotif.chatId === newNotif.chatId &&
                                existingNotif.message === newNotif.message
                            )
                        );

                        const updatedItems = [...uniqueNewNotifications, ...existingItems].slice(0, 20);

                        // Only update if something actually changed
                        if (updatedItems.length === existingItems.length &&
                            prev.unreadCount === totalUnreadCount) {
                            return prev;
                        }

                        return {
                            items: updatedItems,
                            unreadCount: totalUnreadCount,
                            lastChecked: new Date().toISOString()
                        };
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error checking for new messages:', error);
        } finally {
            isProcessingRef.current = false;
        }
    }, [localNotifications.unreadCount, handleNotificationClick]);

    // MINIMAL polling setup - ONLY RUNS WHEN ABSOLUTELY NECESSARY
    useEffect(() => {
        if (!stableAuthenticated.current) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        // Only poll when page is visible AND user is active
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (pollingRef.current) {
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                }
            } else {
                // Wait a bit before starting polling on visibility change
                setTimeout(() => {
                    if (!pollingRef.current && !document.hidden) {
                        pollingRef.current = setInterval(() => {
                            checkForNewMessages();
                        }, POLLING_INTERVAL);
                    }
                }, 5000); // 5 second delay after becoming visible
            }
        };

        // Initial check after a long delay
        const timeoutId = setTimeout(() => {
            if (!document.hidden) {
                checkForNewMessages();
            }
        }, 10000); // 10 second delay for initial check

        // Only start polling if page is visible
        if (!document.hidden) {
            pollingRef.current = setInterval(() => {
                checkForNewMessages();
            }, POLLING_INTERVAL);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(timeoutId);
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [stableAuthenticated.current, checkForNewMessages, POLLING_INTERVAL]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, []);

    const NotificationBell = () => {
        const unreadCount = localNotifications.unreadCount || 0;

        const handleBellClick = () => {
            setNotificationsOpen(!notificationsOpen);
        };

        return (
            <div className="relative">
                <button
                    onClick={handleBellClick}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </div>
        );
    };

    // Local notification functions - NO GLOBAL STATE
    const removeNotification = useCallback((notificationId) => {
        setLocalNotifications(prev => {
            const currentItems = prev.items || [];
            const notification = currentItems.find(n => n.id === notificationId);
            const newItems = currentItems.filter(n => n.id !== notificationId);

            const currentUnreadCount = prev.unreadCount || 0;
            const newUnreadCount = notification && !notification.read
                ? Math.max(0, currentUnreadCount - (notification.unreadCount || 1))
                : currentUnreadCount;

            if (newItems.length === currentItems.length && currentUnreadCount === newUnreadCount) {
                return prev;
            }

            return {
                ...prev,
                items: newItems,
                unreadCount: newUnreadCount
            };
        });
    }, []);

    const markNotificationAsRead = useCallback((notificationId) => {
        setLocalNotifications(prev => {
            const currentItems = prev.items || [];
            const notification = currentItems.find(n => n.id === notificationId);

            if (!notification || notification.read) return prev;

            // Mark chat as read
            if (notification.chatId || (notification.applicantId && notification.companyId && notification.jobId)) {
                markChatAsRead(
                    notification.chatId,
                    notification.applicantId,
                    notification.companyId,
                    notification.jobId
                );
            }

            const newItems = currentItems.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            );

            const currentUnreadCount = prev.unreadCount || 0;
            const newUnreadCount = Math.max(0, currentUnreadCount - (notification.unreadCount || 1));

            return {
                ...prev,
                items: newItems,
                unreadCount: newUnreadCount
            };
        });
    }, [markChatAsRead]);

    const markAllNotificationsAsRead = useCallback(() => {
        setLocalNotifications(prev => {
            const currentItems = prev.items || [];

            // Mark all chat notifications as read
            currentItems.forEach(notification => {
                if (!notification.read && (notification.chatId || (notification.applicantId && notification.companyId && notification.jobId))) {
                    markChatAsRead(
                        notification.chatId,
                        notification.applicantId,
                        notification.companyId,
                        notification.jobId
                    );
                }
            });

            return {
                ...prev,
                items: currentItems.map(n => ({ ...n, read: true })),
                unreadCount: 0
            };
        });
    }, [markChatAsRead]);

    const clearAllNotifications = useCallback(() => {
        setLocalNotifications({
            items: [],
            unreadCount: 0,
            lastChecked: new Date().toISOString()
        });
    }, []);

    // Check if user can post jobs
    const canPostJobs = ["superadmin", "company", "recruiter"].includes(role);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-4 sm:px-6 z-50">
            <div className="flex h-20 sm:h-20 items-center justify-between gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center"
                    prefetch={true}
                >
                    <Image
                        src="/logo.webp"
                        alt="logo"
                        width={150}
                        height={10}
                        priority
                        className="object-cover"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-4 h-full flex-1 justify-end">
                    <Link
                        href="/"
                        className={linkClasses("/")}
                        prefetch={true}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={linkClasses("/about")}
                        prefetch={true}
                    >
                        About Us
                    </Link>
                    {(role !== "recruiter" && role !== "company" && role !== "superadmin" || !authenticated) && (
                        <Link
                            href="/companies"
                            className={linkClasses("/companies")}
                            prefetch={true}
                        >
                            Companies
                        </Link>
                    )}
                    {(role !== "recruiter" && role !== "company" && role !== "superadmin" || !authenticated) && (
                        <Link
                            href="/jobs"
                            className={linkClasses("/jobs")}
                            prefetch={true}
                        >
                            Jobs
                        </Link>
                    )}

                    {authenticated ? (
                        <>
                            {canPostJobs && pathname !== "/applications" && (
                                <div>
                                    {showLoader ? (
                                        <AnimatedBorderLoader title={"POST NEW JOB"} />
                                    ) : (
                                        <button
                                            onClick={() => setIsOpen(!isOpen)}
                                            className="bg-gray-900 border-1.5 border-gray-900 text-white px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap ml-4"
                                        >
                                            POST NEW JOB
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Notification Bell - USES LOCAL STATE ONLY */}
                            <NotificationBell />

                            {/* Notification Dropdown - USES LOCAL STATE ONLY */}
                            {notificationsOpen && (
                                <NotificationDropdown
                                    notifications={localNotifications.items || []}
                                    unreadCount={localNotifications.unreadCount || 0}
                                    onCloseNotification={removeNotification}
                                    onMarkAsRead={markNotificationAsRead}
                                    onMarkAllAsRead={markAllNotificationsAsRead}
                                    onClearAll={clearAllNotifications}
                                    onCloseDropdown={() => setNotificationsOpen(false)}
                                    onNotificationClick={handleNotificationClick}
                                />
                            )}

                            {/* User Dropdown */}
                            <Menu as="div" className="relative no-focus-outline z-[99999]">
                                <Menu.Button className="flex items-center gap-1 cursor-pointer">
                                    <div className="sm:hidden w-6 h-6 rounded-full bg-indigo-900 text-white flex items-center justify-center font-semibold">
                                        {(rootContext?.user?.name || "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col capitalize">
                                        <p className="font-semibold flex items-center">
                                            {rootContext?.user?.name || "User"}
                                            <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden sm:block" />
                                        </p>
                                        <p className="text-gray-500 text-xs text-right">
                                            {role || "role"}
                                        </p>
                                    </div>
                                </Menu.Button>

                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute no-focus-outline top-full right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-[99999999] focus:outline-none">
                                        {/* Dashboard/Profile based on role */}
                                        {["superadmin", "company", "recruiter"].includes(role) ? (
                                            <>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => router.push(`/dashboard`)}
                                                            className={`${active ? "bg-gray-100" : ""
                                                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                        >
                                                            Dashboard
                                                        </button>
                                                    )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => router.push(jobSeekerProfileLink)}
                                                            className={`${active ? "bg-gray-100" : ""
                                                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                        >
                                                            Profile
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </>
                                        ) : (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            router.push(jobSeekerProfileLink)
                                                        }
                                                        className={`${active ? "bg-gray-100" : ""
                                                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Profile
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={logOut}
                                                    className={`${active ? "bg-gray-100" : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-purple-600"
                            prefetch={true}
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="sm:hidden text-gray-700 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="sm:hidden flex flex-col items-start px-6 pb-4 gap-3 bg-white shadow-md">
                    {/* Public Links */}
                    <Link
                        href="/"
                        className={linkClasses("/")}
                        onClick={() => setMenuOpen(false)}
                        prefetch={true}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={linkClasses("/about")}
                        onClick={() => setMenuOpen(false)}
                        prefetch={true}
                    >
                        About Us
                    </Link>
                    {/* Conditional Public Links */}
                    {(role !== "recruiter" && role !== "company" && role !== "superadmin" || !authenticated) && (
                        <>
                            <Link
                                href="/companies"
                                className={linkClasses("/companies")}
                                onClick={() => setMenuOpen(false)}
                                prefetch={true}
                            >
                                Companies
                            </Link>
                            <Link
                                href="/jobs"
                                className={linkClasses("/jobs")}
                                onClick={() => setMenuOpen(false)}
                                prefetch={true}
                            >
                                Jobs
                            </Link>
                        </>
                    )}

                    {/* Authenticated Links (All roles) */}
                    {authenticated && (
                        <Link
                            href="/services"
                            className={linkClasses("/services")}
                            onClick={() => setMenuOpen(false)}
                            prefetch={true}
                        >
                            Premium Services
                        </Link>
                    )}

                    {/* Role-specific Mobile Links */}
                    {authenticated && (
                        <>
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.link}
                                    href={item.link}
                                    className={linkClasses(item.link)}
                                    onClick={() => setMenuOpen(false)}
                                    prefetch={true}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Post Job Button for allowed roles */}
                            {canPostJobs && (
                                <button
                                    onClick={() => { setIsOpen(true); setMenuOpen(false); }}
                                    className="w-full px-4 py-2 rounded-lg text-center bg-gray-900 border-1.5 border-gray-900 text-white hover:bg-gray-700 mt-2"
                                >
                                    POST NEW JOB
                                </button>
                            )}
                        </>
                    )}

                    {/* Job Seeker Profile Link */}
                    {authenticated && role === "applicant" && (
                        <Link
                            href={jobSeekerProfileLink}
                            className={linkClasses(jobSeekerProfileLink)}
                            onClick={() => setMenuOpen(false)}
                            prefetch={true}
                        >
                            Profile
                        </Link>
                    )}

                    {/* Login/Logout Button */}
                    {!authenticated ? (
                        <Link
                            href="/login"
                            className="w-full px-4 py-2 rounded-lg text-center bg-indigo-600 text-white hover:bg-purple-600 mt-2"
                            onClick={() => setMenuOpen(false)}
                            prefetch={true}
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={logOut}
                            className="w-full px-4 py-2 rounded-lg text-center bg-gray-200 text-gray-700 hover:bg-gray-300 mt-2"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}

            {authenticated && isOpen && (
                <JobPostingModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title="Post New Job"
                    mode="create"
                    userProfile={rootContext?.user}
                />
            )}
        </nav>
    );
};