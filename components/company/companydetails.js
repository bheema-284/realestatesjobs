'use client';
import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import CompanyInvestors from './companyinvestors';
import CompanyProjects from './comanyprojects';
import AboutCompany from './aboutcompany';
import ButtonTab from '../common/buttontab';
import CompanyJobs from './companyjobs';
import CompanyServices from './companyservices';
import { companyData } from '../config/data'
const tabs = [
    { name: 'About', component: AboutCompany },
    { name: 'New Projects', component: CompanyProjects },
    { name: 'Jobs', component: CompanyJobs },
    { name: 'Premium Services', component: CompanyServices },
    { name: 'Investors', component: CompanyInvestors },
];

export default function CompanyDetails({ companyId }) {
    const [activeTab, setActiveTab] = useState(0);

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
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-[#0d1b2a] text-white py-6 px-4 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-5xl mx-auto">
                    <img
                        src={tempCompanyProfile.logo || "https://placehold.co/48x48/F0F0F0/000000?text=Logo"}
                        alt="Avatar"
                        className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-white object-cover"
                    />
                    {editingHeader ? (
                        <div className="flex flex-col w-full gap-2">
                            <label className="text-sm">Name</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempCompanyProfile.name}
                                onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, name: e.target.value })}
                            />
                            <label className="text-sm">Industry</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempCompanyProfile.industry}
                                onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, industry: e.target.value })}
                            />
                            <label className="text-sm">Location</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempCompanyProfile.location}
                                onChange={(e) => setTempCompanyProfile({ ...tempCompanyProfile, location: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="text-sm bg-white text-black px-3 py-1 rounded"
                                    onClick={() => {
                                        setCompanyProfile(tempCompanyProfile);
                                        setEditingHeader(false);
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className="text-sm text-white border border-white px-3 py-1 rounded"
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
                    <button
                        onClick={() => {
                            setEditingHeader(true);
                            setTempCompanyProfile(companyProfile);
                        }}
                        className="absolute top-8 sm:top-4 right-6 text-white"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
                {/* Desktop Edit Icon */}
                <button
                    onClick={() => {
                        setEditingHeader(true);
                        setTempCompanyProfile(companyProfile);
                    }}
                    className="hidden sm:block absolute top-4 right-6 text-white"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
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