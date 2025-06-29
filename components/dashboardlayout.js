import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import {
    FaCode,
    FaPaintBrush,
    FaUserTie,
    FaBriefcase,
    FaChartBar,
    FaUsers,
    FaTasks,
    FaCalendarAlt,
    FaCog,
    FaSuitcase,
    FaBell
} from "react-icons/fa";
import Dashboard from "./dashboard";

const sidebarItems = [
    { icon: <FaChartBar />, label: "Dashboard" },
    { icon: <FaSuitcase />, label: "Jobs" },
    { icon: <FaUsers />, label: "Candidates" },
    { icon: <FaTasks />, label: "Tasks" },
    { icon: <FaCalendarAlt />, label: "Calendar" },
    { icon: <FaChartBar />, label: "Analytics" },
    { icon: <FaCog />, label: "Settings" }
];

const Sidebar = () => (
    <div className="group fixed top-0 left-0 h-screen bg-white shadow-md transition-all duration-300 w-16 hover:w-64 overflow-hidden z-20">
        <div className="space-y-6 text-sm font-medium p-6">
            {sidebarItems.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex items-center gap-3 cursor-pointer ${idx === 0 ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"}`}
                >
                    {item.icon}
                    <span className="hidden group-hover:inline">{item.label}</span>
                </div>
            ))}
        </div>
    </div>
);



const DashboardLayout = () => (
    <div className="flex bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-10 group-hover:ml-64 transition-all duration-300">
            <div className="p-2 mt-1 w-full">
                <Dashboard />
            </div>
        </div>
    </div>
);

export default DashboardLayout;
