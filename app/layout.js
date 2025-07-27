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
      {
        id: 1,
        title: 'Marketing strategy',
        priority: 'High',
        status: 'In progress',
        progress: 70,
        dueDate: '2025-07-28',
        remaining: '00:30',
        overdue: false,
        assignedTo: ['P', 'B'],
        attachments: true,
        comments: false,
        bookmarked: false,
        duration: '02:00',
        timeSpent: '01:30'
      },
      {
        id: 2,
        title: 'New contract template',
        priority: 'High',
        status: 'Needs review',
        progress: 90,
        dueDate: '2025-07-28',
        remaining: '00:00',
        overdue: false,
        assignedTo: ['P'],
        attachments: false,
        comments: true,
        bookmarked: true,
        duration: '01:00',
        timeSpent: '01:00'
      },
      {
        id: 3,
        title: 'New estimation for Fineline Inc. project',
        priority: 'High',
        status: 'Needs attention',
        progress: 40,
        dueDate: '2024-12-19',
        remaining: '-03:00',
        overdue: true,
        assignedTo: ['B', 'M'],
        attachments: true,
        comments: true,
        bookmarked: false,
        duration: '05:00',
        timeSpent: '08:00'
      },
      {
        id: 4,
        title: 'Quarter budget analysis',
        priority: 'High',
        status: 'Needs input',
        progress: 20,
        dueDate: '2025-01-11',
        remaining: '00:00',
        overdue: false,
        assignedTo: ['W', 'J'],
        attachments: false,
        comments: false,
        bookmarked: false,
        duration: '03:00',
        timeSpent: '00:40'
      },
      {
        id: 5,
        title: 'Launch marketing campaign',
        priority: 'High',
        status: 'In progress',
        progress: 60,
        dueDate: '2025-01-11',
        remaining: '00:00',
        overdue: false,
        assignedTo: ['W', 'J'],
        attachments: false,
        comments: false,
        bookmarked: true,
        duration: '04:00',
        timeSpent: '02:40'
      },
      {
        id: 6,
        title: 'Planning and data collection',
        priority: 'High',
        status: 'Planned',
        progress: 10,
        dueDate: '2025-01-11',
        remaining: '00:00',
        overdue: false,
        assignedTo: [],
        attachments: false,
        comments: false,
        bookmarked: false,
        duration: '01:30',
        timeSpent: '00:10'
      },
      {
        id: 7,
        title: 'Contract and other documentation',
        priority: 'Medium',
        status: 'Needs input',
        progress: 30,
        dueDate: '2025-07-30',
        remaining: '00:26',
        overdue: false,
        assignedTo: ['P', 'B'],
        attachments: true,
        comments: false,
        bookmarked: false,
        duration: '02:30',
        timeSpent: '01:50'
      },
      {
        id: 8,
        title: 'Sales pitch script & roleplay',
        priority: 'Medium',
        status: 'Needs attention',
        progress: 100,
        dueDate: '2024-12-22',
        remaining: '03:35',
        overdue: true,
        assignedTo: ['P', 'M'],
        attachments: false,
        comments: true,
        bookmarked: false,
        duration: '04:00',
        timeSpent: '00:25'
      },
      {
        id: 9,
        title: 'Find a place for client meetings',
        priority: 'Medium',
        status: 'In progress',
        progress: 80,
        dueDate: '2025-12-29',
        remaining: '00:15',
        overdue: false,
        assignedTo: ['W', 'J'],
        attachments: true,
        comments: false,
        bookmarked: true,
        duration: '01:30',
        timeSpent: '01:15'
      }
    ],
    schedule: [
      {
        title: 'Property Listing Review',
        startDate: '2025-07-05',
        endDate: '2025-07-05',
        category: 'Business',
        allDay: true,
        url: 'https://example.com/event-1734',
        guests: 'guest2',
        location: 'Location M',
        description: 'Description for Property Listing Review',
        id: 'job-1753599000001-9z7x8q2'
      },
      {
        title: 'Client Site Visit - Downtown Flats',
        startDate: '2025-07-06',
        endDate: '2025-07-06',
        category: 'Personal',
        allDay: false,
        url: 'https://example.com/event-8291',
        guests: 'guest4',
        location: 'Location R',
        description: 'Description for Client Site Visit - Downtown Flats',
        id: 'job-1753599000002-a1b2c3d'
      },
      {
        title: 'Photography Session - Villa Bella',
        startDate: '2025-07-07',
        endDate: '2025-07-07',
        category: 'Business',
        allDay: true,
        url: 'https://example.com/event-5823',
        guests: 'guest9',
        location: 'Location A',
        description: 'Description for Photography Session - Villa Bella',
        id: 'job-1753599000003-e4f5g6h'
      },
      {
        title: 'Team Standup - Weekly Sync',
        startDate: '2025-07-08',
        endDate: '2025-07-08',
        category: 'Meeting',
        allDay: false,
        url: 'https://example.com/event-1420',
        guests: 'guest1',
        location: 'Location W',
        description: 'Description for Team Standup - Weekly Sync',
        id: 'job-1753599000004-j1k2l3m'
      },
      {
        title: 'Broker Conference Call',
        startDate: '2025-07-09',
        endDate: '2025-07-09',
        category: 'Meeting',
        allDay: true,
        url: 'https://example.com/event-9731',
        guests: 'guest7',
        location: 'Location T',
        description: 'Description for Broker Conference Call',
        id: 'job-1753599000005-n4o5p6q'
      },
      {
        title: 'Final Deal Closure - Sunrise Apartments',
        startDate: '2025-07-10',
        endDate: '2025-07-10',
        category: 'Business',
        allDay: false,
        url: 'https://example.com/event-2104',
        guests: 'guest6',
        location: 'Location Z',
        description: 'Description for Final Deal Closure - Sunrise Apartments',
        id: 'job-1753599000006-r7s8t9u'
      },
      {
        title: 'Real Estate Webinar',
        startDate: '2025-07-11',
        endDate: '2025-07-11',
        category: 'Learning',
        allDay: true,
        url: 'https://example.com/event-3048',
        guests: 'guest8',
        location: 'Location B',
        description: 'Description for Real Estate Webinar',
        id: 'job-1753599000007-v1w2x3y'
      },
      {
        title: 'Site Visit with NRI Client',
        startDate: '2025-07-12',
        endDate: '2025-07-12',
        category: 'Business',
        allDay: false,
        url: 'https://example.com/event-4620',
        guests: 'guest3',
        location: 'Location D',
        description: 'Description for Site Visit with NRI Client',
        id: 'job-1753599000008-z5a6b7c'
      },
      {
        title: 'Family Get-together',
        startDate: '2025-07-13',
        endDate: '2025-07-13',
        category: 'Personal',
        allDay: true,
        url: 'https://example.com/event-1176',
        guests: 'guest5',
        location: 'Location H',
        description: 'Description for Family Get-together',
        id: 'job-1753599000009-c9d0e1f'
      },
      {
        title: 'Annual Property Audit',
        startDate: '2025-07-14',
        endDate: '2025-07-14',
        category: 'Business',
        allDay: false,
        url: 'https://example.com/event-6723',
        guests: 'guest0',
        location: 'Location E',
        description: 'Description for Annual Property Audit',
        id: 'job-1753599000010-g2h3i4j'
      },
      {
        title: 'Apartment Handover - Tower B',
        startDate: '2025-07-15',
        endDate: '2025-07-15',
        category: 'Business',
        allDay: true,
        url: 'https://example.com/event-3842',
        guests: 'guest2',
        location: 'Location K',
        description: 'Description for Apartment Handover - Tower B',
        id: 'job-1753599000011-l5m6n7o'
      },
      {
        title: 'Digital Marketing Campaign Launch',
        startDate: '2025-07-16',
        endDate: '2025-07-16',
        category: 'Marketing',
        allDay: false,
        url: 'https://example.com/event-5812',
        guests: 'guest6',
        location: 'Location J',
        description: 'Description for Digital Marketing Campaign Launch',
        id: 'job-1753599000012-p8q9r0s'
      },
      {
        title: 'Property Auction - Green Acres',
        startDate: '2025-07-17',
        endDate: '2025-07-17',
        category: 'Business',
        allDay: true,
        url: 'https://example.com/event-9053',
        guests: 'guest4',
        location: 'Location C',
        description: 'Description for Property Auction - Green Acres',
        id: 'job-1753599000013-t1u2v3w'
      },
      {
        title: 'Investment Portfolio Review',
        startDate: '2025-07-18',
        endDate: '2025-07-18',
        category: 'Finance',
        allDay: false,
        url: 'https://example.com/event-7289',
        guests: 'guest9',
        location: 'Location N',
        description: 'Description for Investment Portfolio Review',
        id: 'job-1753599000014-x4y5z6a'
      },
      {
        title: 'Family Feedback Session',
        startDate: '2025-07-19',
        endDate: '2025-07-19',
        category: 'Family',
        allDay: true,
        url: 'https://example.com/event-1893',
        guests: 'guest1',
        location: 'Location V',
        description: 'Description for Family Feedback Session',
        id: 'job-1753599000015-b7c8d9e'
      },
      {
        title: 'Business Feedback Session',
        startDate: '2025-07-19',
        endDate: '2025-07-19',
        category: 'Business',
        allDay: false,
        url: 'https://example.com/event-1893',
        guests: 'guest1',
        location: 'Location V',
        description: 'Description for Business Feedback Session',
        id: 'job-1753599000015-b7c8d9e'
      },
      {
        title: 'Holiday Feedback Session',
        startDate: '2025-07-19',
        endDate: '2025-07-19',
        category: 'Holiday',
        allDay: true,
        url: 'https://example.com/event-1893',
        guests: 'guest1',
        location: 'Location V',
        description: 'Description for Holyday Feedback Session',
        id: 'job-1753599000015-b7c8d9e'
      },
      {
        title: 'ETC Feedback Session',
        startDate: '2025-07-19',
        endDate: '2025-07-19',
        category: 'ETC',
        allDay: true,
        url: 'https://example.com/event-1893',
        guests: 'guest1',
        location: 'Location V',
        description: 'Description for ETC Feedback Session',
        id: 'job-1753599000015-b7c8d9e'
      }
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
