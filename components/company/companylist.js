// CompanyList.js
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';


// Dummy company data (remains the same)
const companys = [
    { id: 1, name: "DLF Ltd.", logo: "/company/dlf.png", industry: "Real Estate", location: "Gurugram", established: 1946, website: "https://www.dlf.in" },
    { id: 2, name: "Honer Properties", logo: "/company/honer.jpg", industry: "Real Estate", location: "Hyderabad", established: 2010, website: "https://www.honerhomes.com" },
    { id: 3, name: "Brigade Group", logo: "/company/brigade.jpeg", industry: "Real Estate", location: "Bengaluru", established: 1986, website: "https://www.brigadegroup.com" },
    { id: 4, name: "Cyber City.", logo: "/company/cybercity.jpg", industry: "IT Parks & Infrastructure", location: "Hyderabad", established: 2000, website: "https://www.cybercity.in" },
    { id: 5, name: "Jayabheri Properties", logo: "/company/jayabheri.jpg", industry: "Real Estate", location: "Hyderabad", established: 1987, website: "https://www.jayabheri.com" },
    { id: 6, name: "Muppa Group", logo: "/company/muppa.jpeg", industry: "Real Estate", location: "Hyderabad", established: 2009, website: "https://www.muppagroup.com" },
    { id: 7, name: "Prestige Group", logo: "/company/prestigegroup.png", industry: "Real Estate", location: "Bengaluru", established: 1986, website: "https://www.prestigeconstructions.com" },
    { id: 8, name: "My Home Group.", logo: "/company/myhomegroup.png", industry: "Real Estate", location: "Hyderabad", established: 1981, website: "https://www.myhomegroup.in" },
    { id: 9, name: "Radhey Properties", logo: "/company/radhey.jpg", industry: "Real Estate", location: "Ahmedabad", established: 2005, website: "https://www.radheyproperties.com" },
    { id: 10, name: "Rajpushpa Group", logo: "/company/rajpushpagroup.jpg", industry: "Real Estate", location: "Hyderabad", established: 2011, website: "https://www.rajapushpa.in" },
    { id: 11, name: "NCC Ltd.", logo: "/company/ncc.jpg", industry: "Construction & Infrastructure", location: "Hyderabad", established: 1978, website: "https://www.nccltd.in" },
    { id: 12, name: "Ramkey Group", logo: "/company/ramkeygroup.jpg", industry: "Infrastructure & Real Estate", location: "Hyderabad", established: 1994, website: "https://www.ramky.com" },
    { id: 13, name: "Lodha Group", logo: "/company/lodha.jpg", industry: "Real Estate", location: "Mumbai", established: 1980, website: "https://www.lodhagroup.in" },
    { id: 14, name: "Phoenix Mills", logo: "/company/images.jpeg", industry: "Retail & Hospitality", location: "Mumbai", established: 1905, website: "https://www.thephoenixmills.com" },
];

// Card Component (simplified for the chat button, no longer managing `isChatOpen` itself)
const CompanyCard = ({ company }) => {
    const router = useRouter();

    const handleViewCompany = () => {
        router.push(`/companies/${company.id}`);
    };

    return (
        <div className="border rounded-xl shadow-sm flex p-2 flex-col sm:flex-row grid grid-cols-1 sm:grid-cols-3 justify-between gap-4">
            {/* Left section with logo and name */}
            <div className="flex gap-2 justify-between items-center gap-4 flex-1">
                <div className="w-24 h-24 sm:w-32 sm:h-32 p-2">
                    <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 py-2">
                    <div className="flex items-center gap-2 font-semibold text-base sm:text-lg flex-wrap sm:flex-row">
                        <span className="text-md text-black">{company.name.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Industry: {company.industry}</p>
                    <p className="text-sm text-gray-500 mt-1 mb-5">Established: {company.established}</p>
                    <button
                        onClick={handleViewCompany}
                        className="border hidden sm:block px-2 py-1 flex gap-2 items-center rounded text-xs sm:text-sm text-purple-600 border-purple-600 hover:bg-purple-50 whitespace-nowrap"
                    >
                        <span className="inline">Know More</span>
                    </button>
                </div>
            </div>
            <div></div>
            {/* Right section */}
            <div className="flex flex-row justify-between">
                {/* Full height divider */}
                <div className="hidden sm:block w-px bg-purple-600 self-stretch"></div>
                <div className="text-sm text-gray-600 flex flex-col justify-center">
                    <p>Location: {company.location}</p>
                    <p>
                        Website:{" "}
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline"
                        >
                            {company.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                    </p>
                </div>
                <button
                    onClick={handleViewCompany}
                    className="border sm:hidden px-2 py-1 flex gap-2 items-center rounded text-xs sm:text-sm text-purple-600 border-purple-600 hover:bg-purple-50 whitespace-nowrap"
                >
                    <span className="inline">Know More</span>
                </button>
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

    return (
        <div className="w-full sm:w-[80%] m-auto grid grid-cols-1 gap-4 p-2">
            <TitleCard />
            {companys.map((company) => (
                <CompanyCard
                    key={company.id}
                    company={company}
                />
            ))}
        </div>
    );
};

export default CompanyList;