'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ButtonTab from '../common/buttontab';

// Import Heroicons
import {
    ClockIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';

// Utility function to create a URL-friendly slug
const createSlug = (title) => {
    return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
};

// Job Card Component
const JobCard = ({ job, logo, category, title }) => {
    const router = useRouter();

    const handleViewJob = () => {
        const categorySlug = encodeURIComponent(createSlug(category));
        const titleSlug = encodeURIComponent(createSlug(job.jobTitle || job.title));
        router.push(`/jobs/${categorySlug}/${titleSlug}`);
    };

    return (
        <div className="
            w-full max-w-4xl mx-auto
            bg-white rounded-2xl 
            shadow-[0px_0px_25px_rgba(21,58,103,0.15),0px_4px_12px_rgba(0,0,0,0.1)]
            border border-blue-100
            flex flex-col lg:flex-row items-start lg:items-center
            p-4 lg:p-5 lg:pl-44 relative
            min-h-[120px] lg:min-h-[140px]
            transition-all duration-300
            hover:shadow-[0px_0px_30px_rgba(21,58,103,0.25),0px_4px_15px_rgba(0,0,0,0.12)]
            hover:border-blue-200
        ">

            {/* LEFT LOGO BOX - Responsive positioning */}
            <div className="
                lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2
                w-16 h-16 lg:w-40 lg:h-40 
                bg-white 
                rounded-2xl 
                shadow-[0px_4px_20px_rgba(21,58,103,0.2)]
                border border-gray-200
                flex items-center justify-center
                overflow-hidden
                transition-all duration-300
                hover:shadow-[0px_6px_25px_rgba(21,58,103,0.3)]
                hover:scale-105
                mb-3 lg:mb-0
                mx-auto lg:mx-0
            ">
                <img
                    src={job.companyProfileImage || '/icons/job.png'}
                    alt={job.companyName}
                    className="w-[80%] h-[80%] object-contain transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* MIDDLE DETAILS - Responsive spacing and layout */}
            <div className="flex-1 w-full lg:w-auto text-center lg:text-left mb-4 lg:mb-0">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                    {job.jobTitle} - {job.companyName}
                </h2>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 lg:gap-6 mt-3 lg:mt-4 text-gray-700 font-medium text-sm lg:text-[15px]">

                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        <span className="font-semibold">{job.employmentTypes?.[0] || job.type || "full_time"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        <span className="font-semibold">{job.location || "Tirupati"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CurrencyRupeeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        <span className="font-semibold">{job.salary || job.salaryAmount || "20000"}</span>
                    </div>
                </div>
            </div>

            {/* RIGHT BUTTON - Responsive layout */}
            <div className="flex items-center justify-center lg:justify-normal w-full lg:w-auto">
                {/* Blue Vertical Line - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block w-[2px] h-20 lg:h-24 bg-[#153A67] mr-4"></div>

                <button
                    onClick={handleViewJob}
                    className="
                        px-4 lg:px-6 py-2 
                        bg-[#153A67] 
                        text-white 
                        rounded-xl 
                        font-semibold 
                        hover:bg-[#0d2c52] 
                        transition-all duration-300
                        whitespace-nowrap
                        hover:shadow-[0px_4px_15px_rgba(21,58,103,0.4)]
                        hover:translate-y-[-2px]
                        text-sm lg:text-base
                        w-full lg:w-auto
                    "
                >
                    View Details
                </button>
            </div>
        </div>
    );
};


// Main Jobs List
const JobsList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for job categories and loading
    const [jobCategories, setJobCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. Get Query Parameters ---
    const initialCategorySlug = searchParams.get('category');
    const initialLocationSlug = searchParams.get('location');

    // Determine the initial active tab based on the URL category slug
    const initialTabIndex = jobCategories.findIndex(
        (cat) => createSlug(cat.title) === initialCategorySlug
    );

    // Set initial state from URL or default to 0
    const [activeTab, setActiveTab] = useState(initialTabIndex !== -1 ? initialTabIndex : 0);

    // Fetch jobs data from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/jobs');

                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }

                const data = await response.json();

                if (data.success && data.jobs) {
                    // Transform the API response to match the required jobCategories format
                    const transformedCategories = transformJobsToCategories(data.jobs);
                    setJobCategories(transformedCategories);
                } else {
                    throw new Error(data.error || 'Failed to load jobs');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Function to transform API jobs data to the required categories format
    const transformJobsToCategories = (jobs) => {
        // Define the category structure
        const categoryStructure = [
            {
                icon: "/icons/cp.png",
                title: "Channel Partners",
                description: "Collaborate & Earn",
                slug: "channel-partners",
                jobs: []
            },
            {
                icon: "/icons/hrandop.png",
                title: "HR & Operations",
                description: "People & Process",
                slug: "hr-and-operations",
                jobs: []
            },
            {
                icon: "/icons/realestate.png",
                title: "Real Estate Sales",
                description: "Sell Property Faster",
                slug: "real-estate-sales",
                jobs: []
            },
            {
                icon: "/icons/tel.png",
                title: "Tele Caller",
                description: "Engage & Convert",
                slug: "tele-caller",
                jobs: []
            },
            {
                icon: "/icons/digital.png",
                title: "Digital Marketing",
                description: "Promote & Convert",
                slug: "digital-marketing",
                jobs: []
            },
            {
                icon: "/icons/webdev.png",
                title: "Web Development",
                description: "Build Real Estate Tech",
                slug: "web-development",
                jobs: []
            },
            {
                icon: "/icons/crm.png",
                title: "CRM Executive",
                description: "Manage Client Relations",
                slug: "crm-executive",
                jobs: []
            },
            {
                icon: "/icons/accounts.png",
                title: "Accounts & Auditing",
                description: "Ensure Financial Clarity",
                slug: "accounts-and-auditing",
                jobs: []
            },
            {
                icon: '/icons/architects.png',
                title: 'Architects',
                description: 'Design Smart & Aesthetic Spaces',
                slug: 'architects',
                jobs: []
            },
            {
                icon: '/icons/legal.png',
                title: 'Legal',
                description: 'Safeguard Deals & Compliance',
                slug: 'legal',
                jobs: []
            },
        ];

        // Group jobs by category
        jobs.forEach(job => {
            const categorySlug = job.categorySlug;
            const categoryIndex = categoryStructure.findIndex(cat => cat.slug === categorySlug);

            if (categoryIndex !== -1) {
                // Transform job data to match the required format
                const transformedJob = {
                    ...job, // Include all original job data
                    title: job.jobTitle,
                    company: job.companyName,
                    type: job.employmentTypes?.[0] || 'Full-time',
                    salary: job.salary || job.salaryAmount,
                    // Ensure we have all necessary fields for display
                    location: job.location,
                    experience: job.experience
                };

                categoryStructure[categoryIndex].jobs.push(transformedJob);
            }
        });

        return categoryStructure;
    };

    // --- EFFECT TO UPDATE URL WHEN TAB CHANGES (Category) ---
    useEffect(() => {
        if (jobCategories.length > 0) {
            const selectedCategory = jobCategories[activeTab];
            if (selectedCategory) {
                const slug = createSlug(selectedCategory.title);

                // Preserve the existing search parameters (including location)
                const currentPath = window.location.pathname;
                const newSearchParams = new URLSearchParams(searchParams.toString());

                newSearchParams.set('category', slug);

                // Update the URL without navigating (shallow routing)
                router.replace(`${currentPath}?${newSearchParams.toString()}`, { shallow: true });
            }
        }
    }, [activeTab, router, searchParams, jobCategories]);

    // --- 2. Filter Jobs by Category and Location ---

    // A) Get the jobs for the currently selected category
    const activeCategory = jobCategories[activeTab];
    const jobsByCategory = activeCategory ? activeCategory.jobs : [];

    // B) Filter the category jobs by location slug if present
    const jobsToDisplay = jobsByCategory.filter(job => {
        if (!initialLocationSlug) {
            // No location filter applied
            return true;
        }

        // Convert the job location to a slug for comparison
        const jobLocationSlug = createSlug(job.location);

        // Check if the job's location slug matches the URL location slug
        return jobLocationSlug === initialLocationSlug;
    });

    // C) Create readable names for the "No jobs" message
    const locationName = initialLocationSlug
        ? initialLocationSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : null;

    // Tabs definition
    const tabs = jobCategories.map((job, index) => ({
        name: (
            <div key={index} className="flex flex-wrap items-center gap-2 text-left">
                <div className="flex flex-col">
                    <img
                        src={job.icon}
                        alt={job.title}
                        className="h-4 sm:h-6 md:h-8 lg:h-10 w-auto object-contain mx-auto"
                    />
                    <span className="text-xs xl:text-sm font-semibold">{job.title}</span>
                    <span className="text-[9px] xl:text-xs text-gray-500">{job.description}</span>
                    <span className="text-[8px] xl:text-[10px] text-blue-600 font-medium">
                        {job.jobs.length} jobs
                    </span>
                </div>
            </div>
        ),
    }));

    if (loading) {
        return (
            <div className="w-full px-6 sm:px-10 grid grid-cols-1 bg-white gap-10 p-5 mt-32">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full px-6 sm:px-10 grid grid-cols-1 bg-white gap-10 p-5 mt-32">
                <div className="text-center text-red-600 p-4">
                    <p>Error loading jobs: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-6 sm:px-10 grid grid-cols-1 bg-white gap-10 p-5">

            {/* Display the active location filter if present */}
            {initialLocationSlug && (
                <div className="w-full sm:w-[80%] mx-auto mt-32 p-3 bg-purple-100 border-l-4 border-purple-600 text-purple-800">
                    <p className="text-center font-medium">
                        Showing jobs for: <span className="font-bold">{locationName}</span>
                        <button
                            onClick={() => {
                                const newSearchParams = new URLSearchParams(searchParams.toString());
                                newSearchParams.delete('location');
                                router.push(`/jobs?${newSearchParams.toString()}`);
                            }}
                            className="ml-4 text-sm underline hover:text-purple-900"
                        >
                            (Clear Location)
                        </button>
                    </p>
                </div>
            )}

            {/* Sticky Tabs Navigation */}
            <div className='bg-white w-full'>
                <div className={`fixed left-0 right-0 w-full sm:w-[80%] mx-auto z-30 bg-white top-20`}>
                    <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            {/* Job Listings - Content start pushed down by sticky header */}
            <div className={`${initialLocationSlug ? 'mt-0' : 'mt-36'} space-y-8`}>
                {/* Check if a category is selected and has jobs */}
                {jobsToDisplay.length > 0 ? (
                    jobsToDisplay.map((job, ind) => (
                        <JobCard
                            key={job.id || ind}
                            job={job}
                            logo={activeCategory.icon}
                            category={activeCategory.title}
                            title={job.jobTitle}
                        />
                    ))
                ) : (
                    <div className="text-center text-lg text-gray-500 pt-10">
                        {locationName ? (
                            `No ${activeCategory?.title || 'selected'} jobs found in ${locationName}.`
                        ) : activeCategory?.jobs.length === 0 ? (
                            `No jobs found in the ${activeCategory?.title || 'selected'} category.`
                        ) : (
                            `No jobs match your criteria in the ${activeCategory?.title || 'selected'} category.`
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsList;