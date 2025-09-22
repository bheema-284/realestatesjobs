"use client";

import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";

export default function Header({ company }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Close search on outside click
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                !event.target.closest(".search-trigger")
            ) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header
            className={`fixed w-full z-20 transition-all duration-500 ${isScrolled
                    ? "bg-transparent backdrop-blur-md"
                    : "bg-gray-100/75 shadow-md"
                }`}
        >
            {/* Top Navbar */}
            <div
                className={`flex justify-between items-center mx-auto transition-all duration-500 ${isScrolled ? "w-[80%]" : "w-[95%]"
                    }`}
            >
                {/* Logo */}
                <div
                    className={`flex items-center gap-3 transform transition-transform duration-500 ${isScrolled ? "scale-75" : "scale-100"
                        }`}
                >
                    <img src={company.logo} alt="Logo" className="h-12" />
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button className="border px-4 py-2 text-xs font-semibold uppercase">
                        Upcoming Projects
                    </button>
                    <FaSearch
                        onClick={() => setShowSearch(true)}
                        className="cursor-pointer search-trigger"
                    />
                    <FaBars
                        onClick={() => setShowMenu(true)}
                        className="cursor-pointer text-lg"
                    />
                </div>
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div ref={searchRef}>
                    <div className="p-6 flex flex-col gap-6">
                        {/* Search Bar */}
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by project name, keywords..."
                                className="flex-1 border rounded px-4 py-2"
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <select className="border p-2 rounded">
                                <option>Project Type</option>
                            </select>
                            <select className="border p-2 rounded">
                                <option>Location</option>
                            </select>
                            <select className="border p-2 rounded">
                                <option>Construction Status</option>
                            </select>
                            <select className="border p-2 rounded">
                                <option>Bedrooms</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Right-Side Drawer Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform ${showMenu ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-500 z-50`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <FaTimes
                        onClick={() => setShowMenu(false)}
                        className="cursor-pointer"
                    />
                </div>
                <nav className="flex flex-col gap-4 p-6 text-sm">
                    <a href="#">About</a>
                    <a href="#">Residential</a>
                    <a href="#">Commercial</a>
                    <a href="#">Rentals</a>
                    <a href="#">Hospitality</a>
                    <a href="#">Retail</a>
                    <a href="#">Blogs</a>
                </nav>
            </div>
        </header>
    );
}
