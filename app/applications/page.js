'use client';
import React, { useState, Fragment, useEffect, useContext } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/solid';
import RootContext from '@/components/config/rootcontext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import JobPostingModal from '@/components/createjob';
import ButtonTab from '@/components/common/buttontab';
import { useSWRFetch, Mutated } from '@/components/config/useswrfetch';

// Generate unique job ID
const generateJobId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `job-${timestamp}-${random}`;
};

// API service functions for company jobs
const companyJobsService = {
    createJob: async (jobData) => {
        try {
            const response = await fetch('/api/companies/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });
            if (!response.ok) throw new Error('Failed to create job');
            return await response.json();
        } catch (error) {
            throw new Error(`Error creating job: ${error.message}`);
        }
    },

    updateJob: async (jobData) => {
        try {
            const response = await fetch(`/api/companies/jobs`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });
            if (!response.ok) throw new Error('Failed to update job');
            return await response.json();
        } catch (error) {
            throw new Error(`Error updating job: ${error.message}`);
        }
    },

    deleteJob: async (jobId, companyId) => {
        try {
            const response = await fetch(`/api/companies/jobs?companyId=${companyId}&jobId=${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyId }),
            });
            if (!response.ok) throw new Error('Failed to delete job');
            return await response.json();
        } catch (error) {
            throw new Error(`Error deleting job: ${error.message}`);
        }
    },
};

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

// Updated job categories to match your categorySlug values
const jobCategories = [
    {
        icon: '/icons/tel.png',
        title: 'Tele Caller',
        description: 'Engage & Convert',
        slug: 'tele-caller'
    },
    {
        icon: '/icons/cp.png',
        title: 'Channel Partners',
        description: 'Collaborate & Earn',
        slug: 'channel-partners'
    },
    {
        icon: '/icons/realestate.png',
        title: 'Real Estate Sales',
        description: 'Sell Property Faster',
        slug: 'real-estate-sales'
    },
    {
        icon: '/icons/crm.png',
        title: 'CRM Executive',
        description: 'Manage Client Relations',
        slug: 'crm-executive'
    },
    {
        icon: '/icons/digital.png',
        title: 'Digital Marketing',
        description: 'Promote & Convert',
        slug: 'digital-marketing'
    },
    {
        icon: '/icons/hrandop.png',
        title: 'HR & Operations',
        description: 'People & Process',
        slug: 'hr-operations'
    },
    {
        icon: '/icons/accounts.png',
        title: 'Accounts & Auditing',
        description: 'Ensure Financial Clarity',
        slug: 'accounts-auditing'
    },
    {
        icon: '/icons/legal.png',
        title: 'Legal',
        description: 'Safeguard Deals & Compliance',
        slug: 'legal'
    },
    {
        icon: '/icons/architects.png',
        title: 'Architects',
        description: 'Design Smart & Aesthetic Spaces',
        slug: 'architects'
    },
    {
        icon: '/icons/webdev.png',
        title: 'Web Development',
        description: 'Build Real Estate Tech',
        slug: 'web-development'
    }
];

// Auto-create job templates for each category
const autoCreateJobTemplates = {
    'tele-caller': {
        jobTitle: "Tele Caller Executive",
        jobDescription: "<p>We are looking for an enthusiastic Tele Caller Executive to generate sales by contacting potential customers. The ideal candidate should have excellent communication skills and a pleasant phone voice.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "15000-25000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: true,
        location: "Hyderabad",
        experience: "0-1 Year",
        salary: "1.5-2.5 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Performance based incentives",
        incentives: "Monthly performance bonus",
        propertyTypes: ["residential", "commercial"],
        targetAreas: "All Hyderabad areas",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: false,
        targetAudience: "local",
        salesTargets: "50 calls per day",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: false
    },
    'channel-partners': {
        jobTitle: "Channel Partner Manager",
        jobDescription: "<p>Looking for experienced Channel Partner Managers to expand our real estate network. Build and maintain relationships with channel partners to drive sales growth.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: true,
            custom: ""
        },
        salaryType: "commission",
        salaryAmount: "",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "2-5 Years",
        salary: "3-6 LPA + Commission",
        jobRoleType: "field-sales",
        commissionStructure: "5-10% on sales",
        incentives: "Quarterly bonuses, travel allowances",
        propertyTypes: ["residential", "commercial", "plots", "luxury"],
        targetAreas: "Hyderabad and surrounding areas",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: true,
        targetAudience: "nri",
        salesTargets: "2-3 deals per month",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: false
    },
    'real-estate-sales': {
        jobTitle: "Real Estate Sales Executive",
        jobDescription: "<p>Join our dynamic sales team as a Real Estate Sales Executive. Showcase premium properties to potential buyers and close deals effectively.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: true,
            custom: ""
        },
        salaryType: "fixed+commission",
        salaryAmount: "20000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: true,
        location: "Hyderabad",
        experience: "1-3 Years",
        salary: "2-5 LPA + Commission",
        jobRoleType: "field-sales",
        commissionStructure: "2-5% on sales",
        incentives: "Performance bonuses, incentives",
        propertyTypes: ["residential", "commercial", "luxury", "apartments"],
        targetAreas: "Hyderabad prime locations",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: true,
        targetAudience: "nri",
        salesTargets: "1-2 deals per month",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: false
    },
    'crm-executive': {
        jobTitle: "CRM Executive",
        jobDescription: "<p>We are hiring a CRM Executive to manage customer relationships and ensure excellent client service. Maintain client databases and handle customer queries efficiently.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "25000-40000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "1-3 Years",
        salary: "3-5 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Not applicable",
        incentives: "Performance bonus",
        propertyTypes: ["residential", "commercial"],
        targetAreas: "Not applicable",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: false,
        targetAudience: "existing-clients",
        salesTargets: "Client satisfaction metrics",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: false
    },
    'digital-marketing': {
        jobTitle: "Digital Marketing Executive",
        jobDescription: "<p>Looking for a creative Digital Marketing Executive to handle our online presence. Create and manage digital campaigns for real estate properties.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "30000-50000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "2-4 Years",
        salary: "3.6-6 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Performance based",
        incentives: "Campaign performance bonuses",
        propertyTypes: ["residential", "commercial", "luxury"],
        targetAreas: "Online platforms",
        languageRequirements: ["english", "hindi"],
        vehicleRequirement: false,
        targetAudience: "digital-audience",
        salesTargets: "Lead generation targets",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: true
    },
    'hr-operations': {
        jobTitle: "HR Operations Executive",
        jobDescription: "<p>Join our HR team as an Operations Executive. Handle recruitment, employee engagement, and operational activities for our growing real estate team.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "35000-50000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "2-5 Years",
        salary: "4.2-6 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Not applicable",
        incentives: "Annual bonus",
        propertyTypes: [],
        targetAreas: "Not applicable",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: false,
        targetAudience: "internal",
        salesTargets: "Recruitment targets",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: true
    },
    'accounts-auditing': {
        jobTitle: "Accounts Executive",
        jobDescription: "<p>We are seeking an experienced Accounts Executive to manage financial records, handle audits, and ensure compliance with accounting standards.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "40000-60000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "3-6 Years",
        salary: "4.8-7.2 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Not applicable",
        incentives: "Annual performance bonus",
        propertyTypes: [],
        targetAreas: "Not applicable",
        languageRequirements: ["english", "hindi"],
        vehicleRequirement: false,
        targetAudience: "internal",
        salesTargets: "Financial reporting deadlines",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: true
    },
    'legal': {
        jobTitle: "Legal Advisor",
        jobDescription: "<p>Looking for a Legal Advisor to handle property documentation, legal compliance, and client agreements. Ensure all real estate transactions are legally sound.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "50000-80000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "4-8 Years",
        salary: "6-9.6 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Not applicable",
        incentives: "Case completion bonuses",
        propertyTypes: ["residential", "commercial", "plots"],
        targetAreas: "Legal documentation",
        languageRequirements: ["english", "hindi", "telugu"],
        vehicleRequirement: false,
        targetAudience: "clients",
        salesTargets: "Document processing timelines",
        leadProvided: true,
        trainingProvided: false,
        certificationRequired: true
    },
    'architects': {
        jobTitle: "Architect",
        jobDescription: "<p>Join our design team as an Architect. Create innovative architectural designs for residential and commercial projects. Bring creative vision to life.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "45000-70000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "3-7 Years",
        salary: "5.4-8.4 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Project based incentives",
        incentives: "Design excellence awards",
        propertyTypes: ["residential", "commercial", "luxury"],
        targetAreas: "Design and planning",
        languageRequirements: ["english", "hindi"],
        vehicleRequirement: false,
        targetAudience: "clients",
        salesTargets: "Project completion timelines",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: true
    },
    'web-development': {
        jobTitle: "Web Developer",
        jobDescription: "<p>Looking for a skilled Web Developer to build and maintain our real estate platforms. Create responsive websites and implement new features.</p>",
        employmentTypes: ["full-time"],
        workingSchedule: {
            dayShift: true,
            nightShift: false,
            weekendAvailability: false,
            custom: ""
        },
        salaryType: "fixed",
        salaryAmount: "40000-70000",
        salaryFrequency: "Monthly",
        salaryNegotiable: true,
        hiringMultiple: false,
        location: "Hyderabad",
        experience: "2-5 Years",
        salary: "4.8-8.4 LPA",
        jobRoleType: "office-based",
        commissionStructure: "Not applicable",
        incentives: "Project completion bonuses",
        propertyTypes: [],
        targetAreas: "Web development",
        languageRequirements: ["english"],
        vehicleRequirement: false,
        targetAudience: "online-users",
        salesTargets: "Project delivery timelines",
        leadProvided: true,
        trainingProvided: true,
        certificationRequired: false
    }
};

const getIconForTitle = (name) => {
    const normalizedTitle = name && name.replace(/\s+/g, '').replace(/[^\w]/g, '');
    return <img
        src={Icons[normalizedTitle] || Icons.Default}
        alt={name}
        className="h-8 w-auto object-contain mx-auto"
    />;
};

// Enhanced JobList component to display jobs in tabular form
const EnhancedJobList = ({
    tabName,
    getIconForTitle,
    editForm,
    deleteItem,
    formatWorkingSchedule,
    formatEmploymentTypes,
    jobList,
    handleCategoryClick,
    handleAutoCreate,
    setIsOpen,
    loading,
    categorySlug,
    setMode
}) => {
    // Helper functions for real estate specific fields
    const formatPropertyTypes = (types) => {
        if (!types || types.length === 0) return 'N/A';
        return types.map(type =>
            type.charAt(0).toUpperCase() + type.slice(1)
        ).join(', ');
    };

    const formatLanguageRequirements = (languages) => {
        if (!languages || languages.length === 0) return 'N/A';
        return languages.map(lang =>
            lang.charAt(0).toUpperCase() + lang.slice(1)
        ).join(', ');
    };

    const formatTargetAudience = (audience) => {
        if (!audience) return 'N/A';
        return audience.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatJobRoleType = (roleType) => {
        if (!roleType) return 'N/A';
        return roleType.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatBoolean = (value) => {
        return value ? 'Yes' : 'No';
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Not specified';
        if (salary.includes('cr')) return salary.toUpperCase();
        return salary;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Create Job Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{tabName} Jobs</h2>
                <div className="flex gap-3">
                    {/* Auto Create Button */}
                    <button
                        onClick={() => { handleAutoCreate(tabName); setMode("create"); }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Auto Create Job</span>
                    </button>

                    {/* Manual Create Button */}
                    <button
                        onClick={() => handleCategoryClick(tabName)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Create Job</span>
                    </button>
                </div>
            </div>

            {/* Jobs Table - Always show if jobs exist */}
            {jobList.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location & Experience
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Salary & Commission
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Requirements
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applications
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobList.map((job, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        {/* Job Details */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {getIconForTitle(job.categorySlug)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {job.jobTitle}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {job.companyName}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Posted: {formatDate(job.postedOn)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {job.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location & Experience */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{job.location}</div>
                                            <div className="text-sm text-gray-500">{job.experience}</div>
                                            <div className="text-xs text-gray-400">
                                                {formatJobRoleType(job.jobRoleType)}
                                            </div>
                                        </td>

                                        {/* Salary & Commission */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatSalary(job.salary)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Commission: {job.commissionStructure || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Incentives: {job.incentives || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Requirements */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 space-y-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs">Property:</span>
                                                    <span className="text-xs font-medium">
                                                        {job.propertyTypes?.slice(0, 2).join(', ')}
                                                        {job.propertyTypes?.length > 2 && '...'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs">Languages:</span>
                                                    <span className="text-xs font-medium">
                                                        {job.languageRequirements?.slice(0, 2).join(', ')}
                                                        {job.languageRequirements?.length > 2 && '...'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs">Vehicle:</span>
                                                    <span className="text-xs font-medium">
                                                        {formatBoolean(job.vehicleRequirement)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Applications */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {job.applications?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Applications
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Views: {job.views || 0}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {job.status}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatEmploymentTypes(job.employmentTypes)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => editForm(index, "edit")}
                                                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                    title="Edit Job"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => deleteItem(index)}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                    title="Delete Job"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{jobList.length}</span> job{jobList.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-500">
                                Last updated: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty state only shown when there are no jobs
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-400 mb-4">
                        <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first job posting.</p>
                </div>
            )}
        </div>
    );
};

// Main Jobs Component
export default function Jobs() {
    const { rootContext, setRootContext } = useContext(RootContext);
    const [activeTab, setActiveTab] = useState(0);
    const [editData, setEditData] = useState({});
    const [mode, setMode] = useState("create");
    const [isOpen, setIsOpen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get company ID from context
    const companyId = rootContext?.user?.companyId || rootContext?.user?.id;
    const companyName = rootContext?.user?.companyName || rootContext?.user?.name;

    // Get current category slug and name
    const currentCategory = jobCategories[activeTab];
    const categorySlug = currentCategory?.slug || '';
    const tabName = currentCategory?.title || '';

    // Use SWR to fetch jobs data
    const { data, isLoading, error: swrError } = useSWRFetch(`/api/companies/jobs`);
    const mutated = Mutated(`/api/companies/jobs`);

    // Get jobs from SWR data - handle the correct data structure
    const jobList = data?.jobs || [];

    // Filter jobs by category slug
    const filterJobs = jobList.filter((item) => {
        return item.categorySlug === categorySlug;
    });


    // Auto-select first tab that has jobs
    useEffect(() => {
        if (jobList.length > 0 && activeTab === 0) {
            // Find the first category that has jobs
            const firstCategoryWithJobs = jobCategories.findIndex(category => {
                return jobList.some(job => job.categorySlug === category.slug);
            });

            if (firstCategoryWithJobs !== -1 && firstCategoryWithJobs !== activeTab) {
                setActiveTab(firstCategoryWithJobs);
            }
        }
    }, [jobList, activeTab]);

    const handleCategoryClick = (categoryTitle) => {
        const currentCategory = jobCategories.find(cat => cat.title === categoryTitle);
        const jobId = generateJobId();
        setEditData({
            jobTitle: categoryTitle,
            categorySlug: currentCategory?.slug || categoryTitle.toLowerCase().replace(/\s+/g, '-'),
            companyId: companyId,
            companyName: companyName,
            postedBy: rootContext?.user?.id,
            postedByRole: rootContext?.user?.role,
            id: jobId,
            postedOn: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            applications: [],
            views: 0
        });
        setMode("create");
        setIsOpen(true);
    };

    const handleAutoCreate = (categoryTitle) => {
        const currentCategory = jobCategories.find(cat => cat.title === categoryTitle);
        const categorySlug = currentCategory?.slug;
        const template = autoCreateJobTemplates[categorySlug];

        if (template) {
            const jobId = generateJobId();
            const currentDate = new Date().toISOString();

            setEditData({
                ...template,
                categorySlug: categorySlug,
                companyId: companyId,
                companyName: companyName,
                postedBy: rootContext?.user?.id,
                postedByRole: rootContext?.user?.role,
                id: jobId,
                postedOn: currentDate,
                createdAt: currentDate,
                updatedAt: currentDate,
                status: 'active',
                applications: [],
                views: 0
            });
            setMode("create");
            setIsOpen(true);
        }
    };

    const editForm = (index, mode) => {
        const jobListToEdit = filterJobs[index];
        setEditData({
            ...jobListToEdit,
            companyId: companyId,
            companyName: companyName,
            postedBy: rootContext?.user?.id,
            postedByRole: rootContext?.user?.role,
        });
        setMode(mode);
        setIsOpen(true);
    };

    const deleteItem = async (filterIndex) => {
        const isConfirmed = confirm("Are you sure you want to delete this job?");
        if (!isConfirmed) return;

        const jobToDelete = filterJobs[filterIndex];

        try {
            setLoading(true);
            const response = await companyJobsService.deleteJob(jobToDelete.id, companyId);

            if (response.success) {
                mutated();
                console.log('Job deleted successfully!');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error deleting job:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
    const formatEmploymentTypes = (types) => {
        if (!types || types.length === 0) return 'N/A';
        return types.map(type => type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')).join(', ');
    };

    const formatWorkingSchedule = (schedule) => {
        const parts = [];
        if (schedule?.dayShift) parts.push('Day');
        if (schedule?.nightShift) parts.push('Night');
        if (schedule?.weekendAvailability) parts.push('Weekend');
        if (schedule?.custom) parts.push(schedule.custom);
        return parts.length > 0 ? parts.join(', ') : 'Flexible';
    };

    // Enhanced tabs with job counts
    const tabs = jobCategories.map((job, index) => {
        const categorySlug = job.slug;
       
        return {
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
        };
    });

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (swrError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
                    <p className="text-gray-600 mb-4">{swrError.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
                {/* Loading and Error States */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg">
                            <p>Loading...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="absolute top-0 right-0 px-4 py-3"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="hidden sm:flex flex-col text-sm w-full z-10 bg-white shadow text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-5 font-normal text-gray-800 leading-tight">
                        Click to unlock your <span className="font-bold">Dream Real Estate Jobs</span> below
                    </h1>
                    <div className="w-full px-1 mx-auto">
                        <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </div>

                {/* Category Info Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {tabName} Jobs
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filterJobs.length} job{filterJobs.length !== 1 ? 's' : ''} found in {tabName} category
                        </p>
                    </div>
                </div>

                {/* Mobile Accordion */}
                <div className="sm:hidden">
                    {tabs.map((tab, index) => {
                        const isOpen = accordionOpen === index;
                        const currentCategory = jobCategories[index];
                        const categorySlug = currentCategory?.slug || '';
                        const mobileFilterJobs = jobList.filter((item) => item.categorySlug === categorySlug);

                        return (
                            <div key={index} className="border-b border-gray-200">
                                <button
                                    onClick={() => { setAccordionOpen(isOpen ? null : index); setActiveTab(index) }}
                                    className="w-full flex justify-between items-center py-3 px-4 bg-white text-left"
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-sm text-gray-800 text-base truncate">{currentCategory?.title}</span>
                                        {mobileFilterJobs.length > 0 && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1">
                                                {mobileFilterJobs.length} job{mobileFilterJobs.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDownIcon
                                        className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isOpen && currentCategory && (
                                    <div className="p-3 bg-gray-50">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{currentCategory.title} Jobs</h3>
                                            <p className="text-sm text-gray-600">
                                                {mobileFilterJobs.length} job{mobileFilterJobs.length !== 1 ? 's' : ''} found
                                            </p>
                                        </div>
                                        <EnhancedJobList
                                            tabName={currentCategory.title}
                                            getIconForTitle={getIconForTitle}
                                            editForm={editForm}
                                            deleteItem={deleteItem}
                                            formatWorkingSchedule={formatWorkingSchedule}
                                            formatEmploymentTypes={formatEmploymentTypes}
                                            jobList={mobileFilterJobs}
                                            handleCategoryClick={handleCategoryClick}
                                            handleAutoCreate={handleAutoCreate}
                                            setIsOpen={setIsOpen}
                                            loading={loading}
                                            categorySlug={categorySlug}
                                            setMode={setMode}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Job List Section */}
                <div className="hidden sm:flex w-full">
                    {currentCategory && (
                        <EnhancedJobList
                            tabName={tabName}
                            getIconForTitle={getIconForTitle}
                            editForm={editForm}
                            deleteItem={deleteItem}
                            formatWorkingSchedule={formatWorkingSchedule}
                            formatEmploymentTypes={formatEmploymentTypes}
                            jobList={filterJobs}
                            handleCategoryClick={handleCategoryClick}
                            handleAutoCreate={handleAutoCreate}
                            setIsOpen={setIsOpen}
                            loading={loading}
                            setMode={setMode}
                        />
                    )}
                </div>
            </div>

            {/* Job Posting Modal */}
            {isOpen && (
                <JobPostingModal
                    title={tabName}
                    editData={editData}
                    mode={mode}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    userProfile={rootContext?.user}
                    mutated={mutated}
                    loading={loading}
                />
            )}
        </>
    );
}