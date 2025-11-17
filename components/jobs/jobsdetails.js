'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import RootContext from '../config/rootcontext';
import Loading from '../common/loading';

// Utility function (MUST match the one used for navigation/routing)
const createSlug = (title) => {
    return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
};

const JobCard = ({ job, category }) => {
    const router = useRouter();
    const { rootContext, setRootContext } = useContext(RootContext);

    const user = rootContext?.user;
    const isLoggedIn = user && user.role;
    const isApplicant = isLoggedIn && user.role === "applicant";
    const [serviceCall, setServiceCall] = useState(false);
    const [applied, setApplied] = useState(false);

    // -----------------------------------------------------
    // ✅ CHECK IF USER ALREADY APPLIED FOR THIS JOB
    // -----------------------------------------------------
    useEffect(() => {
        if (isApplicant && job?.applications?.length > 0) {
            const alreadyApplied = job.applications.some(
                (a) => a.applicantId === (user._id || user.id)
            );
            setApplied(alreadyApplied);
        }
    }, [job, user, isApplicant]);

    // -----------------------------------------------------
    // ✅ HANDLE APPLY
    // -----------------------------------------------------
    const handleApply = async () => {
        if (!isLoggedIn || !user?.role) {
            router.push("/login");
            return;
        }

        if (!isApplicant) return;
        setServiceCall(true)
        try {
            const response = await fetch("/api/jobs/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id || user.id,
                    jobId: job.id,
                    jobTitle: job.jobTitle,
                    category
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setRootContext({
                    ...rootContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to apply",
                    },
                });
            }
            if (response.status) {
                setServiceCall(false);
            }
            setApplied(true);

            setRootContext({
                ...rootContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "success",
                    title: "Applied Successfully",
                    message: `You applied for ${job.jobTitle}`,
                },
            });
        } catch (err) {
            console.error(err);
            setRootContext({
                ...rootContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: err.message,
                },
            });
        }
    };

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">
            {serviceCall && <Loading />}
            {/* Company Logo */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 -top-3 -left-3 border border-gray-300 shadow-md bg-white rounded-xl flex items-center justify-center p-2">
                <img
                    src={job.companyProfileImage || "/icons/job.png"}
                    alt={job.companyName}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            {/* Job Info */}
            <div className="flex-1 w-full pl-24 sm:pl-32">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {job.jobTitle}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Company: <span className="font-semibold">{job.companyName}</span> {/* Updated */}
                </p>

                <p className="text-xs sm:text-sm text-gray-600">Location: {job.location}</p>
                <p className="text-xs sm:text-sm text-gray-600">Experience: {job.experience}</p>
                <p className="text-xs sm:text-sm text-gray-600">Salary: {job.salary}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                    Type: {job.employmentTypes?.[0]}
                </p>

                {/* Job Description */}
                {job.jobDescription && (
                    <div
                        className="text-xs sm:text-sm text-gray-700 mt-2 prose"
                        dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                    />
                )}

                {/* Apply Button Logic */}
                {!isLoggedIn ? (
                    <button
                        onClick={() => router.push("/login")}
                        className="mt-3 px-4 py-2 text-xs sm:text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                        Login to Apply
                    </button>
                ) : isApplicant ? (
                    <button
                        onClick={handleApply}
                        disabled={applied}
                        className={`mt-3 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${applied
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        {applied ? "Applied" : "Apply"}
                    </button>
                ) : (
                    <p className="text-sm text-gray-500 mt-3">
                        Login as Applicant to apply
                    </p>
                )}
            </div>
        </div>
    );
};

const JobsDetails = () => {
    const { category, title } = useParams();
    const [jobCategories, setJobCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // The params are already decoded
    const categorySlug = category || null;
    const titleSlug = title || null;

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

    // Filter the category by comparing the SLUG from the URL to the SLUG of the category title
    const filteredCategories = categorySlug
        ? jobCategories.filter(
            (cat) => createSlug(cat.title) === categorySlug
        )
        : jobCategories;

    if (loading) {
        return (
            <div className="jobs-details py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-details py-10">
                <div className="text-center text-red-600 p-4">
                    <p>Error loading job details: {error}</p>
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
                        (job) => createSlug(job.jobTitle || job.title) === titleSlug
                    )
                    : category.jobs;

                return (
                    <div className='py-5 space-y-8' key={category.title}>
                        {filteredJobs.length === 0 ? (
                            <p className='text-center text-lg text-gray-600'>
                                {titleSlug
                                    ? `No jobs found matching "${titleSlug}" in category "${category.title}"`
                                    : `No jobs found in category "${category.title}"`
                                }
                            </p>
                        ) : (
                            filteredJobs.map((job, ind) => (
                                <JobCard
                                    key={job.id || ind}
                                    job={job}
                                    category={category.title}
                                    logo={category.icon}
                                />
                            ))
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default JobsDetails;