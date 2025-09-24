'use client';
import React, { useState, useEffect, useContext } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import CompanyInvestors from './companyinvestors';
import CompanyProjects from './comanyprojects';
import AboutCompany from './aboutcompany';
import ButtonTab from '../common/buttontab';
import CompanyJobs from './companyjobs';
import CompanyServices from './companyservices';
import { companyData } from '../config/data'
import RootContext from '../config/rootcontext';
const tabs = [
    { name: 'About', component: AboutCompany },
    { name: 'New Projects', component: CompanyProjects },
    { name: 'Jobs', component: CompanyJobs },
    { name: 'Premium Services', component: CompanyServices },
    { name: 'Investors', component: CompanyInvestors },
];

export default function CompanyDetails({ companyId }) {
    const [activeTab, setActiveTab] = useState(0);
    const { rootContext } = useContext(RootContext)
    const [companyProfile, setCompanyProfile] = useState({
        name: '', industry: '', location: '', image: '', summary: '', experience: [], education: [],
    });
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempCompanyProfile, setTempCompanyProfile] = useState(companyProfile);
    const [accordionOpen, setAccordionOpen] = useState(null);

    useEffect(() => {
        const data = companyData.find((c) => String(c.id) === String(companyId || 1));
        if (data) {
            setCompanyProfile(data);
            setTempCompanyProfile(data);
        }
    }, [companyId]);

    const ActiveComponent = tabs[activeTab].component;

    return (
        <div className="bg-white mt-20 min-h-screen">
            <div className="max-w-5xl border border-gray-200 rounded-t-xl mx-auto relative shadow-sm">
                <div className="p-6 flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    <div className="absolute -top-12 left-6 sm:left-6">
                        <img
                            src={tempCompanyProfile.logo || "https://placehold.co/48x48/F0F0F0/000000?text=Logo"}
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
                                                setProfile(tempCompanyProfile);
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
                                    setTempCompanyProfile(profile);
                                }}
                                className="text-gray-600 hover:text-gray-900 mt-2 sm:mt-0"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab / Accordion Section */}
            <div className="bg-white border-b border-gray-200 max-w-5xl mx-auto px-4 py-6 rounded-b-md shadow-sm">
                {/* Desktop Tabs */}
                <div className="hidden sm:flex flex-col text-sm mb-6">
                    {/* Tab Navigation */}
                    <ButtonTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Tab Content */}
                    <div className="py-1 px-3 rounded-t-md">
                        <ActiveComponent companyProfile={companyProfile} />
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
                                        <Component companyProfile={companyProfile} />
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