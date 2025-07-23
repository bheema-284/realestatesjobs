'use client';
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import SignIn from "@/components/common/login";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import RegisterForm from "@/components/common/signup";
import { usePathname, useRouter } from "next/navigation";
import { FaChartBar, FaUsers, FaTasks, FaCalendarAlt, FaCog, FaSuitcase, FaBell, FaThLarge } from "react-icons/fa";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";
import { Inter } from 'next/font/google';
import JobPostingModal from "@/components/createjob";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], display: "swap" });

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
    if (itemLink === '/candidates') {
      return pathname.startsWith('/candidates') || pathname.startsWith('/profile');
    }
    return pathname === itemLink || pathname.startsWith(`${itemLink}/`);
  };

  return (
    <div className={`fixed top-26 sm:top-16 left-0 h-screen w-36 bg-white shadow-md z-50 transition-transform duration-300 ease-in-out
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
    jobs: [
      {
        "id": "job-1753249533581-t8lcig7",
        "jobTitle": "Real Estate Sales",
        "jobDescription": "Sell properties in a fast-paced real estate market.",
        "employmentTypes": [
          "full-time"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": true,
          "custom": "Flexible weekends"
        },
        "salaryType": "hourly",
        "salaryAmount": "80,000 + Commission",
        "salaryFrequency": "Weekly",
        "hiringMultiple": true,
        "location": "Bangalore",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249534307-7iy01jw",
        "jobTitle": "Channel Partners",
        "jobDescription": "Develop B2B networks and alliances.",
        "employmentTypes": [
          "contract",
          "negotiable"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "fixed",
        "salaryAmount": "75,000",
        "salaryFrequency": "Yearly",
        "hiringMultiple": true,
        "location": "Remote",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249535004-injnu4q",
        "jobTitle": "Tele Caller",
        "jobDescription": "Engage prospects over phone and pitch services.",
        "employmentTypes": [
          "contract",
          "negotiable"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "custom",
        "salaryAmount": "25",
        "salaryFrequency": "Weekly",
        "hiringMultiple": false,
        "location": "Mumbai",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249535684-rwlhae1",
        "jobTitle": "HR & Operations",
        "jobDescription": "Join our team as a HR & Operations specialist.",
        "employmentTypes": [
          "full-time",
          "remote"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": true,
          "custom": "Flexible weekends"
        },
        "salaryType": "monthly",
        "salaryAmount": "60,000",
        "salaryFrequency": "Yearly",
        "hiringMultiple": true,
        "location": "Remote",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249536283-fssr2hj",
        "jobTitle": "Accounts & Auditing",
        "jobDescription": "Join our team as a Accounts & Auditing specialist.",
        "employmentTypes": [
          "full-time",
          "remote"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "monthly",
        "salaryAmount": "55,000",
        "salaryFrequency": "Weekly",
        "hiringMultiple": false,
        "location": "Bangalore",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249536835-3l7uypm",
        "jobTitle": "Digital Marketing",
        "jobDescription": "This is an auto-generated description for a Digital Marketing role.",
        "employmentTypes": [
          "contract",
          "negotiable"
        ],
        "workingSchedule": {
          "dayShift": false,
          "nightShift": true,
          "weekendAvailability": true,
          "custom": "Night shift only"
        },
        "salaryType": "monthly",
        "salaryAmount": "70,000",
        "salaryFrequency": "Monthly",
        "hiringMultiple": true,
        "location": "Mumbai",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249537460-tuhp7e9",
        "jobTitle": "Web Development",
        "jobDescription": "Join our team as a Web Development specialist.",
        "employmentTypes": [
          "part-time"
        ],
        "workingSchedule": {
          "dayShift": false,
          "nightShift": true,
          "weekendAvailability": true,
          "custom": "Night shift only"
        },
        "salaryType": "fixed",
        "salaryAmount": "85,000",
        "salaryFrequency": "Monthly",
        "hiringMultiple": false,
        "location": "Mumbai",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249538068-lrp0fzr",
        "jobTitle": "CRM Executive",
        "jobDescription": "Join our team as a CRM Executive specialist.",
        "employmentTypes": [
          "on-demand"
        ],
        "workingSchedule": {
          "dayShift": false,
          "nightShift": true,
          "weekendAvailability": true,
          "custom": "Night shift only"
        },
        "salaryType": "monthly",
        "salaryAmount": "48,000",
        "salaryFrequency": "Yearly",
        "hiringMultiple": false,
        "location": "Mumbai",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249541371-lwyxixx",
        "jobTitle": "HR & Operations",
        "jobDescription": "This is an auto-generated description for a HR & Operations role.",
        "employmentTypes": [
          "on-demand"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": true,
          "custom": "Flexible weekends"
        },
        "salaryType": "custom",
        "salaryAmount": "60,000",
        "salaryFrequency": "Monthly",
        "hiringMultiple": true,
        "location": "Hyderabad",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249541981-njwzbnq",
        "jobTitle": "Tele Caller",
        "jobDescription": "Contact and follow up with clients effectively.",
        "employmentTypes": [
          "full-time",
          "remote"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "hourly",
        "salaryAmount": "25",
        "salaryFrequency": "Monthly",
        "hiringMultiple": false,
        "location": "Bangalore",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249542619-jsrp8je",
        "jobTitle": "Channel Partners",
        "jobDescription": "Manage and grow channel partnerships.",
        "employmentTypes": [
          "part-time"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "fixed",
        "salaryAmount": "70,000",
        "salaryFrequency": "Monthly",
        "hiringMultiple": true,
        "location": "Pune",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249543262-4nto179",
        "jobTitle": "Real Estate Sales",
        "jobDescription": "Help clients buy dream homes while achieving sales goals.",
        "employmentTypes": [
          "part-time"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "monthly",
        "salaryAmount": "80,000 + Commission",
        "salaryFrequency": "Yearly",
        "hiringMultiple": false,
        "location": "Hyderabad",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249546435-2guuuxp",
        "jobTitle": "CRM Executive",
        "jobDescription": "This is an auto-generated description for a CRM Executive role.",
        "employmentTypes": [
          "part-time"
        ],
        "workingSchedule": {
          "dayShift": false,
          "nightShift": true,
          "weekendAvailability": true,
          "custom": "Night shift only"
        },
        "salaryType": "custom",
        "salaryAmount": "48,000",
        "salaryFrequency": "Weekly",
        "hiringMultiple": false,
        "location": "Hyderabad",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249547108-38wh0ug",
        "jobTitle": "Web Development",
        "jobDescription": "This is an auto-generated description for a Web Development role.",
        "employmentTypes": [
          "contract",
          "negotiable"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "fixed",
        "salaryAmount": "95,000",
        "salaryFrequency": "Yearly",
        "hiringMultiple": true,
        "location": "Mumbai",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249547661-rpol9gb",
        "jobTitle": "Digital Marketing",
        "jobDescription": "Join our team as a Digital Marketing specialist.",
        "employmentTypes": [
          "contract",
          "negotiable"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": true,
          "custom": "Flexible weekends"
        },
        "salaryType": "custom",
        "salaryAmount": "70,000",
        "salaryFrequency": "Weekly",
        "hiringMultiple": true,
        "location": "Hyderabad",
        "postedOn": "2025-07-23"
      },
      {
        "id": "job-1753249548235-h4d4dda",
        "jobTitle": "Accounts & Auditing",
        "jobDescription": "Join our team as a Accounts & Auditing specialist.",
        "employmentTypes": [
          "full-time",
          "remote"
        ],
        "workingSchedule": {
          "dayShift": true,
          "nightShift": false,
          "weekendAvailability": false,
          "custom": ""
        },
        "salaryType": "custom",
        "salaryAmount": "50,000",
        "salaryFrequency": "Yearly",
        "hiringMultiple": true,
        "location": "Remote",
        "postedOn": "2025-07-23"
      }
    ],
    notification: false,
    tasks: [
      { percent: 40, title: "Resume Screening", stage: "Evaluation", date: "May 27, 2027" },
      { percent: 60, title: "Interview Scheduling", stage: "Engagement", date: "May 20, 2027" },
      { percent: 30, title: "Candidate Communication", stage: "Relationship", date: "May 23, 2027" },
      { percent: 50, title: "Offer Management", stage: "Selection", date: "May 25, 2027" },
    ]
  });

  useEffect(() => {
    const user_details = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user_details"));
    const updatedContext = { ...rootContext, loader: false };

    if (user_details) {
      updatedContext.authenticated = true;
      updatedContext.user = user_details;
    } else {
      updatedContext.authenticated = false;
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
    const updatedContext = {
      ...rootContext,
      authenticated: false,
    };

    setRootContext(updatedContext);
    router.push(`/`);
  };


  const AnimatedBorderLoader = () => {
    return (
      <div
        className={`
        relative w-full max-w-[150px] h-10
        flex items-center px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base justify-center
        rounded-lg overflow-hidden
        bg-white dark:bg-slate-700
      `}
      >
        {/* Top border */}
        <span
          className="absolute top-0 left-0 h-0.5 w-0 
                   bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineTop"
        />
        {/* Right border */}
        <span
          className="absolute top-0 right-0 w-0.5 h-0 
                   bg-gradient-to-b from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineRight"
        />
        {/* Bottom border */}
        <span
          className="absolute bottom-0 right-0 h-0.5 w-0 
                   bg-gradient-to-l from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineBottom"
        />
        {/* Left border */}
        <span
          className="absolute bottom-0 left-0 w-0.5 h-0 
                   bg-gradient-to-t from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineLeft"
        />

        <div className="relative z-10 font-semibold text-gray-700 dark:text-gray-300 text-center px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
          POST NEW JOB
        </div>
      </div>
    );
  };

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // Loader displays for 3 seconds

    return () => clearTimeout(timer);
  }, [pathName]);
  const NotificationBell = ({ count }) => {
    return (
      <div className="relative w-4 h-4">
        <FaBell className="text-gray-700 dark:text-white w-full h-full" />
        {count > 0 && (
          <span className="absolute -top-[2px] -right-[2px] min-w-[12px] h-[12px] px-[2px] text-[8px] leading-[12px] text-white bg-red-500 rounded-full text-center ring-1 ring-white dark:ring-gray-800">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    );
  };
  const Topbar = () => (
    <div className="flex h-26 sm:h-16 flex-wrap sm:flex-nowrap fixed top-0 left-0 w-full z-50 justify-between items-center px-4 sm:px-6 py-2 bg-white shadow-md gap-2">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Image alt={"logo"} width={100} height={20} src="https://realestatejobs.co.in/images/logo.png" />
        <button
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          className="sm:hidden text-gray-700 focus:outline-none"
        >
          ☰
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        {pathName !== "/applications" && <div>
          {showLoader ? (
            // Use the new AnimatedBorderLoader here
            <AnimatedBorderLoader />
          ) : (
            <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-900 border-1.5 border-gray-900 text-white px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
              POST NEW JOB
            </button>
          )}
        </div>}
        <input
          type="text"
          placeholder="Search candidate, vacancy, etc"
          className="px-3 py-2 border rounded w-full sm:w-1/3 text-sm"
        />
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {rootContext.notification ? <NotificationBell count={3} /> : <FaBell className="text-gray-600" />}
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
              <div className="flex flex-col sm:flex-row pt-26 sm:pt-16 bg-gray-100 min-h-screen">
                <Sidebar isMobileOpen={isMobileSidebarOpen} toggleSidebar={setMobileSidebarOpen} />
                <main className="flex-1 sm:ml-36 p-1">{children}</main>
              </div>
            </div>
          )}
          {rootContext?.toast && <Toast />}
        </RootContext.Provider>
      </body>
    </html>
  );
}
