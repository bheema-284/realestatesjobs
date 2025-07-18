'use client';
import React, { Fragment, useContext, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { FaCode, FaPaintBrush, FaUserTie, FaBriefcase, FaBell } from "react-icons/fa";
import { FaLaptopCode, FaBuilding, FaHeadset, FaUsers, FaBullhorn, FaFileInvoiceDollar, FaUserCog } from "react-icons/fa";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import RootContext from "../components/config/rootcontext";
import { Popover } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Dialog, Transition } from '@headlessui/react';

const Dashboard = () => {
    const { rootContext, setRootContext } = useContext(RootContext);
    console.log("rootContext", rootContext)
    const [selectedDate, setSelectedDate] = useState(new Date());

    const stats = [
        {
            title: "Applications",
            value: "542",
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">14%</span>
                </span>
            ),
            bgColor: "bg-blue-100",
            details: {
                agency: "Dream Homes Realty",
                lastMonth: 475,
                growth: "67 more applications than last month",
            }
        },
        {
            title: "Shortlisted",
            value: "118",
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">10%</span>
                </span>
            ),
            bgColor: "bg-white",
            details: {
                agency: "Urban Nest Group",
                lastMonth: 107,
                growth: "11 more shortlisted than last month",
            }
        },
        {
            title: "Hired",
            value: "42",
            change: (
                <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">5%</span>
                </span>
            ),
            bgColor: "bg-white",
            details: {
                agency: "Skyline Realtors",
                lastMonth: 40,
                growth: "2 more hires than last month",
            }
        },
        {
            title: "Rejected",
            value: "88",
            change: (
                <span className="flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-md">
                    <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">3%</span>
                </span>
            ),
            bgColor: "bg-white",
            details: {
                agency: "Elite Brokers",
                lastMonth: 91,
                drop: "3 fewer rejections than last month",
            }
        },
    ];


    const barData = [
        { date: "13 May", Applied: 300, Shortlisted: 100 },
        { date: "14 May", Applied: 330, Shortlisted: 110 },
        { date: "15 May", Applied: 360, Shortlisted: 120 },
        { date: "16 May", Applied: 340, Shortlisted: 105 },
        { date: "17 May", Applied: 370, Shortlisted: 115 },
        { date: "18 May", Applied: 390, Shortlisted: 125 },
    ];

    const pieData = [
        { name: "Engineering", value: 120 },
        { name: "Marketing", value: 110 },
        { name: "Sales", value: 95 },
        { name: "Customer Support", value: 85 },
        { name: "Finance", value: 65 },
        { name: "Human Resources", value: 50 },
    ];

    const resourceData = [
        { name: "Job Boards", value: 350 },
        { name: "Social Media Campaigns", value: 300 },
        { name: "Employee Referrals", value: 200 },
        { name: "Recruitment Agencies", value: 150 },
    ];

    const tasks = [
        { percent: 40, title: "Resume Screening", stage: "Evaluation", date: "May 27, 2027" },
        { percent: 60, title: "Interview Scheduling", stage: "Engagement", date: "May 20, 2027" },
        { percent: 30, title: "Candidate Communication", stage: "Relationship", date: "May 23, 2027" },
        { percent: 50, title: "Offer Management", stage: "Selection", date: "May 25, 2027" },
    ];


    const events = rootContext.jobs || []

    const schedule = [
        { time: "1:00 PM", title: "Marketing Strategy Presentation", dept: "Marketing", color: "bg-lime-200 text-lime-900" },
        { time: "2:30 PM", title: "HR Policy Update Session", dept: "Human Resources", color: "bg-lime-100 text-lime-800" },
        { time: "4:00 PM", title: "Customer Feedback Analysis", dept: "Customer Support", color: "bg-indigo-100 text-indigo-800" },
        { time: "5:30 PM", title: "Financial Reporting Session", dept: "Finance", color: "bg-indigo-200 text-indigo-900" },
    ];

    // const [startDate, setStartDate] = useState(new Date());
    const [filterType, setFilterType] = useState("Popular");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", stage: "", date: "", percent: 0 });


    const [taskList, setTaskList] = useState(tasks);



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
        setTaskList([...taskList, newTask]);
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
        AccountsAuditing: <FaFileInvoiceDollar className="w-5 h-5 text-gray-600" />,
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
            icon: category?.icon || null,
            tags: job.employmentTypes,
        };
    });



    const COLORS = ["#a5f3fc", "#86efac", "#fde68a", "#fcd34d"];


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
    return (
        <div className="text-gray-800 font-sans pb-6 space-y-8 mt-10 sm:mt-0">
            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {stats.map((item, index) => (
                            <div key={index} className={`${item.bgColor} px-4 py-3 rounded-xl shadow`}>
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
                                    <h2 className="text-2xl font-bold">{item.value}</h2>
                                    <p className="text-xs mt-1">{item.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Charts */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="bg-white shadow rounded-xl w-full lg:w-1/2">
                            <div className="flex justify-between items-center mb-4 p-4">
                                <h3 className="text-lg font-semibold">Applications</h3>
                                <Popover className="relative">
                                    <Popover.Button className="w-auto h-7 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-xs gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="font-semibold">{display1Date}</span>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </Popover.Button>

                                    <Popover.Panel className="absolute z-10 mt-2">
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
                            <div className="w-full h-64 p-4 bg-white rounded-xl shadow-md">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={430}
                                        height={230}
                                        data={barData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barCategoryGap="30%" // space between groups (date-based)
                                        barGap={5}           // space between bars inside a group
                                    >
                                        <CartesianGrid stroke="white" strokeDasharray="4 4" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {/* Shortlisted bar */}
                                        <Bar
                                            dataKey="Shortlisted"
                                            fill="#fef08a" // Tailwind yellow-200
                                            stackId="a"
                                            radius={[0, 0, 0, 0]}
                                            barSize={30} // same thickness
                                        />
                                        {/* Applied bar */}
                                        <Bar
                                            dataKey="Applied"
                                            fill="#bfdbfe" // Tailwind blue-200
                                            stackId="a"
                                            radius={[8, 8, 0, 0]}
                                            barSize={30} // thin bar
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 shadow rounded-xl w-full lg:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Appication by Deportment</h3>
                                <Popover className="relative ">
                                    <Popover.Button className="w-32 h-7 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-xs">
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
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <PieChart width={200} height={200}>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2}>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <ul className="text-xs text-gray-700">
                                    {pieData.map((item, idx) => (
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
                <div className="bg-indigo-100 pt-3 shadow rounded-xl w-full space-y-4">
                    <h3 className="text-lg font-semibold text-center">Applicant Resources</h3>
                    <div className="flex justify-center items-center">
                        <PieChart width={250} height={250}>
                            <Pie data={resourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                                {resourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="flex justify-center items-center">
                        <ul className="text-xs text-gray-700 mt-2 grid grid-cols-2 sm:grid grid-cols-4 gap-2 list-none">
                            {resourceData.map((item, idx) => (
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
                                className={`flex gap-1 text-xs cursor-pointer ${filterType === "Popular" ? "text-red-500 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
                            >
                                <p>Popular</p>
                            </div>
                            <p
                                onClick={() => setFilterType("All")}
                                className={`text-xs cursor-pointer ${filterType === "All" ? "text-red-500 font-bold text-lg" : "text-blue-400 hover:text-orange-600"}`}
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
                        <button className="w-5 h-5 bg-green-300 p-1 rounded" onClick={() => setShowTaskForm(!showTaskForm)}><PlusIcon /></button>
                    </div>
                    <Transition appear show={showTaskForm} as={Fragment}>
                        <Dialog as="div" className="relative shadow-xl z-50" onClose={() => setShowTaskForm(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-opacity-75" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Add New Task</Dialog.Title>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Task Title</label>
                                                    <input type="text" placeholder="Enter task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full border rounded px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Stage</label>
                                                    <input type="text" placeholder="Enter stage" value={newTask.stage} onChange={(e) => setNewTask({ ...newTask, stage: e.target.value })} className="w-full border rounded px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Date</label>
                                                    <input type="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} className="w-full border rounded px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Progress %</label>
                                                    <input type="number" placeholder="Enter progress" value={newTask.percent} onChange={(e) => setNewTask({ ...newTask, percent: e.target.value })} className="w-full border rounded px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm" onClick={() => setShowTaskForm(false)}>Cancel</button>
                                                    <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm" onClick={handleAddTask}>Add</button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
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
                            <Popover.Button className="w-32 h-7 bg-gray-200 text-gray-500 px-2 rounded flex items-center justify-between text-xs">
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
                    <div>
                        {schedule.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 relative mt-2">
                                <div className="w-[18%] pt-1 text-xs font-medium text-gray-500">{item.time}</div>
                                <div className="flex flex-col items-center relative">
                                    <span className={`w-3 h-3 rounded-full border-2 border-white shadow ${item.color}`} />
                                    <div className="w-px border-l-2 border-dashed mt-1 min-h-10" style={{ borderColor: item.color.replace("bg-", "#") }} />
                                </div>
                                <div className={`w-[75%] flex flex-col gap-1 p-3 rounded-xl ${item.color}`}>
                                    <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                    <span className="text-xs text-gray-700">{item.dept}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;