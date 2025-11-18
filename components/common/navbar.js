"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import AnimatedBorderLoader from "./animatedbutton";
import JobPostingModal from "../createjob";

export const Navbar = ({ rootContext, showLoader, logOut }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const role = rootContext?.user?.role;
    const authenticated = rootContext.authenticated;

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

    const NotificationBell = ({ count }) => (
        <div className="relative w-4 h-6">
            <FaBell className="text-gray-700 w-full h-full" />
            {count > 0 && (
                <span className="absolute -top-[2px] -right-[2px] min-w-[12px] h-[12px] px-[2px] text-[8px] leading-[12px] text-white bg-red-500 rounded-full text-center ring-1 ring-white dark:ring-gray-800">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </div>
    );

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

                            <NotificationBell count={3} />

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
                                    <Menu.Items className="absolute no-focus-outline top-full right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-50 focus:outline-none">
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

                                        {/* REMOVED: Add Projects and Add Recruiters from dropdown */}

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
                    // Add other required props based on your needs:
                    title="Post New Job"  // or dynamic title
                    mode="create"         // since this is for creating new jobs
                    userProfile={rootContext?.user} // pass user data if needed                  
                // editData={null} // Only pass if editing existing job
                />
            )}
        </nav>
    );
};