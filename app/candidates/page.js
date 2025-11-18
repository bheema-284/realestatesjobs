'use client';
import Chat from '@/components/common/chat';
import RootContext from '@/components/config/rootcontext';
import { Mutated, useSWRFetch } from '@/components/config/useswrfetch';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import {
    FaGraduationCap,
    FaHandshake,
    FaChartLine,
    FaMoneyBillAlt,
    FaStar,
    FaCheckCircle,
    FaUserTie,
    FaBuilding,
    FaPhoneAlt,
    FaHeadset,
    FaHome,
    FaChartBar,
    FaUsers,
    FaCog
} from 'react-icons/fa';

// Candidate Card
const ApplicationCard = ({ candidate, onOpenChatWithCandidate, onStatusChange }) => {
    const router = useRouter();
    const [status, setStatus] = useState(candidate.status || 'Applied');
    const [isUpdating, setIsUpdating] = useState(false);
    const isNotChatEnabled = status === 'Not Interested';
    const ratingValue = candidate.ratings || 0;
    const handleViewProfile = () => router.push(`/profile/${candidate.applicantId}/${candidate.category}`);

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        setIsUpdating(true);

        try {
            await onStatusChange(candidate.applicantId, candidate.jobId, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert on error
            setStatus(candidate.status || 'Applied');
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="w-3 h-3 text-yellow-400" />
                ))}
                {hasHalfStar && <FaStar key="half" className="w-3 h-3 text-yellow-400 opacity-50" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaStar key={`empty-${i}`} className="w-3 h-3 text-gray-500 opacity-30" />
                ))}
            </>
        );
    };

    // Get company logo from jobDetails or companyDetails
    const companyLogo = candidate.comapnyLogo || candidate.jobDetails?.companyProfileImage ||
        candidate.companyDetails?.profileImage ||
        candidate.companyProfileImage;

    // Get location from jobDetails
    const jobLocation = candidate.jobDetails?.location || candidate.location;

    return (
        <div className="border rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                    {/* Avatar - Now shows company logo */}
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0 overflow-hidden">
                        {companyLogo ? (
                            <img
                                src={companyLogo}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${companyLogo ? 'hidden' : 'flex'}`}>
                            {candidate.comapnyName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 break-words">
                                {candidate.applicantName?.toUpperCase() || 'Applicant'}
                            </h3>
                            <div className="flex items-center gap-2">
                                {jobLocation && (
                                    <span className="text-sm text-gray-600 break-words hidden sm:flex items-center gap-1">
                                        <MapPinIcon className="w-4 h-4" />
                                        {jobLocation}
                                    </span>
                                )}
                                <FaCheckCircle className='w-4 h-4 text-blue-600' />
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3 text-sm">
                            <div className="min-w-0">
                                <span className="text-gray-600">Job: </span>
                                <span className="font-medium break-words">{candidate.jobTitle}</span>
                            </div>
                            <div className="min-w-0">
                                <span className="text-gray-600">Applied: </span>
                                <span className="font-medium">{new Date(candidate.appliedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                                <span className="text-gray-600">Email: </span>
                                <span className="font-medium break-all">{candidate.applicantEmail}</span>
                            </div>
                        </div>

                        {/* Company Info */}
                        {candidate.companyName && (
                            <div className="mb-2 text-sm">
                                <span className="text-gray-600">Company: </span>
                                <span className="font-medium">{candidate.companyName}</span>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <FaGraduationCap title='Education' className='w-4 h-4 text-gray-600' />
                                <FaHandshake title='Experience' className='w-4 h-4 text-gray-600' />
                                <FaChartLine title='Performance' className='w-4 h-4 text-gray-600' />
                                <FaMoneyBillAlt title='Salary' className='w-4 h-4 text-gray-600' />
                            </div>

                            <div className="border border-gray-300 px-2 py-1 rounded flex items-center gap-1">
                                <div className="bg-yellow-800 text-white w-5 h-5 flex flex-col items-center justify-center rounded text-[7px]">
                                    <span className="font-bold">{ratingValue.toFixed(1)}</span>
                                    <span className="text-[5px]">rating</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {renderStars(ratingValue)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-2 flex-shrink-0">
                <select
                    className={`border rounded px-3 py-2 text-sm min-w-[140px] ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                >
                    <option value="Applied">Applied</option>
                    <option value="Interested">Interested</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Selected">Selected</option>
                    <option value="Not Interested">Not Interested</option>
                </select>

                <div className="flex gap-2">
                    <button
                        onClick={() => onOpenChatWithCandidate(candidate)}
                        disabled={isNotChatEnabled || isUpdating}
                        className={`flex-1 px-3 py-2 rounded text-sm flex items-center gap-2 justify-center min-w-[80px] border
                            ${!isNotChatEnabled && !isUpdating
                                ? 'text-gray-600 border-gray-300 hover:bg-gray-50'
                                : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                        <span>Chat</span>
                    </button>

                    <button
                        onClick={handleViewProfile}
                        disabled={isUpdating}
                        className={`flex-1 px-3 py-2 rounded text-sm flex items-center gap-2 justify-center min-w-[100px] border border-green-600 text-green-600 hover:bg-green-50 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <EyeIcon className="w-4 h-4" />
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Category icon mapping
const categoryIcons = {
    'channel-partners': FaUserTie,
    'real-estate-sales': FaHome,
    'tele-caller': FaPhoneAlt,
    'crm-executive': FaHeadset,
    'hr-manager': FaUsers,
    'operations': FaCog,
    'marketing': FaChartBar,
    'default': FaBuilding
};

// Helper function to get icon for category
const getCategoryIcon = (category) => {
    const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '-');
    return categoryIcons[normalizedCategory] || categoryIcons.default;
};

// Main List
const ApplicationList = () => {
    const { rootContext, setRootContext } = useContext(RootContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [openCategory, setOpenCategory] = useState('');
    const { data, error, isLoading } = useSWRFetch(`/api/companies`);
    const [isMounted, setIsMounted] = useState(false);
    const mutated = Mutated(`/api/companies`);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Extract appliedJobs from company data
    const getAppliedJobs = () => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];

        const company = data[0]; // Assuming we're working with the first company
        return company.appliedJobs || [];
    };

    const appliedJobs = getAppliedJobs();

    // Group applied jobs by category
    const jobsByCategory = appliedJobs.reduce((acc, job) => {
        const category = job.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(job);
        return acc;
    }, {});

    // Get company data
    const getCompanyData = () => {
        if (data && Array.isArray(data) && data.length > 0) {
            return {
                _id: data[0]._id,
                name: data[0].name,
                profileImage: data[0].profileImage || data[0].logo
            };
        }
        return {
            _id: 'unknown-company',
            name: 'Company',
            profileImage: null
        };
    };

    const company = getCompanyData();

    // Handle status change API call
    const handleStatusChange = async (applicantId, jobId, newStatus) => {
        try {
            const response = await fetch('/api/jobs/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicantId,
                    jobId,
                    status: newStatus,
                    companyId: company._id
                })
            });

            const result = await response.json();

            if (result.success) {
                mutated();
                setRootContext(prevContext => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: "Application status updated successfully"
                    }
                }));
            } else {
                throw new Error(result.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Status update error:', error);
            setRootContext(prevContext => ({
                ...prevContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Failed",
                    message: "Failed to update application status"
                }
            }));
            throw error;
        }
    };

    // Handle chat with candidate
    const handleOpenChatWithCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setSelectedCandidate(null);
    };

    // Handle sending chat message - FIXED API CALL
    const handleSendMessage = async (message) => {
        try {
            // Use the correct field names expected by your API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicantId: selectedCandidate.applicantId, // Changed from candidateId
                    companyId: company._id,
                    jobId: selectedCandidate.jobId,
                    jobTitle: selectedCandidate.jobTitle,
                    message: message,
                    senderType: 'company', // Changed to 'company' for company messages
                    senderId: company._id, // Company ID as sender
                    senderName: company.name // Company name as sender
                })
            });

            const result = await response.json();

            if (result.success) {
                setRootContext(prevContext => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: "Message sent successfully"
                    }
                }));
                return true;
            } else {
                console.error('Chat API Error:', result.error);
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Chat message error:', error);
            setRootContext(prevContext => ({
                ...prevContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Failed",
                    message: "Failed to send message: " + error.message
                }
            }));
            return false;
        }
    };

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? '' : category);
    };

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="w-full sm:w-[80%] mx-auto p-8 text-center">
                <div className="animate-pulse">Loading applications...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full sm:w-[80%] mx-auto p-8 text-center text-red-600">
                Error loading applications: {error.message}
            </div>
        );
    }

    return (
        <div className="w-full sm:w-[80%] mx-auto">
            {/* Header */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
                <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
                <p className="text-gray-600 mt-2">
                    Manage applications for {company?.name || 'your company'}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="font-semibold text-blue-800">Total Applications:</span>
                        <span className="ml-2 text-blue-600">{appliedJobs.length}</span>
                    </div>
                    <div className="bg-green-50 px-3 py-2 rounded-lg">
                        <span className="font-semibold text-green-800">Categories:</span>
                        <span className="ml-2 text-green-600">{Object.keys(jobsByCategory).length}</span>
                    </div>
                </div>
            </div>

            {/* Applications by Category */}
            {appliedJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <div className="text-gray-500 text-lg mb-4">No applications received yet</div>
                    <div className="text-gray-400 text-sm">
                        Applications will appear here when candidates apply to your job posts
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {Object.entries(jobsByCategory).map(([category, jobs]) => {
                        const isOpen = openCategory === category;
                        const CategoryIcon = getCategoryIcon(category);

                        return (
                            <div key={category} className="flex flex-col gap-2">
                                {/* Accordion Header */}
                                <div
                                    className={`flex w-full cursor-pointer gap-5 justify-between text-left px-4 py-3 sm:text-xl rounded font-semibold border items-center ${isOpen ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
                                        }`}
                                    onClick={() => toggleCategory(category)}
                                >
                                    <button className='capitalize flex items-center gap-2'>
                                        <CategoryIcon className="w-5 h-5" />
                                        {category} ({jobs.length})
                                    </button>
                                    {isOpen ? (
                                        <ChevronUpIcon className="w-6 h-6 text-white" />
                                    ) : (
                                        <ChevronDownIcon className="w-6 h-6 text-white" />
                                    )}
                                </div>

                                {/* Collapsible Candidates */}
                                <div
                                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                        }`}
                                >
                                    <div className="grid grid-cols-1 gap-4 p-2">
                                        {jobs.map((candidate, index) => (
                                            <ApplicationCard
                                                key={candidate._id || candidate.id || index}
                                                candidate={candidate}
                                                onOpenChatWithCandidate={handleOpenChatWithCandidate}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isChatOpen && selectedCandidate && (
                <Chat
                    candidate={selectedCandidate}
                    company={company}
                    onClose={handleCloseChat}
                    onSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
};

export default ApplicationList;