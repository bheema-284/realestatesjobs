'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import SignIn from "@/components/common/login";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import { contextObject } from "@/components/config/contextobject";
import RegisterForm from "@/components/common/signup";
import { usePathname, useRouter } from "next/navigation";
import { FaChartBar, FaUsers, FaTasks, FaCalendarAlt, FaCog, FaSuitcase, FaBell } from "react-icons/fa";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


const sidebarItems = [
  { icon: <FaChartBar />, label: "Dashboard", link: "/dashboard" },
  { icon: <FaSuitcase />, label: "Jobs", link: "/applications" },
  { icon: <FaUsers />, label: "Candidates", link: "/candidates" },
  { icon: <FaTasks />, label: "Tasks", link: "/tasks" },
  { icon: <FaCalendarAlt />, label: "Calendar", link: "/calendar" },
  { icon: <FaChartBar />, label: "Analytics", link: "/analytics" },
  { icon: <FaCog />, label: "Settings", link: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isPathActive = (itemLink) => {
    if (itemLink === '/applications') {
      return pathname.startsWith('/applications') || pathname.startsWith('/profile');
    }
    return pathname === itemLink || pathname.startsWith(`${itemLink}/`);
  };

  const handleNavigate = (link) => {
    if (pathname !== link) {
      router.push(link);
    }
  };

  return (
    <div className="fixed top-16 left-0 h-screen w-36 bg-white shadow-md z-20">
      <div className="p-4 space-y-4">
        {sidebarItems.map((item, idx) => {
          const isActive = isPathActive(item.link);
          return (
            <div
              key={idx}
              onClick={() => handleNavigate(item.link)}
              className={`flex items-center gap-3 px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 ${isActive ? "text-green-500 bg-indigo-200 font-bold" : "text-yellow-400 hover:text-black"
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


export default function RootLayout({ children }) {
  const context = useContext(RootContext);
  const pathName = usePathname();
  const [rootContext, setRootContext] = useState(context);
  const dropdownRef = useRef();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const user_details = localStorage && JSON.parse(localStorage.getItem("user_details"));
    const updatedContext = { ...contextObject, loader: false };
    if (user_details) {
      updatedContext.authenticated = true;
      updatedContext.user = user_details;
    }
    setRootContext(updatedContext);
    setReady(true);
  }, []);

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
    localStorage.clear();
    const resetContext = { ...contextObject, authenticated: false };
    setRootContext(resetContext);
    router.push(`/`);
  };

  const Topbar = () => (
    <div className="flex fixed top-0 left-0 w-full z-50 justify-between items-center px-6 py-2 bg-white shadow">
      <img width={100} src="https://realestatejobs.co.in/images/logo.png" alt="Logo" />
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
    <html lang="en" className={inter.variable}>
      <body className={`antialiased`}>
        <RootContext.Provider value={{ rootContext, setRootContext }}>
          {pathName === "/signup" && !rootContext.authenticated && !rootContext.loader ? (
            <RegisterForm />
          ) : rootContext.loader ? (
            <Loader />
          ) : !rootContext.authenticated ? (
            <SignIn />
          ) : (
            <div>
              {!ready && <Loader />}
              <Topbar />
              <div className="flex pt-16 bg-gray-100">
                <Sidebar />
                <main className="flex-1 ml-36 p-4">{children}</main>
              </div>
            </div>
          )}
          <Toast />
        </RootContext.Provider>
      </body>
    </html>
  );
}
