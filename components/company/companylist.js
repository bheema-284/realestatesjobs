// CompanyList.js
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { companyData } from '../config/data'
import Link from 'next/link';
import { useSWRFetch } from '../config/useswrfetch';



// Card Component (simplified for the chat button, no longer managing `isChatOpen` itself)
const CompanyCard = ({ company }) => {
    const router = useRouter();

    const handleViewCompany = () => {
        router.push(`/companies/${company._id}`);
    };

    return (
        <div className="relative w-full sm:w-[80%] mx-auto bg-white border border-gray-400 shadow-lg rounded-2xl shadow-md flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-6">
            {/* Logo with overlay effect */}
            <div className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-42 md:h-42 -top-3 -left-3 border border-gray-400 shadow-lg bg-white rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center p-2">
                <img
                    src={company.profileImage || company.logo || "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"}
                    alt={company.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Main content (with padding to avoid overlap) */}
            <div className="flex-1 w-full break-words flex flex-col sm:flex-row justify-between items-center pl-28 sm:pl-40 md:pl-48">
                {/* Left section: Name + Industry + Button */}
                <div className="flex-1 w-full sm:w-[60%] flex flex-col justify-center">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                        {company.name.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Industry: {company.industry}
                    </p>
                    <button
                        onClick={handleViewCompany}
                        className="mt-3 px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition w-fit"
                    >
                        Know More
                    </button>
                </div>

                {/* Right section: Divider + Info */}
                <div className="flex flex-col sm:flex-row w-full sm:w-[40%] items-start sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-blue-600 h-full"></div>

                    <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <p className="truncate">📍 Location: {company.location}</p>
                        <p>🏢 Established: {company.established}</p>
                        <p className="truncate break-all">
                            🌐 Website:{" "}
                            <Link
                                href={company.website || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                            >
                                {company.website}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TitleCard = () => {
    return (
        <div className="w-full mx-auto perspective">
            <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden shadow-xl
                      bg-gradient-to-br from-blue-900 to-gray-800 transform-gpu
                      transition-transform duration-500 ease-in-out hover:scale-105">

                {/* Abstract pattern to emulate a card design */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: '10px 10px'
                    }}>
                </div>

                {/* Card Chip placeholder */}
                <div className="absolute top-8 left-8 w-12 h-10 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-lg shadow-md"></div>

                {/* Main Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                    <div className="flex flex-col">
                        <h2 className="text-xl sm:text-5xl font-bold tracking-wide leading-tight">
                            Explore Top Real Estate Companies
                        </h2>
                        <p className="mt-2 text-sm sm:text-base opacity-80">
                            Discover trusted names shaping the future of real estate.
                        </p>
                    </div>

                    {/* Company/Network Logo placeholder */}
                    <div className="absolute top-8 right-8 flex items-center">
                        <svg className="w-10 h-10 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.02c-3.31 0-6-2.71-6-6.02s2.69-6.02 6-6.02 6 2.71 6 6.02-2.69 6.02-6 6.02zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Main List Component
const CompanyList = () => {
    const [companyID, setCompanyID] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Get user details from localStorage on client side only
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setCompanyID(user_details.id || null);
    }, []);

    // Only fetch data if we have a companyID and we're on the client
    const { data, error, isLoading } = useSWRFetch(`/api/companies`);

    // Handle loading state
    if (!isClient || isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">Error loading company data</div>
            </div>
        );
    }

    const companys = data || [];
    return (
        <div className="w-full px-10 m-auto grid grid-cols-1 gap-20 p-5">
            <TitleCard />
            {companys.map((company, index) => (
                <CompanyCard
                    key={index}
                    company={company}
                />
            ))}
        </div>
    );
};

export default CompanyList;