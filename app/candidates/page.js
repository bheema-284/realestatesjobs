'use client';
import Chat from '@/components/common/chat';
import RootContext from '@/components/config/rootcontext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { ChatBubbleOvalLeftEllipsisIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import {
    FaGraduationCap,
    FaHandshake,
    FaChartLine,
    FaMoneyBillAlt,
    FaStar,
    FaCheckCircle,
} from 'react-icons/fa';

// Job Categories
const jobCategories = [
    { icon: '/icons/cp.png', title: 'Channel Partners', description: 'Collaborate & Earn' },
    { icon: '/icons/hrandop.png', title: 'HR & Operations', description: 'People & Process' },
    { icon: '/icons/realestate.png', title: 'Real Estate Sales', description: 'Sell Property Faster' },
    { icon: '/icons/tel.png', title: 'Tele Caller', description: 'Engage & Convert' },
    { icon: '/icons/digital.png', title: 'Digital Marketing', description: 'Promote & Convert' },
    { icon: '/icons/webdev.png', title: 'Web Development', description: 'Build Real Estate Tech' },
    { icon: '/icons/crm.png', title: 'CRM Executive', description: 'Manage Client Relations' },
    { icon: '/icons/accounts.png', title: 'Accounts & Auditing', description: 'Ensure Financial Clarity' },
];

// Utility: Random pick
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Name pools
const firstNames = ['Emma', 'Alex', 'Priya', 'Rahul', 'Anjali', 'Arjun', 'Sneha', 'Rohit', 'Neha', 'Vikram', 'Kiran', 'Meera', 'Suresh', 'Isha', 'Kabir'];
const lastNames = ['Robin', 'Johnson', 'Mehta', 'Verma', 'Singh', 'Desai', 'Kapoor', 'Sharma', 'Dubey', 'Rao', 'Patel', 'Nair', 'Menon', 'Bose', 'Chopra'];

// Cities
const locations = [
    'Hyderabad, Madhapur', 'Mumbai, Andheri', 'Bangalore, Koramangala', 'Pune, Baner',
    'Delhi, Hauz Khas', 'Ahmedabad, Satellite', 'Chennai, T. Nagar', 'Kolkata, Salt Lake',
    'Jaipur, Malviya Nagar', 'Nagpur, Dharampeth', 'Lucknow, Hazratganj', 'Surat, Adajan', 'Indore, Vijay Nagar'
];

// Generate image URLs
const getImage = (gender, index) => `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;

// Generate candidates per category
let candidateId = 1;
const candidates = jobCategories.flatMap((category) => {
    const numCandidates = Math.floor(Math.random() * 6) + 5; // 5–10
    return Array.from({ length: numCandidates }, () => {
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        return {
            id: candidateId++,
            name: `${getRandom(firstNames)} ${getRandom(lastNames)}`,
            location: getRandom(locations),
            image: getImage(gender, Math.floor(Math.random() * 90)),
            category: category.title,
        };
    });
});

// Candidate Card
const ApplicationCard = ({ candidate, onOpenChatWithCandidate }) => {
    const router = useRouter();
    const [status, setStatus] = useState('Interested');
    const isChatEnabled = status === 'Interested';

    const handleViewProfile = () => router.push(`/profile/${candidate.id}`);

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
                        <FaGraduationCap className='w-5 h-5 text-gray-700' />
                        <FaHandshake className='w-5 h-5 text-gray-700' />
                        <FaChartLine className='w-5 h-5 text-gray-700' />
                        <FaMoneyBillAlt className='w-5 h-5 text-gray-700' />
                        <div className="border border-gray-600 px-3 h-6 rounded flex gap-2 items-center">
                            <div className="bg-yellow-900 text-yellow-500 w-6 h-6 flex flex-col items-center justify-center rounded text-[8px] leading-tight text-center overflow-hidden">
                                <p className="m-0 p-0 text-[9px] leading-none">5.0</p>
                                <p className="uppercase text-[6px] pt-0.5 px-1 leading-none">rating</p>
                            </div>
                            <div className="text-yellow-400 flex">
                                {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3 h-3" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <select className="border rounded px-2 py-1 text-xs sm:text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Interested</option>
                    <option>Shortlisted</option>
                    <option>Selected</option>
                    <option>Not Selected</option>
                </select>

                <button
                    onClick={() => onOpenChatWithCandidate(candidate.name)}
                    disabled={!isChatEnabled}
                    className={`border px-2 py-1 rounded text-xs sm:text-sm flex gap-2 items-center gap-1 
                        ${isChatEnabled ? 'text-gray-500 hover:bg-gray-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
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
                                className={`flex w-full cursor-pointer gap-5 justify-between text-left px-4 py-2 rounded font-semibold border items-center ${isOpen ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 hover:text-gray-800'
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