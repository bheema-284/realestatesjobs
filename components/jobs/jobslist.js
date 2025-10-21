'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { jobCategories } from '../config/data';
import ButtonTab from '../common/buttontab';

// Utility function to create a URL-friendly slug
const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

// Job Card Component (remains unchanged)
const JobCard = ({ job, logo, category, title }) => {
    const router = useRouter();

    const handleViewJob = () => {
        // This path construction remains the same for viewing a specific job detail
        const categorySlug = encodeURIComponent(createSlug(category));
        const titleSlug = encodeURIComponent(createSlug(job.title));
        router.push(`/jobs/${categorySlug}/${titleSlug}`);
    };

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">
            {/* Left Section: Logo (dummy or company icon) */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 -top-3 -left-3 border border-gray-300 shadow-md bg-white rounded-xl flex items-center justify-center p-2">
                <img
                    src={logo || '/icons/job.png'} // fallback icon
                    alt={job.title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Job Info */}
            <div className="flex-1 w-full pl-24 sm:pl-32">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {job.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Location: <span className="font-semibold">{job.location}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Experience: {job.experience}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Salary: {job.salary}
                </p>

                <button
                    onClick={handleViewJob}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

// Tabs definition (remains unchanged)
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

// Main Jobs List
const JobsList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- 1. Get Query Parameters ---
    const initialCategorySlug = searchParams.get('category');
    const initialLocationSlug = searchParams.get('location'); // <-- NEW: Get location slug

    // Determine the initial active tab based on the URL category slug
    const initialTabIndex = jobCategories.findIndex(
        (cat) => createSlug(cat.title) === initialCategorySlug
    );

    // Set initial state from URL or default to 0
    const [activeTab, setActiveTab] = useState(initialTabIndex !== -1 ? initialTabIndex : 0);

    // --- EFFECT TO UPDATE URL WHEN TAB CHANGES (Category) ---
    useEffect(() => {
        const selectedCategory = jobCategories[activeTab];
        if (selectedCategory) {
            const slug = createSlug(selectedCategory.title);

            // Preserve the existing search parameters (including location)
            const currentPath = window.location.pathname;
            const newSearchParams = new URLSearchParams(searchParams.toString());

            newSearchParams.set('category', slug);

            // Note: We don't touch the 'location' param here, so it persists when switching tabs

            // Update the URL without navigating (shallow routing)
            router.replace(`${currentPath}?${newSearchParams.toString()}`, { shallow: true });
        }
    }, [activeTab, router, searchParams]);

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
        // This is case-insensitive and hyphenated comparison
        return jobLocationSlug === initialLocationSlug;
    });

    // C) Create readable names for the "No jobs" message
    const locationName = initialLocationSlug
        ? initialLocationSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : null;

    return (
        <div className="w-full px-6 sm:px-10 grid grid-cols-1 bg-white gap-10 p-5">

            {/* Display the active location filter if present */}
            {initialLocationSlug && (
                <div className="w-full sm:w-[80%] mx-auto mt-32 p-3 bg-purple-100 border-l-4 border-purple-600 text-purple-800">
                    <p className="text-center font-medium">
                        Showing jobs for: <span className="font-bold">{locationName}</span>
                        {/* Optional: Add a button to clear the location filter */}
                        <button
                            onClick={() => {
                                const newSearchParams = new URLSearchParams(searchParams.toString());
                                newSearchParams.delete('location'); // Remove location param
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
            <div className={`fixed left-0 right-0 w-full sm:w-[80%] mx-auto z-30 bg-white top-20`}>
                {/* setActiveTab changes the state, which triggers the useEffect */}
                <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Job Listings - Content start pushed down by sticky header */}
            <div className={`${initialLocationSlug ? 'mt-0' : 'mt-32'} space-y-8`}>
                {/* Check if a category is selected and has jobs */}
                {jobsToDisplay.length > 0 ? (
                    jobsToDisplay.map((job, ind) => (
                        <JobCard
                            key={ind}
                            job={job}
                            logo={activeCategory.icon}
                            category={activeCategory.title}
                            title={job.title}
                        />
                    ))
                ) : (
                    <p className="text-center text-lg text-gray-500 pt-10">
                        {locationName ?
                            `No ${activeCategory?.title || 'selected'} jobs found in ${locationName}.`
                            :
                            `No jobs found in the ${activeCategory?.title || 'selected'} category.`
                        }
                    </p>
                )}
            </div>
        </div>
    );
};

export default JobsList;
