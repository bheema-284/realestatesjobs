"use client";
import { useParams } from "next/navigation";
import Slider from "../common/slider";
import { createRef, useEffect, useRef, useState } from "react";
import Header from "./companyheader";
import { useSWRFetch } from "../config/useswrfetch";

export default function ProjectDetailsPage() {
    const { id, title } = useParams();
    const [project, setProject] = useState({});
    const [activeTab, setActiveTab] = useState("About");
    const [loadedSections, setLoadedSections] = useState(["About"]);
    const [company, setCompany] = useState({});

    // Only fetch data if we have a companyID and we're on the client
    const { data, error, isLoading } = useSWRFetch(`/api/companies`);

    useEffect(() => {
        if (data) {
            // Handle both single object and array cases
            if (Array.isArray(data)) {
                // If data is an array, use the first object
                if (data.length > 0) {
                    setCompany(data[0]);
                } else {
                    // Handle empty array case
                    setCompany({});
                }
            } else {
                // If data is a single object, use it directly
                setCompany(data);
            }
        } else {
            // Handle no data case
            setCompany({});
        }
    }, [id, data]);

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
    const observerRef = useRef(null);

    sections.forEach((sec) => {
        sectionRefs.current[sec] = sectionRefs.current[sec] || createRef();
    });

    useEffect(() => {
        const data = company?.projects?.find(
            (c) => String(c.id) === decodeURIComponent(String(title || ""))
        );
        if (data) setProject(data);
    }, [id, title, company]);

    // Track active section + load content when visible
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
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
            {
                threshold: 0.4,
                rootMargin: '-100px 0px -100px 0px' // Adjust this to control when section becomes active
            }
        );

        sections.forEach((sec) => {
            if (sectionRefs.current[sec]?.current) {
                observerRef.current.observe(sectionRefs.current[sec].current);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [sections]);

    // ✅ Scroll to section + lock observer temporarily
    const handleTabClick = (sec) => {
        isManualNav.current = true; // 🚫 stop IntersectionObserver temporarily

        // Immediately set the active tab and load the section
        setActiveTab(sec);
        setLoadedSections((prev) =>
            prev.includes(sec) ? prev : [...prev, sec]
        );

        // Disconnect observer temporarily
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Scroll to section
        setTimeout(() => {
            const element = sectionRefs.current[sec]?.current;
            if (element) {
                const yOffset = -80; // Adjust for header height
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: "smooth"
                });
            }
        }, 100);

        // 🔓 Re-enable scroll detection after animation
        setTimeout(() => {
            isManualNav.current = false;

            // Reconnect observer
            if (observerRef.current) {
                sections.forEach((section) => {
                    if (sectionRefs.current[section]?.current) {
                        observerRef.current.observe(sectionRefs.current[section].current);
                    }
                });
            }
        }, 1500);
    };

    // Enhanced section renderers
    const renderAboutSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Project Overview</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                    <strong>{project.title}</strong> is a premium {project.projectType?.toLowerCase()} project
                    located at <strong>{project.location}</strong>. {project.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{project.status}</div>
                    <div className="text-sm text-gray-600">Project Status</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">₹{project.price} Cr</div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{project.totalUnits}</div>
                    <div className="text-sm text-gray-600">Total Units</div>
                </div>
            </div>

            {project.highlights && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">Project Highlights</h4>
                    <p className="text-yellow-700">{project.highlights}</p>
                </div>
            )}
        </div>
    );

    const renderPlansSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-3">Unit Configuration</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bedrooms:</span>
                            <span className="font-semibold">{project.bedrooms}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Carpet Area:</span>
                            <span className="font-semibold">{project.carpetArea} sq.ft.</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Super Area:</span>
                            <span className="font-semibold">{project.superArea} sq.ft.</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-3">Building Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Floors:</span>
                            <span className="font-semibold">{project.totalFloors}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Floor Range:</span>
                            <span className="font-semibold">{project.floorRange}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Development Size:</span>
                            <span className="font-semibold">{project.devSize} acres</span>
                        </div>
                    </div>
                </div>
            </div>

            {project.unitVariants && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-3">Available Unit Variants</h4>
                    <p className="text-blue-700">{project.unitVariants}</p>
                </div>
            )}
        </div>
    );

    const renderAmenitiesSection = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Premium Amenities</h3>
            {project.amenities && project.amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {project.amenities.map((amenity, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-blue-600 font-bold text-lg">✓</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{amenity}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Amenities information will be updated soon.</p>
            )}
        </div>
    );

    const renderSpecificationsSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Construction Details</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Developer:</span>
                                <span className="font-semibold">{project.developer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">RERA Number:</span>
                                <span className="font-semibold">{project.reraNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Possession Date:</span>
                                <span className="font-semibold">
                                    {project.possessionDate ? new Date(project.possessionDate).toLocaleDateString() : 'To be announced'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booking Amount:</span>
                                <span className="font-semibold">₹{project.bookingAmount} Lakhs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Plan:</span>
                                <span className="font-semibold">{project.paymentPlan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Additional Charges:</span>
                                <span className="font-semibold">₹{project.additionalCharges}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLocationSection = () => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Project Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Address Details</h4>
                            <p className="text-gray-600"><strong>Location:</strong> {project.location}</p>
                            {project.landmark && <p className="text-gray-600"><strong>Landmark:</strong> {project.landmark}</p>}
                            {project.city && <p className="text-gray-600"><strong>City:</strong> {project.city}</p>}
                            {project.state && <p className="text-gray-600"><strong>State:</strong> {project.state}</p>}
                            {project.pincode && <p className="text-gray-600"><strong>Pincode:</strong> {project.pincode}</p>}
                        </div>

                        {project.googleMapLink && (
                            <a
                                href={project.googleMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View on Google Maps
                            </a>
                        )}
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                            {project.googleMapLink
                                ? "Interactive map would be displayed here"
                                : "Location map will be available soon"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Connectivity Highlights</h4>
                <p className="text-green-700">
                    Well-connected to major transportation hubs, schools, hospitals, and shopping centers.
                    Easy access to public transport and major highways.
                </p>
            </div>
        </div>
    );

    const renderGallerySection = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Project Gallery</h3>
            {project.images && project.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.images.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200">
                            <img
                                src={image.url || "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"}
                                alt={`${project.title} - Image ${index + 1}`}
                                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    View
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 italic">Project images will be updated soon.</p>
                </div>
            )}
        </div>
    );

    const renderWalkthroughVideoSection = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Virtual Walkthrough</h3>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 text-2xl">🎥</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Virtual Tour Coming Soon
                    </h4>
                    <p className="text-gray-600 mb-4">
                        Experience {project.title} through an immersive virtual walkthrough.
                        Get a realistic feel of the spaces and amenities from the comfort of your home.
                    </p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Notify Me When Available
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-20">
            <Header company={company} />

            <div className="w-full sm:w-[80%] mx-auto">
                {/* Project Slider */}
                {project.images && project.images.length > 0 && (
                    <Slider data={project.images.map(item => ({ image: item.url }))} imageSize={"400px"} />
                )}

                {/* Project Header */}
                <div className="text-center mt-8 mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {project.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">{project.location}</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {project.projectType}
                        </span>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {project.status}
                        </span>
                        <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            Starting at ₹{project.price} Cr
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 justify-center mt-8 sticky top-32 bg-white py-3 z-10 border-b">
                    {sections.map((sec) => (
                        <button
                            key={sec}
                            onClick={() => handleTabClick(sec)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${activeTab === sec
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
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800 pb-2">
                                {sec}
                            </h2>

                            {!loadedSections.includes(sec) ? (
                                <div className="text-gray-400 italic text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    {sec === "About" && renderAboutSection()}
                                    {sec === "Plans" && renderPlansSection()}
                                    {sec === "Amenities" && renderAmenitiesSection()}
                                    {sec === "Specifications" && renderSpecificationsSection()}
                                    {sec === "Location" && renderLocationSection()}
                                    {sec === "Gallery" && renderGallerySection()}
                                    {sec === "Walkthrough Video" && renderWalkthroughVideoSection()}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}