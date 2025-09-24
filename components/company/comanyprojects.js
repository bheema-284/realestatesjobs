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
} from "@heroicons/react/24/solid";

export default function ProjectsPage({ companyProfile }) {
    const router = useRouter();
    if (!companyProfile?.projects?.length) {
        return (
            <div className="py-12 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    No projects available
                </h2>
            </div>
        );
    }

    const projectDetails = (p) => {
        const slug = encodeURIComponent(p.title);
        router.push(`/companies/${companyProfile.id}/${slug}`);
    };

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {companyProfile.projects.map((p) => (
                    <div
                        key={p.id}
                        className="group relative cursor-pointer bg-white border border-gray-300 overflow-hidden hover:shadow-xl transition flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative cursor-pointer" onClick={() => projectDetails(p)}>
                            <Image
                                src={p.image}
                                alt={p.title}
                                width={600}
                                height={400}
                                className="w-full h-56 object-cover"
                            />
                            <span className="absolute top-3 right-3 bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded">
                                {p.status}
                            </span>
                            <div className="absolute bottom-3 left-3 bg-yellow-600 text-white text-xs font-semibold">
                                <Image
                                    src={companyProfile.logo}
                                    alt={companyProfile.name}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className="p-3 flex-1 cursor-pointer"
                            onClick={() => projectDetails(p)}
                        >
                            <h3 className="text-md text-yellow-700 mb-1">{p.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{p.location}</p>
                            <p className="text-xs font-semibold text-yellow-700 mb-2">
                                {p.price}
                            </p>
                            <div className="border-t border-yellow-200" />

                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-8 h-8 text-gray-300" />
                                    <div>
                                        <p className="text-gray-500">Project Type</p>
                                        <p className="font-semibold text-yellow-800">{p.projectType}</p>
                                    </div>
                                </div>

                                {p.devSize && (
                                    <div className="flex items-center gap-2">
                                        <Squares2X2Icon className="w-8 h-8 text-gray-300" />
                                        <div>
                                            <p className="text-gray-500">Development Size</p>
                                            <p className="font-semibold text-yellow-800">{p.devSize}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <HomeModernIcon className="w-8 h-8 text-gray-300" />
                                    <div>
                                        <p className="text-gray-500">Bedrooms</p>
                                        <p className="font-semibold text-yellow-800">{p.bedrooms}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BuildingLibraryIcon className="w-8 h-8 text-gray-300" />
                                    <div>
                                        <p className="text-gray-500">Total Units</p>
                                        <p className="font-semibold text-yellow-800">{p.totalUnits}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons appear on hover */}
                        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex justify-between gap-2 p-2 border-t border-gray-200 bg-gray-50">
                                <button className="flex items-center gap-1 border border-yellow-700 text-yellow-900 py-1 px-3 text-[9px] bg-orange-100">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" /> Enquire Now
                                </button>
                                <button className="flex items-center gap-1 border border-yellow-700 text-yellow-900 py-1 px-3 text-[9px] bg-orange-100">
                                    <CalendarDaysIcon className="w-4 h-4" /> Book Site Visit
                                </button>
                                <button className="flex items-center gap-1 border border-yellow-700 text-yellow-900 py-1 px-3 text-[9px] bg-orange-100">
                                    <PhoneIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
