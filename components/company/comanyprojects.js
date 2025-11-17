"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    BuildingOfficeIcon,
    Squares2X2Icon,
    HomeModernIcon,
    BuildingLibraryIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import EnquiryForm from "../common/enquirynow";
import Slider from "../common/slider";

export default function ProjectsPage({ profile }) {

    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState({
        open: false,
        image: ""
    });

    if (!profile?.projects?.length) {
        return (
            <div className="py-12 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    No projects available
                </h2>
            </div>
        );
    }

    const projectDetails = (p) => {
        const slug = encodeURIComponent(p.id);
        router.push(`/companies/${profile._id}/${slug}`);
    };

    return (
        <div className="relative w-full mx-auto">
            {/* ✅ Floating Enquiry Button */}
            <button
                onClick={() => setDrawerOpen({
                    open: true,
                    image: ""
                })}
                className="fixed top-1/2 right-0 z-50 transform -translate-y-1/2 bg-yellow-800 text-white px-3 py-2 rotate-180 [writing-mode:vertical-rl] tracking-wider font-medium hover:bg-yellow-700 transition-all duration-300"
            >
                ENQUIRE NOW
            </button>

            {/* ✅ Enquiry Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${drawerOpen.open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <EnquiryForm drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            </div>

            {/* ✅ Overlay (click outside to close) */}
            {drawerOpen.open && (
                <div
                    onClick={() => setDrawerOpen({
                        open: false,
                        image: ""
                    })}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                />
            )}

            {/* ✅ Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
                {profile.projects.map((p, index) => (
                    <div
                        key={index}
                        className="group relative cursor-pointer bg-white border border-gray-300 overflow-hidden hover:shadow-xl transition flex flex-col"
                    >
                        {/* Image */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => projectDetails(p)}
                        >
                            {p.images && p.images.length > 0 && (
                                <Slider data={p.images.map(item => ({ image: item.url }))} imageSize={"400px"} />
                            )}
                            <span className="absolute top-3 right-3 bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded">
                                {p.status}
                            </span>
                        </div>

                        {/* Content */}
                        <div
                            className="p-3 flex-1 cursor-pointer"
                            onClick={() => projectDetails(p)}
                        >
                            <h3 className="text-md text-red-700 mb-1">{p.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{p.location}</p>
                            <p className="text-xs font-semibold text-red-700 mb-2">
                                {p.price}
                            </p>
                            <div className="border-t border-red-200" />

                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-8 h-8 text-yellow-300" />
                                    <div>
                                        <p className="text-gray-500">Project Type</p>
                                        <p className="font-semibold text-pink-800">{p.projectType}</p>
                                    </div>
                                </div>

                                {p.devSize && (
                                    <div className="flex items-center gap-2">
                                        <Squares2X2Icon className="w-8 h-8 text-red-300" />
                                        <div>
                                            <p className="text-gray-500">Development Size</p>
                                            <p className="font-semibold text-pink-800">{p.devSize}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <HomeModernIcon className="w-8 h-8 text-purple-300" />
                                    <div>
                                        <p className="text-gray-500">Bedrooms</p>
                                        <p className="font-semibold text-pink-800">{p.bedrooms}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BuildingLibraryIcon className="w-8 h-8 text-pink-300" />
                                    <div>
                                        <p className="text-gray-500">Total Units</p>
                                        <p className="font-semibold text-pink-800">{p.totalUnits}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Buttons */}
                        <div
                            className={`relative w-full border-t border-gray-200 bg-gray-50 
                                md:absolute md:bottom-0 md:left-0 
                                md:translate-y-full md:group-hover:translate-y-0 
                                md:transition-transform md:duration-300
                            `}
                        >
                            <div className="flex justify-between gap-2 p-2">
                                <button
                                    onClick={() => setDrawerOpen({
                                        open: true,
                                        image: p.images
                                    })}
                                    className="flex items-center gap-1 border border-purple-700 text-purple-900 py-1 px-3 text-[9px] bg-purple-100 whitespace-nowrap"
                                >
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" /> Enquire Now
                                </button>
                                <button className="flex items-center gap-1 border border-purple-700 text-purple-900 py-1 px-3 text-[9px] bg-purple-100 whitespace-nowrap">
                                    <CalendarDaysIcon className="w-4 h-4" /> Book Site Visit
                                </button>
                                <button className="flex items-center gap-1 border border-purple-700 text-purple-900 py-1 px-3 text-[9px] bg-purple-100 flex-shrink-0">
                                    <PhoneIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}