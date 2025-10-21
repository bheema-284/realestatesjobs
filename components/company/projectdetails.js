"use client";
import { useParams } from "next/navigation";
import Slider from "../common/slider";
import { companyData } from "../config/data";
import { createRef, useEffect, useRef, useState } from "react";
import Header from "./companyheader";

export default function ProjectDetailsPage() {
    const { id, title } = useParams();
    const [project, setProject] = useState({});
    const [activeTab, setActiveTab] = useState("About");
    const [loadedSections, setLoadedSections] = useState(["About"]);

    const company = companyData.find((c) => String(c.id) === String(id || 1));
    const sections = [
        "About",
        "Plans",
        "Amenities",
        "Specifications",
        "Location",
        "Gallery",
        "Walkthrough Video",
    ];

    // Refs for scrolling
    const sectionRefs = useRef({});
    const isManualNav = useRef(false); // 🚫 prevents scroll flicker after click

    sections.forEach((sec) => {
        sectionRefs.current[sec] = sectionRefs.current[sec] || createRef();
    });

    useEffect(() => {
        const data = company?.projects.find(
            (c) => String(c.title) === decodeURIComponent(String(title || ""))
        );
        if (data) setProject(data);
    }, [id, title, company]);

    // Track active section + load content when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isManualNav.current) return; // 🧠 ignore updates after manual nav

                entries.forEach((entry) => {
                    const section = entry.target.dataset.section;
                    if (entry.isIntersecting) {
                        setActiveTab(section);
                        setLoadedSections((prev) =>
                            prev.includes(section) ? prev : [...prev, section]
                        );
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach((sec) => {
            if (sectionRefs.current[sec]?.current) {
                observer.observe(sectionRefs.current[sec].current);
            }
        });

        return () => {
            sections.forEach((sec) => {
                if (sectionRefs.current[sec]?.current) {
                    observer.unobserve(sectionRefs.current[sec].current);
                }
            });
        };
    }, []);

    // ✅ Scroll to section + lock observer temporarily
    const handleTabClick = (sec) => {
        isManualNav.current = true; // 🚫 stop IntersectionObserver temporarily

        setLoadedSections((prev) =>
            prev.includes(sec) ? prev : [...prev, sec]
        );

        setActiveTab(sec); // immediately highlight tab

        setTimeout(() => {
            sectionRefs.current[sec]?.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);

        // 🔓 Re-enable scroll detection after animation
        setTimeout(() => {
            isManualNav.current = false;
        }, 1200);
    };

    return (
        <div className="mt-20">
            <Header company={company} />

            <div className="w-full sm:w-[80%] mx-auto">
                {/* Project Slider */}
                <Slider data={company?.projects || []} imageSize={"400px"} />

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 justify-center mt-8 sticky top-32 bg-white py-3 z-10 border-b">
                    {sections.map((sec) => (
                        <button
                            key={sec}
                            onClick={() => handleTabClick(sec)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                                activeTab === sec
                                    ? "bg-yellow-600 text-white border-yellow-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>

                {/* Sections */}
                <div className="space-y-20 mt-10">
                    {sections.map((sec) => (
                        <div
                            key={sec}
                            ref={sectionRefs.current[sec]}
                            data-section={sec}
                            className="scroll-mt-24 min-h-[50vh] flex flex-col justify-center"
                        >
                            <h2 className="text-2xl font-semibold mb-4">{sec}</h2>

                            {!loadedSections.includes(sec) ? (
                                <div className="text-gray-400 italic">Loading...</div>
                            ) : (
                                <>
                                    {sec === "About" && (
                                        <div>
                                            <p className="text-gray-700 mb-3">
                                                <strong>{project.title}</strong> is a premium{" "}
                                                {project.projectType?.toLowerCase()} project located at{" "}
                                                <strong>{project.location}</strong>.
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-600 space-y-1">
                                                <li>Status: {project.status}</li>
                                                <li>Price: {project.price}</li>
                                                <li>Configuration: {project.bedrooms}</li>
                                                <li>Development Size: {project.devSize}</li>
                                                <li>Total Units: {project.totalUnits}</li>
                                            </ul>
                                        </div>
                                    )}
                                    {sec === "Plans" && (
                                        <p className="text-gray-600">Floor plans and layouts go here.</p>
                                    )}
                                    {sec === "Amenities" && (
                                        <p className="text-gray-600">Amenities list goes here.</p>
                                    )}
                                    {sec === "Specifications" && (
                                        <p className="text-gray-600">Project specifications go here.</p>
                                    )}
                                    {sec === "Location" && (
                                        <p className="text-gray-600">
                                            Located at {project.location}, well connected to major hubs.
                                        </p>
                                    )}
                                    {sec === "Gallery" && (
                                        <p className="text-gray-600">Image gallery goes here.</p>
                                    )}
                                    {sec === "Walkthrough Video" && (
                                        <p className="text-gray-600">Video embed goes here.</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
