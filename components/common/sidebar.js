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
    FaPlus,
    FaUserPlus
} from "react-icons/fa";

const Sidebar = ({ isMobileOpen, toggleSidebar, userRole, authenticated }) => {
    const pathname = usePathname();
    const router = useRouter();

    console.log("Sidebar Debug - userRole:", userRole, "Authenticated:", authenticated);

    // If not authenticated, don't show sidebar
    if (!authenticated) {
        console.log("Sidebar: Not authenticated - hiding sidebar");
        return null;
    }

    // Base sidebar items for all roles
    const baseSidebarItems = [
        { icon: <FaThLarge />, label: "Dashboard", link: "/dashboard", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaSuitcase />, label: "Jobs", link: "/applications", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaUsers />, label: "Candidates", link: "/candidates", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaTasks />, label: "Tasks", link: "/tasks", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaCalendarAlt />, label: "Calendar", link: "/calendar", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaChartBar />, label: "Analytics", link: "/analytics", roles: ["superadmin", "company", "recruiter"] },
        { icon: <FaCog />, label: "Settings", link: "/settings", roles: ["superadmin", "company", "recruiter", "applicant"] },
    ];

    // Additional sidebar items
    const additionalSidebarItems = [
        { icon: <FaPlus />, label: "Projects", link: "/projects", roles: ["superadmin", "company"] },
        { icon: <FaUserPlus />, label: "Recruiters", link: "/recruiters", roles: ["superadmin", "company"] },
    ];

    // Combine all sidebar items
    const allSidebarItems = [...baseSidebarItems, ...additionalSidebarItems];

    // Filter sidebar items based on user role with proper fallback
    const sidebarItems = allSidebarItems.filter(item =>
        item.roles.includes(userRole || "")
    );

    const isPathActive = (itemLink) => {
        if (!itemLink) return false;

        if (itemLink === "/candidates") {
            return pathname.startsWith("/candidates") || pathname.startsWith("/profile");
        }
        if (itemLink === "/projects") {
            return pathname.startsWith("/projects");
        }
        if (itemLink === "/recruiters") {
            return pathname.startsWith("/recruiters");
        }
        return pathname === itemLink || pathname.startsWith(`${itemLink}/`);
    };

    // If no items to show for this role, don't render sidebar
    if (sidebarItems.length === 0) {
        console.log("Sidebar: No items available for role:", userRole);
        return null;
    }

    return (
        <div
            className={`fixed sm:sticky top-16 left-0 z-30 w-36 bg-white shadow-md transition-transform duration-300 ease-in-out
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
            style={{ height: "calc(100vh - 4rem)" }}
        >
            <div className="p-4 space-y-4 overflow-y-auto h-full">
                {sidebarItems.map((item, idx) => {
                    const isActive = isPathActive(item.link);
                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                if (item.link) {
                                    router.push(item.link);
                                    toggleSidebar(false);
                                }
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