'use client';
import "./globals.css";
import React, { useEffect, useRef, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from 'next/font/google';
import Footer from "@/components/common/footer";
import Sidebar from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });


export default function RootLayout({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    tasksColumns: [
      {
        title: 'Backlog',
        tasks: [
          {
            id: '1',
            title: 'Add discount code to checkout page',
            dueDate: '2025-08-10',
            type: 'Feature Request',
            progress: 60,
            priority: 'High',
            assignedTo: ['A'],
            bookmarked: true,
            attachments: true,
            comments: false,
            duration: '03:14',
            timeSpent: '00:50',
            remaining: '02:24',
            overdue: false
          },
          {
            id: '2',
            title: 'Provide documentation on integrations',
            dueDate: '2025-08-07',
            progress: 25,
            priority: 'Medium',
            assignedTo: ['A'],
            bookmarked: false,
            attachments: true,
            comments: false,
            duration: '03:36',
            timeSpent: '02:00',
            remaining: '01:36',
            overdue: false
          }
        ]
      },
      {
        title: 'In Progress',
        tasks: [
          {
            id: '3',
            title: 'Fix bug in mobile nav',
            dueDate: '2025-08-01',
            type: 'Bug',
            progress: 30,
            priority: 'High',
            assignedTo: ['A'],
            bookmarked: true,
            attachments: true,
            comments: true,
            duration: '02:00',
            timeSpent: '01:00',
            remaining: '01:00',
            overdue: false
          },
          {
            id: '4',
            title: 'Refactor dashboard layout',
            dueDate: '2025-08-06',
            type: 'Feature Request',
            progress: 10,
            priority: 'Low',
            assignedTo: ['A'],
            bookmarked: false,
            attachments: false,
            comments: true,
            duration: '02:40',
            timeSpent: '00:40',
            remaining: '02:00',
            overdue: false
          }
        ]
      },
      {
        title: 'Review',
        tasks: [
          {
            id: '5',
            title: 'Add API rate limit warning',
            dueDate: '2025-08-09',
            type: 'Feature Request',
            progress: 80,
            priority: 'Medium',
            assignedTo: ['A'],
            bookmarked: true,
            attachments: false,
            comments: false,
            duration: '01:30',
            timeSpent: '01:20',
            remaining: '00:10',
            overdue: false
          },
          {
            id: '6',
            title: 'Remove legacy payment code',
            dueDate: '2025-07-31',
            type: 'Cleanup',
            progress: 90,
            priority: 'Low',
            assignedTo: ['A'],
            bookmarked: false,
            attachments: true,
            comments: true,
            duration: '00:45',
            timeSpent: '00:30',
            remaining: '00:15',
            overdue: false
          }
        ]
      },
      {
        title: 'Done',
        tasks: [
          {
            id: '7',
            title: 'Fix broken image on homepage',
            dueDate: '2025-08-02',
            type: 'Bug',
            progress: 100,
            priority: 'High',
            assignedTo: ['A'],
            bookmarked: true,
            attachments: false,
            comments: true,
            duration: '00:30',
            timeSpent: '00:30',
            remaining: '00:00',
            overdue: false
          },
          {
            id: '8',
            title: 'Update user settings UI',
            dueDate: '2025-08-01',
            type: 'Improvement',
            progress: 100,
            priority: 'Medium',
            assignedTo: ['A'],
            bookmarked: false,
            attachments: true,
            comments: false,
            duration: '01:30',
            timeSpent: '01:30',
            remaining: '00:00',
            overdue: false
          }
        ]
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
    if (!ready) return;

    const role = rootContext?.user?.role;
    const category = "Channel Partners";
    const allowedRoutes = [
      `/home`,
      `/jobs`,
      `/jobs/${category}`,
      `/services`,
      `/companies`,
      `/about`,
      `/details`,
      `/details/${rootContext?.user?.id || 1}/${rootContext?.user?.name || ""}`
    ];

    if (role !== "recruiter" && rootContext?.authenticated) {
      const isAllowed = allowedRoutes.some((route) =>
        pathName.startsWith(route)
      );
      if (!isAllowed && rootContext?.authenticated) {
        router.push("/");
      }
    }
  }, [ready, rootContext, pathName, router]);

  const logOut = () => {
    localStorage.clear();
    const updatedContext = {
      ...rootContext,
      authenticated: false,
      loader: true,
      user: {
        name: "",
        email: "",
        mobile: "",
        role: "",
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
      }
    };

    setRootContext(updatedContext);
    router.push(`/`);
  };

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // Loader displays for 3 seconds

    return () => clearTimeout(timer);
  }, [pathName]);


  return (
    <html lang="en" className={inter.variable}>
      <body className="w-full mx-auto">
        <RootContext.Provider value={{ rootContext, setRootContext }}>
          {(pathName !== "/login" && pathName !== "/signup") && (
            <Navbar rootContext={rootContext} showLoader={showLoader} logOut={logOut} />
          )}
          <div className={`${(pathName === "/login" || pathName === "/signup") ? "pt-0" : "pt-26 sm:pt-20"} flex`}>
            {!ready && <Loader />}
            {/* Sidebar only when authenticated & not home & not about & not services */}
            {rootContext?.user?.role === "recruiter" &&
              rootContext.authenticated &&
              pathName !== "/" &&
              pathName !== "/services" &&
              pathName !== "/about" &&
              pathName !== "/login" &&
              pathName !== "/signup" && (
                <Sidebar
                  isMobileOpen={isMobileSidebarOpen}
                  toggleSidebar={setMobileSidebarOpen}
                />
              )}
            {/* Main content */}
            <main className="w-full m-auto">
              {children}
            </main>
          </div>
          {(pathName !== "/login" && pathName !== "/signup") && <Footer />}
          {rootContext?.toast && <Toast />}
        </RootContext.Provider>
      </body>
    </html>
  );
}
