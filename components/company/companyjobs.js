'use client';
import React, { useState, useEffect } from 'react';

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

// Job Card Component
const JobCard = ({ job, logo, company }) => {
    // Get category icon based on job's categorySlug
    const getCategoryIcon = () => {
        const category = categoryStructure.find(cat => cat.slug === job.categorySlug);
        return category?.icon || '/icons/job.png';
    };

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">
            {/* Category Logo */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 -top-3 -left-3 border border-gray-300 shadow-md bg-white rounded-xl flex items-center justify-center p-2">
                <img
                    src={getCategoryIcon()}
                    alt={job.categorySlug}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Job Info */}
            <div className="flex-1 w-full pl-24 sm:pl-32">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {job.jobTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Company: {company}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Location: {job.location}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Experience: {job.experience}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Salary: {job.salary}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Category: {categoryStructure.find(cat => cat.slug === job.categorySlug)?.title || job.categorySlug}
                </p>

                {/* Job Status */}
                <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {job.status}
                    </span>
                </div>

                {/* Applications Count */}
                {job.applications && job.applications.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                        {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Posted Date */}
            <div className="text-xs text-gray-500 self-end">
                Posted: {new Date(job.postedOn).toLocaleDateString()}
            </div>
        </div>
    );
};

// Jobs List Component
const CompanyJobs = ({ companyProfile }) => {
    const [jobsWithLogos, setJobsWithLogos] = useState([]);
    const [categorizedJobs, setCategorizedJobs] = useState({});

    useEffect(() => {
        if (companyProfile?.jobs) {
            // Process jobs to add category icons and organize by category
            processJobs(companyProfile.jobs);
        }
    }, [companyProfile]);

    const processJobs = (jobs) => {
        // Add category icons to each job
        const jobsWithCategoryData = jobs.map(job => {
            const category = categoryStructure.find(cat => cat.slug === job.categorySlug);
            return {
                ...job,
                categoryIcon: category?.icon || '/icons/job.png',
                categoryTitle: category?.title || job.categorySlug
            };
        });

        setJobsWithLogos(jobsWithCategoryData);

        // Group jobs by category
        const jobsByCategory = {};
        jobsWithCategoryData.forEach(job => {
            if (!jobsByCategory[job.categorySlug]) {
                const category = categoryStructure.find(cat => cat.slug === job.categorySlug);
                jobsByCategory[job.categorySlug] = {
                    category: category || { title: job.categorySlug, icon: '/icons/job.png' },
                    jobs: []
                };
            }
            jobsByCategory[job.categorySlug].jobs.push(job);
        });

        setCategorizedJobs(jobsByCategory);
    };

    // Render all jobs in a single list
    const renderAllJobs = () => {
        return jobsWithLogos.map((job, index) => (
            <JobCard
                key={job.id || index}
                job={job}
                logo={job.categoryIcon}
                company={companyProfile?.name || companyProfile?.company}
            />
        ));
    };

    // Render jobs grouped by category
    const renderJobsByCategory = () => {
        return Object.keys(categorizedJobs).map(categorySlug => {
            const categoryData = categorizedJobs[categorySlug];
            if (categoryData.jobs.length === 0) return null;

            return (
                <div key={categorySlug} className="mb-8">
                    {/* Jobs in this category */}
                    <div className="space-y-4">
                        {categoryData.jobs.map((job, index) => (
                            <JobCard
                                key={job.id || index}
                                job={job}
                                logo={job.categoryIcon}
                                company={companyProfile?.name || companyProfile?.company}
                            />
                        ))}
                    </div>
                </div>
            );
        });
    };

    if (!companyProfile?.jobs || companyProfile.jobs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No jobs posted yet.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Job Openings at {companyProfile?.name || companyProfile?.company}
                </h2>
                <p className="text-gray-600">
                    {jobsWithLogos.length} total job{jobsWithLogos.length !== 1 ? 's' : ''} available
                </p>
            </div>

            {renderJobsByCategory()}
        </div>
    );
};

export default CompanyJobs;