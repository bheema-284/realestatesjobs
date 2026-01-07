'use client';
import React, { useState, Fragment, useContext, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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

// Field configurations for each job category
const jobCategoryFields = {
    // Common fields for all categories
    common: {
        salaryRange: { type: 'text', label: 'Salary Range *', placeholder: 'e.g. ₹ 3-5 LPA, Commission Based' },
        jobTitle: { type: 'text', label: 'Job Title *', placeholder: 'Enter job title' },
        skills: { type: 'text', label: 'Required Skills', placeholder: 'e.g. Communication, Sales, Negotiation' },
        qualification: { type: 'text', label: 'Educational Qualification', placeholder: 'e.g. Any Graduate, B.Tech, MBA' },
        experience: {
            type: 'select',
            label: 'Experience Required *',
            options: [
                'Beginner (0-1 Year)',
                '1-3 Years',
                '3-5 Years',
                '5-7 Years',
                '7-10 Years',
                '10+ Years'
            ]
        },
        employmentTypes: {
            type: 'checkbox-group',
            label: 'Employment Type *',
            options: [
                { id: 'full-time', name: 'Full-time' },
                { id: 'part-time', name: 'Part-time' },
            ]
        },
        jobRoleType: {
            type: 'select',
            label: 'Job Role Type',
            options: [
                'Office Based',
                'Hybrid',
                'Site Based',
                'Channel Sales'
            ]
        },
        location: {
            type: 'select',
            label: 'Job Location *',
            options: [
                'Hyderabad',
                'Bengaluru',
                'Mumbai',
                'Delhi NCR',
                'Chennai',
                'Kolkata',
                'Kochi',
                'Jaipur',
                'Ahmedabad',
                'Ayodhya',
                'Tirupati',
                'Shirdi',
            ]
        },
        languageRequirements: {
            type: 'checkbox-group',
            label: 'Language Requirements',
            options: [
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
            ]
        },
        propertyTypes: {
            type: 'checkbox-group',
            label: 'Property Types',
            options: [
                { id: 'residential', name: 'Residential' },
                { id: 'commercial', name: 'Commercial' },
                { id: 'industrial', name: 'Industrial' },
                { id: 'plots', name: 'Plots/Land' },
                { id: 'luxury', name: 'Luxury Properties' },
                { id: 'affordable', name: 'Affordable Housing' },
            ]
        },
        jobDescription: { type: 'editor', label: 'Job Description *' }
    },

    // Tele Caller specific fields (you already have these)
    'tele-caller': {
        commissionPercentage: {
            type: 'select',
            label: 'Commission Percentage',
            options: ['1-2%', '2-3%', '3-5%', 'Performance Based']
        },
        targetAudience: {
            type: 'select',
            label: 'Target Audience',
            options: ['Inbound Leads', 'Database Calling', 'Walk-in Customers', 'Channel Partners']
        },
        incentives: { type: 'text', label: '+ Incentives', placeholder: 'e.g., Performance bonus, Lead conversion bonus' },
        salesTargets: {
            type: 'radio-group',
            label: 'Sales Targets',
            options: ['50-60 calls per day', '1-3 site visits per week', '3-5 site visits per week']
        },
        additionalBenefits: {
            type: 'checkbox-group',
            label: 'Additional Benefits',
            options: [
                { id: 'performance-bonus', name: 'Performance Bonus' },
                { id: 'pf', name: 'PF' },
                { id: 'insurance', name: 'Insurance' },
                { id: 'phone-reimbursement', name: 'Cell Phone Reimbursement' },
            ]
        }
    },

    // Real Estate Sales specific fields
    'real-estate-sales': {
        commissionPercentage: {
            type: 'select',
            label: 'Commission Percentage *',
            options: ['0.5-1%', '1-2%', '2-3%', '3-5%', 'Performance Based']
        },
        salesTargetAmount: {
            type: 'select',
            label: 'Sales Target (Monthly)',
            options: ['₹10-20 Lakhs', '₹20-30 Lakhs', '₹30-50 Lakhs', '₹50 Lakhs - 1 Crore', 'Above 1 Crore']
        },
        targetAreas: { type: 'text', label: 'Target Areas', placeholder: 'e.g., Central Hyderabad, Western Suburbs' },
        leadProvided: { type: 'checkbox', label: 'Leads provided by company' },
        trainingProvided: { type: 'checkbox', label: 'Training provided' },
        vehicleRequirement: { type: 'checkbox', label: 'Vehicle required' }
    },

    // Digital Marketing specific fields
    'digital-marketing': {
        specialization: {
            type: 'select',
            label: 'Specialization *',
            options: ['SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC/Google Ads']
        },
        tools: { type: 'text', label: 'Required Tools/Platforms', placeholder: 'e.g., Google Analytics, Facebook Ads, CRM tools' },
        workMode: {
            type: 'select',
            label: 'Work Mode',
            options: ['Office', 'Remote', 'Hybrid']
        },
        targetAudience: {
            type: 'select',
            label: 'Target Audience',
            options: ['B2B Clients', 'B2C Customers', 'NRI Clients', 'Investors']
        }
    },

    // Web Development specific fields
    'web-development': {
        techStack: {
            type: 'select',
            label: 'Technology Stack *',
            options: ['React.js', 'Angular', 'Vue.js', 'Node.js', 'PHP/Laravel', 'WordPress', 'Python/Django']
        },
        workMode: {
            type: 'select',
            label: 'Work Mode *',
            options: ['Remote', 'Hybrid', 'On-site']
        },
        projectType: {
            type: 'select',
            label: 'Project Type',
            options: ['Real Estate Portals', 'Property Management Systems', 'CRM Development', 'E-commerce']
        }
    },

    // Accounts & Auditing specific fields
    'accounts-and-auditing': {
        accountsQualification: {
            type: 'select',
            label: 'Qualification *',
            options: ['Chartered Accountant (CA)', 'Cost & Management Accountant (CMA)', 'M.Com', 'B.Com', 'MBA (Finance)']
        },
        accountingSoftware: {
            type: 'select',
            label: 'Accounting Software *',
            options: ['Tally ERP 9', 'SAP', 'QuickBooks', 'Zoho Books', 'Busy', 'Microsoft Dynamics']
        },
        experience: {
            type: 'select',
            label: 'Experience Required *',
            options: [
                '0-2 Years',
                '2-5 Years',
                '5-8 Years',
                '8+ Years'
            ]
        },
        industryExperience: {
            type: 'checkbox-group',
            label: 'Industry Experience',
            options: [
                { id: 'real-estate', name: 'Real Estate' },
                { id: 'construction', name: 'Construction' },
                { id: 'finance', name: 'Finance' },
                { id: 'audit', name: 'Audit Firms' },
            ]
        }
    },

    // Architects specific fields
    'architects': {
        architectureType: {
            type: 'select',
            label: 'Architecture Type *',
            options: ['Residential', 'Commercial', 'Interior Design', 'Landscape', 'Urban Planning']
        },
        designSoftware: {
            type: 'select',
            label: 'Design Software *',
            options: ['AutoCAD', 'Revit', 'SketchUp', '3ds Max', 'Lumion', 'V-Ray']
        },
        projectScale: {
            type: 'select',
            label: 'Project Scale',
            options: ['Small (< 5000 sq ft)', 'Medium (5000-20000 sq ft)', 'Large (> 20000 sq ft)', 'Mixed']
        },
        portfolioRequired: { type: 'checkbox', label: 'Portfolio required' }
    },

    // Legal specific fields
    'legal': {
        legalSpecialization: {
            type: 'select',
            label: 'Legal Specialization *',
            options: ['Real Estate Law', 'Corporate Law', 'Property Law', 'Contract Law', 'Regulatory Compliance']
        },
        legalQualification: {
            type: 'select',
            label: 'Qualification *',
            options: ['LL.B', 'LL.M', 'Company Secretary (CS)', 'Chartered Accountant (CA)', 'MBA (Law)']
        },
        caseTypes: {
            type: 'checkbox-group',
            label: 'Case Types Handled',
            options: [
                { id: 'property-disputes', name: 'Property Disputes' },
                { id: 'contract-drafting', name: 'Contract Drafting' },
                { id: 'due-diligence', name: 'Due Diligence' },
                { id: 'litigation', name: 'Litigation' },
                { id: 'compliance', name: 'Regulatory Compliance' },
            ]
        }
    },

    // Channel Partners specific fields
    'channel-partners': {
        partnerType: {
            type: 'select',
            label: 'Partner Type *',
            options: ['Individual Broker', 'Brokerage Firm', 'Property Consultant', 'Real Estate Agent']
        },
        partnerCommission: {
            type: 'select',
            label: 'Commission Rate *',
            options: ['1-2%', '2-3%', '3-5%', '5-7%', 'Negotiable']
        },
        networkSize: {
            type: 'select',
            label: 'Network Size',
            options: ['Small (1-5 agents)', 'Medium (5-20 agents)', 'Large (20+ agents)', 'Corporate Network']
        },
        exclusivePartnership: { type: 'checkbox', label: 'Exclusive Partnership' }
    },

    // HR & Operations specific fields
    'hr-and-operations': {
        hrSpecialization: {
            type: 'select',
            label: 'HR Specialization *',
            options: ['Recruitment & Talent Acquisition', 'Operations Management', 'Payroll & Compliance', 'Employee Relations']
        },
        hrQualification: {
            type: 'select',
            label: 'Qualification *',
            options: ['MBA (HR)', 'MSW', 'MHRDM', 'Bachelor\'s in HR', 'Diploma in HR']
        },
        industryKnowledge: {
            type: 'checkbox-group',
            label: 'Industry Knowledge',
            options: [
                { id: 'real-estate-recruitment', name: 'Real Estate Recruitment' },
                { id: 'sales-team-management', name: 'Sales Team Management' },
                { id: 'construction-labour', name: 'Construction Labour Laws' },
                { id: 'property-management', name: 'Property Management HR' },
            ]
        }
    },

    // CRM Executive specific fields
    'crm-executive': {
        crmSoftware: {
            type: 'select',
            label: 'CRM Software *',
            options: ['Salesforce', 'Zoho CRM', 'HubSpot', 'Microsoft Dynamics CRM', 'SugarCRM']
        },
        customerSegment: {
            type: 'select',
            label: 'Customer Segment *',
            options: ['NRI Clients', 'Investors', 'End Users', 'Channel Partners', 'Corporate Clients']
        },
        dataManagement: { type: 'checkbox', label: 'Data Management Experience' },
        clientRetention: { type: 'checkbox', label: 'Client Retention Focus' }
    }
};

export default function JobPostingModal({ title, editData, mode, isOpen, setIsOpen, userProfile, onJobSaved, mutated }) {
    const { setRootContext } = useContext(RootContext);
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Get user details from localStorage on client side only
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setUser(user_details || null);
    }, []);

    // Single state object for all form fields
    const [formData, setFormData] = useState({
        // Common fields
        salaryRange: '',
        jobTitle: '',
        skills: '',
        qualification: '',
        experience: '',
        employmentTypes: [],
        jobRoleType: '',
        location: '',
        languageRequirements: [],
        propertyTypes: [],
        jobDescription: '',

        // Category-specific fields will be added dynamically
        commissionPercentage: '',
        targetAudience: '',
        incentives: '',
        salesTargets: '',
        additionalBenefits: [],
        salesTargetAmount: '',
        targetAreas: '',
        leadProvided: false,
        trainingProvided: false,
        vehicleRequirement: false,
        specialization: '',
        tools: '',
        workMode: '',
        techStack: '',
        projectType: '',
        accountsQualification: '',
        accountingSoftware: '',
        industryExperience: [],
        architectureType: '',
        designSoftware: '',
        projectScale: '',
        portfolioRequired: false,
        legalSpecialization: '',
        legalQualification: '',
        caseTypes: [],
        partnerType: '',
        partnerCommission: '',
        networkSize: '',
        exclusivePartnership: false,
        hrSpecialization: '',
        hrQualification: '',
        industryKnowledge: [],
        crmSoftware: '',
        customerSegment: '',
        dataManagement: false,
        clientRetention: false,

        // Other required fields for API
        salaryType: 'fixed',
        salaryAmount: '',
        salaryFrequency: 'Monthly',
        salaryNegotiable: false,
        hiringMultiple: false,
        workingSchedule: {
            dayShift: false,
            nightShift: false,
            weekendAvailability: false,
            custom: '',
        },
        categorySlug: '',
        status: 'active'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const wordCount = getWordCount(formData.jobDescription);
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

    const handleDescriptionChange = (html) => {
        setFormData(prev => ({ ...prev, jobDescription: html }));
    };

    function closeModal() {
        setIsOpen(false);
        resetForm();
    }

    function resetForm() {
        setFormData({
            salaryRange: '',
            jobTitle: '',
            skills: '',
            qualification: '',
            experience: '',
            employmentTypes: [],
            jobRoleType: '',
            location: '',
            languageRequirements: [],
            propertyTypes: [],
            jobDescription: '',
            commissionPercentage: '',
            targetAudience: '',
            incentives: '',
            salesTargets: '',
            additionalBenefits: [],
            salesTargetAmount: '',
            targetAreas: '',
            leadProvided: false,
            trainingProvided: false,
            vehicleRequirement: false,
            specialization: '',
            tools: '',
            workMode: '',
            techStack: '',
            projectType: '',
            accountsQualification: '',
            accountingSoftware: '',
            industryExperience: [],
            architectureType: '',
            designSoftware: '',
            projectScale: '',
            portfolioRequired: false,
            legalSpecialization: '',
            legalQualification: '',
            caseTypes: [],
            partnerType: '',
            partnerCommission: '',
            networkSize: '',
            exclusivePartnership: false,
            hrSpecialization: '',
            hrQualification: '',
            industryKnowledge: [],
            crmSoftware: '',
            customerSegment: '',
            dataManagement: false,
            clientRetention: false,
            salaryType: 'fixed',
            salaryAmount: '',
            salaryFrequency: 'Monthly',
            salaryNegotiable: false,
            hiringMultiple: false,
            workingSchedule: {
                dayShift: false,
                nightShift: false,
                weekendAvailability: false,
                custom: '',
            },
            categorySlug: '',
            status: 'active'
        });
        setIsSubmitting(false);
    }

    useEffect(() => {
        if (editData) {
            // Map editData to formData
            const mappedData = {
                salaryRange: editData.salary || editData.salaryRange || '',
                jobTitle: editData.jobTitle || editData.title || '',
                skills: editData.skills || '',
                qualification: editData.qualification || '',
                experience: editData.experience || '',
                employmentTypes: editData.employmentTypes || [],
                jobRoleType: editData.jobRoleType || '',
                location: editData.location || '',
                languageRequirements: editData.languageRequirements || [],
                propertyTypes: editData.propertyTypes || [],
                jobDescription: editData.jobDescription || '',
                commissionPercentage: editData.commissionPercentage || '',
                targetAudience: editData.targetAudience || '',
                incentives: editData.incentives || '',
                salesTargets: editData.salesTargets || '',
                additionalBenefits: editData.additionalBenefits || [],
                salesTargetAmount: editData.salesTargetAmount || '',
                targetAreas: editData.targetAreas || '',
                leadProvided: editData.leadProvided || false,
                trainingProvided: editData.trainingProvided || false,
                vehicleRequirement: editData.vehicleRequirement || false,
                specialization: editData.specialization || '',
                tools: editData.tools || '',
                workMode: editData.workMode || '',
                techStack: editData.techStack || '',
                projectType: editData.projectType || '',
                accountsQualification: editData.accountsQualification || '',
                accountingSoftware: editData.accountingSoftware || '',
                industryExperience: editData.industryExperience || [],
                architectureType: editData.architectureType || '',
                designSoftware: editData.designSoftware || '',
                projectScale: editData.projectScale || '',
                portfolioRequired: editData.portfolioRequired || false,
                legalSpecialization: editData.legalSpecialization || '',
                legalQualification: editData.legalQualification || '',
                caseTypes: editData.caseTypes || [],
                partnerType: editData.partnerType || '',
                partnerCommission: editData.partnerCommission || '',
                networkSize: editData.networkSize || '',
                exclusivePartnership: editData.exclusivePartnership || false,
                hrSpecialization: editData.hrSpecialization || '',
                hrQualification: editData.hrQualification || '',
                industryKnowledge: editData.industryKnowledge || [],
                crmSoftware: editData.crmSoftware || '',
                customerSegment: editData.customerSegment || '',
                dataManagement: editData.dataManagement || false,
                clientRetention: editData.clientRetention || false,
                salaryType: editData.salaryType || 'fixed',
                salaryAmount: editData.salaryAmount || '',
                salaryFrequency: editData.salaryFrequency || 'Monthly',
                salaryNegotiable: editData.salaryNegotiable || false,
                hiringMultiple: editData.hiringMultiple || false,
                workingSchedule: editData.workingSchedule || {
                    dayShift: false,
                    nightShift: false,
                    weekendAvailability: false,
                    custom: '',
                },
                categorySlug: editData.categorySlug || '',
                status: editData.status || 'active'
            };
            setFormData(mappedData);
        } else {
            // Set default location to company location for new jobs
            if (userProfile?.location) {
                setFormData(prev => ({ ...prev, location: userProfile.location }));
            }
        }
    }, [editData, userProfile]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxGroupChange = (field, optionId) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(optionId)
                ? prev[field].filter(id => id !== optionId)
                : [...prev[field], optionId]
        }));
    };

    const handleCheckboxChange = (field, checked) => {
        setFormData(prev => ({ ...prev, [field]: checked }));
    };

    // Get all fields for current category
    const getCategoryFields = () => {
        const commonFields = jobCategoryFields.common;
        const categorySpecificFields = formData.categorySlug ? jobCategoryFields[formData.categorySlug] || {} : {};

        return { ...commonFields, ...categorySpecificFields };
    };

    // Render field based on type
    const renderField = (fieldName, fieldConfig) => {
        switch (fieldConfig.type) {
            case 'text':
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
                            {fieldConfig.label}
                        </label>
                        <input
                            type="text"
                            id={fieldName}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleInputChange(fieldName, e.target.value)}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder={fieldConfig.placeholder || ''}
                            required={fieldConfig.label.includes('*')}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
                            {fieldConfig.label}
                        </label>
                        <select
                            id={fieldName}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleInputChange(fieldName, e.target.value)}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required={fieldConfig.label.includes('*')}
                        >
                            <option value="">Select an option</option>
                            {fieldConfig.options?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                );

            case 'checkbox-group':
                return (
                    <div key={fieldName} className="flex flex-col gap-3">
                        <label className="text-gray-700 font-medium text-sm sm:text-base">
                            {fieldConfig.label}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {fieldConfig.options?.map((option) => (
                                <div
                                    key={option.id}
                                    className={`relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm border text-sm
                                    ${formData[fieldName]?.includes(option.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                    hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                    onClick={() => handleCheckboxGroupChange(fieldName, option.id)}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {option.name}
                                                </p>
                                            </div>
                                        </div>
                                        {formData[fieldName]?.includes(option.id) && (
                                            <div className="flex-shrink-0 text-white">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'radio-group':
                return (
                    <div key={fieldName}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            {fieldConfig.label}
                        </label>
                        <div className="space-y-2">
                            {fieldConfig.options?.map((option, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name={fieldName}
                                        value={option}
                                        checked={formData[fieldName] === option}
                                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={fieldName} className="flex items-center">
                        <input
                            type="checkbox"
                            id={fieldName}
                            checked={formData[fieldName] || false}
                            onChange={(e) => handleCheckboxChange(fieldName, e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={fieldName} className="ml-2 block text-sm text-gray-900">
                            {fieldConfig.label}
                        </label>
                    </div>
                );

            case 'editor':
                return (
                    <div key={fieldName} className="flex flex-col gap-3">
                        <div>
                            <label className="text-gray-700 font-medium text-sm sm:text-base">
                                {fieldConfig.label}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Provide detailed job responsibilities and requirements</p>
                        </div>
                        <div className="relative">
                            <DynamicTiptapEditor
                                ref={tiptapEditorRef}
                                initialContent={formData.jobDescription}
                                onContentChange={handleDescriptionChange}
                                className="mt-0"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                                {wordCount} words
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
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

        // Validation
        if (!formData.categorySlug) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Missing Information",
                    message: "Please select a job category"
                }
            }));
            setIsSubmitting(false);
            return;
        }

        // Check required common fields
        if (!formData.jobTitle || !formData.location || !formData.experience || !formData.salaryRange) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Missing Information",
                    message: "Please fill all required fields (*)"
                }
            }));
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare job data
            const jobData = {
                ...formData,
                postedBy: userProfile._id || user?.id || 1,
                postedByRole: userProfile.role || user?.role || 'company',
                companyId: userProfile.companyId || userProfile._id || user?.id || 1,
                companyName: userProfile.company || userProfile.name || user?.name || "Unknown Company",
            };

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
                mutated && mutated();
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

    const categoryFields = getCategoryFields();

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
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl lg:max-w-5xl transform overflow-hidden rounded-xl sm:rounded-2xl bg-white px-3 pb-3 sm:px-4 lg:px-6 text-left align-middle shadow-xl transition-all max-h-[90vh] sm:max-h-[95vh] overflow-y-auto">
                                    {/* Header */}
                                    <div className='sticky top-0 bg-white py-3 z-10'>
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title as="h3" className="text-lg sm:text-xl font-semibold leading-6 text-gray-900">
                                                {editData?.id ? 'Edit Job Posting' : 'Create Real Estate Job Posting'}
                                            </Dialog.Title>
                                            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={closeModal} />
                                        </div>
                                    </div>

                                    <div className="mt-2">
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
                                            {/* Job Category Selection */}
                                            <div>
                                                <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job Category *
                                                </label>
                                                <select
                                                    id="categorySlug"
                                                    value={formData.categorySlug}
                                                    onChange={(e) => handleInputChange('categorySlug', e.target.value)}
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

                                            {/* Category-specific fields */}
                                            {formData.categorySlug && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                    {Object.entries(categoryFields).map(([fieldName, fieldConfig]) => (
                                                        <div key={fieldName} className={fieldConfig.type === 'editor' ? 'md:col-span-2' : ''}>
                                                            {renderField(fieldName, fieldConfig)}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

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
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}