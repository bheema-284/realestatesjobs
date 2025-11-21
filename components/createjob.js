'use client';
import React, { useState, Fragment, useContext, useRef, useEffect } from 'react';
import { Dialog, Transition, RadioGroup, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/solid';
import RootContext from './config/rootcontext';
import dynamic from 'next/dynamic';

const DynamicTiptapEditor = dynamic(() => import('../components/common/tiptapeditor'), {
    ssr: false,
    loading: () => <p className="p-3 sm:p-4 border border-gray-300 rounded-md min-h-[150px] sm:min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-500 text-sm sm:text-base">Loading editor...</p>,
});

const getWordCount = (html) => {
    if (typeof document === 'undefined' || !html) return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split(/\s+/).filter(word => word.length > 0).length;
};

export default function JobPostingModal({ title, editData, mode, isOpen, setIsOpen, userProfile, onJobSaved, mutated }) {
    const { setRootContext } = useContext(RootContext);
    console.log("mode", mode)
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Get user details from localStorage on client side only
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setUser(user_details || null);
    }, []);

    // State for form fields
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [workingSchedule, setWorkingSchedule] = useState({
        dayShift: false,
        nightShift: false,
        weekendAvailability: false,
        custom: '',
    });
    const [salaryType, setSalaryType] = useState('fixed');
    const [salaryAmount, setSalaryAmount] = useState('');
    const [salaryFrequency, setSalaryFrequency] = useState('Monthly');
    const [salaryNegotiable, setSalaryNegotiable] = useState(false);
    const [hiringMultiple, setHiringMultiple] = useState(false);
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Real Estate Specific Fields
    const [jobRoleType, setJobRoleType] = useState(''); // Field Sales, Office Based, Hybrid
    const [commissionStructure, setCommissionStructure] = useState('');
    const [incentives, setIncentives] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [targetAreas, setTargetAreas] = useState('');
    const [languageRequirements, setLanguageRequirements] = useState([]);
    const [vehicleRequirement, setVehicleRequirement] = useState(false);
    const [targetAudience, setTargetAudience] = useState(''); // NRI, Local, Corporate, etc.
    const [salesTargets, setSalesTargets] = useState('');
    const [leadProvided, setLeadProvided] = useState(false);
    const [trainingProvided, setTrainingProvided] = useState(false);
    const [certificationRequired, setCertificationRequired] = useState(false);

    const wordCount = getWordCount(jobDescription);
    const tiptapEditorRef = useRef(null);

    // Check if user has permission to post jobs
    const canPostJobs = userProfile &&
        (userProfile.role === 'company' ||
            userProfile.role === 'superadmin' ||
            userProfile.role === 'recruiter');

    // Real Estate Job Categories
    const jobCategories = [
        { slug: 'channel-partners', name: 'Channel Partners' },
        { slug: 'hr-and-operations', name: 'HR & Operations' },
        { slug: 'real-estate-sales', name: 'Real Estate Sales' },
        { slug: 'tele-caller', name: 'Tele Caller' },
        { slug: 'digital-marketing', name: 'Digital Marketing' },
        { slug: 'web-development', name: 'Web Development' },
        { slug: 'crm-executive', name: 'CRM Executive' },
        { slug: 'accounts-and-auditing', name: 'Accounts & Auditing' },
        { slug: 'architects', name: 'Architects' },
        { slug: 'legal', name: 'Legal' },
    ];

    // Real Estate Experience Options - Detailed
    const experienceOptions = [
        'Beginner (0-1 Year)',
        '1-3 Years',
        '3-5 Years',
        '5-7 Years',
        '7-10 Years',
        '10+ Years'
    ];

    // Employment types for real estate
    const employmentOptions = [
        { id: 'full-time', name: 'Full-time' },
        { id: 'part-time', name: 'Part-time' },
    ];

    // Real Estate Job Role Types
    const jobRoleTypeOptions = [
        { id: 'field-sales', name: 'Field Sales' },
        { id: 'office-based', name: 'Office Based' },
        { id: 'hybrid', name: 'Hybrid' },
        { id: 'site-based', name: 'Site Based' },
        { id: 'channel-sales', name: 'Channel Sales' },
    ];

    // Property Types for Real Estate
    const propertyTypeOptions = [
        { id: 'residential', name: 'Residential' },
        { id: 'commercial', name: 'Commercial' },
        { id: 'industrial', name: 'Industrial' },
        { id: 'plots', name: 'Plots/Land' },
        { id: 'luxury', name: 'Luxury Properties' },
        { id: 'affordable', name: 'Affordable Housing' },
        { id: 'villas', name: 'Villas' },
        { id: 'apartments', name: 'Apartments' },
        { id: 'farmhouses', name: 'Farmhouses' },
        { id: 'redevelopment', name: 'Redevelopment Projects' },
    ];

    // Language Requirements
    const languageOptions = [
        { id: 'english', name: 'English' },
        { id: 'hindi', name: 'Hindi' },
        { id: 'telugu', name: 'Telugu' },
        { id: 'tamil', name: 'Tamil' },
        { id: 'kannada', name: 'Kannada' },
        { id: 'malayalam', name: 'Malayalam' },
        { id: 'marathi', name: 'Marathi' },
        { id: 'bengali', name: 'Bengali' },
        { id: 'gujarati', name: 'Gujarati' },
        { id: 'punjabi', name: 'Punjabi' },
    ];

    // Target Audience Options
    const targetAudienceOptions = [
        { id: 'nri', name: 'NRI Clients' },
        { id: 'local', name: 'Local Clients' },
        { id: 'corporate', name: 'Corporate Clients' },
        { id: 'investors', name: 'Investors' },
        { id: 'end-users', name: 'End Users' },
        { id: 'channel-partners', name: 'Channel Partners' },
        { id: 'brokers', name: 'Brokers' },
        { id: 'all', name: 'All Types' },
    ];

    const handleDescriptionChange = (html) => {
        setJobDescription(html);
    };

    function closeModal() {
        setIsOpen(false);
        resetForm();
    }

    function resetForm() {
        setJobTitle("");
        setJobDescription("");
        setEmploymentTypes([]);
        setWorkingSchedule({
            dayShift: false,
            nightShift: false,
            weekendAvailability: false,
            custom: '',
        });
        setSalaryType("fixed");
        setSalaryAmount("");
        setSalaryFrequency("Monthly");
        setSalaryNegotiable(false);
        setHiringMultiple(false);
        setLocation("");
        setExperience("");
        setSalaryRange("");
        setCategorySlug("");
        setIsSubmitting(false);

        // Reset real estate specific fields
        setJobRoleType("");
        setCommissionStructure("");
        setIncentives("");
        setPropertyTypes([]);
        setTargetAreas("");
        setLanguageRequirements([]);
        setVehicleRequirement(false);
        setTargetAudience("");
        setSalesTargets("");
        setLeadProvided(false);
        setTrainingProvided(false);
        setCertificationRequired(false);
    }

    useEffect(() => {
        if (editData) {
            setJobTitle(editData.jobTitle || editData.title || "");
            setJobDescription(editData.jobDescription || "");
            setEmploymentTypes(editData.employmentTypes || []);
            setWorkingSchedule(editData.workingSchedule || {
                dayShift: false,
                nightShift: false,
                weekendAvailability: false,
                custom: '',
            });
            setSalaryType(editData.salaryType || "fixed");
            setSalaryAmount(editData.salaryAmount || "");
            setSalaryFrequency(editData.salaryFrequency || "Monthly");
            setSalaryNegotiable(editData.salaryNegotiable || false);
            setHiringMultiple(editData.hiringMultiple || false);
            setLocation(editData.location || "");
            setExperience(editData.experience || "");
            setSalaryRange(editData.salary || editData.salaryRange || "");
            setCategorySlug(editData.categorySlug || "");

            // Set real estate specific fields
            setJobRoleType(editData.jobRoleType || "");
            setCommissionStructure(editData.commissionStructure || "");
            setIncentives(editData.incentives || "");
            setPropertyTypes(editData.propertyTypes || []);
            setTargetAreas(editData.targetAreas || "");
            setLanguageRequirements(editData.languageRequirements || []);
            setVehicleRequirement(editData.vehicleRequirement || false);
            setTargetAudience(editData.targetAudience || "");
            setSalesTargets(editData.salesTargets || "");
            setLeadProvided(editData.leadProvided || false);
            setTrainingProvided(editData.trainingProvided || false);
            setCertificationRequired(editData.certificationRequired || false);
        } else {
            // Set default location to company location for new jobs
            if (userProfile?.location) {
                setLocation(userProfile.location);
            }
        }
    }, [editData, userProfile]);

    const handleEmploymentTypeChange = (typeId) => {
        setEmploymentTypes((prev) =>
            prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
        );
    };

    const handlePropertyTypeChange = (typeId) => {
        setPropertyTypes((prev) =>
            prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
        );
    };

    const handleLanguageRequirementChange = (languageId) => {
        setLanguageRequirements((prev) =>
            prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check permission before submitting
        if (!canPostJobs) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Permission Denied",
                    message: "You don't have permission to post jobs"
                }
            }));
            setIsSubmitting(false);
            return;
        }

        // Validate required fields
        if (!jobTitle || !location || !experience || !salaryRange || !categorySlug || !jobDescription) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Missing Information",
                    message: "Please fill all required fields"
                }
            }));
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare job data with real estate specific fields
            const jobData = {
                jobTitle,
                jobDescription,
                employmentTypes,
                workingSchedule,
                salaryType,
                salaryAmount,
                salaryFrequency,
                salaryNegotiable,
                hiringMultiple,
                location,
                experience,
                salary: salaryRange,
                categorySlug,
                status: 'active',
                postedBy: userProfile._id,
                postedByRole: userProfile.role,
                companyId: userProfile.companyId || userProfile._id,
                companyName: userProfile.company || userProfile.name,

                // Real Estate Specific Fields
                jobRoleType,
                commissionStructure,
                incentives,
                propertyTypes,
                targetAreas,
                languageRequirements,
                vehicleRequirement,
                targetAudience,
                salesTargets,
                leadProvided,
                trainingProvided,
                certificationRequired
            };
            jobData.companyId = user.id || 1
            jobData.postedBy = user.name
            jobData.postedByRole = user.role
            let apiUrl = '/api/companies/jobs';
            let method = mode === "create" ? 'POST' : "PUT";
            let successMessage = "Job posted successfully";

            if (mode !== "create" && editData?.id) {
                jobData.id = editData.id;
                successMessage = "Job updated successfully";
            }

            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: successMessage
                    }
                }));
                mutated && mutated()

                closeModal();
            } else {
                // Handle API validation errors
                const errorMessage = data.error || data.details || 'Failed to save job posting';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Job submission error:', error);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Failed",
                    message: error.message || "Failed to save job posting"
                }
            }));
        } finally {
            setIsSubmitting(false);
        }
    };


    // If user doesn't have permission, show access denied message
    if (!canPostJobs) {
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
                        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center" style={{ backgroundColor: '#F0F2F5' }}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title as="h3" className="text-base sm:text-lg font-medium leading-6 text-gray-900">
                                            Access Denied
                                        </Dialog.Title>
                                        <XMarkIcon className="h-5 w-5 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={closeModal} />
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">
                                            You don't have permission to post jobs. Only company accounts, recruiters, and superadmins can create job postings.
                                        </p>
                                    </div>
                                    <div className="mt-4 sm:mt-5 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

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
                        <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center" style={{ backgroundColor: '#F0F2F5' }}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl lg:max-w-5xl transform overflow-hidden rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 lg:p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] sm:max-h-[95vh] overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                                        <Dialog.Title as="h3" className="text-lg sm:text-xl font-semibold leading-6 text-gray-900">
                                            {editData?.id ? 'Edit Job Posting' : 'Create Real Estate Job Posting'}
                                        </Dialog.Title>
                                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={closeModal} />
                                    </div>

                                    {/* Company Information */}
                                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-900">Posting as:</h4>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    {userProfile?.company || userProfile?.name}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    This job will be associated with your company profile
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                        {/* Basic Job Information */}
                                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                            {/* Job Title */}
                                            <div>
                                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job title *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="jobTitle"
                                                    value={jobTitle}
                                                    onChange={(e) => setJobTitle(e.target.value)}
                                                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="e.g. Sales Executive, Property Consultant, Tele Caller"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {/* Job Category */}
                                                <div>
                                                    <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Job Category *
                                                    </label>
                                                    <select
                                                        id="categorySlug"
                                                        value={categorySlug}
                                                        onChange={(e) => setCategorySlug(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        required
                                                    >
                                                        <option value="">Select a category</option>
                                                        {jobCategories.map((category) => (
                                                            <option key={category.slug} value={category.slug}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Job Role Type */}
                                                <div>
                                                    <label htmlFor="jobRoleType" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Job Role Type
                                                    </label>
                                                    <select
                                                        id="jobRoleType"
                                                        value={jobRoleType}
                                                        onChange={(e) => setJobRoleType(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    >
                                                        <option value="">Select role type</option>
                                                        {jobRoleTypeOptions.map((role) => (
                                                            <option key={role.id} value={role.id}>
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {/* Location */}
                                                <div>
                                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Job Location *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        placeholder="e.g. Hyderabad, Mumbai"
                                                        required
                                                    />
                                                </div>

                                                {/* Target Areas */}
                                                <div>
                                                    <label htmlFor="targetAreas" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Target Areas/Localities
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="targetAreas"
                                                        value={targetAreas}
                                                        onChange={(e) => setTargetAreas(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        placeholder="e.g. Gachibowli, Hitech City, Financial District"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {/* Experience */}
                                                <div>
                                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Experience Required *
                                                    </label>
                                                    <select
                                                        id="experience"
                                                        value={experience}
                                                        onChange={(e) => setExperience(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        required
                                                    >
                                                        <option value="">Select experience level</option>
                                                        {experienceOptions.map((exp) => (
                                                            <option key={exp} value={exp}>{exp}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Target Audience */}
                                                <div>
                                                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Target Audience
                                                    </label>
                                                    <select
                                                        id="targetAudience"
                                                        value={targetAudience}
                                                        onChange={(e) => setTargetAudience(e.target.value)}
                                                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    >
                                                        <option value="">Select target audience</option>
                                                        {targetAudienceOptions.map((audience) => (
                                                            <option key={audience.id} value={audience.id}>
                                                                {audience.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Salary Information */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {/* Salary Range */}
                                            <div>
                                                <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Salary Range *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="salaryRange"
                                                    value={salaryRange}
                                                    onChange={(e) => setSalaryRange(e.target.value)}
                                                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="e.g. ₹ 3-5 LPA, Commission Based"
                                                    required
                                                />
                                            </div>

                                            {/* Commission Structure */}
                                            <div>
                                                <label htmlFor="commissionStructure" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Commission Structure
                                                </label>
                                                <input
                                                    type="text"
                                                    id="commissionStructure"
                                                    value={commissionStructure}
                                                    onChange={(e) => setCommissionStructure(e.target.value)}
                                                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="e.g. 1% on sales, 20-40% on brokerage"
                                                />
                                            </div>

                                            {/* Incentives */}
                                            <div>
                                                <label htmlFor="incentives" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Additional Incentives
                                                </label>
                                                <input
                                                    type="text"
                                                    id="incentives"
                                                    value={incentives}
                                                    onChange={(e) => setIncentives(e.target.value)}
                                                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="e.g. Performance bonus, Travel allowance"
                                                />
                                            </div>

                                            {/* Sales Targets */}
                                            <div>
                                                <label htmlFor="salesTargets" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sales Targets (if any)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="salesTargets"
                                                    value={salesTargets}
                                                    onChange={(e) => setSalesTargets(e.target.value)}
                                                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="e.g. 2 deals per month, ₹50L quarterly target"
                                                />
                                            </div>
                                        </div>

                                        <div className='border-b border-gray-300'></div>

                                        {/* Property Types */}
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                    Property Types
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">Select property types involved</p>
                                            </div>
                                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                                {propertyTypeOptions.map((property) => (
                                                    <div
                                                        key={property.id}
                                                        className={`relative flex cursor-pointer rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm border text-xs sm:text-sm
                                                        ${propertyTypes.includes(property.id) ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                        hover:border-green-500 hover:shadow-md transition-all duration-200`}
                                                        onClick={() => handlePropertyTypeChange(property.id)}
                                                    >
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {property.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {propertyTypes.includes(property.id) && (
                                                                <div className="flex-shrink-0 text-white">
                                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Language Requirements */}
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                    Language Requirements
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">Select required languages</p>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                                                {languageOptions.map((language) => (
                                                    <div
                                                        key={language.id}
                                                        className={`relative flex cursor-pointer rounded-lg px-2 py-2 sm:px-3 sm:py-2 shadow-sm border text-xs
                                                        ${languageRequirements.includes(language.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                        hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                                        onClick={() => handleLanguageRequirementChange(language.id)}
                                                    >
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {language.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {languageRequirements.includes(language.id) && (
                                                                <div className="flex-shrink-0 text-white">
                                                                    <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Job Description */}
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                    Job description *
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">Provide detailed job responsibilities and requirements</p>
                                            </div>
                                            <div className="relative">
                                                <DynamicTiptapEditor
                                                    ref={tiptapEditorRef}
                                                    initialContent={jobDescription}
                                                    onContentChange={handleDescriptionChange}
                                                    className="mt-0"
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                                                    {wordCount} words
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Requirements */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {/* Employment Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Employment type *
                                                </label>
                                                <div className="space-y-2">
                                                    {employmentOptions.map((option) => (
                                                        <div
                                                            key={option.id}
                                                            className={`relative flex cursor-pointer rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm border text-sm
                                                            ${employmentTypes.includes(option.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                            hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                                            onClick={() => handleEmploymentTypeChange(option.id)}
                                                        >
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {option.name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {employmentTypes.includes(option.id) && (
                                                                    <div className="flex-shrink-0 text-white">
                                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Additional Features */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Additional Features
                                                </label>
                                                <div className="space-y-3">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="vehicleRequirement"
                                                            checked={vehicleRequirement}
                                                            onChange={(e) => setVehicleRequirement(e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="vehicleRequirement" className="ml-2 block text-sm text-gray-900">
                                                            Vehicle required
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="leadProvided"
                                                            checked={leadProvided}
                                                            onChange={(e) => setLeadProvided(e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="leadProvided" className="ml-2 block text-sm text-gray-900">
                                                            Leads provided by company
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="trainingProvided"
                                                            checked={trainingProvided}
                                                            onChange={(e) => setTrainingProvided(e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="trainingProvided" className="ml-2 block text-sm text-gray-900">
                                                            Training provided
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="certificationRequired"
                                                            checked={certificationRequired}
                                                            onChange={(e) => setCertificationRequired(e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="certificationRequired" className="ml-2 block text-sm text-gray-900">
                                                            Real estate certification required
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 sm:px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        {editData?.id ? 'Updating...' : 'Posting...'}
                                                    </>
                                                ) : (
                                                    editData?.id ? 'Update Job' : 'Post Job'
                                                )}
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