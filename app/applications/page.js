'use client';
import React, { useState, Fragment, useEffect, useContext } from 'react';
import { Dialog, Transition, RadioGroup, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // For the dropdown icon
import { XMarkIcon } from '@heroicons/react/24/solid';
import RootContext from '@/components/config/rootcontext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import JobPostingModal from '@/components/createjob';
import ButtonTab from '@/components/common/buttontab';
import JobList from '@/components/jobslist';


const Icons = {
    ChannelPartners: "/icons/cp.png",
    RealEstateSales: "/icons/realestate.png",
    TeleCaller: "/icons/tel.png",
    HROperations: "/icons/hrandop.png",
    CRMExecutive: "/icons/crm.png",
    WebDevelopment: "/icons/webdev.png",
    DigitalMarketing: "/icons/digital.png",
    AccountsAuditing: "/icons/accounts.png",
    Default: (
        <ExclamationTriangleIcon className="w-6 h-6 text-gray-400" />
    ),
};

// Data for the job category cards
const jobCategories = [
    {
        icon: '/icons/cp.png',
        title: 'Channel Partners',
        description: 'Collaborate & Earn',
    },
    {
        icon: '/icons/hrandop.png',
        title: 'HR & Operations',
        description: 'People & Process',
    },
    {
        icon: '/icons/realestate.png',
        title: 'Real Estate Sales',
        description: 'Sell Property Faster',
    },
    {
        icon: '/icons/tel.png',
        title: 'Tele Caller',
        description: 'Engage & Convert',
    },
    {
        icon: '/icons/digital.png',
        title: 'Digital Marketing',
        description: 'Promote & Convert',
    },
    {
        icon: '/icons/webdev.png',
        title: 'Web Development',
        description: 'Build Real Estate Tech',
    },
    {
        icon: '/icons/crm.png',
        title: 'CRM Executive',
        description: 'Manage Client Relations',
    },
    {
        icon: '/icons/accounts.png',
        title: 'Accounts & Auditing',
        description: 'Ensure Financial Clarity',
    },
];


const getIconForTitle = (name) => {
    const normalizedTitle = name && name.replace(/\s+/g, '').replace(/[^\w]/g, '');
    return <img
        src={Icons[normalizedTitle] || Icons.Default}
        alt={name}
        className="h-8 w-auto object-contain mx-auto"
    />;
};


// JobModal component (modified to accept props for state management)
function JobModal({ isOpen, setIsOpen, initialJobTitle = '', onSave }) {
    // State for form fields
    const [jobTitle, setJobTitle] = useState(initialJobTitle);
    const [jobDescription, setJobDescription] = useState('');
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [workingSchedule, setWorkingSchedule] = useState({
        dayShift: false,
        nightShift: false,
        weekendAvailability: false,
        custom: '',
    });
    const [salaryType, setSalaryType] = useState('hourly');
    const [salaryAmount, setSalaryAmount] = useState('');
    const [salaryFrequency, setSalaryFrequency] = useState('Yearly');
    const [hiringMultiple, setHiringMultiple] = useState(false);

    // Update jobTitle when initialJobTitle prop changes
    useEffect(() => {
        setJobTitle(initialJobTitle);
    }, [initialJobTitle]);

    function closeModal() {
        setIsOpen(false);
        // Optionally reset form fields when closing
        setJobDescription('');
        setEmploymentTypes([]);
        setWorkingSchedule({ dayShift: false, nightShift: false, weekendAvailability: false, custom: '' });
        setSalaryType('hourly');
        setSalaryAmount('');
        setSalaryFrequency('Yearly');
        setHiringMultiple(false);
    }

    const employmentOptions = [
        { id: 'full-time', name: 'Full-time' },
        { id: 'part-time', name: 'Part-time' },
        { id: 'on-demand', name: 'On demand' },
        { id: 'negotiable', name: 'Negotiable' },
    ];

    const salaryFrequencies = ['Yearly', 'Monthly', 'Weekly', 'Hourly'];

    const handleEmploymentTypeChange = (typeId) => {
        setEmploymentTypes((prev) =>
            prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJob = {
            id: `job-${Date.now()}`, // Unique ID for the new job
            jobTitle,
            jobDescription,
            employmentTypes,
            workingSchedule,
            salaryType,
            salaryAmount,
            salaryFrequency,
            hiringMultiple,
        };
        onSave(newJob); // Pass the new job data to the parent
        closeModal();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center" style={{ backgroundColor: '#F0F2F5' }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-5">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Create Job Posting
                                    </Dialog.Title>
                                    <XMarkIcon className="h-5 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={closeModal} />
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Job Title */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center">
                                        <label htmlFor="jobTitle" className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Job name
                                            <p className="text-xs text-gray-500 mt-1">A job name must describe one position only</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0">
                                            <input
                                                type="text"
                                                id="jobTitle"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="e.g. &quot;Kitchen staff&quot;"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Job Description */}
                                    <div className="flex flex-col md:flex-row items-start">
                                        <label htmlFor="jobDescription" className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Job description
                                            <p className="text-xs text-gray-500 mt-1">Provide a short description about the job. Keep it short and to the point.</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0 relative">
                                            <div className="flex justify-between items-center border border-gray-300 rounded-t-md p-2 bg-gray-50 text-gray-600 text-sm">
                                                <div className="flex space-x-2">
                                                    <span className="font-bold">B</span>
                                                    <span className="italic">I</span>
                                                    <span className="underline">U</span>
                                                    <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2.75 7.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2 10.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10.25ZM2.75 13a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2 15.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 15.75Z" clipRule="evenodd" /></svg></span>
                                                    <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-1.716 0-3.405.106-5.07.31C3.807 2.511 3 3.407 3 4.42v10.164a3 3 0 0 0 .807 2.022c.638.63 1.543.994 2.493.994H16.5A1.5 1.5 0 0 0 18 16.5V6.75A.75.75 0 0 0 17.25 6H13.5a.75.75 0 0 1-.75-.75V2.75A.75.75 0 0 0 12 2h-2Zm2.25 1.5v-.25a.75.75 0 0 0-.75-.75H10a.75.75 0 0 0-.75.75v.25h3.75Z" clipRule="evenodd" /></svg></span>
                                                </div>
                                                <span className="text-gray-500">200 words</span>
                                            </div>
                                            <textarea
                                                id="jobDescription"
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-b-md focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[120px]"
                                                placeholder="Description"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Employment Type */}
                                    <div className="flex flex-col md:flex-row items-start">
                                        <label className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Employment type
                                            <p className="text-xs text-gray-500 mt-1">Description text goes in ehre</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0 space-y-3">
                                            <RadioGroup value={employmentTypes} onChange={setEmploymentTypes} className="space-y-3">
                                                {employmentOptions.map((option) => (
                                                    <RadioGroup.Option
                                                        key={option.id}
                                                        value={option.id}
                                                        className={({ active }) =>
                                                            `relative flex cursor-pointer rounded-lg px-5 py-3 shadow-sm focus:outline-none border
                              ${employmentTypes.includes(option.id) ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-gray-300 text-gray-900'}
                              ${active ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`
                                                        }
                                                    >
                                                        {({ checked }) => (
                                                            <>
                                                                <div className="flex w-full items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <div className="text-sm">
                                                                            <RadioGroup.Label
                                                                                as="p"
                                                                                className={`font-medium ${employmentTypes.includes(option.id) ? 'text-blue-900' : 'text-gray-900'
                                                                                    }`}
                                                                            >
                                                                                {option.name}
                                                                            </RadioGroup.Label>
                                                                        </div>
                                                                    </div>
                                                                    {employmentTypes.includes(option.id) && (
                                                                        <div className="flex-shrink-0 text-blue-600">
                                                                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </RadioGroup.Option>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    {/* Working Schedule */}
                                    <div className="flex flex-col md:flex-row items-start">
                                        <label className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Working schedule
                                            <p className="text-xs text-gray-500 mt-1">You can pick multiple work schedules.</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setWorkingSchedule(prev => ({ ...prev, dayShift: !prev.dayShift }))}
                                                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200
                          ${workingSchedule.dayShift ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                Day shift
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setWorkingSchedule(prev => ({ ...prev, nightShift: !prev.nightShift }))}
                                                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200
                          ${workingSchedule.nightShift ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                Night shift
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setWorkingSchedule(prev => ({ ...prev, weekendAvailability: !prev.weekendAvailability }))}
                                                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200
                          ${workingSchedule.weekendAvailability ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                Weekend availability
                                            </button>
                                            <input
                                                type="text"
                                                value={workingSchedule.custom}
                                                onChange={(e) => setWorkingSchedule(prev => ({ ...prev, custom: e.target.value }))}
                                                placeholder="Pick working schedule"
                                                className="flex-grow p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[150px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="flex flex-col md:flex-row items-start">
                                        <label className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Salary
                                            <p className="text-xs text-gray-500 mt-1">Choose how you prefer to pay for this job.</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0 space-y-4">
                                            <RadioGroup value={salaryType} onChange={setSalaryType} className="flex gap-4">
                                                <RadioGroup.Option
                                                    value="hourly"
                                                    className={({ active, checked }) =>
                                                        `relative flex cursor-pointer rounded-md p-3 focus:outline-none border
                            ${checked ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-gray-300 text-gray-900'}
                            ${active ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`
                                                    }
                                                >
                                                    {({ checked }) => (
                                                        <div className="flex items-center">
                                                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white'}`}>
                                                                {checked && <span className="h-2 w-2 rounded-full bg-white" />}
                                                            </span>
                                                            <RadioGroup.Label as="p" className="ml-2 text-sm font-medium">
                                                                Hourly
                                                            </RadioGroup.Label>
                                                        </div>
                                                    )}
                                                </RadioGroup.Option>
                                                <RadioGroup.Option
                                                    value="custom"
                                                    className={({ active, checked }) =>
                                                        `relative flex cursor-pointer rounded-md p-3 focus:outline-none border
                            ${checked ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-gray-300 text-gray-900'}
                            ${active ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`
                                                    }
                                                >
                                                    {({ checked }) => (
                                                        <div className="flex items-center">
                                                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white'}`}>
                                                                {checked && <span className="h-2 w-2 rounded-full bg-white" />}
                                                            </span>
                                                            <RadioGroup.Label as="p" className="ml-2 text-sm font-medium">
                                                                Custom
                                                            </RadioGroup.Label>
                                                        </div>
                                                    )}
                                                </RadioGroup.Option>
                                            </RadioGroup>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="salaryAmount" className="block text-xs text-gray-500 mb-1">Amount you want to pay</label>
                                                    <input
                                                        type="number"
                                                        id="salaryAmount"
                                                        value={salaryAmount}
                                                        onChange={(e) => setSalaryAmount(e.target.value)}
                                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        placeholder="35,000"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <label htmlFor="salaryFrequency" className="block text-xs text-gray-500 mb-1">How you want to pay</label>
                                                    <select
                                                        id="salaryFrequency"
                                                        value={salaryFrequency}
                                                        onChange={(e) => setSalaryFrequency(e.target.value)}
                                                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
                                                    >
                                                        {salaryFrequencies.map((freq) => (
                                                            <option key={freq} value={freq}>{freq}</option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-4">
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center mt-4">
                                                <input
                                                    type="checkbox"
                                                    id="salaryNegotiable"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="salaryNegotiable" className="ml-2 block text-sm text-gray-900">
                                                    Salary is negotiable
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hiring Multiple Candidates */}
                                    <div className="flex flex-col md:flex-row items-start">
                                        <label htmlFor="hiringMultiple" className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                            Hiring multiple candidates?
                                            <p className="text-xs text-gray-500 mt-1">This will be displayed on job page for candidates to see.</p>
                                        </label>
                                        <div className="w-full md:w-2/3 mt-2 md:mt-0 flex items-center">
                                            <Switch
                                                checked={hiringMultiple}
                                                onChange={setHiringMultiple}
                                                className={`${hiringMultiple ? 'bg-blue-600' : 'bg-gray-200'
                                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                            >
                                                <span className="sr-only">Enable notifications</span>
                                                <span
                                                    className={`${hiringMultiple ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                                                />
                                            </Switch>
                                            <span className="ml-3 text-sm text-gray-900">
                                                Yes, I am hiring multiple candidates
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Save Job
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}


// Main Jobs Component (combining categories and table)
export default function Jobs() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Keep for potential future manual modal open
    const [currentJobCategory, setCurrentJobCategory] = useState(''); // Still used to identify category
    const { rootContext, setRootContext } = useContext(RootContext);
    const [activeTab, setActiveTab] = useState(0);
    const jobList = rootContext.jobs || []
    const tabName = jobCategories[activeTab].title
    const filterJobs = jobList.filter((item) => item.jobTitle === tabName);
    const [editData, setEditData] = useState({});
    const [mode, setMode] = useState("create");
    const [isOpen, setIsOpen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(null);
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const generateDummyJob = (categoryTitle) => {
        const salaryOptions = {
            'Real Estate Sales': ['80,000 + Commission', '85,000 + Bonus', '75,000 + Incentives'],
            'Channel Partners': ['70,000', '75,000', '78,000'],
            'Tele Caller': ['20', '25', '30'],
            'HR & Operations': ['60,000', '65,000', '68,000'],
            'CRM Executive': ['45,000', '48,000', '50,000'],
            'Web Development': ['85,000', '90,000', '95,000'],
            'Digital Marketing': ['65,000', '70,000', '75,000'],
            'Accounts & Auditing': ['50,000', '55,000', '58,000'],
        };

        const employmentTypesList = [
            ['full-time'],
            ['part-time'],
            ['full-time', 'part-time'],
            ['part-time', 'negotiable'],
            ['on-demand'],
            ['full-time', 'negotiable'],
        ];

        const workingSchedules = [
            { dayShift: true, nightShift: false, weekendAvailability: false, custom: '' },
            { dayShift: false, nightShift: true, weekendAvailability: true, custom: 'Night shift only' },
            { dayShift: true, nightShift: true, weekendAvailability: true, custom: 'Flexible' },
            { dayShift: true, nightShift: false, weekendAvailability: true, custom: 'Flexible weekends' },
        ];

        const salaryTypes = ['custom', 'hourly', 'monthly', 'fixed'];

        const jobDescriptions = {
            'Real Estate Sales': [
                'Drive property sales and meet targets.',
                'Sell properties in a fast-paced real estate market.',
                'Help clients buy dream homes while achieving sales goals.'
            ],
            'Channel Partners': [
                'Manage and grow channel partnerships.',
                'Expand the business through new partnerships.',
                'Develop B2B networks and alliances.'
            ],
            'Tele Caller': [
                'Convert leads to appointments via calls.',
                'Engage prospects over phone and pitch services.',
                'Contact and follow up with clients effectively.'
            ],
            // Add more as needed...
        };

        const baseJob = {
            id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            jobTitle: categoryTitle,
            jobDescription: getRandomElement(jobDescriptions[categoryTitle] || [
                `This is an auto-generated description for a ${categoryTitle} role.`,
                `Join our team as a ${categoryTitle} specialist.`,
            ]),
            employmentTypes: getRandomElement(employmentTypesList),
            workingSchedule: getRandomElement(workingSchedules),
            salaryType: getRandomElement(salaryTypes),
            salaryAmount: getRandomElement(salaryOptions[categoryTitle] || ['50,000', '60,000', '70,000']),
            salaryFrequency: getRandomElement(['Monthly', 'Yearly', 'Weekly']),
            hiringMultiple: Math.random() < 0.5, // 50% chance
            location: getRandomElement(['Mumbai', 'Hyderabad', 'Remote', 'Bangalore', 'Pune']),
            postedOn: new Date().toISOString().split('T')[0], // Today's date
        };

        return baseJob;
    };


    const handleCategoryClick = (categoryTitle) => {
        const newJob = generateDummyJob(categoryTitle);
        // setJobList((prevList) => [...prevList, newJob]); // Add the auto-generated job to the list
        setEditData(newJob);
        // modal opening here
        setIsOpen(true);
    };

    // The handleNewJobPost function is now only relevant if you add a separate button to open the modal manually
    // For this request, it's not directly used by category clicks.
    const handleNewJobPost = (newJob) => {
        // setJobList((prevList) => [...prevList, newJob]);
        setRootContext((prevContext) => ({
            ...prevContext,
            jobs: [...prevContext.jobs, newJob],
        }));
        // No modal closing here, as it's assumed to be closed by its own internal state or a separate trigger
    };


    // Helper function to format employment types for table display
    const formatEmploymentTypes = (types) => {
        if (!types || types.length === 0) return 'N/A';
        return types.map(type => type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')).join(', ');
    };

    // Helper function to format working schedule for table display
    const formatWorkingSchedule = (schedule) => {
        const parts = [];
        if (schedule.dayShift) parts.push('Day');
        if (schedule.nightShift) parts.push('Night');
        if (schedule.weekendAvailability) parts.push('Weekend');
        if (schedule.custom) parts.push(schedule.custom);
        return parts.length > 0 ? parts.join(', ') : 'Flexible';
    };

    const editForm = (index, mode) => {
        const jobListToEdit = filterJobs[index];
        setEditData(jobListToEdit);
        setMode(mode)
        setIsOpen(true)
    };

    const deleteItem = (filterIndex) => {
        // Find the job to delete from the filtered list
        const isConfirmed = confirm("Are you sure you want to delete?");
        const jobToDelete = filterJobs[filterIndex];
        if (isConfirmed) {
            setRootContext((prevContext) => ({
                ...prevContext,
                jobs: prevContext.jobs.filter((job) => job !== jobToDelete),
            }));
        }
    };


    const tabs = jobCategories.map((job, index) => ({
        name: (
            <div key={index} className="flex flex-wrap items-center gap-2 text-left">
                <div className="flex flex-col">
                    <img
                        src={job.icon}
                        alt={job.title}
                        className="h-12 w-auto object-contain mx-auto"
                    />
                    <span className="text-sm font-semibold">{job.title}</span>
                    <span className="text-xs text-gray-500">{job.description}</span>
                </div>
            </div>
        ),
    }));

    return (
        <>
            {/* Job Categories Section */}
            <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
                {/* Header */}
                <div className="hidden sm:flex flex-col text-sm w-full z-10 bg-white shadow text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-5 font-normal text-gray-800 leading-tight">
                        Click to unlock your <span className="font-bold">Dream Real Estate Jobs</span> below
                    </h1>
                    <div className="w-full px-1 mx-auto">
                        <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </div>
                {/* Mobile Accordion */}
                <div className="sm:hidden">
                    {tabs.map((tab, index) => {
                        const Component = JobList;
                        const isOpen = accordionOpen === index;
                        return (
                            <div key={index} className="border-b border-gray-200">
                                <button
                                    onClick={() => { setAccordionOpen(isOpen ? null : index); setActiveTab(index) }}
                                    className="w-full flex justify-between items-center py-3 px-4 bg-white text-left"
                                >
                                    <span className="font-medium text-sm text-gray-800 text-base truncate">{tab.name}</span>
                                    <ChevronDownIcon
                                        className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isOpen && jobCategories[index] && (
                                    <div className="p-3 bg-gray-50">
                                        <Component
                                            tabName={tabName}
                                            getIconForTitle={getIconForTitle}
                                            editForm={editForm}
                                            deleteItem={deleteItem}
                                            formatWorkingSchedule={formatWorkingSchedule}
                                            formatEmploymentTypes={formatEmploymentTypes}
                                            jobList={filterJobs}
                                            handleCategoryClick={handleCategoryClick}
                                            setIsOpen={setIsOpen}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Job List Section */}
                <div className="hidden sm:flex w-full">
                    {jobCategories[activeTab] && (
                        <JobList
                            tabName={tabName}
                            getIconForTitle={getIconForTitle}
                            editForm={editForm}
                            deleteItem={deleteItem}
                            formatWorkingSchedule={formatWorkingSchedule}
                            formatEmploymentTypes={formatEmploymentTypes}
                            jobList={filterJobs}
                            handleCategoryClick={handleCategoryClick}
                            setIsOpen={setIsOpen}
                        />
                    )}
                </div>
            </div>

            {/* Job Posting Modal (rendered but not opened by category clicks) */}
            {/* You can add a separate button to open this modal for manual job creation if needed */}
            <JobModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                initialJobTitle={currentJobCategory}
                onSave={handleNewJobPost}
            />
            {isOpen && <JobPostingModal title={tabName} editData={editData} mode={mode} isOpen={isOpen} setIsOpen={setIsOpen} />}
        </>
    );
}
