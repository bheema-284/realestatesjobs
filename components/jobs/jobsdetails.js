'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import RootContext from '../config/rootcontext';
import Loading from '../common/loading';

// Import Heroicons
import {
    ClockIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    HeartIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';

// Utility function (MUST match the one used for navigation/routing)
const createSlug = (title) => {
    return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
};

const JobCard = ({ job, category, isOpen, onToggle }) => {
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
    const handleApply = async (companyId) => {
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
                    companyId: companyId || 1,
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

    const handleCardClick = () => {
        onToggle();
    };

    return (
        <div
            className="
                w-full max-w-6xl mx-auto
                bg-white rounded-2xl 
                shadow-[0px_0px_25px_rgba(21,58,103,0.15),0px_4px_12px_rgba(0,0,0,0.1)]
                border border-blue-100
                flex flex-col lg:flex-row items-start lg:items-center
                p-2 sm:p-4 lg:p-5 lg:pl-44 relative
                min-h-[120px] lg:min-h-[140px]
                transition-all duration-300
                hover:shadow-[0px_0px_30px_rgba(21,58,103,0.25),0px_4px_15px_rgba(0,0,0,0.12)]
                hover:border-blue-200
                sticky top-2 lg:top-4 z-10
                cursor-pointer
            "
        >
            {serviceCall && <Loading />}

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
                mb-4 lg:mb-0
                mx-auto lg:mx-0
            "
                onClick={handleCardClick}
            >
                <img
                    src={job.companyProfileImage || '/icons/job.png'}
                    alt={job.companyName}
                    className="w-[80%] h-[80%] object-contain transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* MIDDLE DETAILS - Responsive layout */}
            <div onClick={handleCardClick} className="flex-1 w-full lg:w-auto lg:pl-0">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                    {job.jobTitle} - {job.companyName}
                </h2>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 lg:gap-6 mt-3 lg:mt-4 text-gray-700 font-medium text-sm lg:text-[15px]">

                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                        <span className="font-semibold text-xs lg:text-sm">{job.employmentTypes?.[0] || job.type || "full_time"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                        <span className="font-semibold text-xs lg:text-sm">{job.location || "Tirupati"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CurrencyRupeeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                        <span className="font-semibold text-xs lg:text-sm">{job.salary || job.salaryAmount || "20000"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                        <span className="font-semibold text-xs lg:text-sm">{job.experience || "1-3 years"}</span>
                    </div>
                </div>
            </div>

            {/* RIGHT BUTTON - Responsive layout */}
            <div className="flex items-center justify-between w-full lg:w-auto mt-4 lg:mt-0" onClick={handleCardClick}>
                {/* Blue Vertical Line - Hidden on mobile, visible on desktop */}
                <div className="hidden lg:block w-[2px] h-20 lg:h-24 bg-[#153A67] mr-4"></div>

                <div className="flex items-center gap-3 lg:gap-4 w-full justify-between lg:justify-normal">
                    {/* Toggle Icon */}
                    <div className={`flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full transition-colors ${isOpen ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'
                        }`}>
                        {isOpen ? (
                            <ChevronUpIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                        ) : (
                            <ChevronDownIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        )}
                    </div>

                    {/* Apply Button Logic */}
                    <div className="flex flex-col items-center gap-2">
                        {!isLoggedIn ? (
                            <button
                                onClick={() => router.push("/login")}
                                className="
                                    px-4 lg:px-6 py-2 
                                    bg-green-600
                                    text-white 
                                    rounded-xl 
                                    font-semibold 
                                    hover:bg-green-700
                                    transition-all duration-300
                                    whitespace-nowrap
                                    hover:shadow-[0px_4px_15px_rgba(34,197,94,0.4)]
                                    hover:translate-y-[-2px]
                                    text-xs lg:text-sm
                                "
                            >
                                Login to Apply
                            </button>
                        ) : isApplicant ? (
                            <button
                                onClick={() => handleApply(job.companyId)}
                                disabled={applied}
                                className={`
                                    px-4 lg:px-6 py-2 
                                    rounded-xl 
                                    font-semibold 
                                    transition-all duration-300
                                    whitespace-nowrap
                                    hover:translate-y-[-2px]
                                    text-xs lg:text-sm
                                    ${applied
                                        ? "bg-gray-400 cursor-not-allowed hover:shadow-none"
                                        : "bg-[#153A67] text-white hover:bg-[#0d2c52] hover:shadow-[0px_4px_15px_rgba(21,58,103,0.4)]"
                                    }
                                `}
                            >
                                {applied ? "Applied" : "Apply Now"}
                            </button>
                        ) : (
                            <p className="text-xs lg:text-sm text-gray-500 whitespace-nowrap text-center">
                                Login as Applicant to apply
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobDetailsContent = ({ job, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="
            w-full max-w-6xl mx-auto
            bg-white rounded-2xl 
            shadow-[0px_0px_25px_rgba(21,58,103,0.15),0px_4px_12px_rgba(0,0,0,0.1)]
            border border-blue-100
            p-4 lg:p-8
            mt-4 lg:mt-6
            transition-all duration-300 ease-in-out
            transform origin-top
        ">

            {/* Job Description */}
            {job.jobDescription && (
                <div className="mb-6 lg:mb-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                        Job Description
                    </h3>
                    <div
                        className="prose prose-sm lg:prose-lg max-w-none text-gray-700 text-sm lg:text-base"
                        dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                    />
                </div>
            )}

            {/* Key Responsibilities */}
            {job.responsibilities && (
                <div className="mb-6 lg:mb-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                        Key Responsibilities
                    </h3>
                    <div
                        className="prose prose-sm lg:prose-lg max-w-none text-gray-700 text-sm lg:text-base"
                        dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                    />
                </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
                <div className="mb-6 lg:mb-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                        Qualifications
                    </h3>
                    <div
                        className="prose prose-sm lg:prose-lg max-w-none text-gray-700 text-sm lg:text-base"
                        dangerouslySetInnerHTML={{ __html: job.qualifications }}
                    />
                </div>
            )}

            {/* Why Join Us */}
            {job.benefits && (
                <div className="mb-6 lg:mb-8">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <HeartIcon className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600" />
                        Why Join Us?
                    </h3>
                    <div
                        className="prose prose-sm lg:prose-lg max-w-none text-gray-700 text-sm lg:text-base"
                        dangerouslySetInnerHTML={{ __html: job.benefits }}
                    />
                </div>
            )}
        </div>
    );
};

const JobsDetails = () => {
    const { category, title } = useParams();
    const [jobCategories, setJobCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openJobId, setOpenJobId] = useState(null);

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

    // Handle job card toggle
    const handleJobToggle = (jobId) => {
        setOpenJobId(openJobId === jobId ? null : jobId);
    };

    if (loading) {
        return (<Loading />);
    }

    if (error) {
        return (
            <div className="jobs-details sm:py-8 lg:py-10 sm:px-4 lg:px-0">
                <div className="text-center text-red-600 p-4">
                    <p className="text-sm lg:text-base">Error loading job details: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm lg:text-base"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-details sm:py-8 lg:py-10 min-h-screen bg-gray-50 px-4 lg:px-0">
            {filteredCategories.length === 0 && (
                <p className='text-center text-base lg:text-lg text-gray-600 px-4'>
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
                    <div className='sm:py-4 lg:py-5 space-y-4 lg:space-y-6' key={category.title}>
                        {filteredJobs.length === 0 ? (
                            <p className='text-center text-base lg:text-lg text-gray-600 px-4'>
                                {titleSlug
                                    ? `No jobs found matching "${titleSlug}" in category "${category.title}"`
                                    : `No jobs found in category "${category.title}"`
                                }
                            </p>
                        ) : (
                            <div className="space-y-4 lg:space-y-6">
                                {/* Job Cards with Toggle */}
                                {filteredJobs.map((job, ind) => {
                                    const jobUniqueId = job.id || `job-${ind}`;
                                    return (
                                        <div key={jobUniqueId} className="space-y-4 lg:space-y-6">
                                            <JobCard
                                                job={job}
                                                category={category.title}
                                                logo={category.icon}
                                                isOpen={openJobId === jobUniqueId}
                                                onToggle={() => handleJobToggle(jobUniqueId)}
                                            />
                                            {/* Scrollable Job Details */}
                                            <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] overflow-y-auto">
                                                <JobDetailsContent
                                                    job={job}
                                                    isOpen={openJobId === jobUniqueId}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default JobsDetails;