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

export const Navbar = ({ rootContext, showLoader, logOut }) => {
    const { setRootContext } = useContext(RootContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const role = rootContext?.user?.role;
    const authenticated = rootContext?.authenticated || false;
    const pollingRef = useRef(null);

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

        // Add role-specific items
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

    // Helper function to get candidate name (for companies)
    const getCandidateName = (applicantId) => {
        // This would typically come from your API or context
        // For now, return a placeholder
        return 'Candidate';
    };

    // Helper function to get company name (for applicants)
    const getCompanyName = (companyId) => {
        // This would typically come from your API or context
        // For now, return a placeholder
        return 'Company';
    };

    // Check for new messages and update notifications
    const checkForNewMessages = useCallback(async () => {
        if (!authenticated || !rootContext?.user?.id) return;

        try {
            const userType = rootContext?.user?.role;
            const userId = rootContext?.user?.id;

            console.log('🔔 Checking for new messages for user:', userId, 'type:', userType);

            const response = await fetch(`/api/chat/read?userId=${userId}&userType=${userType}`);
            const result = await response.json();

            console.log('🔔 Chat API Response:', result);

            if (result.success) {
                const unreadChats = result.unreadChats || [];
                const totalUnreadCount = result.unreadCount || 0;
                const newNotifications = [];

                // Process unread chats and create notifications
                unreadChats.forEach((chat) => {
                    if (chat.unreadCount > 0) {
                        // Safely access existing notifications
                        const existingNotifications = rootContext?.notifications?.items || [];
                        const existingNotification = existingNotifications.find(
                            n => n.chatId === chat.chatId
                        );

                        // Only create notification if we don't have one for this chat
                        // or if there are new unread messages
                        if (!existingNotification || chat.unreadCount > 0) {
                            const otherUserName = userType === 'company'
                                ? getCandidateName(chat.applicantId)
                                : getCompanyName(chat.companyId);

                            // Use the last unread message for notification
                            const latestUnreadMessage = chat.messages && chat.messages.length > 0
                                ? chat.messages[chat.messages.length - 1]
                                : chat.lastMessage;

                            const newNotification = {
                                id: `${chat.chatId}-${Date.now()}`,
                                type: 'chat',
                                title: otherUserName || 'User',
                                message: latestUnreadMessage?.content || 'New message',
                                timestamp: latestUnreadMessage?.timestamp || new Date().toISOString(),
                                read: false,
                                meta: chat.jobTitle,
                                chatId: chat.chatId,
                                applicantId: chat.applicantId,
                                companyId: chat.companyId,
                                jobId: chat.jobId,
                                unreadCount: chat.unreadCount,
                                onClick: () => {
                                    handleNotificationClick(chat);
                                }
                            };

                            newNotifications.push(newNotification);
                        }
                    }
                });

                // Safely update context
                const currentUnreadCount = rootContext?.notifications?.unreadCount || 0;

                if (newNotifications.length > 0 || totalUnreadCount !== currentUnreadCount) {
                    console.log('🔔 Updating notifications:', {
                        newNotifications: newNotifications.length,
                        totalUnreadCount,
                        currentUnreadCount
                    });

                    setRootContext(prev => {
                        // Remove old notifications for the same chats to avoid duplicates
                        const existingItems = prev.notifications?.items || [];
                        const filteredExistingItems = existingItems.filter(existingNotif =>
                            !newNotifications.some(newNotif => newNotif.chatId === existingNotif.chatId)
                        );

                        return {
                            ...prev,
                            notifications: {
                                items: [...newNotifications, ...filteredExistingItems].slice(0, 20),
                                unreadCount: totalUnreadCount,
                                lastChecked: new Date().toISOString(),
                                isDropdownOpen: prev.notifications?.isDropdownOpen || false
                            }
                        };
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error checking for new messages:', error);
        }
    }, [authenticated, rootContext?.user?.id, rootContext?.user?.role, rootContext?.notifications, setRootContext]);

    // Handle notification click
    const handleNotificationClick = (chatData) => {
        const userType = rootContext?.user?.role;

        console.log('🔔 Notification clicked:', chatData);

        if (userType === 'company') {
            // Navigate to applications page
            router.push(`/applications`);
        } else if (userType === 'applicant') {
            // Navigate to jobs page
            router.push(`/jobs`);
        }

        // Close notification dropdown
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                isDropdownOpen: false
            }
        }));
    };

    // Set up polling for new messages
    useEffect(() => {
        if (!authenticated) return;

        // Check immediately on mount
        checkForNewMessages();

        // Set up interval for polling
        pollingRef.current = setInterval(() => {
            checkForNewMessages();
        }, 5000); // Check every 5 seconds for better responsiveness

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [authenticated, checkForNewMessages]);

    const NotificationBell = () => {
        // Safe access with default value
        const unreadCount = rootContext?.notifications?.unreadCount || 0;

        const handleBellClick = () => {
            setRootContext(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    isDropdownOpen: !(prev.notifications?.isDropdownOpen || false)
                }
            }));
        };

        return (
            <div className="relative">
                <button
                    onClick={handleBellClick}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-4 bg-red-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </div>
        );
    };

    // Notification functions
    const removeNotification = (notificationId) => {
        setRootContext(prev => {
            const currentItems = prev.notifications?.items || [];
            const notification = currentItems.find(n => n.id === notificationId);
            const newItems = currentItems.filter(n => n.id !== notificationId);
            const currentUnreadCount = prev.notifications?.unreadCount || 0;
            const newUnreadCount = notification && !notification.read
                ? Math.max(0, currentUnreadCount - (notification.unreadCount || 1))
                : currentUnreadCount;

            return {
                ...prev,
                notifications: {
                    items: newItems,
                    unreadCount: newUnreadCount,
                    isDropdownOpen: prev.notifications?.isDropdownOpen || false,
                    lastChecked: prev.notifications?.lastChecked || null
                }
            };
        });
    };

    const markNotificationAsRead = (notificationId) => {
        setRootContext(prev => {
            const currentItems = prev.notifications?.items || [];
            const newItems = currentItems.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            );
            const currentUnreadCount = prev.notifications?.unreadCount || 0;
            const notification = currentItems.find(n => n.id === notificationId);
            const unreadCountToRemove = notification && !notification.read ? (notification.unreadCount || 1) : 0;

            return {
                ...prev,
                notifications: {
                    items: newItems,
                    unreadCount: Math.max(0, currentUnreadCount - unreadCountToRemove),
                    isDropdownOpen: prev.notifications?.isDropdownOpen || false,
                    lastChecked: prev.notifications?.lastChecked || null
                }
            };
        });
    };

    const markAllNotificationsAsRead = () => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                items: (prev.notifications?.items || []).map(notification => ({
                    ...notification,
                    read: true
                })),
                unreadCount: 0,
                isDropdownOpen: prev.notifications?.isDropdownOpen || false,
                lastChecked: prev.notifications?.lastChecked || null
            }
        }));
    };

    const clearAllNotifications = () => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                items: [],
                unreadCount: 0,
                isDropdownOpen: prev.notifications?.isDropdownOpen || false,
                lastChecked: prev.notifications?.lastChecked || null
            }
        }));
    };

    const setNotificationsDropdownOpen = (isOpen) => {
        setRootContext(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                isDropdownOpen: isOpen
            }
        }));
    };

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
                    {authenticated && (
                        <Link
                            href="/services"
                            className={linkClasses("/services")}
                            prefetch={true}
                        >
                            Premium Services
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

                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* Notification Dropdown */}
                            {rootContext?.notifications?.isDropdownOpen && (
                                <NotificationDropdown
                                    notifications={rootContext.notifications.items || []}
                                    unreadCount={rootContext.notifications.unreadCount || 0}
                                    onCloseNotification={removeNotification}
                                    onMarkAsRead={markNotificationAsRead}
                                    onMarkAllAsRead={markAllNotificationsAsRead}
                                    onClearAll={clearAllNotifications}
                                    onCloseDropdown={() => setNotificationsDropdownOpen(false)}
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