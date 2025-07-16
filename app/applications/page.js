'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    FaGraduationCap,
    FaHandshake,
    FaChartLine,
    FaMoneyBillAlt,
    FaStar,
    FaCheckCircle,
} from 'react-icons/fa';

// Dummy candidate data
const candidates = [
    {
        id: 1,
        name: 'Emma Robin',
        location: 'Hyderabad, Madhapur',
        image: 'https://randomuser.me/api/portraits/women/75.jpg',
    },
    {
        id: 2,
        name: 'Alex Johnson',
        location: 'Mumbai, Andheri',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        id: 3,
        name: 'Priya Mehta',
        location: 'Bangalore, Koramangala',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
        id: 4,
        name: 'Rahul Verma',
        location: 'Pune, Baner',
        image: 'https://randomuser.me/api/portraits/men/44.jpg',
    },
    {
        id: 5,
        name: 'Anjali Singh',
        location: 'Delhi, Hauz Khas',
        image: 'https://randomuser.me/api/portraits/women/25.jpg',
    },
    {
        id: 6,
        name: 'Arjun Desai',
        location: 'Ahmedabad, Satellite',
        image: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
        id: 7,
        name: 'Sneha Kapoor',
        location: 'Chennai, T. Nagar',
        image: 'https://randomuser.me/api/portraits/women/35.jpg',
    },
    {
        id: 8,
        name: 'Rohit Sharma',
        location: 'Kolkata, Salt Lake',
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    {
        id: 9,
        name: 'Neha Dubey',
        location: 'Jaipur, Malviya Nagar',
        image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
        id: 10,
        name: 'Vikram Rao',
        location: 'Nagpur, Dharampeth',
        image: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
];

// Card Component
const ApplicationCard = ({ candidate }) => {
    const router = useRouter();

    const handleViewProfile = () => {
        router.push(`/profile/${candidate.id}`);
    };

    return (
        <div className="border rounded-xl shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-4 flex-1">
                <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <div className="flex items-center gap-2 font-semibold text-base sm:text-lg flex-wrap sm:flex-row">
                        {candidate.name.toUpperCase()}
                        <span className="text-blue-500">
                            <FaCheckCircle />
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">{candidate.location}</div>

                    <div className="flex flex-wrap sm:flex-row gap-2 mt-2 text-blue-600 text-xs items-center">
                        <FaGraduationCap />
                        <FaHandshake />
                        <FaChartLine />
                        <FaMoneyBillAlt />

                        <div className="border border-gray-600 px-3 h-6 rounded flex gap-2 items-center">
                            <div className="bg-yellow-900 text-yellow-500 w-6 h-6 flex flex-col items-center justify-center rounded text-[8px] leading-tight text-center overflow-hidden">
                                <p className="m-0 p-0 text-[9px] leading-none">5.0</p>
                                <p className="uppercase text-[6px] pt-0.5 px-1 leading-none">rating</p>
                            </div>
                            <div className="text-yellow-400 flex">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="w-3 h-3" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <select className="border rounded px-2 py-1 text-xs sm:text-sm">
                    <option>Interested</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                </select>

                <button className="border px-2 py-1 rounded text-xs sm:text-sm flex items-center gap-1">
                    <span>💬</span> <span className="hidden sm:inline">Chat</span>
                </button>

                <button
                    onClick={handleViewProfile}
                    className="border px-2 py-1 rounded text-xs sm:text-sm text-green-600 border-green-600 hover:bg-green-50 whitespace-nowrap"
                >
                    👁 <span className="inline">View Profile</span>
                </button>
            </div>
        </div>

    );
};

// Main List Component
const ApplicationList = () => {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-4">
                <select className="bg-blue-500 w-full text-white font-semibold px-4 py-2 rounded text-sm sm:text-base">
                    <option>
                        Associate Director / General Manager / Channel Partner - Real Estate Sales at TIRUMALA REALITY
                    </option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {candidates.map((candidate) => (
                    <ApplicationCard key={candidate.id} candidate={candidate} />
                ))}
            </div>
        </div>

    );
};

export default ApplicationList;
