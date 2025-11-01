"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";

// Dynamically import heavy components
const AnimatedBorderLoader = dynamic(() => import("./animatedbutton"), {
    loading: () => <div className="bg-gray-300 animate-pulse rounded px-3 py-1.5">Loading...</div>,
});

const JobPostingModal = dynamic(() => import("../createjob"), {
    ssr: false, // Disable SSR for modals since they're interactive
});

// Memoize static data
const RECRUITER_SIDEBAR_ITEMS = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Applications", link: "/applications" },
    { label: "Candidates", link: "/candidates" },
    { label: "Tasks", link: "/tasks" },
    { label: "Calendar", link: "/calendar" },
    { label: "Analytics", link: "/analytics" },
    { label: "Settings", link: "/settings" },
];

export const Navbar = ({ rootContext, showLoader, logOut }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Memoize derived values
    const { role, authenticated, user } = rootContext || {};
    const userId = user?.id;
    const userName = user?.name;

    const jobSeekerProfileLink = useMemo(() =>
        `/details/${userId || 1}/${userName || ""}`,
        [userId, userName]
    );

    // Memoize link classes calculation
    const linkClasses = useCallback((href) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return `relative flex items-center h-full px-2 font-medium transition ${isActive
                ? "text-purple-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-purple-600"
                : "text-gray-700 hover:text-purple-600"
            }`;
    }, [pathname]);

    // Memoize notification component
    const NotificationBell = useMemo(() => {
        const Bell = ({ count }) => (
            <div className="relative w-4 h-6">
                <FaBell className="text-gray-700 w-full h-full" />
                {count > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] min-w-[12px] h-[12px] px-[2px] text-[8px] leading-[12px] text-white bg-red-500 rounded-full text-center ring-1 ring-white dark:ring-gray-800">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </div>
        );
        return Bell;
    }, []);

    // Optimize handlers
    const handleMobileLinkClick = useCallback(() => {
        setMenuOpen(false);
    }, []);

    const handlePostJobClick = useCallback(() => {
        setIsOpen(true);
        setMenuOpen(false);
    }, []);

    const handleProfileNavigation = useCallback(() => {
        router.push(jobSeekerProfileLink);
    }, [router, jobSeekerProfileLink]);

    const handleDashboardNavigation = useCallback(() => {
        router.push('/dashboard');
    }, [router]);

    // Early return for logo to prevent unnecessary computations
    const Logo = useMemo(() => (
        <Link href="/" className="flex items-center" prefetch={false}>
            <Image
                src="/logo.webp"
                alt="logo"
                width={150}
                height={10}
                priority
                loading="eager"
                className="object-cover"
            />
        </Link>
    ), []);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-4 sm:px-6 z-50">
            <div className="flex h-20 sm:h-20 items-center justify-between gap-4">
                {Logo}

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-4 h-full flex-1 justify-end">
                    <Link href="/" className={linkClasses("/")} prefetch={false}>
                        Home
                    </Link>
                    <Link href="/about" className={linkClasses("/about")} prefetch={false}>
                        About Us
                    </Link>
                    {(role !== "recruiter" || !authenticated) && (
                        <Link href="/companies" className={linkClasses("/companies")} prefetch={false}>
                            Companies
                        </Link>
                    )}
                    {(role !== "recruiter" || !authenticated) && (
                        <Link href="/jobs" className={linkClasses("/jobs")} prefetch={false}>
                            Jobs
                        </Link>
                    )}
                    {authenticated && (
                        <Link href="/services" className={linkClasses("/services")} prefetch={false}>
                            Premium Services
                        </Link>
                    )}

                    {authenticated ? (
                        <>
                            {pathname !== "/applications" && role === "recruiter" && (
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

                            <NotificationBell count={3} />

                            {/* User Dropdown */}
                            <Menu as="div" className="relative no-focus-outline z-50">
                                <Menu.Button className="flex items-center gap-1 cursor-pointer">
                                    <div className="sm:hidden w-6 h-6 rounded-full bg-indigo-900 text-white flex items-center justify-center font-semibold">
                                        {(userName || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col capitalize">
                                        <p className="font-semibold flex items-center">
                                            {userName || "User"}
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
                                    <Menu.Items className="absolute no-focus-outline top-full right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-50 focus:outline-none">
                                        {role === "recruiter" ? (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleDashboardNavigation}
                                                        className={`${active ? "bg-gray-100" : ""
                                                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Dashboard
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ) : (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleProfileNavigation}
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
                            prefetch={false}
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
                    <Link href="/" className={linkClasses("/")} onClick={handleMobileLinkClick}>
                        Home
                    </Link>
                    <Link href="/about" className={linkClasses("/about")} onClick={handleMobileLinkClick}>
                        About Us
                    </Link>

                    {(role !== "recruiter" || !authenticated) && (
                        <>
                            <Link href="/companies" className={linkClasses("/companies")} onClick={handleMobileLinkClick}>
                                Companies
                            </Link>
                            <Link href="/jobs" className={linkClasses("/jobs")} onClick={handleMobileLinkClick}>
                                Jobs
                            </Link>
                        </>
                    )}

                    {authenticated && (
                        <Link href="/services" className={linkClasses("/services")} onClick={handleMobileLinkClick}>
                            Premium Services
                        </Link>
                    )}

                    {authenticated && role === "recruiter" && (
                        <>
                            {RECRUITER_SIDEBAR_ITEMS.map((item) => (
                                <Link
                                    key={item.link}
                                    href={item.link}
                                    className={linkClasses(item.link)}
                                    onClick={handleMobileLinkClick}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handlePostJobClick}
                                className="w-full px-4 py-2 rounded-lg text-center bg-gray-900 border-1.5 border-gray-900 text-white hover:bg-gray-700 mt-2"
                            >
                                POST NEW JOB
                            </button>
                        </>
                    )}

                    {authenticated && role !== "recruiter" && (
                        <Link
                            href={jobSeekerProfileLink}
                            className={linkClasses(jobSeekerProfileLink)}
                            onClick={handleMobileLinkClick}
                        >
                            Profile
                        </Link>
                    )}

                    {!authenticated ? (
                        <Link
                            href="/login"
                            className="w-full px-4 py-2 rounded-lg text-center bg-indigo-600 text-white hover:bg-purple-600 mt-2"
                            onClick={handleMobileLinkClick}
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
                <JobPostingModal isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </nav>
    );
};