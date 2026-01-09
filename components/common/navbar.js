"use client";

import { useState, useContext, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, BellIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import AnimatedBorderLoader from "./animatedbutton";
import RootContext from "@/components/config/rootcontext";
import NotificationDropdown from "./notificationdropdown";
import { useNotificationService } from "./usenotificationservice";

// Memoized Notification Bell to prevent unnecessary re-renders
const NotificationBell = memo(({
    unreadCount,
    isLoading,
    error,
    onBellClick
}) => {
    return (
        <div className="relative">
            <button
                onClick={onBellClick}
                disabled={isLoading}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0 -right-1 bg-red-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                {/* Show loader only when actually loading */}
                {isLoading && (
                    <div className="absolute -top-0 -right-1 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
            </button>

            {/* Show error briefly then auto-clear */}
            {error && (
                <div className="absolute top-full right-0 mt-1 bg-red-100 border border-red-300 rounded px-2 py-1 text-xs text-red-700 whitespace-nowrap">
                    Error: {error}
                </div>
            )}
        </div>
    );
});

NotificationBell.displayName = 'NotificationBell';

export const Navbar = ({ rootContext: propRootContext, showLoader, logOut }) => {
    const {
        rootContext: contextRootContext,
        toggleNotificationDropdown,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearAllNotifications
    } = useContext(RootContext);

    // Use prop rootContext or context rootContext
    const rootContext = propRootContext || contextRootContext;

    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const role = rootContext?.user?.role;
    const authenticated = rootContext?.authenticated || false;

    // Initialize notification service
    const { isLoading, error, refreshNotifications } = useNotificationService();

    // Notification state from context
    const notifications = rootContext?.notifications || { items: [], unreadCount: 0 };
    const isNotificationDropdownOpen = notifications.isDropdownOpen || false;

    // Use ref to track if we've already logged debug info
    const hasLoggedRef = useRef(false);

    // Debug: Log notification state (only once per mount)
    useEffect(() => {
        if (!hasLoggedRef.current) {
            console.log('🔔 Navbar Mounted - Notification State:', {
                authenticated,
                userId: rootContext?.user?.id,
                unreadCount: notifications.unreadCount,
                notificationItems: notifications.items?.length || 0,
                isLoading,
                error
            });
            hasLoggedRef.current = true;
        }
    }, [notifications, authenticated, rootContext?.user?.id, isLoading, error]);

    // Handle bell click with refresh and debounce
    const handleBellClick = useCallback(() => {
        refreshNotifications();
        toggleNotificationDropdown(!isNotificationDropdownOpen);
    }, [refreshNotifications, toggleNotificationDropdown, isNotificationDropdownOpen]);

    // Handle notification click
    const handleNotificationClick = useCallback((notification) => {

        // Mark as read
        markNotificationAsRead(notification.id);

        // Navigate based on user role and notification type
        if (role === 'company' || role === 'recruiter' || role === 'superadmin') {
            router.push('/applications');
        } else if (role === 'applicant') {
            router.push('/jobs');
        }

        // Close dropdown
        toggleNotificationDropdown(false);
    }, [markNotificationAsRead, role, router, toggleNotificationDropdown]);

    // Sidebar items based on roles
    const getSidebarItems = useCallback(() => {
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
                roles: ["superadmin", "company", "recruiter"]
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
    }, [role, rootContext?.user?.id, rootContext?.user?.name]);

    const sidebarItems = getSidebarItems();
    const jobSeekerProfileLink = `/details/${rootContext?.user?.id || 1}/${rootContext?.user?.name || ""}`;

    const linkClasses = useCallback((href) => {
        const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

        return `relative flex items-center h-full px-2 font-medium transition ${isActive
            ? "text-purple-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-purple-600"
            : "text-gray-700 hover:text-purple-600"
            }`;
    }, [pathname]);

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
                                            onClick={() => { authenticated && router.push("/applications") }}
                                            className="bg-gray-900 border-1.5 border-gray-900 text-white px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap ml-4"
                                        >
                                            POST NEW JOB
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Notification Bell */}
                            <NotificationBell
                                unreadCount={notifications.unreadCount || 0}
                                isLoading={isLoading}
                                error={error}
                                onBellClick={handleBellClick}
                            />

                            {/* Notification Dropdown */}
                            {isNotificationDropdownOpen && (
                                <NotificationDropdown
                                    notifications={notifications.items || []}
                                    unreadCount={notifications.unreadCount || 0}
                                    onCloseNotification={removeNotification}
                                    onMarkAsRead={markNotificationAsRead}
                                    onMarkAllAsRead={markAllNotificationsAsRead}
                                    onClearAll={clearAllNotifications}
                                    onCloseDropdown={() => toggleNotificationDropdown(false)}
                                    onNotificationClick={handleNotificationClick}
                                    isLoading={isLoading}
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
                                    onClick={() => { authenticated && router.push("/applications") }}
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
        </nav>
    );
};