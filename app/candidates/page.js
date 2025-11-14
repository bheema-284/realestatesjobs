'use client';
import Chat from '@/components/common/chat';
import { jobCategories } from '@/components/config/data';
import RootContext from '@/components/config/rootcontext';
import { useSWRFetch } from '@/components/config/useswrfetch';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import {
    FaGraduationCap,
    FaHandshake,
    FaChartLine,
    FaMoneyBillAlt,
    FaStar,
    FaCheckCircle,
} from 'react-icons/fa';


// Candidate Card
const ApplicationCard = ({ candidate, onOpenChatWithCandidate }) => {
    const router = useRouter();
    const [status, setStatus] = useState('Interested');
    const isNotChatEnabled = status === 'Not Interested';

    // Get the rating from the candidate object, default to 0 if missing
    const ratingValue = candidate.ratings || 0;

    // Function to handle navigation to the profile page
    const handleViewProfile = () => router.push(`/profile/${candidate.id}/${candidate.category}`);

    // Function to render stars based on the rating value
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        const stars = [];

        // 1. Full Stars (Yellow)
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="w-3 h-3 text-yellow-400" />);
        }

        // 2. Half Star (This simple implementation uses a full star for simplicity 
        //    since FaStar doesn't easily support half fill in Tailwind without a more complex mask/gradient)
        //    NOTE: For true half-star, you would need FaStarHalfAlt from a different library or a custom component.
        //    For this iteration, we treat it as a full star if it's 0.5 or greater.
        if (hasHalfStar) {
            stars.push(<FaStar key="half" className="w-3 h-3 text-yellow-400 opacity-50" />);
        }

        // 3. Empty Stars (Gray)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="w-3 h-3 text-gray-500 opacity-30" />);
        }

        return stars;
    };


    return (
        <div className="border rounded-xl shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-4 flex-1">
                <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <div className="flex items-center gap-2 font-semibold text-base sm:text-lg flex-wrap sm:flex-row">
                        <span className="text-md text-black">{candidate.name.toUpperCase()}</span> {" | "}
                        <span className="text-sm text-gray-500">{candidate.location}</span>
                        <FaCheckCircle className='w-3 h-3 text-blue-600' />
                    </div>
                    <div className="flex flex-wrap sm:flex-row gap-2 mt-2 text-xs items-center">
                        <FaGraduationCap title='degree' className='cursor-pointer w-5 h-5 text-gray-700' />
                        <FaHandshake title='partner' className='cursor-pointer w-5 h-5 text-gray-700' />
                        <FaChartLine title='sales' className='cursor-pointer w-5 h-5 text-gray-700' />
                        <FaMoneyBillAlt title='commission' className='cursor-pointer w-5 h-5 text-gray-700' />

                        {/* -------------------- RATING DISPLAY UPDATED -------------------- */}
                        <div
                            className="border border-gray-300 px-3 h-6 rounded flex gap-2 items-center"
                            title={`Overall Rating: ${ratingValue.toFixed(1)}/5`} // Tooltip on hover
                        >
                            {/* Rating Score Box */}
                            <div className="bg-yellow-800 text-white w-6 h-6 flex flex-col items-center justify-center rounded text-[8px] leading-tight text-center overflow-hidden">
                                {/* Use toFixed(1) to ensure one decimal place, e.g., 4.0, 3.5 */}
                                <p className="m-0 p-0 text-[9px] font-bold leading-none">{ratingValue.toFixed(1)}</p>
                                <p className="uppercase text-[6px] pt-0.5 px-1 leading-none">rating</p>
                            </div>

                            {/* Star Icons */}
                            <div className="text-yellow-400 flex">
                                {renderStars(ratingValue)}
                            </div>
                        </div>
                        {/* ----------------------------------------------------------------- */}

                    </div>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <select className="border rounded px-2 py-1 text-xs sm:text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Interested</option>
                    <option>Shortlisted</option>
                    <option>Selected</option>
                    <option>Not Interested</option>
                </select>

                <button
                    onClick={() => onOpenChatWithCandidate(candidate.name)}
                    disabled={isNotChatEnabled}
                    className={`border px-2 py-1 rounded text-xs sm:text-sm flex gap-2 items-center gap-1 
                        ${!isNotChatEnabled ? 'text-gray-500 hover:bg-gray-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Chat</span>
                </button>

                <button
                    onClick={handleViewProfile}
                    className="border px-2 py-1 flex gap-2 items-center rounded text-xs sm:text-sm text-green-600 border-green-600 hover:bg-green-50 whitespace-nowrap"
                >
                    <EyeIcon className="w-4 h-4 text-green-600" /> <span className="inline">View Profile</span>
                </button>
            </div>
        </div>
    );
};

// Main List
const ApplicationList = () => {
    const { rootContext } = useContext(RootContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCandidateName, setSelectedCandidateName] = useState('');
    const [openCategory, setOpenCategory] = useState(''); // Accordion: currently open category
    const { data, error, isLoading } = useSWRFetch(`/api/applicants`);
    const candidates = data || []
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOpenChatWithCandidate = (name) => {
        setSelectedCandidateName(name);
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setSelectedCandidateName('');
    };

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? '' : category);
    };
    if (!isMounted) return null;
    return (
        <div className="w-full sm:w-[80%] mx-auto">
            {/* Accordion Category List */}
            <div className="flex flex-col gap-2">
                {jobCategories.map((cat) => {
                    const catCandidates = candidates.filter(c => c.category === cat.title);
                    const isOpen = openCategory === cat.title;

                    return (
                        <div key={cat.title} className="flex flex-col gap-2">
                            {/* Accordion Header */}
                            <div
                                className={`flex w-full cursor-pointer gap-5 justify-between text-left px-4 py-3 sm:text-xl rounded font-semibold border items-center ${isOpen ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 hover:text-gray-800'
                                    }`}
                                onClick={() => toggleCategory(cat.title)}
                            >
                                <button className='capitalize'>
                                    {cat.title} at {rootContext?.user?.name || 'Company'}
                                </button>
                                {isOpen ? (
                                    <ChevronUpIcon className="w-6 h-6 text-white" />
                                ) : (
                                    <ChevronDownIcon className="w-6 h-6 text-white" />
                                )}
                            </div>

                            {/* Collapsible Candidates */}
                            <div
                                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                                style={{
                                    maxHeight: isOpen ? `${catCandidates.length * 130}px` : '0',
                                }}
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {catCandidates.map(candidate => (
                                        <ApplicationCard
                                            key={candidate.id}
                                            candidate={candidate}
                                            onOpenChatWithCandidate={handleOpenChatWithCandidate}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isChatOpen && (
                <Chat
                    candidateName={selectedCandidateName}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    );
};

export default ApplicationList;