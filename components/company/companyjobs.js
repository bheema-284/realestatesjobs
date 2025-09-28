'use client';
import React from 'react';
// Job Card Component
const JobCard = ({ job, logo }) => {

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">

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
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Location: {job.location}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Experience: {job.experience}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Salary: {job.salary}
                </p>
            </div>
        </div>
    );
};

// Jobs List
const CompanyJobs = ({ companyProfile }) => {
    return (
        <div className="space-y-8">
            {companyProfile?.jobs?.map((job, ind) => (
                <JobCard key={ind} job={job} logo={companyProfile.logo} company={companyProfile.name} title={job.title} />
            ))}
        </div>
    );
};

export default CompanyJobs;
