"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import AnimatedBorderLoader from "./animatedbutton";
import JobPostingModal from "../createjob";

export const Navbar = ({ rootContext, showLoader, logOut }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();
    const linkClasses = (href) => {
        const isActive =
            href === "/"
                ? pathname === "/" // Home should only be active on root
                : pathname.startsWith(href); // Others can use startsWith

        return `relative flex items-center h-full px-2 font-medium transition ${isActive
            ? "text-purple-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-purple-600"
            : "text-gray-700 hover:text-purple-600"
            }`;
    };


    const NotificationBell = ({ count }) => {
        return (
            <div className="relative w-4 h-6">
                <FaBell className="text-gray-700 w-full h-full" />
                {count > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] min-w-[12px] h-[12px] px-[2px] text-[8px] leading-[12px] text-white bg-red-500 rounded-full text-center ring-1 ring-white dark:ring-gray-800">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </div>
        );
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-4 sm:px-6 z-50">
            <div className="flex h-16 sm:h-16 items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="https://realestatejobs.co.in/images/logo.png"
                        alt="logo"
                        width={120}
                        height={30}
                        priority
                        className="scale-105"
                    />
                </Link>

                {/* Desktop Menu */}
                <div
                    className={`hidden sm:flex items-center gap-4 h-full flex-1 justify-end`}
                >
                    <Link href="/" className={linkClasses("/")}>
                        Home
                    </Link>
                    {!rootContext.authenticated && <Link href="/companies" className={linkClasses("/companies")}>
                        Companies
                    </Link>}
                    {!rootContext.authenticated && <Link href="/jobs" className={linkClasses("/jobs")}>
                        Jobs
                    </Link>}
                    {rootContext.authenticated && <Link href="/services" className={linkClasses("/services")}>
                        Premium Services
                    </Link>}
                    {rootContext.authenticated ? (
                        <>
                            {pathname !== "/applications" && (
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
                            <div
                                className="flex items-center gap-1 ml-4 cursor-pointer relative"
                                ref={dropdownRef}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="sm:hidden w-6 h-6 rounded-full bg-indigo-900 text-white flex items-center justify-center font-semibold">
                                    {(rootContext?.user?.name || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:flex flex-col capitalize">
                                    <p className="font-semibold">{rootContext?.user?.name || "User"}</p>
                                    <p className="text-gray-500 text-xs">{rootContext?.user?.role || "role"}</p>
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden sm:block" />

                                {showDropdown && (
                                    <div className="absolute top-full right-0 mt-2 w-36 bg-white shadow-lg border rounded-md z-50">
                                        <button
                                            onClick={() => router.push(`/dashboard`)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={logOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-purple-600"
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
                    {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="sm:hidden flex flex-col items-start px-6 pb-4 gap-3 bg-white shadow-md">
                    <Link href="/" className={linkClasses("/")} onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/companies" className={linkClasses("/companies")} onClick={() => setMenuOpen(false)}>
                        Companies
                    </Link>
                    <Link href="/jobs" className={linkClasses("/jobs")} onClick={() => setMenuOpen(false)}>
                        Jobs
                    </Link>

                    {!rootContext.authenticated ? (
                        <Link
                            href="/login"
                            className="w-full px-4 py-2 rounded-lg text-center bg-indigo-600 text-white hover:bg-purple-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={logOut}
                            className="w-full px-4 py-2 rounded-lg text-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}

            {rootContext.authenticated && isOpen && <JobPostingModal isOpen={isOpen} setIsOpen={setIsOpen} />}
        </nav>
    );
};
