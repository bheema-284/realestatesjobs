"use client";
import { usePathname, useRouter } from "next/navigation";
import {
    FaChartBar,
    FaUsers,
    FaTasks,
    FaCalendarAlt,
    FaCog,
    FaSuitcase,
    FaThLarge,
} from "react-icons/fa";

const sidebarItems = [
    { icon: <FaThLarge />, label: "Dashboard", link: "/dashboard" },
    { icon: <FaSuitcase />, label: "Jobs", link: "/applications" },
    { icon: <FaUsers />, label: "Candidates", link: "/candidates" },
    { icon: <FaTasks />, label: "Tasks", link: "/tasks" },
    { icon: <FaCalendarAlt />, label: "Calendar", link: "/calendar" },
    { icon: <FaChartBar />, label: "Analytics", link: "/analytics" },
    { icon: <FaCog />, label: "Settings", link: "/settings" },
];

const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isPathActive = (itemLink) => {
        if (itemLink === "/candidates") {
            return (
                pathname.startsWith("/candidates") || pathname.startsWith("/profile")
            );
        }
        return pathname === itemLink || pathname.startsWith(`${itemLink}/`);
    };

    return (
        <div
            className={`fixed sm:sticky top-16 left-0 z-30 w-36 bg-white shadow-md transition-transform duration-300 ease-in-out
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
            style={{ height: "calc(100vh - 4rem)" }} // full height below navbar
        >
            <div className="p-4 space-y-4 overflow-y-auto h-full">
                {sidebarItems.map((item, idx) => {
                    const isActive = isPathActive(item.link);
                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                router.push(item.link);
                                toggleSidebar(false);
                            }}
                            className={`flex items-center gap-3 px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 ${isActive
                                    ? "text-black bg-indigo-200 font-bold"
                                    : "text-black hover:text-black hover:font-medium"
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
