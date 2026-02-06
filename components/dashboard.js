'use client';
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, ChevronDownIcon, PlusIcon, MinusIcon, UserIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import RootContext from "../components/config/rootcontext";
import { Popover } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { addDays, format, differenceInDays, differenceInCalendarMonths, subDays, parseISO, isWithinInterval, startOfDay } from "date-fns";
import { ExclamationTriangleIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import AddEditTaskModal from "./task/addnewtask";
import { useSWRFetch } from "./config/useswrfetch";

// Category structure with icons
const categoryStructure = [
    {
        icon: "/icons/cp.png",
        title: "Channel Partners",
        description: "Collaborate & Earn",
        slug: "channel-partners"
    },
    {
        icon: "/icons/hrandop.png",
        title: "HR & Operations",
        description: "People & Process",
        slug: "hr-and-operations"
    },
    {
        icon: "/icons/realestate.png",
        title: "Real Estate Sales",
        description: "Sell Property Faster",
        slug: "real-estate-sales"
    },
    {
        icon: "/icons/tel.png",
        title: "Tele Caller",
        description: "Engage & Convert",
        slug: "tele-caller"
    },
    {
        icon: "/icons/digital.png",
        title: "Digital Marketing",
        description: "Promote & Convert",
        slug: "digital-marketing"
    },
    {
        icon: "/icons/webdev.png",
        title: "Web Development",
        description: "Build Real Estate Tech",
        slug: "web-development"
    },
    {
        icon: "/icons/crm.png",
        title: "CRM Executive",
        description: "Manage Client Relations",
        slug: "crm-executive"
    },
    {
        icon: "/icons/accounts.png",
        title: "Accounts & Auditing",
        description: "Ensure Financial Clarity",
        slug: "accounts-and-auditing"
    },
    {
        icon: '/icons/architects.png',
        title: 'Architects',
        description: 'Design Smart & Aesthetic Spaces',
        slug: 'architects'
    },
    {
        icon: '/icons/legal.png',
        title: 'Legal',
        description: 'Safeguard Deals & Compliance',
        slug: 'legal'
    },
];

const getRandomChangeChip = (percent) => {
    const rand = Math.random();
    if (rand < 0.33) {
        return {
            bg: "bg-green-100",
            text: "text-green-700",
            icon: <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />,
        };
    } else if (rand < 0.66) {
        return {
            bg: "bg-red-100",
            text: "text-red-600",
            icon: <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />,
        };
    } else {
        return {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            icon: <MinusIcon className="w-3 h-3 text-yellow-500" />,
        };
    }
};

const Dashboard = () => {
    const { rootContext, setRootContext } = useContext(RootContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectScheduleDate, setSelectScheduleDate] = useState(new Date());
    const [selectedStatType, setSelectedStatType] = useState("Applications");
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [companyID, setCompanyID] = useState(null);

    // Fetch company data
    useEffect(() => {
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setCompanyID(user_details.id || null);
    }, []);

    const { data: companyData, error, isLoading } = useSWRFetch(
        companyID ? `/api/companies?id=${companyID}` : null
    );

    // Use real company data directly
    const realCompanyData = companyData?.[0] || {};

    // Calculate recruitment statistics from real company data
    const calculateRecruitmentStats = () => {
        const appliedJobs = realCompanyData.appliedJobs || [];
        const jobs = realCompanyData.jobs || [];
        const chats = realCompanyData.chats || [];
        const recruiters = realCompanyData.recruiters || [];
        const applicants = realCompanyData.applicants || [];

        // Calculate job application status counts
        const statusCounts = {
            Applied: appliedJobs.filter(job => job.status === 'Applied').length,
            Selected: appliedJobs.filter(job => job.status === 'Selected').length,
            Shortlisted: 0, // We'll calculate this based on chats/interviews
            Interview: 0,
            Rejected: 0
        };

        // Count chats as a proxy for shortlisting/interviews
        const uniqueApplicantsInChats = new Set(chats.map(chat => chat.applicantId));
        statusCounts.Shortlisted = uniqueApplicantsInChats.size;

        // Count active chats as interviews
        const recentChats = chats.filter(chat => {
            if (!chat.lastMessage?.timestamp) return false;
            const chatDate = parseISO(chat.lastMessage.timestamp);
            const thirtyDaysAgo = subDays(new Date(), 30);
            return chatDate > thirtyDaysAgo;
        });
        statusCounts.Interview = recentChats.length;

        // Calculate response rate from chats
        const totalMessages = chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
        const responseRate = totalMessages > 0 ? Math.min(100, Math.round((recentChats.length / chats.length) * 100)) : 0;

        // Calculate average time to hire (simplified)
        const selectedJobs = appliedJobs.filter(job => job.status === 'Selected');
        const avgTimeToHire = selectedJobs.length > 0 ? 14 : 0; // Placeholder average days

        return {
            // Core recruitment metrics
            totalApplications: appliedJobs.length,
            totalJobs: jobs.length,
            totalApplicants: new Set(appliedJobs.map(job => job.applicantId)).size,
            activeRecruiters: recruiters.length,

            // Status breakdown
            statusCounts,

            // Engagement metrics
            activeChats: recentChats.length,
            totalChats: chats.length,
            responseRate,

            // Performance metrics
            avgTimeToHire,
            hireRate: appliedJobs.length > 0 ?
                Math.round((statusCounts.Selected / appliedJobs.length) * 100) : 0,

            // Category distribution
            categoryDistribution: calculateCategoryDistribution(jobs),

            // Recent activity
            recentApplications: appliedJobs
                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                .slice(0, 5)
        };
    };

    // Helper function to calculate category distribution
    const calculateCategoryDistribution = (jobs) => {
        const categoryCounts = {};
        jobs.forEach(job => {
            const category = job.categorySlug || 'other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const totalJobs = jobs.length;
        return Object.entries(categoryCounts).map(([category, count]) => {
            const categoryInfo = categoryStructure.find(cat => cat.slug === category) ||
                { title: category.charAt(0).toUpperCase() + category.slice(1) };
            return {
                name: categoryInfo.title,
                value: count,
                proportion: count / totalJobs
            };
        });
    };

    const recruitmentStats = calculateRecruitmentStats();

    // Calculate real stats with proper percentages
    const stats = useMemo(() => {
        const totalApps = recruitmentStats.totalApplications;
        const hireRate = recruitmentStats.hireRate;

        return [
            {
                title: "Total Applications",
                value: totalApps.toString(),
                ...getRandomChangeChip(95),
                percent: totalApps > 0 ? `${Math.round((recruitmentStats.statusCounts.Selected / totalApps) * 100)}% Hire Rate` : "0%",
                details: {
                    total: totalApps,
                    selected: recruitmentStats.statusCounts.Selected,
                    shortlisted: recruitmentStats.statusCounts.Shortlisted,
                    hireRate: `${hireRate}%`
                }
            },
            {
                title: "Active Jobs",
                value: recruitmentStats.totalJobs.toString(),
                ...getRandomChangeChip(recruitmentStats.totalJobs),
                percent: `${recruitmentStats.activeRecruiters} Active Recruiters`,
                details: {
                    totalJobs: recruitmentStats.totalJobs,
                    activeRecruiters: recruitmentStats.activeRecruiters,
                    categories: recruitmentStats.categoryDistribution.length
                }
            },
            {
                title: "Shortlisted",
                value: recruitmentStats.statusCounts.Shortlisted.toString(),
                ...getRandomChangeChip(recruitmentStats.statusCounts.Shortlisted),
                percent: `${recruitmentStats.statusCounts.Interview} in Interview`,
                details: {
                    shortlisted: recruitmentStats.statusCounts.Shortlisted,
                    interviews: recruitmentStats.statusCounts.Interview,
                    responseRate: `${recruitmentStats.responseRate}%`
                }
            },
            {
                title: "Selected",
                value: recruitmentStats.statusCounts.Selected.toString(),
                ...getRandomChangeChip(recruitmentStats.statusCounts.Selected),
                percent: `${recruitmentStats.avgTimeToHire} avg days to hire`,
                details: {
                    selected: recruitmentStats.statusCounts.Selected,
                    avgTimeToHire: `${recruitmentStats.avgTimeToHire} days`,
                    totalApplicants: recruitmentStats.totalApplicants
                }
            }
        ];
    }, [recruitmentStats]);

    // Rest of your existing dashboard code...
    const display2Date = selectedDate ? format(selectedDate, "dd MMM yyyy") : "Today";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const normalizedSelectScheduleDate = new Date(selectScheduleDate);
    normalizedSelectScheduleDate.setHours(0, 0, 0, 0);
    const displayScheduleDateDate = (normalizedSelectScheduleDate.getTime() === today.getTime())
        ? "Today"
        : format(selectScheduleDate, "dd MMM yyyy");

    const categoryColors = {
        Screening: 'bg-blue-100',
        Interview: 'bg-green-100',
        Offer: 'bg-yellow-100',
        Onboarding: 'bg-purple-100',
        Rejected: 'bg-red-100',
    };

    const tailwindBgToHex = {
        'bg-blue-100': '#dbeafe',
        'bg-green-100': '#dcfce7',
        'bg-yellow-100': '#fef9c3',
        'bg-purple-100': '#f3e8ff',
        'bg-red-100': '#fee2e2',
    };

    const scheduleData = rootContext.schedule || [];

    const filteredData = useMemo(() => {
        return scheduleData
            .filter(item => {
                const eventStartDate = startOfDay(parseISO(item.startDate));
                const eventEndDate = item.endDate ? startOfDay(parseISO(item.endDate)) : eventStartDate;
                const normalizedSelectDate = startOfDay(selectScheduleDate);
                return isWithinInterval(normalizedSelectDate, { start: eventStartDate, end: eventEndDate });
            })
            .map(item => ({
                ...item,
                time: item.time ? format(parseISO(`2000-01-01T${item.time}`), 'hh:mm a') : undefined,
                dept: item.category,
                color: categoryColors[item.category] || 'bg-gray-400'
            }));
    }, [selectScheduleDate, scheduleData, categoryColors]);

    const formatDateRange = () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        const dayStart = startDate.getDate();
        const dayEnd = endDate.getDate();
        const monthName = endDate.toLocaleDateString('en-US', { month: 'long' });

        return `${dayStart}-${dayEnd} ${monthName}`;
    };

    const dynamicRange = formatDateRange();
    let display1Date = dynamicRange;
    if (startDate && endDate) {
        const sameMonth = format(startDate, "MMM yyyy") === format(endDate, "MMM yyyy");
        if (sameMonth) {
            display1Date = `${format(startDate, "d")}–${format(endDate, "d MMM")}`;
        } else {
            display1Date = `${format(startDate, "d MMM")} – ${format(endDate, "d MMM")}`;
        }
    }

    const PALETTES_BY_STAT_TYPE = {
        "Total Applications": [
            "#dbeafe",
            "#bfdbfe",
            "#93c5fd"
        ],
        "Active Jobs": [
            "#d9f99d",
            "#bef264",
            "#a3e635"
        ],
        "Shortlisted": [
            "#dcfce7",
            "#bbf7d0",
            "#86efac"
        ],
        "Selected": [
            "#fee2e2",
            "#fecaca",
            "#fca5a5"
        ],
        "default": [
            '#a29eff',
            '#e1fb9b',
            '#fef8ae',
            '#e4fcb0',
            '#e7f5e6',
            '#f8f5fc',
        ]
    };

    const getColorsForChart = (selectedStatType) => {
        let combinedPalette = [];

        switch (selectedStatType) {
            case "Total Applications":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Total Applications"],
                    ...PALETTES_BY_STAT_TYPE["Shortlisted"]
                ];
                break;
            case "Active Jobs":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Active Jobs"],
                    ...PALETTES_BY_STAT_TYPE["Total Applications"]
                ];
                break;
            case "Shortlisted":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Shortlisted"],
                    ...PALETTES_BY_STAT_TYPE["Selected"]
                ];
                break;
            case "Selected":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Selected"],
                    ...PALETTES_BY_STAT_TYPE["Shortlisted"]
                ];
                break;
            default:
                combinedPalette = PALETTES_BY_STAT_TYPE["default"];
                break;
        }
        return combinedPalette;
    };

    const COLORS = getColorsForChart(selectedStatType);

    // Generate recruitment timeline data
    const generateRecruitmentTimelineData = (start = new Date(), end = addDays(new Date(), 6)) => {
        const appliedJobs = realCompanyData.appliedJobs || [];
        const days = differenceInDays(end, start) + 1;
        const data = [];

        // Group applications by date
        const applicationsByDate = {};

        appliedJobs.forEach(job => {
            try {
                if (job.appliedAt) {
                    const appliedDate = parseISO(job.appliedAt);
                    const formattedDate = format(appliedDate, "yyyy-MM-dd");
                    if (!applicationsByDate[formattedDate]) {
                        applicationsByDate[formattedDate] = {
                            Applied: 0,
                            Shortlisted: 0,
                            Selected: 0,
                            Rejected: 0
                        };
                    }

                    applicationsByDate[formattedDate].Applied += 1;

                    // Also count based on status
                    if (job.status === 'Selected') {
                        applicationsByDate[formattedDate].Selected += 1;
                    } else if (job.status === 'Applied') {
                        // Check if shortlisted (has chats)
                        const hasChat = realCompanyData.chats?.some(chat =>
                            chat.applicantId === job.applicantId
                        );
                        if (hasChat) {
                            applicationsByDate[formattedDate].Shortlisted += 1;
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing application date:", e);
            }
        });

        // Fill in all days in range
        for (let i = 0; i < days; i++) {
            const currentDate = addDays(start, i);
            const dateKey = format(currentDate, "yyyy-MM-dd");

            data.push({
                date: dateKey,
                Applied: applicationsByDate[dateKey]?.Applied || 0,
                Shortlisted: applicationsByDate[dateKey]?.Shortlisted || 0,
                Selected: applicationsByDate[dateKey]?.Selected || 0,
                Rejected: applicationsByDate[dateKey]?.Rejected || 0,
                Total: (applicationsByDate[dateKey]?.Applied || 0) +
                    (applicationsByDate[dateKey]?.Shortlisted || 0) +
                    (applicationsByDate[dateKey]?.Selected || 0) +
                    (applicationsByDate[dateKey]?.Rejected || 0)
            });
        }

        return data;
    };

    const [recruitmentTimelineData, setRecruitmentTimelineData] = useState(() =>
        generateRecruitmentTimelineData(subDays(new Date(), 6), new Date())
    );

    useEffect(() => {
        if (startDate && endDate) {
            setRecruitmentTimelineData(generateRecruitmentTimelineData(startDate, endDate));
        }
    }, [startDate, endDate, realCompanyData.appliedJobs]);

    const getBarColorByType = (type) => {
        switch (type) {
            case "Applied": return "#bfdbfe";
            case "Shortlisted": return "#bef264";
            case "Selected": return "#bbf7d0";
            case "Rejected": return "#fecaca";
            default: return "#bfdbfe";
        }
    };

    const getPieColorClassByType = (type) => {
        switch (type) {
            case "Total Applications": return "bg-blue-50";
            case "Active Jobs": return "bg-yellow-50";
            case "Shortlisted": return "bg-green-50";
            case "Selected": return "bg-red-50";
            default: return "bg-blue-50";
        }
    };

    const getPieDataByType = (type) => {
        switch (type) {
            case "Total Applications":
                return recruitmentStats.categoryDistribution;
            case "Active Jobs":
                // Return job types distribution
                return recruitmentStats.categoryDistribution;
            case "Shortlisted":
                // Return shortlisted by category
                return recruitmentStats.categoryDistribution.map(cat => ({
                    ...cat,
                    value: Math.floor(cat.value * 0.3) // 30% shortlisted rate
                }));
            case "Selected":
                // Return selected by category
                return recruitmentStats.categoryDistribution.map(cat => ({
                    ...cat,
                    value: Math.floor(cat.value * 0.1) // 10% selection rate
                }));
            default:
                return recruitmentStats.categoryDistribution;
        }
    };

    const getResourceDataByType = (type) => {
        // Return application sources or channels
        const sources = [
            { name: "Portal", value: 40 },
            { name: "Referral", value: 25 },
            { name: "Direct", value: 20 },
            { name: "Social", value: 15 }
        ];
        return sources;
    };

    const currentPieChartData = getPieDataByType(selectedStatType);
    const currentResourceChartData = getResourceDataByType(selectedStatType);

    // Use recent applications for the events section
    const recentApplications = recruitmentStats.recentApplications || [];

    const [filterType, setFilterType] = useState("Recent");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const taskList = rootContext.tasksColumns?.map(item => item.tasks).flat(1) || [];

    function ApplicationCard({ index, application }) {
        const getStatusColor = (status) => {
            switch (status?.toUpperCase()) {
                case 'SELECTED': return 'bg-green-100 text-green-800';
                case 'APPLIED': return 'bg-blue-100 text-blue-800';
                case 'SHORTLISTED': return 'bg-yellow-100 text-yellow-800';
                case 'REJECTED': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        const getTimeAgo = (dateString) => {
            const date = parseISO(dateString);
            const now = new Date();
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return format(date, 'dd MMM yyyy');
        };

        return (
            <div className="border border-gray-50 rounded-xl shadow-sm p-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-blue-50">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold text-gray-800">{application.applicantName}</h2>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <BriefcaseIcon className="w-3 h-3" />
                            <span>{application.jobTitle}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(application.status)}`}>
                        {application.status || 'Applied'}
                    </span>
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                        {getTimeAgo(application.appliedAt)}
                    </span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600">{application.applicantEmail}</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <PhoneIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const EnhancedApplications = recentApplications.map((application) => {
        return {
            ...application,
            icon: <UserIcon className="w-5 h-5" />,
            tags: [application.status, application.category].filter(Boolean),
        };
    });

    const aggregateToMonthly = (data) => {
        const monthlyData = {};
        data.forEach(item => {
            const date = new Date(item.date);
            const monthKey = format(date, 'yyyy-MM');

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    Applied: 0,
                    Shortlisted: 0,
                    Selected: 0,
                    Rejected: 0,
                    Total: 0,
                };
            }
            monthlyData[monthKey].Applied += item.Applied || 0;
            monthlyData[monthKey].Shortlisted += item.Shortlisted || 0;
            monthlyData[monthKey].Selected += item.Selected || 0;
            monthlyData[monthKey].Rejected += item.Rejected || 0;
            monthlyData[monthKey].Total += item.Total || 0;
        });

        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    };

    const chartData = useMemo(() => {
        if (!startDate || !endDate) {
            return recruitmentTimelineData;
        }
        const diffInMonths = differenceInCalendarMonths(endDate, startDate);
        if (diffInMonths >= 3) {
            return aggregateToMonthly(recruitmentTimelineData);
        }
        return recruitmentTimelineData;
    }, [recruitmentTimelineData, startDate, endDate]);

    const xAxisDataKey = (startDate && endDate && differenceInCalendarMonths(endDate, startDate) >= 3) ? 'month' : 'date';

    const handleSaveTask = (newTask) => {
        setRootContext((prev) => {
            const updatedTasks = [...prev.tasks, newTask];
            return {
                ...prev,
                tasks: updatedTasks,
            };
        });
    }

    return (
        <div className="text-gray-800 font-sans space-y-8">
            {/* Recruiter Dashboard Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
                        <p className="text-gray-600">Track and manage all recruitment activities</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Recruiter</p>
                            <p className="font-semibold">{realCompanyData.contactPerson || "Rama Krishna"}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recruitment Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedStatType(item.title)}
                                className={`px-4 py-3 rounded-xl shadow cursor-pointer transition-transform duration-200 ${selectedStatType === item.title ? item.title === "Total Applications" ? "bg-[#bfdbfe]" :
                                    item.title === "Active Jobs" ? "bg-[#bef264]" :
                                        item.title === "Shortlisted" ? "bg-[#bbf7d0]" :
                                            item.title === "Selected" ? "bg-[#fecaca]" :
                                                "bg-gray-200" : "bg-white"}`}>

                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <Popover className="relative">
                                        <Popover.Button className="text-sm text-gray-600 mb-2 cursor-pointer font-semibold">...</Popover.Button>
                                        <Popover.Panel className="absolute z-10 w-56 right-[-35px] mt-2 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-700 space-y-1">
                                            <p className="font-semibold">Details:</p>
                                            {item.details.total !== undefined && (
                                                <p><span className="font-medium">Total:</span> {item.details.total}</p>
                                            )}
                                            {item.details.selected !== undefined && (
                                                <p><span className="font-medium">Selected:</span> {item.details.selected}</p>
                                            )}
                                            {item.details.shortlisted !== undefined && (
                                                <p><span className="font-medium">Shortlisted:</span> {item.details.shortlisted}</p>
                                            )}
                                            {item.details.hireRate !== undefined && (
                                                <p><span className="font-medium">Hire Rate:</span> {item.details.hireRate}</p>
                                            )}
                                            {item.details.activeRecruiters !== undefined && (
                                                <p><span className="font-medium">Recruiters:</span> {item.details.activeRecruiters}</p>
                                            )}
                                            {item.details.interviews !== undefined && (
                                                <p><span className="font-medium">Interviews:</span> {item.details.interviews}</p>
                                            )}
                                            {item.details.avgTimeToHire !== undefined && (
                                                <p><span className="font-medium">Avg Time:</span> {item.details.avgTimeToHire}</p>
                                            )}
                                        </Popover.Panel>
                                    </Popover>
                                </div>
                                <div className="flex mt-2 justify-between items-center flex-wrap">
                                    <h2 className="text-2xl font-bold">{Number(item.value).toLocaleString()}</h2>
                                    <p className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${item.bg}`}>
                                        {item.icon}
                                        <span className={`text-xs ${item.text}`}>{item.percent}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="bg-white shadow rounded-xl w-full lg:w-1/2">
                            <div className="flex justify-between items-center pt-4 px-4">
                                <h3 className="text-md font-semibold">Recruitment Timeline</h3>
                                <Popover className="relative">
                                    {({ open, close }) => (
                                        <>
                                            <Popover.Button className="w-auto h-6 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-[9px] gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span className="font-semibold">{display1Date}</span>
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </Popover.Button>

                                            <Popover.Panel className="absolute z-10 mt-2 right-0">
                                                <div className="bg-white p-2 rounded shadow-lg">
                                                    <DatePicker
                                                        selectsRange
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        onChange={(update) => {
                                                            setDateRange(update);
                                                            if (update[0] && update[1]) {
                                                                close();
                                                            }
                                                        }}
                                                        inline
                                                    />
                                                </div>
                                            </Popover.Panel>
                                        </>
                                    )}
                                </Popover>
                            </div>
                            <div className="w-full h-64 bg-white rounded-xl mt-5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={750}
                                        height={200}
                                        data={chartData}
                                        barCategoryGap="30%"
                                        barGap={5}
                                    >
                                        <CartesianGrid stroke="white" strokeDashArray="4 4" />
                                        <XAxis
                                            dataKey={xAxisDataKey}
                                            axisLine={{ stroke: "#e5e7eb" }}
                                            tickLine={false}
                                            tickFormatter={(tick) => {
                                                try {
                                                    if (xAxisDataKey === 'month') {
                                                        return format(new Date(tick + '-01'), 'MMM yyyy');
                                                    }
                                                    return format(new Date(tick), 'dd MMM');
                                                } catch {
                                                    return tick;
                                                }
                                            }}
                                            angle={xAxisDataKey === 'date' && chartData.length > 10 ? -45 : 0}
                                            textAnchor={xAxisDataKey === 'date' && chartData.length > 10 ? "end" : "middle"}
                                            interval="preserveStartEnd"
                                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        />
                                        <YAxis
                                            axisLine={{ stroke: "#f3f4f6" }}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                                        />
                                        <Tooltip />
                                        <Legend />

                                        <Bar
                                            dataKey="Applied"
                                            fill={getBarColorByType("Applied")}
                                            stackId="recruitment"
                                            radius={[0, 0, 0, 0]}
                                            barSize={20}
                                        />
                                        <Bar
                                            dataKey="Shortlisted"
                                            fill={getBarColorByType("Shortlisted")}
                                            stackId="recruitment"
                                            radius={[0, 0, 0, 0]}
                                            barSize={20}
                                        />
                                        <Bar
                                            dataKey="Selected"
                                            fill={getBarColorByType("Selected")}
                                            stackId="recruitment"
                                            radius={[8, 8, 0, 0]}
                                            barSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 shadow rounded-xl w-full lg:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-semibold">{selectedStatType} by Category</h3>
                                <Popover className="relative ">
                                    {({ open, close }) => (
                                        <>
                                            <Popover.Button className="w-26 h-6 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-[9px]">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span className="font-semibold">{display2Date}</span>
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </Popover.Button>

                                            <Popover.Panel className="absolute z-10 mt-2 right-0">
                                                <div className="bg-white p-2 rounded shadow-lg">
                                                    <DatePicker
                                                        selected={selectedDate}
                                                        onChange={(date) => { setSelectedDate(date); close() }}
                                                        inline
                                                    />
                                                </div>
                                            </Popover.Panel>
                                        </>
                                    )}
                                </Popover>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between w-full bg-white rounded-xl">
                                <div className="flex flex-col justify-center items-center">
                                    <PieChart width={200} height={200}>
                                        <Pie
                                            data={currentPieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            stroke="none"
                                        >
                                            {currentPieChartData.map((entry, index) => (
                                                <Cell key={`cell-dept-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                    <p className="font-bold text-xl">{Number(currentPieChartData.reduce((sum, item) => item.value ? sum + item.value : sum, 0) || 0).toLocaleString()}</p>
                                    <p>Total {selectedStatType}</p>
                                </div>
                                <ul className="text-xs text-gray-700 mt-6">
                                    {currentPieChartData.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 mb-1">
                                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                            {item.name}: {item.value || 0}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Application Sources */}
                <div className={`${getPieColorClassByType(selectedStatType)} pt-3 shadow rounded-xl w-full space-y-4`}>
                    <h3 className="text-md font-semibold text-center">Application Sources</h3>
                    <div className="flex justify-center items-center">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={currentResourceChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={102}
                                paddingAngle={2}
                                stroke="none"
                            >
                                {currentResourceChartData.map((entry, index) => (
                                    <Cell key={`cell-resource-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label
                                    position="center"
                                    content={() => (
                                        <>
                                            <text x="50%" y="48%" textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="bold" fill="#333">
                                                {recruitmentStats.totalApplicants}
                                            </text>
                                            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#666">
                                                Total Applicants
                                            </text>
                                        </>
                                    )}
                                />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="flex justify-center items-center">
                        <ul className="text-xs text-gray-700 my-2 grid grid-cols-2 gap-2 list-none">
                            {currentResourceChartData.map((item, idx) => (
                                <li key={idx} className="flex gap-1 items-center">
                                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                    <div className="leading-tight">
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                        <span className="text-[11px] text-gray-500 block">{item.value}%</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recent Applications, Tasks, Schedule */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                {/* Recent Applications */}
                <div className="bg-white p-2 rounded-xl shadow w-full sm:w-1/2">
                    <div className="flex gap-5 justify-between items-center mb-3">
                        <p className="text-medium font-semibold">Recent Applications <span className="text-medium">({EnhancedApplications.length})</span></p>
                        <div className="flex gap-2">
                            <div
                                onClick={() => setFilterType("Recent")}
                                className={`flex gap-1 text-xs cursor-pointer ${filterType === "Recent" ? "text-lime-600 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
                            >
                                <p>Recent</p>
                            </div>
                            <p
                                onClick={() => setFilterType("All")}
                                className={`text-xs cursor-pointer ${filterType === "All" ? "text-lime-600 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
                            >
                                See All
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[300px] overflow-y-auto">
                        {EnhancedApplications.map((application, indx) => (
                            <ApplicationCard key={indx} index={indx} application={application} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 w-full sm:w-1/2">
                    {/* Recruitment Tasks */}
                    <div className="bg-white p-4 rounded-xl shadow w-full">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-md font-semibold">Recruitment Tasks</h3>
                            <button className="w-5 h-5 bg-lime-300 p-1 rounded" onClick={() => setShowTaskForm(!showTaskForm)}><PlusIcon /></button>
                        </div>
                        {showTaskForm &&
                            <AddEditTaskModal
                                isOpen={showTaskForm}
                                onClose={() => { setShowTaskForm(false) }}
                                onSave={handleSaveTask}
                            />
                        }
                        <div className="space-y-4  h-[300px] overflow-y-auto">
                            {taskList.map((task, idx) => (
                                <div key={idx} className="flex text-xs items-center gap-4 bg-gray-200 rounded-lg p-1">
                                    <div className="relative w-12 h-12">
                                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className="text-blue-200"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="text-blue-500"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeDasharray={`${task.progress}, 100`}
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                            {task.progress}%
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-800">{task.title}</h4>
                                        <p className="text-xs text-gray-500">{task.priority} — {task.dueDate}</p>
                                        {task.category && (
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {task.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Interview Schedule */}
                    <div className="bg-white p-4 rounded-xl shadow w-full">
                        <div className="flex justify-between mb-3">
                            <h3 className="text-sm font-semibold">Interview Schedule</h3>
                            <Popover className="relative">
                                {({ open, close }) => (
                                    <>
                                        <Popover.Button className="w-32 h-6 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-[9px]">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span className="font-semibold text-[10px]">{displayScheduleDateDate}</span>
                                            <ChevronDownIcon className="w-4 h-4" />
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-30 mt-2 right-0">
                                            <div className="bg-white p-2 rounded shadow-lg">
                                                <DatePicker
                                                    selected={selectScheduleDate}
                                                    onChange={(date) => {
                                                        setSelectScheduleDate(date);
                                                        close();
                                                    }}
                                                    inline
                                                />
                                            </div>
                                        </Popover.Panel>
                                    </>
                                )}
                            </Popover>
                        </div>

                        <div className="relative h-[300px] overflow-y-auto">
                            {filteredData.length === 0 ? (
                                <p className="text-center text-xs text-gray-400">No interviews scheduled for this day.</p>
                            ) : (
                                filteredData.map((item, index) => {
                                    const bgColorClass = item.color;
                                    const borderColorHex = tailwindBgToHex[bgColorClass] || 'gray';

                                    return (
                                        <div key={index} className="flex items-start gap-4 relative mt-2">
                                            <div className="w-[18%] text-xs font-medium text-gray-500">{item.time}</div>

                                            <div className="flex flex-col items-center relative">
                                                <span className={`w-3 h-3 rounded-full ${bgColorClass} z-10`} />

                                                <div
                                                    className="absolute left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dashed"
                                                    style={{
                                                        borderColor: borderColorHex,
                                                        top: '6px',
                                                        height: index === filteredData.length - 1 ? '3rem' : '4.3rem'
                                                    }}
                                                />
                                            </div>

                                            <div className={`w-[75%] flex flex-col gap-1 p-2 rounded-xl ${bgColorClass}`}>
                                                <span className="text-xs font-semibold text-gray-900">{item.title}</span>
                                                <span className="text-xs text-gray-600">{item.dept} Interview</span>
                                                <span className="text-xs text-gray-500">With {item.description || "Candidate"}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;