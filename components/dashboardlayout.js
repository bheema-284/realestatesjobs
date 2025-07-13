import React, { useContext, useEffect, useRef, useState } from "react";
import {
    FaChartBar, FaUsers, FaTasks, FaCalendarAlt, FaCog, FaSuitcase, FaBell,
} from "react-icons/fa";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { contextObject } from "./config/contextobject";
import Dashboard from "./dashboard";
import RootContext from "./config/rootcontext";


// Main Layout Component
const DashboardLayout = () => {
    const dropdownRef = useRef();
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const { rootContext, setRootContext } = useContext(RootContext);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logOut = () => {
        const resp = contextObject;
        localStorage.clear();
        resp.authenticated = false;
        setRootContext({ ...resp });
        router.push(`/`);
    };

    const Topbar = () => (
        <div className={`flex justify-between items-center px-6 py-2 bg-white shadow transition-all duration-300 ml-${isSidebarExpanded ? "36" : "16"}`}>
            <div>
                <img width={100} src="https://realestatejobs.co.in/images/logo.png" alt="Logo" />
            </div>
            <button className="bg-indigo-900 text-white px-4 py-2 rounded">POST NEW JOB</button>
            <input
                type="text"
                placeholder="Search candidate, vacancy, etc"
                className="ml-4 px-4 py-2 border rounded w-1/3"
            />
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <FaBell className="text-gray-600" />
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <div className="text-sm flex items-center gap-1">
                        <div>
                            <p className="font-semibold">{rootContext?.user?.name || "User"}</p>
                            <p className="text-gray-500 text-xs">Lead HR</p>
                        </div>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                {showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-white shadow-lg border rounded-md z-50">
                        <button
                            onClick={logOut}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <Topbar />
            <div className="flex bg-gray-100">
                <Sidebar isExpanded={isSidebarExpanded} onHoverChange={setIsSidebarExpanded} />
                <div
                    className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarExpanded ? "ml-36" : "ml-16"
                        }`}
                >
                    <div className="p-2 mt-1 w-full">
                        <Dashboard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
