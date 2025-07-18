'use client';
import React, { useState, Fragment, useContext, useRef, useEffect } from 'react';
import { Dialog, Transition, RadioGroup, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // For the dropdown icon
import { XMarkIcon } from '@heroicons/react/24/solid';
import RootContext from './config/rootcontext';
import dynamic from 'next/dynamic';
const DynamicTiptapEditor = dynamic(() => import('../components/common/tiptapeditor'), {
    ssr: false,
    loading: () => <p className="p-4 border border-gray-300 rounded-md min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-500">Loading editor...</p>,
});

// Helper for word count (Tiptap doesn't have a direct word count, but can get text content)
const getWordCount = (html) => {
    if (typeof document === 'undefined' || !html) return 0; // Guard for SSR
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split(/\s+/).filter(word => word.length > 0).length;
};

export default function JobPostingModal({ editData, mode, isOpen, setIsOpen }) {
    console.log("editData", editData)
    const { rootContext, setRootContext } = useContext(RootContext);
    // State for form fields
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [employmentTypes, setEmploymentTypes] = useState([]); // Array for multiple selections
    const [workingSchedule, setWorkingSchedule] = useState({
        dayShift: false,
        nightShift: false,
        weekendAvailability: false,
        custom: '', // This will hold the text for "Pick working schedule" input
    });
    const [salaryType, setSalaryType] = useState('hourly'); // 'hourly' or 'custom'
    const [salaryAmount, setSalaryAmount] = useState('');
    const [salaryFrequency, setSalaryFrequency] = useState('Yearly'); // 'Yearly', 'Monthly', 'Weekly', 'Hourly'
    const [salaryNegotiable, setSalaryNegotiable] = useState(false); // State for salary negotiable checkbox
    const [hiringMultiple, setHiringMultiple] = useState(false);
    const wordCount = getWordCount(jobDescription);

    const tiptapEditorRef = useRef(null); // Ref for Tiptap editor methods

    const handleDescriptionChange = (html) => {
        setJobDescription(html);
    };

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (editData) {
            setJobTitle(editData.jobTitle || "")
            setJobDescription(editData.jobDescription || "")
            setEmploymentTypes(editData.employmentTypes || [])
            setWorkingSchedule(editData.workingSchedule || {
                dayShift: false,
                nightShift: false,
                weekendAvailability: false,
                custom: '',
            })
            setSalaryType(editData.salaryType || "hourly")
            setSalaryAmount(editData.salaryAmount || "")
            setSalaryFrequency(editData.salaryFrequency || "Yearly")
            setSalaryNegotiable(editData.salaryNegotiable || false)
            setHiringMultiple(editData.hiringMultiple || false)
        }

    }, [editData])

    // Options for employment type (now treated as checkboxes)
    const employmentOptions = [
        { id: 'full-time', name: 'Full-time' },
        { id: 'part-time', name: 'Part-time' },
        { id: 'on-demand', name: 'On demand' },
        { id: 'negotiable', name: 'Negotiable' },
    ];

    // Options for salary frequency dropdown
    const salaryFrequencies = ['Yearly', 'Monthly', 'Weekly', 'Hourly'];

    const handleEmploymentTypeChange = (typeId) => {
        setEmploymentTypes((prev) =>
            prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newJob = {
            id: editData.id || `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // use existing `jobId` if updating
            jobTitle,
            jobDescription,
            employmentTypes,
            workingSchedule,
            salaryType,
            salaryAmount,
            salaryFrequency,
            salaryNegotiable,
            hiringMultiple,
        };

        setRootContext((prevContext) => {
            const existingIndex = prevContext.jobs.findIndex(job => job.id === newJob.id);

            if (existingIndex !== -1) {
                // Update existing job
                const updatedJobs = [...prevContext.jobs];
                updatedJobs[existingIndex] = newJob;

                return {
                    ...prevContext,
                    jobs: updatedJobs,
                };
            } else {
                // Add new job
                return {
                    ...prevContext,
                    jobs: [...prevContext.jobs, newJob],
                };
            }
        });

        closeModal();
    };

    const timeSlotOptions = [
        { label: 'Select a preferred time range', value: '' }, // Default/placeholder option
        { label: 'Morning (9 AM - 1 PM)', value: 'morning_09_13' },
        { label: 'Afternoon (1 PM - 5 PM)', value: 'afternoon_13_17' },
        { label: 'Evening (5 PM - 9 PM)', value: 'evening_17_21' },
        { label: 'Full Day (9 AM - 5 PM)', value: 'full_day_09_17' },
        { label: 'Night (9 PM - 5 AM)', value: 'night_21_05' },
        { label: 'Flexible Hours', value: 'flexible' },
    ];
    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { }}>
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
                                                Job title
                                                <p className="text-xs text-gray-500 mt-1">A job title must describe one position only</p>
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
                                        <div className='border-b border-gray-300'></div>
                                        {/* Job Description */}
                                        <div className="flex flex-col md:flex-row items-start">
                                            <label htmlFor="jobDescription" className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                                Job description
                                                <p className="text-xs text-gray-500 mt-1">Provide a short description about the job. Keep it short and to the point.</p>
                                            </label>
                                            <div className="w-full md:w-2/3 mt-2 md:mt-0 relative">
                                                {/* Simplified rich text editor placeholder */}
                                                {/* <div className="flex justify-between items-center border border-gray-300 rounded-t-md p-2 bg-gray-50 text-gray-600 text-sm">
                                                    <div className="flex space-x-2">
                                                        <span className="font-bold">B</span>
                                                        <span className="italic">I</span>
                                                        <span className="underline">U</span>
                                                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2.75 7.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2 10.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10.25ZM2.75 13a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2 15.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 15.75Z" clipRule="evenodd" /></svg></span>
                                                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-1.716 0-3.405.106-5.07.31C3.807 2.511 3 3.407 3 4.42v10.164a3 3 0 0 0 .807 2.022c.638.63 1.543.994 2.493.994H16.5A1.5 1.5 0 0 0 18 16.5V6.75A.75.75 0 0 0 17.25 6H13.5a.75.75 0 0 1-.75-.75V2.75A.75.75 0 0 0 12 2h-2Zm2.25 1.5v-.25a.75.75 0 0 0-.75-.75H10a.75.75 0 0 0-.75.75v.25h3.75Z" clipRule="evenodd" /></svg></span>
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
                                                /> */}

                                                <DynamicTiptapEditor
                                                    ref={tiptapEditorRef}
                                                    initialContent={jobDescription}
                                                    onContentChange={handleDescriptionChange}
                                                    className="mt-0"
                                                />
                                                {/* Word count overlay */}
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                                                    {wordCount} words
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border-b border-gray-300'></div>
                                        {/* Employment Type (now multi-select) */}
                                        <div className="flex flex-col md:flex-row items-start">
                                            <label className="w-full md:w-1/3 text-gray-700 font-medium text-sm md:text-base">
                                                Employment type
                                                <p className="text-xs text-gray-500 mt-1">Description text goes in ehre</p>
                                            </label>
                                            <div className="w-full md:w-2/3 mt-2 md:mt-0 space-y-3">
                                                {employmentOptions.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className={`relative flex cursor-pointer rounded-lg px-5 py-3 shadow-sm border
                                                        ${employmentTypes.includes(option.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                        hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                                        onClick={() => handleEmploymentTypeChange(option.id)}
                                                    >
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="text-sm">
                                                                    <p className="font-medium">
                                                                        {option.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {employmentTypes.includes(option.id) && (
                                                                <div className="flex-shrink-0 text-white"> {/* Checkmark color */}
                                                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='border-b border-gray-300'></div>
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
                                                    className={`px-2 py-1 rounded-xl border text-sm font-medium transition-colors duration-200
                            ${workingSchedule.dayShift ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-100 rounded-md text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                                                >
                                                    Day shift
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setWorkingSchedule(prev => ({ ...prev, nightShift: !prev.nightShift }))}
                                                    className={`px-2 py-1 rounded-xl border text-sm font-medium transition-colors duration-200
                            ${workingSchedule.nightShift ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-100 rounded-md text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                                                >
                                                    Night shift
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setWorkingSchedule(prev => ({ ...prev, weekendAvailability: !prev.weekendAvailability }))}
                                                    className={`px-2 py-1 rounded-xl border text-sm font-medium transition-colors duration-200
                            ${workingSchedule.weekendAvailability ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-100 rounded-md text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                                                >
                                                    Weekend availability
                                                </button>
                                                {/* Custom input for working schedule */}
                                                {/* <input
                                                    type="text"
                                                    value={workingSchedule.custom}
                                                    onChange={(e) => setWorkingSchedule(prev => ({ ...prev, custom: e.target.value }))}
                                                    placeholder="Pick working schedule"
                                                    className="flex-grow p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[150px]"
                                                /> */}

                                                <div className="mb-6">
                                                    {/* <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Pick working schedule
                                                    </label> */}
                                                    <select
                                                        id="timeRange"
                                                        name="timeRange"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                                        value={workingSchedule.custom}
                                                        onChange={(e) => setWorkingSchedule(prev => ({ ...prev, custom: e.target.value }))}
                                                    >
                                                        {timeSlotOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border-b border-gray-300'></div>
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
                                                            ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                            ${active ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`
                                                        }
                                                    >
                                                        {({ checked }) => (
                                                            <div className="flex items-center">
                                                                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${checked ? 'border-white bg-white' : 'border-gray-400 bg-white'}`}>
                                                                    {checked && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                                                                </span>
                                                                <RadioGroup.Label as="p" className={`ml-2 text-sm font-medium ${checked ? 'text-white' : 'text-gray-900'}`}>
                                                                    Hourly
                                                                </RadioGroup.Label>
                                                            </div>
                                                        )}
                                                    </RadioGroup.Option>
                                                    <RadioGroup.Option
                                                        value="custom"
                                                        className={({ active, checked }) =>
                                                            `relative flex cursor-pointer rounded-md p-3 focus:outline-none border
                                                            ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                            ${active ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`
                                                        }
                                                    >
                                                        {({ checked }) => (
                                                            <div className="flex items-center">
                                                                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${checked ? 'border-white bg-white' : 'border-gray-400 bg-white'}`}>
                                                                    {checked && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                                                                </span>
                                                                <RadioGroup.Label as="p" className={`ml-2 text-sm font-medium ${checked ? 'text-white' : 'text-gray-900'}`}>
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
                                                            type="text"
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
                                                        checked={salaryNegotiable}
                                                        onChange={(e) => setSalaryNegotiable(e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="salaryNegotiable" className="ml-2 block text-sm text-gray-900">
                                                        Salary is negotiable
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border-b border-gray-300'></div>
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
        </div>
    );
}