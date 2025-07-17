'use client';
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import SignIn from "@/components/common/login";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import RegisterForm from "@/components/common/signup";
import { usePathname, useRouter } from "next/navigation";
import { FaChartBar, FaUsers, FaTasks, FaCalendarAlt, FaCog, FaSuitcase, FaBell } from "react-icons/fa";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";
import { Inter } from 'next/font/google';
import JobPostingModal from "@/components/createjob";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const sidebarItems = [
  { icon: <FaChartBar />, label: "Dashboard", link: "/dashboard" },
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
    if (itemLink === '/candidates') {
      return pathname.startsWith('/candidates') || pathname.startsWith('/profile');
    }
    return pathname === itemLink || pathname.startsWith(`${itemLink}/`);
  };

  return (
    <div className={`fixed top-16 left-0 h-screen w-36 bg-white shadow-md z-20 transition-transform duration-300 ease-in-out
      ${isMobileOpen ? 'translate-x-0 z-50' : '-translate-x-full'} sm:translate-x-0`}>
      <div className="p-4 space-y-4">
        {sidebarItems.map((item, idx) => {
          const isActive = isPathActive(item.link);
          return (
            <div
              key={idx}
              onClick={() => {
                router.push(item.link);
                toggleSidebar(false);
              }}
              className={`flex items-center gap-3 px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 ${isActive ? "text-black bg-indigo-200 font-bold" : "text-black hover:text-black hover:font-medium"
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
  const pathName = usePathname();
  const router = useRouter();
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rootContext, setRootContext] = useState({
    authenticated: false,
    loader: true,
    user: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      token: "",
      isAdmin: "",
    },
    accessToken: '',
    remember: false,
    toast: {
      show: false,
      dismiss: true,
      type: '',
      title: '',
      message: ''
    },
    jobs: []
  });

  useEffect(() => {
    const user_details = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user_details"));
    const updatedContext = { ...rootContext, loader: false };

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
    setRootContext(
      {
        authenticated: false,
        loader: true,
        user: {
          name: "",
          email: "",
          mobile: "",
          password: "",
          token: "",
          isAdmin: "",
        },
        accessToken: '',
        remember: false,
        toast: {
          show: false,
          dismiss: true,
          type: '',
          title: '',
          message: ''
        },
        jobs: []
      }
    );
    router.push(`/`);
  };

  const Topbar = () => (
    <div className="flex flex-wrap sm:flex-nowrap fixed top-0 left-0 w-full z-50 justify-between items-center px-4 sm:px-6 py-2 bg-white shadow gap-2">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <img width={100} src="https://realestatejobs.co.in/images/logo.png" alt="Logo" />
        <button
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          className="sm:hidden text-gray-700 focus:outline-none"
        >
          ☰
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-900 text-white px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
          POST NEW JOB
        </button>
        <input
          type="text"
          placeholder="Search candidate, vacancy, etc"
          className="px-3 py-2 border rounded w-full sm:w-1/3 text-sm"
        />
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <FaBell className="text-gray-600" />
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <UserIcon className="w-4 h-4 text-gray-400" />
            <div className="text-sm flex flex-col sm:flex-row sm:items-center gap-1">
              {/* 👇 Small screens: initial in a circle */}
              <div className="sm:hidden w-6 h-6 rounded-full bg-indigo-900 text-white flex items-center justify-center font-semibold">
                {(rootContext?.user?.name || "U").charAt(0).toUpperCase()}
              </div>

              {/* 👇 Larger screens: full name and role */}
              <div className="hidden sm:flex flex-col">
                <p className="font-semibold">{rootContext?.user?.name || "User"}</p>
                <p className="text-gray-500 text-xs">Lead HR</p>
              </div>
            </div>
            <p className="hidden sm:block"><ChevronDownIcon className="w-4 h-4 text-gray-400" /></p>
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
      {isOpen && <JobPostingModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
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
              <div className="flex flex-col sm:flex-row pt-20 bg-gray-100 min-h-screen">
                <Sidebar isMobileOpen={isMobileSidebarOpen} toggleSidebar={setMobileSidebarOpen} />
                <main className="flex-1 ml-36 p-4">{children}</main>
              </div>
            </div>
          )}
          {rootContext?.toast && <Toast />}
        </RootContext.Provider>
      </body>
    </html>
  );
}
