import React, { useContext, useEffect, useRef, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { FaCode, FaPaintBrush, FaUserTie, FaBriefcase, FaBell } from "react-icons/fa";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon, CalendarIcon, ChevronDownIcon, EyeIcon, PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import RootContext from "./config/rootcontext";
import { contextObject } from "./config/contextobject";
import { useRouter } from "next/navigation";
const Dashboard = () => {

    const { rootContext, setRootContext } = useContext(RootContext);
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


    const vacancies = [
        {
            title: "Software Developer",
            icon: <FaCode className="text-xl text-indigo-600" />,
            tags: ["Full-time", "Remote"],
            salary: "$70K - $90K/y",
            applicants: 120,
        },
        {
            title: "Graphic Designer",
            icon: <FaPaintBrush className="text-xl text-green-500" />,
            tags: ["Part-time", "Hybrid"],
            salary: "$40K - $55K/y (pro-rated)",
            applicants: 75,
        },
        {
            title: "Sales Manager",
            icon: <FaUserTie className="text-xl text-yellow-500" />,
            tags: ["Full-time", "On-site"],
            salary: "$65K - $80K/y + commission",
            applicants: 75,
        },
        {
            title: "HR Coordinator",
            icon: <FaBriefcase className="text-xl text-purple-500" />,
            tags: ["Contract", "Remote"],
            salary: "$50K - $60K/y",
            applicants: 60,
        },
    ];

    const schedule = [
        { time: "1:00 PM", title: "Marketing Strategy Presentation", dept: "Marketing", color: "bg-lime-200 text-lime-900" },
        { time: "2:30 PM", title: "HR Policy Update Session", dept: "Human Resources", color: "bg-lime-100 text-lime-800" },
        { time: "4:00 PM", title: "Customer Feedback Analysis", dept: "Customer Support", color: "bg-indigo-100 text-indigo-800" },
        { time: "5:30 PM", title: "Financial Reporting Session", dept: "Finance", color: "bg-indigo-200 text-indigo-900" },
    ];

    const COLORS = ["#a5f3fc", "#86efac", "#fde68a", "#ddd6fe", "#fca5a5", "#fcd34d"];
    function VacancyCard({ job }) {
        const salaryText = job.salary;
        const hasBracket = salaryText.includes("(");
        const hasPlus = salaryText.includes("+");

        // Split salary properly
        let baseSalary = salaryText;
        let extraInfo = "";

        if (hasBracket) {
            baseSalary = salaryText.split("(")[0].trim();
            extraInfo = `(${salaryText.split("(")[1].replace(")", "").trim()})`;
        } else if (hasPlus) {
            const parts = salaryText.split("+");
            baseSalary = parts[0].trim();
            extraInfo = `+ ${parts[1].trim()}`;
        }

        return (
            <div className="p-2 border border-gray-50 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                    {job.icon}
                    <h2 className="text-sm font-semibold text-gray-800">{job.title}</h2>
                </div>

                <div className="flex gap-2">
                    {job.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <p className="mb-1">
                        <span className="text-xs font-semibold text-gray-900">
                            {baseSalary}
                        </span>{" "}
                        {extraInfo && (
                            <span className="text-[9px] text-gary-500 italic">
                                {extraInfo}
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-gray-500">{job.applicants} Applicants</p>
                </div>
            </div>
        );
    }
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const router = useRouter()
    const logOut = () => {
        let resp = contextObject;
        localStorage.clear();
        resp.authenticated = false;
        setRootContext({ ...resp });
        router.push(`/`);
    }

    const Topbar = () => (
        <div className="flex justify-between items-center px-6 py-2 bg-white shadow ml-2 group-hover:ml-64 transition-all duration-300">
            <div>
                <img width={100} height={10} src="	https://realestatejobs.co.in/images/logo.png">
                </img>
            </div>

            <button className="bg-indigo-900 text-white px-4 py-2 rounded">POST NEW JOB</button>
            <input
                type="text"
                placeholder="Search candidate, vacancy, etc"
                className="ml-4 px-4 py-2 border rounded w-1/3"
            />
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <FaBell className="text-gray-600" />
                {/* Profile */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                   <UserIcon className="w-4 h-4 text-gray-400" />
                    <div className="text-sm flex items-center gap-1">
                        <div>
                            <p className="font-semibold">{rootContext.user.name}</p>
                            <p className="text-gray-500 text-xs">Lead HR</p>
                        </div>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* Dropdown */}
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
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
            <Topbar />
            <div className="flex flex-col sm:flex-row gap-4 p-2">
                <div className="w-full sm:w-[70%]">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-lime-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Applications</p>
                            <h2 className="text-2xl font-bold">1,534</h2>
                            <p className="text-green-600 text-xs mt-1">▲ 12.67%</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Shortlisted</p>
                            <h2 className="text-2xl font-bold">869</h2>
                            <p className="text-red-500 text-xs mt-1">▼ 1.69%</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Hired</p>
                            <h2 className="text-2xl font-bold">236</h2>
                            <p className="text-green-600 text-xs mt-1">▲ 8.35%</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Rejected</p>
                            <h2 className="text-2xl font-bold">429</h2>
                            <p className="text-red-500 text-xs mt-1">▼ 2.81%</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 my-6">
                        <div className="bg-white p-4 shadow rounded-xl col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Applications</h3>
                                {/* <p className="text-sm text-gray-500">13–18 May</p> */}
                                <button className="w-32 h-5 bg-gray-300 p-1 rounded flex justify-between gap-2">
                                    <CalendarIcon className="w-4 h-4 fill:gay-200" />
                                    <span className="text-xs"> 13–18 May</span>
                                    <ChevronDownIcon className="w-4 h-4 fill:gay-200" />
                                </button>
                            </div>
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
                        </div>

                        <div className="flex flex-col items-center justify-start pl-1">
                            <h3 className="text-lg font-semibold mb-4">Application by Department</h3>
                            <div className="flex gap-6">
                                <PieChart width={250} height={250}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={2}
                                    // dataKey="value"
                                    //label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <ul className="text-sm text-gray-700 space-y-2 pt-6">
                                    {pieData.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                            ></span>
                                            {item.name}: {item.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">525 Total Applications</p>
                        </div>
                    </div>
                </div>
                <div className="bg-indigo-100 p-4 shadow rounded-xl w-full sm:w-[70%]">
                    <h3 className="text-lg font-semibold text-center mb-2">Applicant Resources</h3>
                    <PieChart width={280} height={250}>
                        <Pie
                            data={resourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={2}
                        //dataKey="value"
                        // label
                        >
                            {resourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <p className="text-center text-sm text-gray-600">1,000 Total Applicants</p>
                    <ul className="text-xs text-gray-700 mt-2 grid grid-cols-2 gap-1 list-none">
                        {resourceData.map((item, idx) => (
                            <li key={item.name} className="flex gap-1">
                                <span
                                    className="inline-block w-2 h-2 mt-0.5 rounded-full"
                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                ></span>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-medium text-gray-900">{item.value}</span>
                                    <span className="text-[11px] text-gray-500">{item.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-5">
                <div className="bg-white p-6 rounded-xl shadow w-full">
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold mb-4">
                            Current Vacancies
                            <span className="text-md mb-4 pl-1">( 234 )</span>
                        </p>
                        <div className="flex gap-5 text-xs">
                            <div className="flex gap-1">
                                <p> Popular </p>
                                <p><ChevronDownIcon className="w-4 h-4 fill:gay-200" /> </p>
                            </div>
                            <p>See All</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vacancies.map((job, idx) => (
                            <VacancyCard key={idx} job={job} />
                        ))}
                    </div>
                </div>

                <div className="w-[65%]">
                    <div className="flex flex-col sm:flex-row justify-between">
                        <h3 className="text-md font-semibold mb-3">Tasks</h3>
                        <button className="w-5 h-5 bg-green-300 p-1 rounded">
                            <PlusIcon />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-gray-200"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-blue-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${task.percent}, 100`}
                                            fill="none"
                                            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
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

                <div className="w-[60%]">
                    <div className="flex flex-col sm:flex-row justify-between">
                        <h3 className="text-md font-semibold mb-3">Schedule</h3>
                        <button className="w-20 h-5 bg-gray-300 p-1 rounded flex justify-between gap-2">
                            <CalendarIcon className="w-4 h-4 fill:gay-200" />
                            <span className="text-xs"> Today</span>
                            <ChevronDownIcon className="w-4 h-4 fill:gay-200" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {schedule.map((item, index) => (
                            <div
                                key={index}
                                className={`flex flex-row justify-between items-start gap-3 p-1 rounded-xl `}
                            >
                                <div className="text-xs w-[18%] font-medium text-gray-500 pt-1">{item.time}</div>
                                <div
                                    className={`w-[80%] flex flex-col items-start gap-3 p-2 rounded-xl ${item.color} ${item.border}`}
                                >
                                    <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                    <span className="text-xs text-gray-500">{item.dept}</span>
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