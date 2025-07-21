'use client';
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    Label,
} from "recharts";
import { FaCode, FaPaintBrush, FaUserTie, FaBriefcase, FaBell } from "react-icons/fa";
import { FaLaptopCode, FaBuilding, FaHeadset, FaUsers, FaBullhorn, FaFileInvoiceDollar, FaUserCog } from "react-icons/fa";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import RootContext from "../components/config/rootcontext";
import { Popover } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format, differenceInDays, subDays } from "date-fns";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import TaskModal from "./createtasks";

const Dashboard = () => {
    const { rootContext, setRootContext } = useContext(RootContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatType, setSelectedStatType] = useState("Applications");
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const displayDate = selectedDate ? format(selectedDate, "dd MMM yyyy") : "Today";
    const display2Date = selectedDate ? format(selectedDate, "dd MMM yyyy") : "Today";
    let display1Date = "Today";
    if (startDate && endDate) {
        const sameMonth = format(startDate, "MMM yyyy") === format(endDate, "MMM yyyy");
        if (sameMonth) {
            display1Date = `${format(startDate, "d")}–${format(endDate, "d MMM")}`;
        } else {
            display1Date = `${format(startDate, "d MMM")} – ${format(endDate, "d MMM")}`;
        }
    }
    const COLORS = [
        '#a29eff', // Engineering
        '#e1fb9b', // Marketing
        '#fef8ae', // Sales
        '#e4fcb0', // Customer Support
        '#e7f5e6', // Finance
        '#f8f5fc', // Human Resources
    ];

    const generateRecruitmentData = (start = new Date(), end = addDays(new Date(), 6)) => {
        const days = differenceInDays(end, start) + 1;
        const data = [];

        for (let i = 0; i < days; i++) {
            const date = format(addDays(start, i), "dd MMM");
            const applications = Math.floor(Math.random() * 101) + 300; // 300–400
            const shortlisted = Math.floor(applications * 0.3);
            const hired = Math.floor(shortlisted * 0.2);
            const rejected = applications - shortlisted - hired;

            data.push({ date, Applications: applications, Shortlisted: shortlisted, Hired: hired, Rejected: rejected });
        }

        return data;
    };

    const [dailyRecruitmentData, setDailyRecruitmentData] = useState(generateRecruitmentData(subDays(new Date(), 6), new Date()));

    useEffect(() => {
        if (startDate && endDate) {
            setDailyRecruitmentData(generateRecruitmentData(startDate, endDate));
        }
    }, [startDate, endDate]);

    // Base distributions (percentages or proportions) for pie charts.
    // These will be scaled by the total value of the selectedStatType.
    const departmentDistribution = [
        { name: "Engineering", proportion: 0.25 },
        { name: "Marketing", proportion: 0.20 },
        { name: "Sales", proportion: 0.15 },
        { name: "Customer Support", proportion: 0.15 },
        { name: "Finance", proportion: 0.10 },
        { name: "Human Resources", proportion: 0.149 },
    ];
    // Sum of proportions should ideally be 1 (100%)
    // console.log("Dept Proportion Sum:", departmentDistribution.reduce((sum, d) => sum + d.proportion, 0));


    const resourceDistribution = [
        { name: "Job Boards", proportion: 0.35 },
        { name: "Social Media Campaigns", proportion: 0.30 },
        { name: "Employee Referrals", proportion: 0.20 },
        { name: "Recruitment Agencies", proportion: 0.12 },
    ];
    // Sum of proportions should ideally be 1 (100%)
    // console.log("Resource Proportion Sum:", resourceDistribution.reduce((sum, r) => sum + r.proportion, 0));


    // --- STATS DATA (largely remains the same, but now derived from dailyRecruitmentData for consistency) ---
    // Calculate current totals from the dailyRecruitmentData for the stats cards
    const getRandomPercentage = (value, base) => {
        if (base === 0) return 0;
        const percentage = (value / base) * 100;
        return Math.min(100, Math.max(1, Math.round(percentage)));
    };

    const totalApplications = dailyRecruitmentData.reduce((sum, entry) => sum + entry.Applications, 0);
    const totalShortlisted = dailyRecruitmentData.reduce((sum, entry) => sum + entry.Shortlisted, 0);
    const totalHired = dailyRecruitmentData.reduce((sum, entry) => sum + entry.Hired, 0);
    const totalRejected = dailyRecruitmentData.reduce((sum, entry) => sum + entry.Rejected, 0);

    // Dynamically calculate percentages
    const shortlistedPercent = getRandomPercentage(totalShortlisted, totalApplications);
    const hiredPercent = getRandomPercentage(totalHired, totalApplications);
    const rejectedPercent = getRandomPercentage(totalRejected, totalApplications);

    const stats = [
        {
            title: "Applications",
            value: totalApplications.toString(),
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">95%</span>
                </span>
            ),
            details: {
                agency: "Dream Homes Realty",
                lastMonth: 475,
                growth: `${totalApplications - 475} more applications than last month`
            }
        },
        {
            title: "Shortlisted",
            value: totalShortlisted.toString(),
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">{shortlistedPercent}%</span>
                </span>
            ),
            details: {
                agency: "Urban Nest Group",
                lastMonth: 107,
                growth: `${totalShortlisted - 107} more shortlisted than last month`
            }
        },
        {
            title: "Hired",
            value: totalHired.toString(),
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">{hiredPercent}%</span>
                </span>
            ),
            details: {
                agency: "Skyline Realtors",
                lastMonth: 40,
                growth: `${totalHired - 40} more hires than last month`
            }
        },
        {
            title: "Rejected",
            value: totalRejected.toString(),
            change: (
                <span className="flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">{rejectedPercent}%</span>
                </span>
            ),
            details: {
                agency: "Elite Brokers",
                lastMonth: 91,
                drop: `${91 - totalRejected} fewer rejections than last month`
            }
        }
    ];

    const getBarColorByType = (type) => {
        switch (type) {
            case "Applications": return "#bfdbfe"; // Tailwind blue-200
            case "Shortlisted": return "#fef08a";  // Tailwind yellow-200
            case "Hired": return "#c4fcd8ff";      // Tailwind green-200 (example)
            case "Rejected": return "#ffbabaff";   // Tailwind red-200 (example)
            default: return "#bfdbfe";
        }
    };

    // --- PIE CHART GETTER FUNCTIONS (now derive values from total of selectedStatType) ---
    const getPieDataByType = (type) => {
        // Find the total value of the selected stat type from dailyRecruitmentData
        const totalValue = dailyRecruitmentData.reduce((sum, entry) => sum + (entry[type] || 0), 0);

        // Distribute this total value across departments based on proportions
        return departmentDistribution.map(dept => ({
            name: dept.name,
            value: Math.round(totalValue * dept.proportion) // Use Math.round for whole numbers
        })).filter(item => item.value > 0); // Filter out zero values for better pie chart rendering
    };

    const getResourceDataByType = (type) => {
        // Find the total value of the selected stat type from dailyRecruitmentData
        const totalValue = dailyRecruitmentData.reduce((sum, entry) => sum + (entry[type] || 0), 0);

        // Distribute this total value across resources based on proportions
        return resourceDistribution.map(res => ({
            name: res.name,
            value: Math.round(totalValue * res.proportion) // Use Math.round for whole numbers
        })).filter(item => item.value > 0); // Filter out zero values for better pie chart rendering
    };

    // Pre-calculate the data based on selectedStatType
    const currentPieChartData = getPieDataByType(selectedStatType);
    const currentResourceChartData = getResourceDataByType(selectedStatType);

    const events = rootContext.jobs || [{
        "id": "job-1752833777976-m3joa98",
        "jobTitle": "Real Estate Sales",
        "jobDescription": "Drive property sales and meet targets.",
        "employmentTypes": [
            "full-time",
            "negotiable"
        ],
        "workingSchedule": {
            "dayShift": false,
            "nightShift": true,
            "weekendAvailability": true,
            "custom": "Night shift only"
        },
        "salaryType": "monthly",
        "salaryAmount": "85,000 + Bonus",
        "salaryFrequency": "Yearly",
        "hiringMultiple": true,
        "location": "Hyderabad",
        "postedOn": "2025-07-18"
    }]

    const schedule = [
        { time: "1:00 PM", title: "Marketing Strategy Presentation", dept: "Marketing", color: "bg-lime-200 text-lime-900" },
        { time: "2:30 PM", title: "HR Policy Update Session", dept: "Human Resources", color: "bg-lime-100 text-lime-800" },
        { time: "4:00 PM", title: "Customer Feedback Analysis", dept: "Customer Support", color: "bg-indigo-100 text-indigo-800" },
        { time: "5:30 PM", title: "Financial Reporting Session", dept: "Finance", color: "bg-indigo-200 text-indigo-900" },
    ];

    const tailwindBgToHex = {
        "bg-lime-200": "#e0f780", // Approximate hex for lime-200
        "bg-lime-100": "#f0f7c2", // Approximate hex for lime-100
        "bg-indigo-100": "#e0e7ff", // Approximate hex for indigo-100
        "bg-indigo-200": "#c7d2fe", // Approximate hex for indigo-200
        // Add other background colors you might use in your schedule data
    };

    // const [startDate, setStartDate] = useState(new Date());
    const [filterType, setFilterType] = useState("Popular");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", stage: "", date: "", percent: 0 });


    const taskList = rootContext.tasks || [
        { percent: 40, title: "Resume Screening", stage: "Evaluation", date: "May 27, 2027" },
        { percent: 60, title: "Interview Scheduling", stage: "Engagement", date: "May 20, 2027" },
        { percent: 30, title: "Candidate Communication", stage: "Relationship", date: "May 23, 2027" },
        { percent: 50, title: "Offer Management", stage: "Selection", date: "May 25, 2027" },
    ];

    const getNumericSalary = (salaryStr) => {
        const match = salaryStr.replace(/,/g, "").match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const filteredEvents =
        filterType === "Popular"
            ? [...events]
                .sort((a, b) => getNumericSalary(b.salaryAmount) - getNumericSalary(a.salaryAmount))
                .slice(0, 5)
            : events;

    function handleAddTask() {
        setRootContext((prevContext) => ({
            ...prevContext,
            tasks: [...prevContext.tasks, newTask],
        }));
        setNewTask({ title: "", stage: "", date: "", percent: 0 });
        setShowTaskForm(false);
    }

    const Icons = {
        RealEstateSales: <FaBuilding className="w-5 h-5 text-blue-600" />,
        ChannelPartners: <FaUserTie className="w-5 h-5 text-purple-600" />,
        TeleCaller: <FaHeadset className="w-5 h-5 text-pink-600" />,
        HROperations: <FaUsers className="w-5 h-5 text-green-600" />,
        CRMExecutive: <FaUserCog className="w-5 h-5 text-yellow-600" />,
        WebDevelopment: <FaLaptopCode className="w-5 h-5 text-indigo-600" />,
        DigitalMarketing: <FaBullhorn className="w-5 h-5 text-red-600" />,
        AccountsAuditing: <FaFileInvoiceDollar className="w-5 h-5 text-gray-900" />,
        Default: <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />,
    };

    const jobCategories = [
        {
            title: 'Real Estate Sales',
            description: 'Sell Property Faster',
            icon: Icons.RealEstateSales,
        },
        {
            title: 'Channel Partners',
            description: 'Collaborate & Earn',
            icon: Icons.ChannelPartners,
        },
        {
            title: 'Tele Caller',
            description: 'Engage & Convert',
            icon: Icons.TeleCaller,
        },
        {
            title: 'HR & Operations',
            description: 'People & Process',
            icon: Icons.HROperations,
        },
        {
            title: 'CRM Executive',
            description: 'Manage Client Relations',
            icon: Icons.CRMExecutive,
        },
        {
            title: 'Web Development',
            description: 'Build Real Estate Tech',
            icon: Icons.WebDevelopment,
        },
        {
            title: 'Digital Marketing',
            description: 'Promote & Convert',
            icon: Icons.DigitalMarketing,
        },
        {
            title: 'Accounts & Auditing',
            description: 'Ensure Financial Clarity',
            icon: Icons.AccountsAuditing,
        },
    ];

    function VacancyCard({ job }) {
        // Construct salary text based on structure
        const salaryText = `${job.salaryAmount} / ${job.salaryFrequency}`;

        return (
            <div className="border border-gray-50 rounded-xl shadow-sm space-y-2 p-3">
                <div className="flex items-center gap-2">
                    {job.icon}
                    <h2 className="text-sm font-semibold text-gray-800">{job.jobTitle}</h2>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {job.employmentTypes.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded-full capitalize"
                        >
                            {tag.replace("-", " ")}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <p className="mb-1">
                        <span className="text-xs font-semibold text-gray-900">{salaryText}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        {job.applicants ?? Math.floor(Math.random() * 1001)} Applicants
                    </p>
                </div>
            </div>
        );
    }

    const EnhancedJobs = filteredEvents.map((job) => {
        const category = jobCategories.find(
            (cat) => cat.title.toLowerCase() === job.jobTitle.toLowerCase()
        );
        return {
            ...job,
            icon: category?.icon || <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />,
            tags: job.employmentTypes,
        };
    });


    return (
        <div className="text-gray-800 font-sans pb-6 space-y-8">
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
                                className={`px-4 py-3 rounded-xl shadow cursor-pointer transition-transform duration-200 ${selectedStatType === item.title ? `bg-lime-200` : ""
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <Popover className="relative">
                                        <Popover.Button className="text-sm text-gray-600 mb-2 cursor-pointer font-semibold">...</Popover.Button>

                                        <Popover.Panel className="absolute z-10 w-56 right-[-35px] mt-2 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-700 space-y-1">
                                            <p><span className="font-semibold">Agency:</span> {item.details.agency}</p>
                                            {item.details.lastMonth && (
                                                <p><span className="font-semibold">Last Month:</span> {item.details.lastMonth}</p>
                                            )}
                                            {item.details.growth && (
                                                <p><span className="font-semibold">Growth:</span> {item.details.growth}</p>
                                            )}
                                            {item.details.drop && (
                                                <p><span className="font-semibold">Drop:</span> {item.details.drop}</p>
                                            )}
                                        </Popover.Panel>
                                    </Popover>
                                </div>
                                <div className="flex mt-2 justify-between items-center flex-wrap">
                                    <h2 className="text-2xl font-bold">{Number(item.value).toLocaleString()}</h2>
                                    <p className="text-xs mt-1">{item.change}</p>
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
                                                onChange={(update) => setDateRange(update)}
                                                inline
                                            />
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </div>
                            <div className="w-full h-64 bg-white rounded-xl mt-5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={750}
                                        height={200}
                                        data={dailyRecruitmentData}
                                        barCategoryGap="30%"
                                        barGap={5}
                                    >
                                        <CartesianGrid stroke="white" strokeDashArray="4 4" />
                                        <XAxis dataKey="date" axisLine={{ stroke: "#f3f4f6" }}    // gray-100
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                        <YAxis axisLine={{ stroke: "#f3f4f6" }}    // gray-100
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                        <Tooltip />
                                        <Legend />

                                        {/* Conditional Bar Rendering Logic for Stacking */}

                                        {/* Case 1: selectedStatType is "Applications" */}
                                        {selectedStatType === "Applications" && (
                                            <>
                                                {/* Shortlisted at the bottom */}
                                                <Bar
                                                    dataKey="Shortlisted"
                                                    fill={getBarColorByType("Shortlisted")}
                                                    stackId="applications-shortlisted"
                                                    radius={[0, 0, 0, 0]} // Flat bottom for stack
                                                    barSize={20}
                                                />
                                                {/* Applications on top */}
                                                <Bar
                                                    dataKey="Applications"
                                                    fill={getBarColorByType("Applications")}
                                                    stackId="applications-shortlisted"
                                                    radius={[8, 8, 0, 0]} // Rounded top for stack
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {/* Case 2: selectedStatType is "Shortlisted" */}
                                        {selectedStatType === "Shortlisted" && (
                                            <>
                                                {/* Applications at the bottom */}
                                                <Bar
                                                    dataKey="Applications"
                                                    fill={getBarColorByType("Applications")}
                                                    stackId="applications-shortlisted"
                                                    radius={[0, 0, 0, 0]} // Flat bottom for stack
                                                    barSize={20}
                                                />
                                                {/* Shortlisted on top */}
                                                <Bar
                                                    dataKey="Shortlisted"
                                                    fill={getBarColorByType("Shortlisted")}
                                                    stackId="applications-shortlisted"
                                                    radius={[8, 8, 0, 0]} // Rounded top for stack
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {/* Case 3: selectedStatType is "Hired" */}
                                        {selectedStatType === "Hired" && (
                                            <>
                                                {/* Rejected at the bottom */}
                                                <Bar
                                                    dataKey="Rejected"
                                                    fill={getBarColorByType("Rejected")}
                                                    stackId="hired-rejected"
                                                    radius={[0, 0, 0, 0]} // Flat bottom for stack
                                                    barSize={20}
                                                />
                                                {/* Hired on top */}
                                                <Bar
                                                    dataKey="Hired"
                                                    fill={getBarColorByType("Hired")}
                                                    stackId="hired-rejected"
                                                    radius={[8, 8, 0, 0]} // Rounded top for stack
                                                    barSize={20}
                                                />
                                            </>
                                        )}

                                        {/* Case 4: selectedStatType is "Rejected" */}
                                        {selectedStatType === "Rejected" && (
                                            <>
                                                {/* Hired at the bottom */}
                                                <Bar
                                                    dataKey="Hired"
                                                    fill={getBarColorByType("Hired")}
                                                    stackId="hired-rejected"
                                                    radius={[0, 0, 0, 0]} // Flat bottom for stack
                                                    barSize={20}
                                                />
                                                {/* Rejected on top */}
                                                <Bar
                                                    dataKey="Rejected"
                                                    fill={getBarColorByType("Rejected")}
                                                    stackId="hired-rejected"
                                                    radius={[8, 8, 0, 0]} // Rounded top for stack
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
                                <h3 className="text-md font-semibold">{selectedStatType} by Deportment</h3>
                                <Popover className="relative ">
                                    <Popover.Button className="w-26 h-6 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-[9px]">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="font-semibold">{display2Date}</span>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </Popover.Button>

                                    <Popover.Panel className="absolute z-10 mt-2 right-0">
                                        <div className="bg-white p-2 rounded shadow-lg">
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                inline
                                            />
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between  w-full bg-white rounded-xl">
                                <div className="flex flex-col justify-center items-center">
                                    <PieChart width={200} height={200}>
                                        <Pie
                                            data={currentPieChartData} // Use the dynamic data
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            stroke="none"
                                        >
                                            {currentPieChartData.map((entry, index) => ( // Map over the dynamic data
                                                <Cell key={`cell-dept-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                    <p className="font-bold text-xl">{Number(currentPieChartData.reduce((sum, item) => sum + item.value, 0) || 0).toLocaleString()}</p>
                                    <p>Total {selectedStatType}</p>
                                </div>
                                <ul className="text-xs text-gray-700 mt-6">
                                    {currentPieChartData.map((item, idx) => ( // Map over the dynamic data for the legend
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
                <div className="bg-[#d4ddff] pt-3 shadow rounded-xl w-full space-y-4">
                    <h3 className="text-md font-semibold text-center">Applicant Resources</h3>
                    <div className="flex justify-center items-center">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={currentResourceChartData} // Use the dynamic data
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={102}
                                paddingAngle={2}
                                stroke="none"
                            >
                                {currentResourceChartData.map((entry, index) => ( // Map over the dynamic data
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
                        <ul className="text-xs text-gray-700 mt-2 grid grid-cols-2 gap-2 list-none">
                            {currentResourceChartData.map((item, idx) => ( // Map over the dynamic data for the legend
                                <li key={item.name} className="flex gap-1 items-center">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Events */}
                <div className="bg-white p-2 rounded-xl shadow w-full">
                    <div className="flex gap-5 items-center">
                        <p className="text-medium font-semibold">Current Vacancies <span className="text-medium">({filteredEvents.length})</span></p>
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
                    {/* <div className="grid grid-cols-1 sm:grid-cols-1 h-[300px] overflow-y-auto gap-4">
                        {filteredEvents.map((job, idx) => <VacancyCard key={idx} job={job} />)}
                    </div> */}

                    <div className="grid grid-cols-1 sm:grid-cols-1 h-[300px] overflow-y-auto gap-4">
                        {EnhancedJobs.map((job, indx) => (
                            <VacancyCard key={indx} job={job} />
                        ))}
                    </div>
                </div>

                {/* Tasks */}
                <div className="bg-white p-4 rounded-xl shadow w-full">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold">Tasks</h3>
                        <button className="w-5 h-5 bg-lime-300 p-1 rounded" onClick={() => setShowTaskForm(!showTaskForm)}><PlusIcon /></button>
                    </div>
                    {showTaskForm && <TaskModal newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} showTaskForm={showTaskForm} setShowTaskForm={setShowTaskForm} />}
                    <div className="space-y-4">
                        {taskList.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-200 rounded-lg p-1">
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
                                            strokeDasharray={`${task.percent}, 100`}
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                        {task.percent}%
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
                                    <p className="text-xs text-gray-500">{task.stage} — {task.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white p-4 rounded-xl shadow w-full">
                    <div className="flex justify-between mb-3">
                        <h3 className="text-md font-semibold">Daily Schedule</h3>
                        <Popover className="relative ">
                            <Popover.Button className="w-26 h-6 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-[9px]">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-semibold">{displayDate}</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </Popover.Button>

                            <Popover.Panel className="absolute z-10 mt-2 right-0">
                                <div className="bg-white p-2 rounded shadow-lg">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        inline
                                    />
                                </div>
                            </Popover.Panel>
                        </Popover>
                    </div>
                    <div className="relative"> {/* Main container for the timeline */}
                        {schedule.map((item, index) => {
                            const bgColorClassMatch = item.color.match(/bg-[a-z]+-[0-9]+/);
                            const bgColorClass = bgColorClassMatch ? bgColorClassMatch[0] : '';
                            const borderColorHex = tailwindBgToHex[bgColorClass] || 'gray';

                            return (
                                <div key={index} className="flex items-start gap-4 relative mt-2">
                                    <div className="w-[18%] pt-1 text-xs font-medium text-gray-500">{item.time}</div>

                                    {/* Dot and Line Column */}
                                    <div className="flex flex-col items-center relative">
                                        {/* The dot */}
                                        <span className={`w-3 h-3 rounded-full border-2 border-white shadow ${item.color.split(' ')[0]} z-10`} />

                                        {/* Vertical line: Only for items that are *not* the last one */}
                                        {index < schedule.length - 1 && (
                                            <div
                                                className="absolute left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dashed"
                                                style={{
                                                    borderColor: borderColorHex,
                                                    top: '6px',
                                                    height: `calc(100% + 5rem)`, // Connects to the top of the next item's container
                                                }}
                                            />
                                        )}
                                        {/* If you specifically want a trailing line from the last dot,
                                you can add it here, with a fixed height.
                                If you want it to disappear after the last dot, remove this block.
                            */}
                                        {index === schedule.length - 1 && (
                                            <div
                                                className="absolute left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dashed"
                                                style={{
                                                    borderColor: borderColorHex,
                                                    top: '6px',
                                                    height: '3.5rem', // A fixed length for the last line to trail off
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Content Box */}
                                    {/* The height of this box largely dictates how long the line needs to be */}
                                    <div className={`w-[75%] flex flex-col gap-1 p-3 rounded-xl ${item.color}`}>
                                        <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                        <span className="text-xs text-gray-700">{item.dept}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;