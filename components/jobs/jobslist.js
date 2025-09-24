'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { jobCategories } from '../config/data';

// Job Card Component
const JobCard = ({ job, logo, category, title }) => {
    const router = useRouter();

    const handleViewJob = () => {
        const categorySlug = encodeURIComponent(category);
        const titleSlug = encodeURIComponent(job.title);
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
                    Location: {job.location}
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

// Title Section
const TitleCard = () => {
    return (
        <div className="w-full mx-auto">
            <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-900 to-gray-800">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h2 className="text-xl sm:text-4xl font-bold">
                        Explore Jobs in Real Estate
                    </h2>
                    <p className="mt-2 text-sm sm:text-base opacity-80">
                        Find your dream job in Real Estate industry
                    </p>
                </div>
            </div>
        </div>
    );
};

// Main Jobs List
const JobsList = () => {
    return (
        <div className="w-full px-6 sm:px-10 grid grid-cols-1 gap-10 p-5">
            <TitleCard />

            {/* Loop over categories → jobs */}
            {jobCategories.map((category, index) => (
                <div key={index} className="space-y-6">
                    <div className="space-y-8">
                        {category.jobs.map((job, ind) => (
                            <JobCard key={ind} job={job} logo={category.icon} category={category.title} title={job.title} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobsList;
