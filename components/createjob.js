'use client';
import React, { useState, Fragment, useContext, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/solid';
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

// Language display names
const languageDisplayNames = {
    'hindi': 'हिंदी',
    'english': 'English',
    'telugu': 'తెలుగు',
    'tamil': 'தமிழ்',
    'kannada': 'ಕನ್ನಡ',
    'malayalam': 'മലയാളം',
    'marathi': 'मराठी',
    'bengali': 'বাংলা',
    'gujarati': 'ગુજરાતી',
    'punjabi': 'ਪੰਜਾਬੀ',
    'odia': 'ଓଡ଼ିଆ',
    'urdu': 'اردو',
    'sanskrit': 'संस्कृतम्',
    'assamese': 'অসমীয়া',
    'maithili': 'मैथिली',
    'kashmiri': 'कॉशुर',
    'sindhi': 'سنڌي',
    'konkani': 'कोंकणी',
    'nepali': 'नेपाली',
    'manipuri': 'मैतैलোন्',
    'bodo': 'बर',
    'dogri': 'डोगरी'
};

// Educational Qualification options
const educationOptions = [
    'PhD',
    'Post Graduation',
    'Graduation',
    'Diploma',
    '12th / Intermediate',
    '10th / SSC',
    'Below 10th'
];

// Common skills for each job category
const categorySkills = {
    // Tele Caller specific skills
    'tele-caller': [
        'Communication Skills',
        'Telephone Etiquette',
        'Cold Calling',
        'Lead Generation',
        'Customer Service',
        'Persistence',
        'Time Management',
        'Sales Techniques',
        'CRM Software',
        'Follow-up Skills'
    ],

    // Real Estate Sales specific skills
    'real-estate-sales': [
        'Sales Negotiation',
        'Property Valuation',
        'Market Analysis',
        'Client Relationship',
        'Lead Generation',
        'Property Law Knowledge',
        'Documentation',
        'Site Visits',
        'Networking',
        'Closing Skills'
    ],

    // Digital Marketing specific skills
    'digital-marketing': [
        'SEO/SEM',
        'Social Media Marketing',
        'Content Creation',
        'Google Analytics',
        'PPC Campaigns',
        'Email Marketing',
        'CRM Tools',
        'Market Research',
        'Data Analysis',
        'Creative Writing'
    ],

    // Web Development specific skills
    'web-development': [
        'React.js',
        'JavaScript',
        'HTML/CSS',
        'Node.js',
        'API Integration',
        'Database Management',
        'Version Control (Git)',
        'Responsive Design',
        'Problem Solving',
        'Testing/Debugging'
    ],

    // Accounts & Auditing specific skills
    'accounts-and-auditing': [
        'Accounting Principles',
        'Tally ERP 9',
        'Financial Reporting',
        'Taxation',
        'Auditing',
        'Budgeting',
        'Excel Advanced',
        'Financial Analysis',
        'Compliance',
        'Bookkeeping'
    ],

    // Architects specific skills
    'architects': [
        'AutoCAD',
        '3D Modeling',
        'Space Planning',
        'Building Codes',
        'Construction Drawings',
        'Material Selection',
        'Project Management',
        'Client Presentation',
        'Sustainable Design',
        'Visualization'
    ],

    // Legal specific skills
    'legal': [
        'Contract Drafting',
        'Legal Research',
        'Case Management',
        'Documentation',
        'Due Diligence',
        'Compliance',
        'Negotiation',
        'Client Counseling',
        'Property Law',
        'Analytical Thinking'
    ],

    // Channel Partners specific skills
    'channel-partners': [
        'Networking',
        'Deal Making',
        'Market Knowledge',
        'Relationship Building',
        'Commission Management',
        'Sales Strategy',
        'Team Leadership',
        'Market Analysis',
        'Negotiation',
        'Business Development'
    ],

    // HR & Operations specific skills
    'hr-and-operations': [
        'Recruitment',
        'Employee Relations',
        'Payroll Management',
        'Performance Management',
        'Training & Development',
        'Labor Laws',
        'Conflict Resolution',
        'HR Analytics',
        'Onboarding',
        'Policy Implementation'
    ],

    // CRM Executive specific skills
    'crm-executive': [
        'Customer Service',
        'CRM Software',
        'Data Management',
        'Client Retention',
        'Communication Skills',
        'Problem Solving',
        'Follow-up',
        'Relationship Building',
        'Feedback Collection',
        'Service Improvement'
    ]
};

// Default common skills (used when no category is selected)
const defaultCommonSkills = [
    'Communication Skills',
    'Negotiation Skills',
    'Customer Service',
    'Sales Techniques',
    'Real Estate Knowledge',
    'Market Analysis',
    'Property Valuation',
    'Lead Generation',
    'Client Relationship Management',
    'MS Office',
    'CRM Software',
    'Property Law',
    'Documentation',
    'Team Management',
    'Problem Solving'
];

// Field configurations for each job category
const jobCategoryFields = {
    // Common fields for all categories
    common: {
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
        salary: {
            type: 'text',
            label: 'Fixed Salary *',
            placeholder: 'e.g. ₹ 3 LPA, ₹ 25,000/month'
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
        employmentTypes: {
            type: 'checkbox-group',
            label: 'Employment Type *',
            options: [
                { id: 'full-time', name: 'Full-time' },
                { id: 'part-time', name: 'Part-time' },
            ]
        },
        qualification: {
            type: 'education-select',
            label: 'Educational Qualification',
        },
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
        }
    },

    // Tele Caller specific fields
    'tele-caller': {
        commissionPercentage: {
            type: 'select',
            label: 'Commission Percentage',
            options: ['1-2%', '2-3%', '3-5%', 'Performance Based']
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

    // Digital Marketing specific skills
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

// Language options with display names
const languageOptions = [
    { id: 'english', name: languageDisplayNames.english },
    { id: 'hindi', name: languageDisplayNames.hindi },
    { id: 'telugu', name: languageDisplayNames.telugu },
    { id: 'tamil', name: languageDisplayNames.tamil },
    { id: 'kannada', name: languageDisplayNames.kannada },
    { id: 'malayalam', name: languageDisplayNames.malayalam },
    { id: 'marathi', name: languageDisplayNames.marathi },
    { id: 'bengali', name: languageDisplayNames.bengali },
    { id: 'gujarati', name: languageDisplayNames.gujarati },
    { id: 'punjabi', name: languageDisplayNames.punjabi },
    { id: 'odia', name: languageDisplayNames.odia },
    { id: 'urdu', name: languageDisplayNames.urdu },
    { id: 'sanskrit', name: languageDisplayNames.sanskrit },
    { id: 'assamese', name: languageDisplayNames.assamese },
    { id: 'maithili', name: languageDisplayNames.maithili },
    { id: 'kashmiri', name: languageDisplayNames.kashmiri },
    { id: 'sindhi', name: languageDisplayNames.sindhi },
    { id: 'konkani', name: languageDisplayNames.konkani },
    { id: 'nepali', name: languageDisplayNames.nepali },
    { id: 'manipuri', name: languageDisplayNames.manipuri },
    { id: 'bodo', name: languageDisplayNames.bodo },
    { id: 'dogri', name: languageDisplayNames.dogri }
];

// Property type options
const propertyTypeOptions = [
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'plots', name: 'Plots/Land' },
    { id: 'luxury', name: 'Luxury Properties' },
    { id: 'affordable', name: 'Affordable Housing' },
];

// Job Preview Component
const JobPreview = ({ formData, jobCategories }) => {
    const getCategoryName = (slug) => {
        const category = jobCategories?.find(cat => cat.slug === slug);
        return category ? category.name : 'N/A';
    };

    const formatHTML = (html) => {
        if (!html || typeof html !== 'string') return '';

        // Sanitize HTML to prevent React errors
        try {
            // Remove any script tags and other potentially dangerous content
            const cleanHtml = html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+="[^"]*"/g, '')
                .replace(/javascript:/gi, '')
                .replace(/data:/gi, '');

            return { __html: cleanHtml };
        } catch (error) {
            console.error('Error formatting HTML for preview:', error);
            return { __html: '' };
        }
    };

    const formatArray = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None';
        return arr.join(', ');
    };

    const formatCheckboxes = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None';
        return arr.map(item => {
            if (typeof item === 'object') return item.name;
            return item;
        }).join(', ');
    };

    const formatLanguages = (langs) => {
        if (!langs || !Array.isArray(langs) || langs.length === 0) return 'None';
        return langs.map(lang => languageDisplayNames[lang] || lang).join(', ');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preview</h3>

            <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-700">Job Title</h4>
                        <p className="text-gray-900">{formData?.jobTitle || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Category</h4>
                        <p className="text-gray-900">{getCategoryName(formData?.categorySlug)}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Location</h4>
                        <p className="text-gray-900">{formData?.location || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Salary</h4>
                        <p className="text-gray-900">{formData?.salary || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Experience</h4>
                        <p className="text-gray-900">{formData?.experience || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Job Role Type</h4>
                        <p className="text-gray-900">{formData?.jobRoleType || 'N/A'}</p>
                    </div>
                </div>

                {/* Employment Type */}
                <div>
                    <h4 className="font-medium text-gray-700">Employment Type</h4>
                    <p className="text-gray-900">{formatArray(formData?.employmentTypes)}</p>
                </div>

                {/* Education & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-700">Educational Qualification</h4>
                        <p className="text-gray-900">{formatArray(formData?.qualification)}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                            {formData?.skills?.map((skill, index) => (
                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {skill}
                                </span>
                            )) || 'None'}
                        </div>
                    </div>
                </div>

                {/* Language & Property Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-700">Language Requirements</h4>
                        <p className="text-gray-900">{formatLanguages(formData?.languageRequirements)}</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Property Types</h4>
                        <p className="text-gray-900">{formatArray(formData?.propertyTypes)}</p>
                    </div>
                </div>

                {/* Category Specific Fields */}
                {formData?.categorySlug && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Category Specific Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dynamic category fields */}
                            {Object.entries(jobCategoryFields[formData.categorySlug] || {}).map(([key, field]) => {
                                if (!formData[key]) return null;

                                let value = formData[key];
                                if (Array.isArray(value)) {
                                    value = formatCheckboxes(value);
                                } else if (typeof value === 'boolean') {
                                    value = value ? 'Yes' : 'No';
                                }

                                return (
                                    <div key={key}>
                                        <h4 className="font-medium text-gray-700">{field.label?.replace('*', '')}</h4>
                                        <p className="text-gray-900">{value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Job Description */}
                <div>
                    <h4 className="font-medium text-gray-700 mb-2">Job Description</h4>
                    <div
                        className="prose prose-sm max-w-none text-gray-700 border border-gray-200 rounded-lg p-4"
                        dangerouslySetInnerHTML={formatHTML(formData?.jobDescription)}
                    />
                </div>
            </div>
        </div>
    );
};

// Helper function to safely access nested properties
const getSafeValue = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current[key] === undefined || current[key] === null) {
            return defaultValue;
        }
        current = current[key];
    }

    return current;
};

// Helper function to map API data to form data
const mapApiDataToFormData = (apiData) => {
    if (!apiData) return null;

    return {
        // Basic job info
        jobTitle: getSafeValue(apiData, 'jobTitle', ''),
        location: getSafeValue(apiData, 'location', ''),
        salary: getSafeValue(apiData, 'salary', ''),
        jobRoleType: getSafeValue(apiData, 'jobRoleType', ''),
        employmentTypes: getSafeValue(apiData, 'employmentTypes', []),
        qualification: getSafeValue(apiData, 'qualification', []),
        experience: getSafeValue(apiData, 'experience', ''),
        skills: getSafeValue(apiData, 'skills', []),
        languageRequirements: getSafeValue(apiData, 'languageRequirements', []),
        propertyTypes: getSafeValue(apiData, 'propertyTypes', []),
        jobDescription: getSafeValue(apiData, 'jobDescription', ''),

        // Category slug
        categorySlug: getSafeValue(apiData, 'categorySlug', ''),

        // Tele Caller specific fields
        commissionPercentage: getSafeValue(apiData, 'commissionPercentage', ''),
        incentives: getSafeValue(apiData, 'incentives', ''),
        salesTargets: getSafeValue(apiData, 'salesTargets', ''),
        additionalBenefits: getSafeValue(apiData, 'additionalBenefits', []),

        // Real Estate Sales specific fields
        salesTargetAmount: getSafeValue(apiData, 'salesTargetAmount', ''),
        targetAreas: getSafeValue(apiData, 'targetAreas', ''),
        leadProvided: getSafeValue(apiData, 'leadProvided', false),
        trainingProvided: getSafeValue(apiData, 'trainingProvided', false),
        vehicleRequirement: getSafeValue(apiData, 'vehicleRequirement', false),

        // Digital Marketing specific fields
        specialization: getSafeValue(apiData, 'specialization', ''),
        tools: getSafeValue(apiData, 'tools', ''),
        workMode: getSafeValue(apiData, 'workMode', ''),

        // Web Development specific fields
        techStack: getSafeValue(apiData, 'techStack', ''),
        projectType: getSafeValue(apiData, 'projectType', ''),

        // Accounts & Auditing specific fields
        accountsQualification: getSafeValue(apiData, 'accountsQualification', ''),
        accountingSoftware: getSafeValue(apiData, 'accountingSoftware', ''),
        industryExperience: getSafeValue(apiData, 'industryExperience', []),

        // Architects specific fields
        architectureType: getSafeValue(apiData, 'architectureType', ''),
        designSoftware: getSafeValue(apiData, 'designSoftware', ''),
        projectScale: getSafeValue(apiData, 'projectScale', ''),
        portfolioRequired: getSafeValue(apiData, 'portfolioRequired', false),

        // Legal specific fields
        legalSpecialization: getSafeValue(apiData, 'legalSpecialization', ''),
        legalQualification: getSafeValue(apiData, 'legalQualification', ''),
        caseTypes: getSafeValue(apiData, 'caseTypes', []),

        // Channel Partners specific fields
        partnerType: getSafeValue(apiData, 'partnerType', ''),
        partnerCommission: getSafeValue(apiData, 'partnerCommission', ''),
        networkSize: getSafeValue(apiData, 'networkSize', ''),
        exclusivePartnership: getSafeValue(apiData, 'exclusivePartnership', false),

        // HR & Operations specific fields
        hrSpecialization: getSafeValue(apiData, 'hrSpecialization', ''),
        hrQualification: getSafeValue(apiData, 'hrQualification', ''),
        industryKnowledge: getSafeValue(apiData, 'industryKnowledge', []),

        // CRM Executive specific fields
        crmSoftware: getSafeValue(apiData, 'crmSoftware', ''),
        customerSegment: getSafeValue(apiData, 'customerSegment', ''),
        dataManagement: getSafeValue(apiData, 'dataManagement', false),
        clientRetention: getSafeValue(apiData, 'clientRetention', false),

        // Other required fields for API
        salaryType: getSafeValue(apiData, 'salaryType', 'fixed'),
        salaryFrequency: getSafeValue(apiData, 'salaryFrequency', 'Monthly'),
        salaryNegotiable: getSafeValue(apiData, 'salaryNegotiable', false),
        hiringMultiple: getSafeValue(apiData, 'hiringMultiple', false),
        workingSchedule: getSafeValue(apiData, 'workingSchedule', {
            dayShift: false,
            nightShift: false,
            weekendAvailability: false,
            custom: '',
        }),
        status: getSafeValue(apiData, 'status', 'active')
    };
};

export default function JobPostingModal({ title, editData, mode, isOpen, setIsOpen, userProfile, onJobSaved, mutated }) {
    const { setRootContext } = useContext(RootContext);
    const [user, setUser] = useState(null);
    const [skillInput, setSkillInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [customQualification, setCustomQualification] = useState('');
    const [showCustomQualInput, setShowCustomQualInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewError, setPreviewError] = useState(null);

    console.log("mode", mode);
    console.log("editData received:", editData);

    useEffect(() => {
        // Get user details from localStorage on client side only
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setUser(user_details || null);
    }, []);

    // Single state object for all form fields with proper initialization
    const [formData, setFormData] = useState(() => {
        // Initialize with default values
        const defaultFormData = {
            // Job Title - use the title prop if provided, otherwise use category-based title
            jobTitle: title || '',

            // Common fields
            location: '',
            salary: '',
            jobRoleType: '',
            employmentTypes: [],
            qualification: [],
            experience: '',
            skills: [],
            languageRequirements: [],
            propertyTypes: [],
            jobDescription: '',

            // Category-specific fields will be added dynamically
            commissionPercentage: '',
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
        };

        return defaultFormData;
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

    // Get current category skills
    const getCurrentCategorySkills = () => {
        if (formData.categorySlug && categorySkills[formData.categorySlug]) {
            return categorySkills[formData.categorySlug];
        }
        return defaultCommonSkills;
    };

    // Handle skill management
    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const addCommonSkill = (skill) => {
        if (!formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    // Handle education qualification changes
    const handleEducationChange = (education) => {
        if (education === 'others') {
            setShowCustomQualInput(true);
        } else {
            setFormData(prev => ({
                ...prev,
                qualification: prev.qualification.includes(education)
                    ? prev.qualification.filter(qual => qual !== education)
                    : [...prev.qualification, education]
            }));
        }
    };

    const addCustomQualification = () => {
        if (customQualification.trim()) {
            setFormData(prev => ({
                ...prev,
                qualification: [...prev.qualification, customQualification.trim()]
            }));
            setCustomQualification('');
            setShowCustomQualInput(false);
        }
    };

    const removeQualification = (qualToRemove) => {
        setFormData(prev => ({
            ...prev,
            qualification: prev.qualification.filter(qual => qual !== qualToRemove)
        }));
    };

    const handleDescriptionChange = (html) => {
        setFormData(prev => ({ ...prev, jobDescription: html }));
    };

    function closeModal() {
        setIsOpen(false);
        resetForm();
        setShowPreview(false);
        setPreviewError(null);
    }

    function resetForm() {
        setFormData({
            jobTitle: title || '',
            location: '',
            salary: '',
            jobRoleType: '',
            employmentTypes: [],
            qualification: [],
            experience: '',
            skills: [],
            languageRequirements: [],
            propertyTypes: [],
            jobDescription: '',
            commissionPercentage: '',
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
        setSkillInput('');
        setSelectedCategory('');
        setCustomQualification('');
        setShowCustomQualInput(false);
        setIsSubmitting(false);
        setIsLoading(false);
        setPreviewError(null);
    }

    // Effect to load edit data when modal opens
    useEffect(() => {
        if (isOpen && editData && mode !== 'create') {
            setIsLoading(true);
            setPreviewError(null);

            try {
                // Safely map API data to form data
                const mappedData = mapApiDataToFormData(editData);

                if (mappedData) {
                    setFormData(mappedData);
                    setSelectedCategory(mappedData.categorySlug || '');

                    // Also set job title from title prop or category if empty
                    if (!mappedData.jobTitle) {
                        if (title) {
                            setFormData(prev => ({ ...prev, jobTitle: title }));
                        } else if (mappedData.categorySlug) {
                            const selectedCategoryObj = jobCategories.find(cat => cat.slug === mappedData.categorySlug);
                            if (selectedCategoryObj) {
                                setFormData(prev => ({ ...prev, jobTitle: selectedCategoryObj.name }));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error mapping edit data:', error);
                setPreviewError('Failed to load job data');
                // Show error toast
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        position: "Error",
                        message: "Failed to load job data"
                    }
                }));
            } finally {
                setIsLoading(false);
            }
        } else if (isOpen && mode === 'create') {
            // Set default location to company location for new jobs
            if (userProfile?.location) {
                setFormData(prev => ({ ...prev, location: userProfile.location }));
            }
            // Set job title from title prop if provided
            if (title) {
                setFormData(prev => ({ ...prev, jobTitle: title }));
            }
        }
    }, [isOpen, editData, mode, userProfile, title]);

    // Effect to reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-update jobTitle when category changes
        if (field === 'categorySlug') {
            setSelectedCategory(value);
            const selectedCategoryObj = jobCategories.find(cat => cat.slug === value);
            if (selectedCategoryObj && !title) {
                // Only auto-update if title prop is not provided
                setFormData(prev => ({ ...prev, jobTitle: selectedCategoryObj.name }));
            }
        }
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
        const fieldValue = formData[fieldName] || '';

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
                            value={fieldValue}
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
                            value={fieldValue}
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

            case 'education-select':
                return (
                    <div key={fieldName} className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {fieldConfig.label}
                        </label>

                        {/* Selected qualifications */}
                        {formData.qualification && formData.qualification.length > 0 && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                    {formData.qualification.map((qual, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {qual}
                                            <button
                                                type="button"
                                                onClick={() => removeQualification(qual)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education options grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                            {educationOptions.map((education) => (
                                <div
                                    key={education}
                                    className={`relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm border text-sm
                                    ${formData.qualification?.includes(education) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                    hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                    onClick={() => handleEducationChange(education)}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {education}
                                                </p>
                                            </div>
                                        </div>
                                        {formData.qualification?.includes(education) && (
                                            <div className="flex-shrink-0 text-white">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Others option */}
                            <div
                                className={`relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm border text-sm
                                ${showCustomQualInput ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                onClick={() => setShowCustomQualInput(true)}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <div>
                                            <p className="font-medium">
                                                Others
                                            </p>
                                        </div>
                                    </div>
                                    {showCustomQualInput && (
                                        <div className="flex-shrink-0 text-white">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Custom qualification input */}
                        {showCustomQualInput && (
                            <div className="mt-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customQualification}
                                        onChange={(e) => setCustomQualification(e.target.value)}
                                        placeholder="Enter custom qualification..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomQualification}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomQualInput(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'checkbox-group':
                // Custom render for language requirements
                if (fieldName === 'languageRequirements') {
                    return (
                        <div key={fieldName} className="flex flex-col gap-3">
                            <label className="text-gray-700 font-medium text-sm sm:text-base">
                                {fieldConfig.label}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {languageOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        title={option.id}
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
                }

                // Custom render for property types
                if (fieldName === 'propertyTypes') {
                    return (
                        <div key={fieldName} className="flex flex-col gap-3">
                            <label className="text-gray-700 font-medium text-sm sm:text-base">
                                {fieldConfig.label}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {propertyTypeOptions.map((option) => (
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
                }

                // Default checkbox-group renderer
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
        if (!formData.jobTitle || !formData.location || !formData.experience || !formData.salary) {
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
                onJobSaved && onJobSaved();
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

    // Handle preview click
    const handlePreviewClick = () => {
        try {
            setPreviewError(null);
            setShowPreview(true);
        } catch (error) {
            console.error('Error showing preview:', error);
            setPreviewError('Failed to load preview. Please check your data.');
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Preview Error",
                    message: "Failed to load preview"
                }
            }));
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
            {/* Preview Modal */}
            <Transition appear show={showPreview} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setShowPreview(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            Job Preview
                                        </Dialog.Title>
                                        <XMarkIcon
                                            className="h-5 w-5 sm:h-6 sm:w-6 fill-gray-900 hover:cursor-pointer hover:font-bold"
                                            onClick={() => setShowPreview(false)}
                                        />
                                    </div>

                                    {previewError ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-red-700">{previewError}</p>
                                        </div>
                                    ) : (
                                        <JobPreview formData={formData} jobCategories={jobCategories} />
                                    )}

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(false)}
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                        >
                                            Back to Edit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Main Job Posting Modal */}
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
                                                {mode !== 'create' ? 'Edit Job Posting' : 'Create Real Estate Job Posting'}
                                            </Dialog.Title>
                                            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={closeModal} />
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-20">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                            <span className="ml-3 text-gray-600">Loading job data...</span>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                                {/* Job Title (prefilled from props or auto-filled from category) */}
                                                <div className='bg-blue-50 border border-blue-200 p-3 rounded-lg'>
                                                    <div className="mb-3">
                                                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Job Title *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="jobTitle"
                                                            value={formData.jobTitle}
                                                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            placeholder="Enter job title"
                                                            required
                                                        />                                                        
                                                    </div>                                                  
                                                </div>

                                                {/* Common fields in correct sequence */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                    {/* Location */}
                                                    {renderField('location', jobCategoryFields.common.location)}

                                                    {/* Fixed Salary */}
                                                    {renderField('salary', {
                                                        type: 'text',
                                                        label: 'Fixed Salary *',
                                                        placeholder: 'e.g. ₹ 3 LPA, ₹ 25,000/month'
                                                    })}

                                                    {/* Job Role Type */}
                                                    {renderField('jobRoleType', jobCategoryFields.common.jobRoleType)}

                                                    {/* Employment Types */}
                                                    <div className="md:col-span-2">
                                                        {renderField('employmentTypes', jobCategoryFields.common.employmentTypes)}
                                                    </div>

                                                    {/* Educational Qualification */}
                                                    {renderField('qualification', jobCategoryFields.common.qualification)}

                                                    {/* Experience */}
                                                    {renderField('experience', jobCategoryFields.common.experience)}

                                                    {/* Skills (custom implementation) */}
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Required Skills
                                                        </label>
                                                        <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                                            <input
                                                                type="text"
                                                                value={skillInput}
                                                                onChange={(e) => setSkillInput(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                                className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Add custom skill"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={addSkill}
                                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm sm:text-base whitespace-nowrap"
                                                            >
                                                                Add Skill
                                                            </button>
                                                        </div>

                                                        <div className="mb-3">
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                Common Skills for {formData.categorySlug ?
                                                                    jobCategories.find(cat => cat.slug === formData.categorySlug)?.name || 'Real Estate'
                                                                    : 'Real Estate'}:
                                                            </p>
                                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                                {getCurrentCategorySkills().map(skill => (
                                                                    <button
                                                                        key={skill}
                                                                        type="button"
                                                                        onClick={() => addCommonSkill(skill)}
                                                                        className={`px-2 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap flex items-center gap-1 ${formData.skills.includes(skill)
                                                                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                                            }`}
                                                                        disabled={formData.skills.includes(skill)}
                                                                    >
                                                                        {formData.skills.includes(skill) ? (
                                                                            <>
                                                                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                                </svg>
                                                                                {skill}
                                                                            </>
                                                                        ) : (
                                                                            `+ ${skill}`
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                                            {formData.skills?.map(skill => (
                                                                <span
                                                                    key={skill}
                                                                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm flex items-center gap-1"
                                                                >
                                                                    {skill}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSkill(skill)}
                                                                        className="text-red-500 hover:text-red-700 text-xs"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Category-specific fields - Only show if category is selected */}
                                                {formData.categorySlug && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                        {Object.entries(categoryFields).map(([fieldName, fieldConfig]) => {
                                                            // Skip common fields that are already rendered above
                                                            const commonFieldNames = [
                                                                'location', 'salary', 'jobRoleType', 'employmentTypes',
                                                                'qualification', 'experience', 'skills', 'jobDescription'
                                                            ];

                                                            if (commonFieldNames.includes(fieldName)) {
                                                                return null;
                                                            }

                                                            return (
                                                                <div key={fieldName} className={fieldConfig.type === 'editor' ? 'md:col-span-2' : ''}>
                                                                    {renderField(fieldName, fieldConfig)}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Language Requirements */}
                                                <div className="md:col-span-2">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                            Language Requirements
                                                        </label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                            {languageOptions.map((option) => (
                                                                <div
                                                                    key={option.id}
                                                                    className={`relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm border text-sm
                                                                    ${formData.languageRequirements?.includes(option.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                                    hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                                                    onClick={() => handleCheckboxGroupChange('languageRequirements', option.id)}
                                                                >
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div>
                                                                                <p className="font-medium">
                                                                                    {option.name}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {formData.languageRequirements?.includes(option.id) && (
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
                                                </div>

                                                {/* Property Types */}
                                                <div className="md:col-span-2">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                            Property Types
                                                        </label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {propertyTypeOptions.map((option) => (
                                                                <div
                                                                    key={option.id}
                                                                    className={`relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm border text-sm
                                                                    ${formData.propertyTypes?.includes(option.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-900'}
                                                                    hover:border-blue-500 hover:shadow-md transition-all duration-200`}
                                                                    onClick={() => handleCheckboxGroupChange('propertyTypes', option.id)}
                                                                >
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div>
                                                                                <p className="font-medium">
                                                                                    {option.name}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {formData.propertyTypes?.includes(option.id) && (
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
                                                </div>

                                                {/* Job Description */}
                                                <div className="md:col-span-2">
                                                    <div className="flex flex-col gap-3">
                                                        <div>
                                                            <label className="text-gray-700 font-medium text-sm sm:text-base">
                                                                Job Description *
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
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:space-x-3">
                                                    <div className="order-3 sm:order-1">
                                                        <button
                                                            type="button"
                                                            onClick={handlePreviewClick}
                                                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-2" />
                                                            Preview Job
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col-reverse sm:flex-row gap-3 order-2 sm:order-2">
                                                        <button
                                                            type="button"
                                                            onClick={closeModal}
                                                            className="inline-flex justify-center rounded-md border hover:text-gray-800 border-gray-300 bg-red-300 text-white px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        >
                                                            Discard
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting || isLoading}
                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 sm:px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isSubmitting ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                                    {mode !== "create" ? 'Updating...' : 'Posting...'}
                                                                </>
                                                            ) : (
                                                                mode !== "create" ? 'Update Job' : 'Post Job'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}