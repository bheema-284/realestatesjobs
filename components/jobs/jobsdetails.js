'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { jobCategories } from '../config/data';
import RootContext from '../config/rootcontext';

// Utility function (MUST match the one used for navigation/routing)
const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

// Job Card Component (remains unchanged)
const JobCard = ({ job, logo }) => {
    const router = useRouter();
    const { rootContext, setRootContext } = useContext(RootContext);
    const [applied, setApplied] = useState(false);

    const handleApply = () => {
        if (rootContext.authenticated) {
            setApplied(true);
            setRootContext({
                ...rootContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "success",
                    title: "Applied",
                    message: `You have successfully applied for ${job.title}!`,
                },
            });
        } else {
            router.push(`/login`);
        }
    };

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">
            {/* Left Section: Logo */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 -top-3 -left-3 border border-gray-300 shadow-md bg-white rounded-xl flex items-center justify-center p-2">
                <img
                    src={logo || '/icons/job.png'}
                    alt={job.title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Job Info */}
            <div className="flex-1 w-full pl-24 sm:pl-32">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {job.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Location: {job.location}</p>
                <p className="text-xs sm:text-sm text-gray-600">Experience: {job.experience}</p>
                <p className="text-xs sm:text-sm text-gray-600">Salary: {job.salary}</p>

                <button
                    onClick={handleApply}
                    disabled={applied}
                    className={`mt-3 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${applied
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {applied ? 'Applied' : 'Apply'}
                </button>
            </div>
        </div>
    );
};

const JobsDetails = () => {
    const { category, title } = useParams();

    // The params are already decoded, but let's confirm they are present
    const categorySlug = category || null;
    const titleSlug = title || null;

    // Filter the category by comparing the SLUG from the URL to the SLUG of the category title
    const filteredCategories = categorySlug
        ? jobCategories.filter(
            (cat) => createSlug(cat.title) === categorySlug
        )
        : jobCategories;

    return (
        <div className="jobs-details py-10">
            {filteredCategories.length === 0 && (
                <p className='text-center text-lg text-gray-600'>
                    No job category found matching the URL: "{categorySlug}"
                </p>
            )}

            {filteredCategories.map((category) => {
                // Filter jobs inside this category by comparing the SLUG of the job title
                const filteredJobs = titleSlug
                    ? category.jobs.filter(
                        (job) => createSlug(job.title) === titleSlug
                    )
                    : category.jobs;

                return (
                    <div className='py-5 space-y-8' key={category.title}>
                        {filteredJobs.length === 0 ? (
                            <p className='text-center text-lg text-gray-600'>
                                No jobs found matching "{titleSlug}" in category "{category.title}"
                            </p>
                        ) : (
                            filteredJobs.map((job, ind) => (
                                <JobCard key={ind} job={job} category={category.title} logo={category.icon} />
                            ))
                        )}
                    </div>
                );
            })}
        </div>
    );
};


export default JobsDetails;
