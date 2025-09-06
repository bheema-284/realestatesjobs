"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="https://realestatejobs.co.in/images/logo.png"
                        alt="logo"
                        width={120}
                        height={30}
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-6">
                    <Link href="/" className="text-gray-700 hover:text-indigo-700 font-medium">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-indigo-700 font-medium">
                        About Us
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
                    <Link
                        href="/"
                        className="w-full text-gray-700 hover:text-indigo-700 font-medium"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="w-full text-gray-700 hover:text-indigo-700 font-medium"
                        onClick={() => setMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/login"
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center"
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};
