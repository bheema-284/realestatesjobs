'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { jobCategories } from '../config/data';
import RootContext from '../config/rootcontext';

// Job Card Component
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
    const decodedCategory = category ? decodeURIComponent(category) : null;
    const decodedTitle = title ? decodeURIComponent(title) : null;
    // Filter the category
    const filteredCategories = decodedCategory
        ? jobCategories.filter(
            (cat) => cat.title.toLowerCase() === decodedCategory.toLowerCase()
        )
        : jobCategories;
    return (
        <div className="jobs-details">
            {filteredCategories.length === 0 && (
                <p>No jobs found in this category.</p>
            )}

            {filteredCategories.map((category) => {
                // Filter jobs inside this category by title
                const filteredJobs = decodedTitle
                    ? category.jobs.filter(
                        (job) => job.title.toLowerCase() === decodedTitle.toLowerCase()
                    )
                    : category.jobs;

                return (
                    <div className='py-5' key={category.title}>
                        {filteredJobs.length === 0 ? (
                            <p>No jobs found matching "{decodedTitle}"</p>
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
