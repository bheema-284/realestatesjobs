"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const linkClasses = (href) =>
        `relative flex items-center h-full px-2 font-medium transition ${pathname === href
            ? "text-purple-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-purple-600"
            : "text-gray-700 hover:text-purple-600"
        }`;

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-4 z-10">
            <div className="flex items-center justify-between h-16">
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
                <div className="hidden sm:flex items-center gap-6 h-full">
                    <Link href="/" className={linkClasses("/")}>
                        Home
                    </Link>
                    <Link href="/companies" className={linkClasses("/companies")}>
                        Companies
                    </Link>
                    <Link href="/jobs" className={linkClasses("/jobs")}>
                        Jobs
                    </Link>
                    <Link href="/about" className={linkClasses("/about")}>
                        About Us
                    </Link>
                    <Link
                        href="/login"
                        className={`px-4 py-2 rounded-sm transition ${pathname === "/login"
                                ? "bg-purple-600 text-white"
                                : "bg-indigo-600 text-white hover:bg-purple-600"
                            }`}
                    >
                        Login
                    </Link>
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
                    <Link href="/about" className={linkClasses("/about")} onClick={() => setMenuOpen(false)}>
                        About Us
                    </Link>
                    <Link
                        href="/login"
                        className={`w-full px-4 py-2 rounded-lg text-center transition ${pathname === "/login"
                                ? "bg-purple-600 text-white"
                                : "bg-indigo-600 text-white hover:bg-purple-600"
                            }`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};
