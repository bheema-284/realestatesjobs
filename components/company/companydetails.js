'use client';
import React, { useState, useEffect, useContext } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import CompanyInvestors from './companyinvestors';
import CompanyProjects from './comanyprojects';
import ButtonTab from '../common/buttontab';
import CompanyJobs from './companyjobs';
import CompanyServices from './companyservices';
import RootContext from '../config/rootcontext';
import { Mutated } from '../config/useswrfetch';
import CompanyLandingPage from './companyprofile';

const allTabs = [
    { name: 'About', component: CompanyLandingPage },
    { name: 'New Projects', component: CompanyProjects },
    { name: 'Jobs', component: CompanyJobs },
    { name: 'Premium Services', component: CompanyServices },
    { name: 'Investors', component: CompanyInvestors },
];

export default function CompanyDetails({ userData, userId }) {

    const [activeTab, setActiveTab] = useState(0);
    const { rootContext, setRootContext } = useContext(RootContext);

    const tabs = React.useMemo(() => {
        const role = rootContext?.user?.role;
        const isRecruiter = role === "recruiter";

        if (isRecruiter) {
            // Recruiter sees all tabs as originally defined
            return allTabs;
        } else {
            // Standard user (remove 'Premium Services', rename 'Investors')
            return allTabs
                .filter(tab => tab.name !== 'Premium Services')
                .map(tab => {
                    if (tab.name === 'Investors') {
                        // Return a new object with the renamed tab name
                        return { ...tab, name: 'Invest with Us' };
                    }
                    return tab;
                });
        }
    }, [rootContext?.user?.role]); // Recalculate only when the user role changes


    const [companyProfile, setCompanyProfile] = useState({
        name: '', industry: '', location: '', image: '', summary: '', experience: [], education: [],
    });
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempCompanyProfile, setTempCompanyProfile] = useState(companyProfile);
    const [accordionOpen, setAccordionOpen] = useState(null);

    const mutated = Mutated(userId ? `/api/users?id=${userId}` : null);

    useEffect(() => {
        if (userData) {
            // Handle both single object and array cases
            if (Array.isArray(userData)) {
                // If userData is an array, use the first object
                if (userData.length > 0) {
                    setCompanyProfile(userData[0]);
                    setTempCompanyProfile(userData[0]);
                } else {
                    // Handle empty array case
                    setCompanyProfile({});
                    setTempCompanyProfile({});
                }
            } else {
                // If userData is a single object, use it directly
                setCompanyProfile(userData);
                setTempCompanyProfile(userData);
            }
        } else {
            // Handle no userData case
            setCompanyProfile({});
            setTempCompanyProfile({});
        }
    }, [userData]); // Changed from companyID to userData

    const ActiveComponent = tabs[activeTab].component;

    return (
        <div className="bg-white mt-20 min-h-screen">

            {/* ------------------ STICKY HEADER CONTAINER ------------------ */}
            <div
                className="
                    max-w-5xl border border-gray-200 rounded-t-xl mx-auto 
                    shadow-sm bg-white 
                    sticky top-20 z-40  // <-- ADDED STICKY CLASSES
                "
            >
                <div className="p-6 flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    <div className="absolute -top-12 left-6 sm:left-6">
                        <img
                            src={tempCompanyProfile.profileImage || tempCompanyProfile.logo || "https://placehold.co/48x48/F0F0F0/000000?text=Logo"}
                            alt="Avatar"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-white object-cover shadow-lg"
                        />
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full ml-0 sm:ml-40">
                        <div className="flex-1">
                            {editingHeader ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={tempCompanyProfile.name}
                                        onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, name: e.target.value })}
                                    />
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={tempCompanyProfile.industry}
                                        onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, industry: e.target.value })}
                                    />
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={tempCompanyProfile.location}
                                        onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, location: e.target.value })}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white rounded"
                                            onClick={() => {
                                                // Assuming you have a function called setProfile (or similar) to save userData
                                                // setProfile(tempCompanyProfile); 
                                                // Using setCompanyProfile for immediate client-side update for demonstration
                                                setCompanyProfile(tempCompanyProfile);
                                                setEditingHeader(false);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="px-3 py-1 border border-gray-400 rounded"
                                            onClick={() => setEditingHeader(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="font-bold text-lg sm:text-xl">{companyProfile.name}</h2>
                                    <p className="text-sm">{companyProfile.industry}</p>
                                    <p className="text-xs text-gray-300">{companyProfile.location}</p>
                                </div>
                            )}
                        </div>

                        {!editingHeader && rootContext?.user?.role === "recruiter" && (
                            <button
                                onClick={() => {
                                    setEditingHeader(true);
                                    // You were using 'profile' here, but it should be 'companyProfile' or 'tempCompanyProfile'
                                    setTempCompanyProfile(companyProfile);
                                }}
                                className="text-gray-600 hover:text-gray-900 mt-2 sm:mt-0"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* ------------------------------------------------------------- */}


            {/* Tab / Accordion Section - Content below the sticky header */}
            <div className="bg-white border-b border-gray-200 max-w-5xl mx-auto px-4 py-6 rounded-b-md shadow-sm">

                {/* Desktop Tabs */}
                <div className="hidden sm:flex flex-col text-sm mb-6">
                    {/* Tab Navigation */}
                    {/* Note: It might be better to make the tabs sticky too, by moving this div to its own sticky container. */}
                    <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Tab Content */}
                    <div className="py-1 px-3 rounded-t-md">
                        <ActiveComponent profile={companyProfile} setRootContext={setRootContext} mutated={mutated} />
                    </div>
                </div>

                {/* Mobile Accordion */}
                <div className="sm:hidden">
                    {tabs.map((tab, index) => {
                        const Component = tab.component;
                        const isOpen = accordionOpen === index;
                        return (
                            <div key={tab.name} className="border-b border-gray-200">
                                <button
                                    onClick={() => setAccordionOpen(isOpen ? null : index)}
                                    className="w-full flex justify-between items-center py-2 px-2 bg-gray-50 text-left"
                                >
                                    <span className="font-medium text-gray-700 text-sm">{tab.name}</span>
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="p-2">
                                        <Component profile={companyProfile} setRootContext={setRootContext} mutated={mutated} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}