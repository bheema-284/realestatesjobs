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
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
    const realCompanyData = companyData || {};

    // Calculate real statistics from company data - NOW USING appliedJobs
    const calculateRealStats = () => {
        const convertToSlug = (category) => {
            if (!category || typeof category !== 'string') return 'other';

            // First, try to find exact match in categoryStructure
            const exactMatch = categoryStructure.find(item =>
                item.title.toLowerCase() === category.toLowerCase() ||
                item.slug.toLowerCase() === category.toLowerCase()
            );

            if (exactMatch) {
                return exactMatch.slug;
            }

            // If not found, try to find partial match
            const partialMatch = categoryStructure.find(item =>
                category.toLowerCase().includes(item.title.toLowerCase()) ||
                item.title.toLowerCase().includes(category.toLowerCase())
            );

            if (partialMatch) {
                return partialMatch.slug;
            }

            // If still not found, create a slug from the category
            return category
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')         // Replace spaces with hyphens
                .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
                .trim();
        };

        // Usage in your code
        const appliedJobs = (realCompanyData.appliedJobs || []).map(item => ({
            ...item,
            category: convertToSlug(item.category)
        }));

        // Calculate total applications
        const totalApplications = appliedJobs.length;

        // Calculate status counts from appliedJobs
        const statusCounts = {
            Applied: appliedJobs.filter(job => job.status === 'Applied').length,
            Selected: appliedJobs.filter(job => job.status === 'Selected').length,
            Shortlisted: 0, // We'll calculate based on logic
            Rejected: 0,
            Interested: 0
        };

        // Calculate Shortlisted as a percentage of Applied (minus Selected)
        statusCounts.Shortlisted = Math.max(0, Math.floor((statusCounts.Applied - statusCounts.Selected) * 0.3));

        // Calculate category distribution from appliedJobs
        const categoryDistribution = {};
        appliedJobs.forEach(job => {
            const category = job.category || job.jobDetails?.categorySlug || 'other';
            categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
        });

        // Get unique applicants
        const uniqueApplicants = new Set(appliedJobs.map(app => app.applicantId));

        return {
            totalApplications,
            statusCounts,
            totalApplicants: uniqueApplicants.size,
            categoryDistribution,
            // For backward compatibility
            totalJobs: Object.keys(categoryDistribution).length
        };
    };

    const realStats = calculateRealStats();

    // Calculate department distribution from category data
    const calculateDepartmentDistribution = () => {
        const categoryDistribution = realStats.categoryDistribution;

        // Get total applications
        const totalApps = realStats.totalApplications;

        if (totalApps === 0) {
            return categoryStructure.slice(0, 6).map(cat => ({
                name: cat.title,
                proportion: 1 / 6
            }));
        }

        // Map category slugs to proper names
        return Object.entries(categoryDistribution)
            .map(([category, count]) => {
                const categoryInfo = categoryStructure.find(cat => cat.slug === category) ||
                    categoryStructure.find(cat => cat.title.toLowerCase().includes(category.toLowerCase())) ||
                    { title: category.charAt(0).toUpperCase() + category.slice(1) };
                return {
                    name: categoryInfo.title,
                    value: count,
                    proportion: count / totalApps
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    };

    // Calculate resource distribution - using category distribution
    const calculateResourceDistribution = () => {
        const totalApplications = realStats.totalApplications;

        if (totalApplications === 0) {
            return [
                { name: "Tele Caller", proportion: 0.35 },
                { name: "Real Estate Sales", proportion: 0.30 },
                { name: "Channel Partners", proportion: 0.20 },
                { name: "Digital Marketing", proportion: 0.15 },
            ];
        }

        // Use category distribution for resource data
        const departmentDist = calculateDepartmentDistribution();

        return departmentDist.slice(0, 4).map(dept => ({
            name: dept.name,
            proportion: dept.proportion,
            value: dept.value
        }));
    };

    const departmentDistribution = calculateDepartmentDistribution();
    const resourceDistribution = calculateResourceDistribution();

    // Calculate real stats with proper percentages - BASED ON APPLIEDJOBS
    const stats = useMemo(() => {
        const totalApps = realStats.totalApplications;
        const statusCounts = realStats.statusCounts;

        return [
            {
                title: "Applications",
                value: totalApps.toString(),
                ...getRandomChangeChip(totalApps),
                percent: totalApps > 0 ? "100%" : "0%",
                details: {
                    agency: realCompanyData.name || "Your Company",
                    categories: Object.keys(realStats.categoryDistribution).length,
                    uniqueApplicants: realStats.totalApplicants
                }
            },
            {
                title: "Shortlisted",
                value: statusCounts.Shortlisted.toString(),
                ...getRandomChangeChip(statusCounts.Shortlisted),
                percent: totalApps > 0 ? `${Math.round((statusCounts.Shortlisted / totalApps) * 100)}%` : "0%",
                details: {
                    agency: realCompanyData.name || "Your Company",
                    fromApplications: statusCounts.Applied,
                    selectionRate: `${Math.round((statusCounts.Selected / Math.max(1, statusCounts.Shortlisted)) * 100)}% from shortlisted`
                }
            },
            {
                title: "Selected",
                value: statusCounts.Selected.toString(),
                ...getRandomChangeChip(statusCounts.Selected),
                percent: totalApps > 0 ? `${Math.round((statusCounts.Selected / totalApps) * 100)}%` : "0%",
                details: {
                    agency: realCompanyData.name || "Your Company",
                    hireRate: `${Math.round((statusCounts.Selected / Math.max(1, totalApps)) * 100)}% overall`,
                    fromShortlisted: `${Math.round((statusCounts.Selected / Math.max(1, statusCounts.Shortlisted)) * 100)}% from shortlisted`
                }
            },
            {
                title: "Active Jobs",
                value: Object.keys(realStats.categoryDistribution).length.toString(),
                ...getRandomChangeChip(Object.keys(realStats.categoryDistribution).length),
                percent: `${realStats.totalApplicants} unique applicants`,
                details: {
                    agency: realCompanyData.name || "Your Company",
                    categories: Object.keys(realStats.categoryDistribution).join(", "),
                    topCategory: departmentDistribution[0]?.name || "N/A"
                }
            }
        ];
    }, [realStats, realCompanyData.name, departmentDistribution]);

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
        "Applications": [
            "#dbeafe",
            "#bfdbfe",
            "#93c5fd"
        ],
        "Shortlisted": [
            "#d9f99d",
            "#bef264",
            "#a3e635"
        ],
        "Selected": [
            "#dcfce7",
            "#bbf7d0",
            "#86efac"
        ],
        "Active Jobs": [
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
            case "Applications":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Applications"],
                    ...PALETTES_BY_STAT_TYPE["Shortlisted"]
                ];
                break;
            case "Shortlisted":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Shortlisted"],
                    ...PALETTES_BY_STAT_TYPE["Applications"]
                ];
                break;
            case "Selected":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Selected"],
                    ...PALETTES_BY_STAT_TYPE["Active Jobs"]
                ];
                break;
            case "Active Jobs":
                combinedPalette = [
                    ...PALETTES_BY_STAT_TYPE["Active Jobs"],
                    ...PALETTES_BY_STAT_TYPE["Selected"]
                ];
                break;
            default:
                combinedPalette = PALETTES_BY_STAT_TYPE["default"];
                break;
        }
        return combinedPalette;
    };

    const COLORS = getColorsForChart(selectedStatType);

    // Generate recruitment data based on REAL appliedJobs data
    const generateRecruitmentData = (start = new Date(), end = addDays(new Date(), 6)) => {
        const appliedJobs = realCompanyData.appliedJobs || [];
        const days = differenceInDays(end, start) + 1;
        const data = [];

        // Group applications by date
        const applicationsByDate = {};

        appliedJobs.forEach(job => {
            try {
                if (job.appliedAt) {
                    const appliedDate = parseISO(job.appliedAt);
                    const dateKey = format(appliedDate, "yyyy-MM-dd");

                    if (!applicationsByDate[dateKey]) {
                        applicationsByDate[dateKey] = {
                            Applications: 0,
                            Shortlisted: 0,
                            Selected: 0,
                            ["Active Jobs"]: 0
                        };
                    }

                    applicationsByDate[dateKey].Applications += 1;

                    if (job.status === 'Selected') {
                        applicationsByDate[dateKey].Selected += 1;
                    } else if (job.status === 'Applied') {
                        // Assume 30% of applications get shortlisted
                        applicationsByDate[dateKey].Shortlisted += Math.random() < 0.3 ? 1 : 0;
                    }
                }
            } catch (e) {
                console.error("Error parsing date:", e);
            }
        });

        // Fill in all days in range
        for (let i = 0; i < days; i++) {
            const currentDate = addDays(start, i);
            const dateKey = format(currentDate, "yyyy-MM-dd");

            const dayData = applicationsByDate[dateKey] || {
                Applications: 0,
                Shortlisted: 0,
                Selected: 0,
                ["Active Jobs"]: 0
            };

            // Count unique job categories for this day as "Active Jobs"
            const dayJobs = appliedJobs.filter(job => {
                try {
                    if (job.appliedAt) {
                        const appliedDate = parseISO(job.appliedAt);
                        return format(appliedDate, "yyyy-MM-dd") === dateKey;
                    }
                    return false;
                } catch {
                    return false;
                }
            });

            const uniqueCategories = new Set(dayJobs.map(job => job.category || job.jobDetails?.categorySlug || 'other'));
            dayData["Active Jobs"] = uniqueCategories.size;

            data.push({
                date: dateKey,
                ...dayData
            });
        }

        return data;
    };

    const [dailyRecruitmentData, setDailyRecruitmentData] = useState(() =>
        generateRecruitmentData(subDays(new Date(), 6), new Date())
    );

    useEffect(() => {
        if (startDate && endDate) {
            setDailyRecruitmentData(generateRecruitmentData(startDate, endDate));
        }
    }, [startDate, endDate, realCompanyData.appliedJobs]);

    const getBarColorByType = (type) => {
        switch (type) {
            case "Applications": return "#bfdbfe";
            case "Shortlisted": return "#bef264";
            case "Selected": return "#bbf7d0";
            case "Active Jobs": return "#fecaca";
            default: return "#bfdbfe";
        }
    };

    const getPieColorClassByType = (type) => {
        switch (type) {
            case "Applications": return "bg-blue-50";
            case "Shortlisted": return "bg-yellow-50";
            case "Selected": return "bg-green-50";
            case "Active Jobs": return "bg-red-50";
            default: return "bg-blue-50";
        }
    };

    const getPieDataByType = (type) => {
        // Use department distribution for pie chart
        if (type === "Applications" || type === "Active Jobs") {
            return departmentDistribution.map(dept => ({
                name: dept.name,
                value: dept.value || 0
            })).filter(item => item.value > 0);
        } else {
            // For status-based charts, distribute values proportionally
            const totalValue = dailyRecruitmentData.reduce((sum, entry) => sum + (entry[type] || 0), 0);
            return departmentDistribution.map(dept => ({
                name: dept.name,
                value: Math.round(totalValue * dept.proportion)
            })).filter(item => item.value > 0);
        }
    };

    const getResourceDataByType = (type) => {
        // Use resource distribution (which is based on department distribution)
        return resourceDistribution.map(res => ({
            name: res.name,
            value: res.value || Math.round((realStats.totalApplications || 0) * res.proportion)
        })).filter(item => item.value > 0);
    };

    const currentPieChartData = getPieDataByType(selectedStatType);
    const currentResourceChartData = getResourceDataByType(selectedStatType);

    // Use appliedJobs data for vacancies section
    const getJobDataFromAppliedJobs = () => {
        const appliedJobs = realCompanyData.appliedJobs || [];

        // Group by job title and category
        const jobMap = {};

        appliedJobs.forEach(job => {
            const jobTitle = job.jobTitle || "Unknown Position";
            const category = job.category || job.jobDetails?.categorySlug || 'other';

            if (!jobMap[jobTitle]) {
                jobMap[jobTitle] = {
                    jobTitle,
                    category,
                    salary: job.jobDetails?.salary || "N/A",
                    employmentTypes: job.jobDetails?.employmentTypes || ["full-time"],
                    applications: 0
                };
            }
            jobMap[jobTitle].applications += 1;
        });

        return Object.values(jobMap);
    };

    const jobData = getJobDataFromAppliedJobs();

    const [filterType, setFilterType] = useState("Popular");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const taskList = rootContext.tasksColumns?.map(item => item.tasks).flat(1) || [];

    const getNumericSalary = (salaryStr) => {
        if (!salaryStr) return 0;
        const match = salaryStr.toString().replace(/,/g, "").match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const filteredJobData = filterType === "Popular"
        ? [...jobData]
            .sort((a, b) => b.applications - a.applications)
            .slice(0, 5)
        : jobData;

    // Get job icon based on category
    const getJobIcon = (job) => {
        const category = categoryStructure.find(cat => cat.slug === job.category);
        if (category?.icon) {
            return (
                <img
                    src={category.icon}
                    alt={category.title}
                    className="h-5 w-auto object-contain mx-auto"
                />
            );
        }
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    };

    const getAltBackgroundColor = (selectedStatType, index) => {
        const colorPairs = {
            "Applications": ["Applications", "Shortlisted"],
            "Shortlisted": ["Shortlisted", "Applications"],
            "Selected": ["Selected", "Active Jobs"],
            "Active Jobs": ["Active Jobs", "Selected"],
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

    function VacancyCard({ index, job }) {
        const salaryText = job.salary || "Salary not specified";

        return (
            <div className="border border-gray-50 rounded-xl shadow-sm p-3">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-sm" style={{ backgroundColor: getAltBackgroundColor(selectedStatType, index) }}>
                        {getJobIcon(job)}
                    </div>
                    <h2 className="text-sm font-semibold text-gray-800">{job.jobTitle}</h2>
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                    {job.employmentTypes?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 font-semibold text-gray-600 text-[11px] px-2 py-1 rounded-full capitalize"
                        >
                            {tag.replace("-", " ")}
                        </span>
                    ))}
                    <span className="bg-blue-100 text-blue-700 text-[11px] px-2 py-1 rounded-full font-semibold">
                        {job.category?.replace("-", " ") || "General"}
                    </span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mt-2">
                    <p className="mb-1">
                        <span className="text-green-600">{salaryText}</span>
                    </p>
                    <p className="text-blue-600">
                        {job.applications} Applicant{job.applications !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        );
    }

    const EnhancedJobs = filteredJobData.map((job) => {
        return {
            ...job,
            icon: getJobIcon(job),
            tags: [...(job.employmentTypes || []), job.category].filter(Boolean),
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
                    Applications: 0,
                    Shortlisted: 0,
                    Selected: 0,
                    ["Active Jobs"]: 0,
                };
            }
            monthlyData[monthKey].Applications += item.Applications || 0;
            monthlyData[monthKey].Shortlisted += item.Shortlisted || 0;
            monthlyData[monthKey].Selected += item.Selected || 0;
            monthlyData[monthKey]["Active Jobs"] += item["Active Jobs"] || 0;
        });

        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    };

    const chartData = useMemo(() => {
        const diffInMonths = differenceInCalendarMonths(endDate, startDate);
        if (diffInMonths >= 3) {
            return aggregateToMonthly(dailyRecruitmentData);
        }
        return dailyRecruitmentData;
    }, [dailyRecruitmentData, startDate, endDate]);

    const xAxisDataKey = differenceInCalendarMonths(endDate, startDate) >= 3 ? 'month' : 'date';

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
                                className={`px-4 py-3 rounded-xl shadow cursor-pointer transition-transform duration-200 ${selectedStatType === item.title ? item.title === "Applications" ? "bg-[#bfdbfe]" :
                                    item.title === "Shortlisted" ? "bg-[#bef264]" :
                                        item.title === "Selected" ? "bg-[#bbf7d0]" :
                                            item.title === "Active Jobs" ? "bg-[#fecaca]" :
                                                "bg-gray-200" : "bg-white"}`}>

                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <Popover className="relative">
                                        <Popover.Button className="text-sm text-gray-600 mb-2 cursor-pointer font-semibold">...</Popover.Button>
                                        <Popover.Panel className="absolute z-10 w-56 right-[-35px] mt-2 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-700 space-y-1">
                                            <p><span className="font-semibold">Agency:</span> {item.details.agency}</p>
                                            {item.details.categories !== undefined && (
                                                <p><span className="font-semibold">Categories:</span> {item.details.categories}</p>
                                            )}
                                            {item.details.uniqueApplicants !== undefined && (
                                                <p><span className="font-semibold">Unique Applicants:</span> {item.details.uniqueApplicants}</p>
                                            )}
                                            {item.details.fromApplications !== undefined && (
                                                <p><span className="font-semibold">From Applications:</span> {item.details.fromApplications}</p>
                                            )}
                                            {item.details.selectionRate && (
                                                <p><span className="font-semibold">Selection Rate:</span> {item.details.selectionRate}</p>
                                            )}
                                            {item.details.hireRate && (
                                                <p><span className="font-semibold">Hire Rate:</span> {item.details.hireRate}</p>
                                            )}
                                            {item.details.fromShortlisted && (
                                                <p><span className="font-semibold">From Shortlisted:</span> {item.details.fromShortlisted}</p>
                                            )}
                                            {item.details.categories && typeof item.details.categories === 'string' && (
                                                <p><span className="font-semibold">Categories:</span> {item.details.categories}</p>
                                            )}
                                            {item.details.topCategory && (
                                                <p><span className="font-semibold">Top Category:</span> {item.details.topCategory}</p>
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
                                <h3 className="text-md font-semibold">{selectedStatType}</h3>
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

                                        {selectedStatType === "Applications" && (
                                            <>
                                                <Bar
                                                    dataKey="Shortlisted"
                                                    fill={getBarColorByType("Shortlisted")}
                                                    stackId="applications-shortlisted"
                                                    radius={[0, 0, 0, 0]}
                                                    barSize={20}
                                                />
                                                <Bar
                                                    dataKey="Applications"
                                                    fill={getBarColorByType("Applications")}
                                                    stackId="applications-shortlisted"
                                                    radius={[8, 8, 0, 0]}
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {selectedStatType === "Shortlisted" && (
                                            <>
                                                <Bar
                                                    dataKey="Applications"
                                                    fill={getBarColorByType("Applications")}
                                                    stackId="applications-shortlisted"
                                                    radius={[0, 0, 0, 0]}
                                                    barSize={20}
                                                />
                                                <Bar
                                                    dataKey="Shortlisted"
                                                    fill={getBarColorByType("Shortlisted")}
                                                    stackId="applications-shortlisted"
                                                    radius={[8, 8, 0, 0]}
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {selectedStatType === "Selected" && (
                                            <>
                                                <Bar
                                                    dataKey="Active Jobs"
                                                    fill={getBarColorByType("Active Jobs")}
                                                    stackId="selected-activejobs"
                                                    radius={[0, 0, 0, 0]}
                                                    barSize={20}
                                                />
                                                <Bar
                                                    dataKey="Selected"
                                                    fill={getBarColorByType("Selected")}
                                                    stackId="selected-activejobs"
                                                    radius={[8, 8, 0, 0]}
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {selectedStatType === "Active Jobs" && (
                                            <>
                                                <Bar
                                                    dataKey="Selected"
                                                    fill={getBarColorByType("Selected")}
                                                    stackId="selected-activejobs"
                                                    radius={[0, 0, 0, 0]}
                                                    barSize={20}
                                                />
                                                <Bar
                                                    dataKey="Active Jobs"
                                                    fill={getBarColorByType("Active Jobs")}
                                                    stackId="selected-activejobs"
                                                    radius={[8, 8, 0, 0]}
                                                    barSize={20}
                                                />
                                            </>
                                        )}
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
                                    <p className="font-bold text-xl">{Number(currentPieChartData.reduce((sum, item) => sum + item.value, 0) || 0).toLocaleString()}</p>
                                    <p>Total {selectedStatType}</p>
                                </div>
                                <ul className="text-xs text-gray-700 mt-6">
                                    {currentPieChartData.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                            {item.name}: {item.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className={`${getPieColorClassByType(selectedStatType)} pt-3 shadow rounded-xl w-full space-y-4`}>
                    <h3 className="text-md font-semibold text-center">Applicant Resources</h3>
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
                                                {Number(currentResourceChartData.reduce((sum, item) => sum + item.value, 0) || 0).toLocaleString()}
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
                                        <span className="font-medium text-gray-900">{item.value}</span>
                                        <span className="text-[11px] text-gray-500 block">{item.name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Events, Tasks, Schedule */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                {/* Events - Using Applied Jobs Data */}
                <div className="bg-white p-2 rounded-xl shadow w-full sm:w-1/2">
                    <div className="flex gap-5 justify-between items-center">
                        <p className="text-medium font-semibold">Current Vacancies <span className="text-medium">({EnhancedJobs.length})</span></p>
                        <div className="flex gap-2">
                            <div
                                onClick={() => setFilterType("Popular")}
                                className={`flex gap-1 text-xs cursor-pointer ${filterType === "Popular" ? "text-lime-600 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
                            >
                                <p>Popular</p>
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
                        {EnhancedJobs.map((job, indx) => (
                            <VacancyCard key={indx} index={indx} job={job} />
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
        </div>
    );
};

export default Dashboard;