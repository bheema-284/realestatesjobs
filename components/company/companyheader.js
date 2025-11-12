"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";

export default function Header({ company }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [scrolledDown, setScrolledDown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolledDown(window.scrollY > 50); // shrink logo when scrolling
        };
        window.addEventListener("scroll", handleScroll);

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
            className={`fixed top-0 w-full z-50 transition-all duration-500 mt-20 ${scrolledDown
                ? "bg-transparent backdrop-blur-md"
                : "bg-gray-50/10"
                }`}
        >
            {/* Navbar with fixed height */}
            <div className="flex justify-between items-center mx-auto w-[80%] h-14 relative">

                {/* Logo wrapper (keeps flex intact) */}
                <div className="relative h-20 w-auto">
                    <img
                        src={company.logo || "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"}
                        alt="Logo"
                        className={`h-full z-50 shadow-lg rounded-lg transform transition-all duration-500 ${scrolledDown
                            ? "scale-75 translate-y-1"
                            : "scale-100 translate-y-4"
                            }`}
                    />
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 ml-auto">
                    <button className="border px-4 hover:bg-purple-200 hover:border hover:border-purple-200 hover:text-orange-500 py-2 text-xs font-semibold uppercase">
                        Upcoming Projects
                    </button>
                    <FaSearch
                        onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch) }}
                        className="cursor-pointer search-trigger"
                    />
                    <FaBars
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                        className="cursor-pointer text-lg"
                    />
                </div>
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div className="w-full sm:w-[83%] mx-auto z-50" ref={searchRef}>
                    <div className="p-6 flex flex-col gap-6 z-50">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by project name, keywords..."
                                className="flex-1 border rounded px-4 py-2"
                            />
                        </div>

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
                className={`fixed top-18 right-0 h-full w-72 transform ${showMenu ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-500 z-50`}
            >
                <nav className="flex flex-col gap-4 p-2 text-sm bg-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <FaTimes
                            onClick={() => setShowMenu(false)}
                            className="cursor-pointer"
                        />
                    </div>
                    <Link href="#">About</Link>
                    <Link href="#">Residential</Link>
                    <Link href="#">Commercial</Link>
                    <Link href="#">Rentals</Link>
                    <Link href="#">Hospitality</Link>
                    <Link href="#">Retail</Link>
                    <Link href="#">Blogs</Link>
                </nav>
            </div>
        </header>
    );
}
