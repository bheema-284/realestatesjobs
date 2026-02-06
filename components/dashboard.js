'use client';
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, ChevronDownIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import RootContext from "../components/config/rootcontext";
import { Popover } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { addDays, format, differenceInDays, differenceInCalendarMonths, subDays, parseISO, isWithinInterval, startOfDay } from "date-fns";
import { ExclamationTriangleIcon, BuildingOfficeIcon, HomeModernIcon, MapPinIcon, UserGroupIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
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

    // Calculate company statistics
    const calculateCompanyStats = () => {
        const projects = realCompanyData.projects || [];
        const appliedJobs = realCompanyData.appliedJobs || [];
        const statistics = realCompanyData.statistics || [];
        const applicants = realCompanyData.applicants || [];
        const projectsOfApplicants = realCompanyData.projectsOfApplicants || [];
        const jobs = realCompanyData.jobs || [];

        // Find statistics values
        const getStatValue = (label) => {
            const stat = statistics.find(s => s.label === label);
            return stat ? stat.value : "0";
        };

        // Count project statuses
        const projectStatusCounts = projects.reduce((acc, project) => {
            const status = project.status?.toUpperCase() || 'UNKNOWN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Count job application statuses
        const jobStatusCounts = {
            Applied: appliedJobs.filter(job => job.status === 'Applied').length,
            Selected: appliedJobs.filter(job => job.status === 'Selected').length,
            Shortlisted: 0, // Not in your data, will calculate
            Rejected: 0,
            Interested: 0
        };

        return {
            // Company statistics
            projectsCompleted: getStatValue("Projects Completed"),
            happyCustomers: getStatValue("Happy Customers"),
            yearsExperience: getStatValue("Years Experience"),
            citiesPresence: getStatValue("Cities Presence"),

            // Project statistics
            totalProjects: projects.length,
            ongoingProjects: projectStatusCounts['ONGOING'] || 0,
            completedProjects: projectStatusCounts['COMPLETED'] || 0,

            // Job statistics
            totalJobs: jobs.length,
            totalApplicants: applicants.length,
            activeApplicants: new Set(projectsOfApplicants.map(p => p.applicantId)).size,

            // Application statistics
            jobApplications: jobStatusCounts.Applied,
            jobSelections: jobStatusCounts.Selected,
        };
    };

    const companyStats = calculateCompanyStats();

    // Calculate project statistics
    const calculateProjectStats = () => {
        const projects = realCompanyData.projects || [];

        if (projects.length === 0) {
            return {
                byType: [],
                byStatus: [],
                byLocation: [],
                totalValue: "0cr",
                averageBudget: "0cr"
            };
        }

        // Count by project type
        const typeCounts = {};
        const statusCounts = {};
        const locationCounts = {};
        let totalValue = 0;

        projects.forEach(project => {
            // Project type
            const type = project.projectType || 'Other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;

            // Project status
            const status = project.status?.toUpperCase() || 'UNKNOWN';
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            // Location
            const location = project.location || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;

            // Budget value
            if (project.budget) {
                const budgetStr = project.budget.toString().toLowerCase();
                let value = 0;
                if (budgetStr.includes('cr')) {
                    value = parseFloat(budgetStr.replace('cr', '').trim()) * 10000000;
                } else if (budgetStr.includes('lakh')) {
                    value = parseFloat(budgetStr.replace('lakh', '').replace('lakhs', '').trim()) * 100000;
                }
                totalValue += value;
            }
        });

        return {
            byType: Object.entries(typeCounts).map(([name, count]) => ({
                name,
                value: count,
                proportion: count / projects.length
            })),
            byStatus: Object.entries(statusCounts).map(([name, count]) => ({
                name,
                value: count,
                proportion: count / projects.length
            })),
            byLocation: Object.entries(locationCounts).map(([name, count]) => ({
                name,
                value: count,
                proportion: count / projects.length
            })),
            totalValue: (totalValue / 10000000).toFixed(1) + 'cr',
            averageBudget: (totalValue / projects.length / 10000000).toFixed(1) + 'cr'
        };
    };

    const projectStats = calculateProjectStats();

    // Calculate real stats with proper percentages
    const stats = useMemo(() => {
        const totalApps = companyStats.jobApplications;
        const totalProjects = companyStats.totalProjects;

        return [
            {
                title: "Total Projects",
                value: totalProjects.toString(),
                ...getRandomChangeChip(95),
                percent: `${Math.min(100, Math.round((companyStats.ongoingProjects / Math.max(1, totalProjects)) * 100))}% Ongoing`,
                details: {
                    agency: realCompanyData.name || "Alpha Reality",
                    ongoing: companyStats.ongoingProjects,
                    completed: companyStats.completedProjects,
                    totalValue: projectStats.totalValue
                }
            },
            {
                title: "Happy Customers",
                value: companyStats.happyCustomers,
                ...getRandomChangeChip(companyStats.happyCustomers),
                percent: "+12%",
                details: {
                    agency: realCompanyData.name || "Alpha Reality",
                    satisfaction: "98% Satisfaction Rate",
                    retention: "85% Repeat Business"
                }
            },
            {
                title: "Applications",
                value: companyStats.jobApplications.toString(),
                ...getRandomChangeChip(companyStats.jobApplications),
                percent: totalApps > 0 ? `${Math.round((companyStats.jobSelections / Math.max(1, companyStats.jobApplications)) * 100)}% Selected` : "0%",
                details: {
                    agency: realCompanyData.name || "Alpha Reality",
                    selected: companyStats.jobSelections,
                    activeApplicants: companyStats.activeApplicants
                }
            },
            {
                title: "Experience",
                value: companyStats.yearsExperience,
                ...getRandomChangeChip(100),
                percent: `${companyStats.citiesPresence} Cities`,
                details: {
                    agency: realCompanyData.name || "Alpha Reality",
                    cities: companyStats.citiesPresence,
                    projectsCompleted: companyStats.projectsCompleted
                }
            }
        ];
    }, [companyStats, realCompanyData.name, projectStats]);

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
        Personal: 'bg-red-100',
        Business: 'bg-rose-100',
        Family: 'bg-yellow-100',
        Holiday: 'bg-green-100',
        ETC: 'bg-sky-100',
    };

    const tailwindBgToHex = {
        'bg-red-100': '#dc2626',
        'bg-rose-100': '#e0193a',
        'bg-yellow-100': '#facc15',
        'bg-green-100': '#4ade80',
        'bg-sky-100': '#38bdf8',
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
        "Total Projects": [
            "#dbeafe",
            "#bfdbfe",
            "#93c5fd"
        ],
        "Happy Customers": [
            "#d9f99d",
            "#bef264",
            "#a3e635"
        ],
        "Applications": [
            "#dcfce7",
            "#bbf7d0",
            "#86efac"
        ],
        "Experience": [
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
            case "Total Projects":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Total Projects"],
                    ...PALETTES_BY_STAT_TYPE["Applications"]
                ];
                break;
            case "Happy Customers":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Happy Customers"],
                    ...PALETTES_BY_STAT_TYPE["Total Projects"]
                ];
                break;
            case "Applications":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Applications"],
                    ...PALETTES_BY_STAT_TYPE["Happy Customers"]
                ];
                break;
            case "Experience":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Experience"],
                    ...PALETTES_BY_STAT_TYPE["Total Projects"]
                ];
                break;
            default:
                combinedPalette = PALETTES_BY_STAT_TYPE["default"];
                break;
        }
        return combinedPalette;
    };

    const COLORS = getColorsForChart(selectedStatType);

    // Generate project timeline data
    const generateProjectTimelineData = (start = new Date(), end = addDays(new Date(), 6)) => {
        const projects = realCompanyData.projects || [];
        const days = differenceInDays(end, start) + 1;
        const data = [];

        // Group projects by date
        const projectsByDate = {};

        projects.forEach(project => {
            try {
                if (project.startDate) {
                    const startDate = parseISO(project.startDate);
                    const formattedDate = format(startDate, "yyyy-MM-dd");
                    if (!projectsByDate[formattedDate]) {
                        projectsByDate[formattedDate] = {
                            Ongoing: 0,
                            Completed: 0,
                            Upcoming: 0
                        };
                    }
                    const status = project.status?.toUpperCase() || 'ONGOING';
                    if (status === 'ONGOING') projectsByDate[formattedDate].Ongoing += 1;
                    else if (status === 'COMPLETED') projectsByDate[formattedDate].Completed += 1;
                    else projectsByDate[formattedDate].Upcoming += 1;
                }
            } catch (e) {
                console.error("Error parsing project date:", e);
            }
        });

        // Fill in all days in range
        for (let i = 0; i < days; i++) {
            const currentDate = addDays(start, i);
            const dateKey = format(currentDate, "yyyy-MM-dd");

            data.push({
                date: dateKey,
                Ongoing: projectsByDate[dateKey]?.Ongoing || 0,
                Completed: projectsByDate[dateKey]?.Completed || 0,
                Upcoming: projectsByDate[dateKey]?.Upcoming || 0,
                Total: (projectsByDate[dateKey]?.Ongoing || 0) +
                    (projectsByDate[dateKey]?.Completed || 0) +
                    (projectsByDate[dateKey]?.Upcoming || 0)
            });
        }

        return data;
    };

    const [projectTimelineData, setProjectTimelineData] = useState(() =>
        generateProjectTimelineData(subDays(new Date(), 6), new Date())
    );

    useEffect(() => {
        if (startDate && endDate) {
            setProjectTimelineData(generateProjectTimelineData(startDate, endDate));
        }
    }, [startDate, endDate, realCompanyData.projects]);

    const getBarColorByType = (type) => {
        switch (type) {
            case "Ongoing": return "#bfdbfe";
            case "Completed": return "#bef264";
            case "Upcoming": return "#bbf7d0";
            case "Total": return "#fecaca";
            default: return "#bfdbfe";
        }
    };

    const getPieColorClassByType = (type) => {
        switch (type) {
            case "Total Projects": return "bg-blue-50";
            case "Happy Customers": return "bg-yellow-50";
            case "Applications": return "bg-green-50";
            case "Experience": return "bg-red-50";
            default: return "bg-blue-50";
        }
    };

    const getPieDataByType = (type) => {
        switch (type) {
            case "Total Projects":
                return projectStats.byType;
            case "Happy Customers":
                return projectStats.byStatus;
            case "Applications":
                return projectStats.byLocation.slice(0, 6);
            case "Experience":
                // Return project types for experience chart
                return projectStats.byType;
            default:
                return projectStats.byType;
        }
    };

    const getResourceDataByType = (type) => {
        // Return services or project types as resources
        const services = realCompanyData.services || [];
        return services.slice(0, 4).map((service, index) => ({
            name: service,
            value: Math.floor(Math.random() * 100) + 20,
            proportion: 1 / services.length
        }));
    };

    const currentPieChartData = getPieDataByType(selectedStatType);
    const currentResourceChartData = getResourceDataByType(selectedStatType);

    // Use real projects data directly from companyData
    const events = realCompanyData.projects || [];

    const [filterType, setFilterType] = useState("Active");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const taskList = rootContext.tasksColumns?.map(item => item.tasks).flat(1) || [];

    const getNumericBudget = (budgetStr) => {
        if (!budgetStr) return 0;
        const budget = budgetStr.toString().toLowerCase();
        if (budget.includes('cr')) {
            return parseFloat(budget.replace('cr', '').trim()) * 100;
        } else if (budget.includes('lakh')) {
            return parseFloat(budget.replace('lakh', '').replace('lakhs', '').trim());
        }
        return parseFloat(budget) || 0;
    };

    const filteredEvents = filterType === "Active"
        ? [...events]
            .filter(project => project.status?.toUpperCase() === 'ONGOING')
            .slice(0, 5)
        : events;

    // Get project icon based on type
    const getProjectIcon = (project) => {
        if (project.projectType === 'Villas') {
            return <HomeModernIcon className="w-5 h-5 text-blue-600" />;
        } else if (project.projectType?.includes('Commercial')) {
            return <BuildingOfficeIcon className="w-5 h-5 text-green-600" />;
        } else {
            return <BuildingOfficeIcon className="w-5 h-5 text-orange-600" />;
        }
    };

    const getAltBackgroundColor = (selectedStatType, index) => {
        const colorPairs = {
            "Total Projects": ["Total Projects", "Applications"],
            "Happy Customers": ["Happy Customers", "Total Projects"],
            "Applications": ["Applications", "Happy Customers"],
            "Experience": ["Experience", "Total Projects"],
        };

        const pair = colorPairs[selectedStatType];
        if (!pair) {
            return "#ffc9c9ff";
        }

        const [firstType, secondType] = pair;
        const firstColor = PALETTES_BY_STAT_TYPE[firstType]?.[1] || "#ffffff";
        const secondColor = PALETTES_BY_STAT_TYPE[secondType]?.[1] || "#ffffff";

        return index % 2 === 0 ? firstColor : secondColor;
    };

    function ProjectCard({ index, project }) {
        const getStatusColor = (status) => {
            switch (status?.toUpperCase()) {
                case 'ONGOING': return 'bg-green-100 text-green-800';
                case 'COMPLETED': return 'bg-blue-100 text-blue-800';
                case 'UPCOMING': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <div className="border border-gray-50 rounded-xl shadow-sm p-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded-sm" style={{ backgroundColor: getAltBackgroundColor(selectedStatType, index) }}>
                        {getProjectIcon(project)}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold text-gray-800">{project.title}</h2>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPinIcon className="w-3 h-3" />
                            <span>{project.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                        {project.status || 'ONGOING'}
                    </span>
                    {project.bedrooms && (
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                            {project.bedrooms}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-gray-900">
                    <p className="mb-1">
                        <span className="text-blue-600">{project.budget || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-1">
                        <UserGroupIcon className="w-3 h-3" />
                        <span>{project.totalUnits || 'N/A'} Units</span>
                    </p>
                </div>
            </div>
        );
    }

    const EnhancedProjects = filteredEvents.map((project) => {
        return {
            ...project,
            icon: getProjectIcon(project),
            tags: [project.status, project.projectType].filter(Boolean),
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
                    Ongoing: 0,
                    Completed: 0,
                    Upcoming: 0,
                    Total: 0,
                };
            }
            monthlyData[monthKey].Ongoing += item.Ongoing || 0;
            monthlyData[monthKey].Completed += item.Completed || 0;
            monthlyData[monthKey].Upcoming += item.Upcoming || 0;
            monthlyData[monthKey].Total += item.Total || 0;
        });

        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    };

    const chartData = useMemo(() => {
        if (!startDate || !endDate) {
            return projectTimelineData;
        }
        const diffInMonths = differenceInCalendarMonths(endDate, startDate);
        if (diffInMonths >= 3) {
            return aggregateToMonthly(projectTimelineData);
        }
        return projectTimelineData;
    }, [projectTimelineData, startDate, endDate]);

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
            {/* Company Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <img
                        src={realCompanyData.profileImage || "https://via.placeholder.com/80"}
                        alt={realCompanyData.name || "Company"}
                        className="w-20 h-20 rounded-full border-4 border-white shadow"
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{realCompanyData.name || "Alpha Reality"}</h1>
                        <p className="text-gray-600">{realCompanyData.tagline || "Leading You to Better Living"}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                <BuildingOfficeIcon className="w-4 h-4" />
                                {realCompanyData.industry || "Real Estate"}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                <MapPinIcon className="w-4 h-4" />
                                {realCompanyData.location || "Hyderabad"}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                <ClockIcon className="w-4 h-4" />
                                Est. {realCompanyData.established || "2025"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedStatType(item.title)}
                                className={`px-4 py-3 rounded-xl shadow cursor-pointer transition-transform duration-200 ${selectedStatType === item.title ? item.title === "Total Projects" ? "bg-[#bfdbfe]" :
                                    item.title === "Happy Customers" ? "bg-[#bef264]" :
                                        item.title === "Applications" ? "bg-[#bbf7d0]" :
                                            item.title === "Experience" ? "bg-[#fecaca]" :
                                                "bg-gray-200" : "bg-white"}`}>

                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <Popover className="relative">
                                        <Popover.Button className="text-sm text-gray-600 mb-2 cursor-pointer font-semibold">...</Popover.Button>
                                        <Popover.Panel className="absolute z-10 w-56 right-[-35px] mt-2 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-700 space-y-1">
                                            <p><span className="font-semibold">Company:</span> {item.details.agency}</p>
                                            {item.details.ongoing !== undefined && (
                                                <p><span className="font-semibold">Ongoing:</span> {item.details.ongoing}</p>
                                            )}
                                            {item.details.completed !== undefined && (
                                                <p><span className="font-semibold">Completed:</span> {item.details.completed}</p>
                                            )}
                                            {item.details.totalValue && (
                                                <p><span className="font-semibold">Total Value:</span> {item.details.totalValue}</p>
                                            )}
                                            {item.details.satisfaction && (
                                                <p><span className="font-semibold">Satisfaction:</span> {item.details.satisfaction}</p>
                                            )}
                                            {item.details.selected !== undefined && (
                                                <p><span className="font-semibold">Selected:</span> {item.details.selected}</p>
                                            )}
                                            {item.details.cities && (
                                                <p><span className="font-semibold">Cities:</span> {item.details.cities}</p>
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
                                <h3 className="text-md font-semibold">Project Timeline</h3>
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
                                            dataKey="Ongoing"
                                            fill={getBarColorByType("Ongoing")}
                                            stackId="projects"
                                            radius={[0, 0, 0, 0]}
                                            barSize={20}
                                        />
                                        <Bar
                                            dataKey="Completed"
                                            fill={getBarColorByType("Completed")}
                                            stackId="projects"
                                            radius={[0, 0, 0, 0]}
                                            barSize={20}
                                        />
                                        <Bar
                                            dataKey="Upcoming"
                                            fill={getBarColorByType("Upcoming")}
                                            stackId="projects"
                                            radius={[8, 8, 0, 0]}
                                            barSize={20}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 shadow rounded-xl w-full lg:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-semibold">{selectedStatType} Distribution</h3>
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

                {/* Right Section */}
                <div className={`${getPieColorClassByType(selectedStatType)} pt-3 shadow rounded-xl w-full space-y-4`}>
                    <h3 className="text-md font-semibold text-center">Services Distribution</h3>
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
                                                {realCompanyData.services?.length || 0}
                                            </text>
                                            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#666">
                                                Services
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

            {/* Events, Tasks, Schedule */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                {/* Active Projects */}
                <div className="bg-white p-2 rounded-xl shadow w-full sm:w-1/2">
                    <div className="flex gap-5 justify-between items-center">
                        <p className="text-medium font-semibold">Active Projects <span className="text-medium">({EnhancedProjects.length})</span></p>
                        <div className="flex gap-2">
                            <div
                                onClick={() => setFilterType("Active")}
                                className={`flex gap-1 text-xs cursor-pointer ${filterType === "Active" ? "text-lime-600 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
                            >
                                <p>Active</p>
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
                        {EnhancedProjects.map((project, indx) => (
                            <ProjectCard key={indx} index={indx} project={project} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 w-full sm:w-1/2">
                    {/* Tasks */}
                    <div className="bg-white p-4 rounded-xl shadow w-full">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-md font-semibold">Tasks</h3>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Schedule */}
                    <div className="bg-white p-4 rounded-xl shadow w-full">
                        <div className="flex justify-between mb-3">
                            <h3 className="text-sm font-semibold">Daily Schedule</h3>
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
                                <p className="text-center text-xs text-gray-400">No events for this day.</p>
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
                                                <span className="text-xs text-gray-600">{item.dept}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Info Summary */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Our Values</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            {realCompanyData.values?.slice(0, 4).map((value, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Leadership</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {realCompanyData.leadership?.slice(0, 3).map((leader, idx) => (
                                <li key={idx}>
                                    <span className="font-medium">{leader.name}</span>
                                    <div className="text-xs text-gray-500">{leader.position}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Email:</span> {realCompanyData.email}</p>
                            <p><span className="font-medium">Phone:</span> {realCompanyData.mobile}</p>
                            <p><span className="font-medium">Website:</span> {realCompanyData.website}</p>
                            <p><span className="font-medium">Contact Person:</span> {realCompanyData.contactPerson}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;