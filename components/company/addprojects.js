"use client";
import { useState, Fragment, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import RootContext from "../config/rootcontext";

const AddProjectForm = ({ companyId, onClose, existingProjects = [], mutated }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        status: "ONGOING",
        projectType: "Apartments",
        bedrooms: "",
        devSize: "",
        totalUnits: "",
        possessionDate: "",
        reraNumber: "",
        developer: "",
        carpetArea: "",
        superArea: "",
        floorRange: "",
        totalFloors: "",
        unitVariants: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        googleMapLink: "",
        amenities: [],
        bookingAmount: "",
        paymentPlan: "",
        additionalCharges: "",
        description: "",
        highlights: "",
        images: []
    });

    const [amenityInput, setAmenityInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState({ value: "ONGOING", label: "ONGOING" });
    const [selectedProjectType, setSelectedProjectType] = useState({ value: "Apartments", label: "Apartments" });
    const [selectedPaymentPlan, setSelectedPaymentPlan] = useState({ value: "", label: "Select Payment Plan" });

    // Detect mobile device
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const { setRootContext } = useContext(RootContext);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            formData.images.forEach(img => {
                if (img.url && img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [formData.images]);

    // Options for dropdowns
    const projectStatusOptions = [
        { value: "NEW LAUNCH", label: "NEW LAUNCH" },
        { value: "ONGOING", label: "ONGOING" },
        { value: "UNDER CONSTRUCTION", label: "UNDER CONSTRUCTION" },
        { value: "READY TO MOVE", label: "READY TO MOVE" },
        { value: "COMPLETED", label: "COMPLETED" },
        { value: "SOLD OUT", label: "SOLD OUT" }
    ];

    const projectTypeOptions = [
        { value: "Apartments", label: "Apartments" },
        { value: "Luxury Apartments", label: "Luxury Apartments" },
        { value: "High-End Residential", label: "High-End Residential" },
        { value: "Ultra Luxury", label: "Ultra Luxury" },
        { value: "Commercial Office", label: "Commercial Office" },
        { value: "Retail Mall", label: "Retail Mall" },
        { value: "Luxury Residences", label: "Luxury Residences" },
        { value: "Villas", label: "Villas" },
        { value: "Plots", label: "Plots" },
        { value: "Farmhouse", label: "Farmhouse" },
        { value: "Penthouse", label: "Penthouse" },
        { value: "Studio Apartments", label: "Studio Apartments" },
        { value: "Service Apartments", label: "Service Apartments" },
        { value: "Gated Community", label: "Gated Community" }
    ];

    const paymentPlanOptions = [
        { value: "", label: "Select Payment Plan" },
        { value: "Construction Linked", label: "Construction Linked" },
        { value: "Time Linked", label: "Time Linked" },
        { value: "Down Payment Plan", label: "Down Payment Plan" },
        { value: "Flexi Payment Plan", label: "Flexi Payment Plan" },
        { value: "Subsidy Linked", label: "Subsidy Linked" }
    ];

    const commonAmenities = [
        "Swimming Pool", "Gym", "Club House", "Park", "Children's Play Area",
        "Security", "Power Backup", "Water Supply", "Car Parking", "Lift",
        "Garden", "Jogging Track", "Shopping Center", "Hospital", "School",
        "Community Hall", "Sports Facility", "WiFi", "CCTV", "Fire Safety"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProjectImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const valid = [];

        files.forEach(file => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                return;
            }

            valid.push({
                tempId: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                file,
                url: URL.createObjectURL(file),
                caption: file.name.replace(/\.[^/.]+$/, ""),
                isNew: true,
                isVisible: true
            });
        });

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...valid],
        }));
    };

    const removeImage = (img) => {
        // Revoke object URL to prevent memory leaks
        if (img.url && img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
        }

        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(i => i.tempId !== img.tempId && i.publicId !== img.publicId),
        }));
    };

    const updateCaption = (id, value) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map(img =>
                img.tempId === id || img.publicId === id
                    ? { ...img, caption: value }
                    : img
            )
        }));
    };

    const addAmenity = () => {
        if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenityInput.trim()]
            }));
            setAmenityInput("");
        }
    };

    const removeAmenity = (amenityToRemove) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
        }));
    };

    const addCommonAmenity = (amenity) => {
        if (!formData.amenities.includes(amenity)) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenity]
            }));
        }
    };

    const generateProjectId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `project-${timestamp}-${random}`;
    };

    const validateForm = () => {
        const requiredFields = ['title', 'location', 'price'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

        if (missingFields.length > 0) {
            return `Please fill in required fields: ${missingFields.join(', ')}`;
        }

        if (formData.images.length === 0) {
            return 'Please add at least one project image';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Validation Error",
                    message: validationError,
                },
            }));
            return;
        }

        setLoading(true);

        try {
            // Generate project ID first
            const projectId = generateProjectId();

            // Calculate the project index (position in the projects array)
            const projectIndex = existingProjects.length; // New project will be at the end

            // 1️⃣ Build basic project object with image metadata
            const newProject = {
                id: projectId,
                title: formData.title,
                location: formData.location,
                price: formData.price,
                status: selectedStatus.value,
                projectType: selectedProjectType.value,
                bedrooms: formData.bedrooms,
                devSize: formData.devSize,
                totalUnits: formData.totalUnits,
                possessionDate: formData.possessionDate,
                reraNumber: formData.reraNumber,
                developer: formData.developer,
                carpetArea: formData.carpetArea,
                superArea: formData.superArea,
                floorRange: formData.floorRange,
                totalFloors: formData.totalFloors,
                unitVariants: formData.unitVariants,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark,
                googleMapLink: formData.googleMapLink,
                amenities: formData.amenities,
                bookingAmount: formData.bookingAmount,
                paymentPlan: selectedPaymentPlan.value,
                additionalCharges: formData.additionalCharges,
                description: formData.description,
                highlights: formData.highlights,
                addedDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                isActive: true,

                // Include image metadata (without file objects)
                images: formData.images.map(img => ({
                    tempId: img.tempId,
                    caption: img.caption,
                    isVisible: img.isVisible,
                    isNew: true
                    // URL will be added by backend after Cloudinary upload
                }))
            };

            // 2️⃣ Prepare FormData
            const fd = new FormData();
            fd.append("id", companyId);

            // 🔥 CRITICAL FIX: Preserve existing projects and add the new one
            const updatedProjects = [...existingProjects, newProject];

            console.log('📊 Projects data:', {
                existingCount: existingProjects.length,
                newProject: newProject.title,
                updatedCount: updatedProjects.length,
                allProjects: updatedProjects.map(p => p.title)
            });

            fd.append("projects", JSON.stringify(updatedProjects));

            // 4️⃣ Append image files in the correct format for backend
            // Backend expects: projectGallery_{projectIndex}
            formData.images.forEach((img) => {
                if (img.file) {
                    fd.append(`projectGallery_${projectIndex}`, img.file);
                }
            });

            // 5️⃣ Send request
            const response = await fetch("/api/users", {
                method: "PUT",
                body: fd
            });

            const result = await response.json();

            // 6️⃣ Notify UI
            if (result.success) {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: "Project added successfully!"
                    }
                }));

                mutated();
                onClose();
                router.refresh();
            } else {
                console.error('Backend error:', result);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        position: "Failed",
                        message: result.error || "Failed to add project"
                    }
                }));
            }

        } catch (err) {
            console.error("Error adding project:", err);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Failed",
                    message: "Error adding project. Please try again."
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-auto">
                <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Real Estate Project</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl p-1"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Basic Information Section */}
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., DLF Cyber Residency"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., DLF Cyber City, Gurugram"
                                />
                            </div>
                        </div>

                        {/* Price, Status, Project Type - Stack on mobile, row on larger screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price *
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., ₹ 2.5 Cr onwards"
                                />
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                                            <span className="block truncate">{selectedStatus.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {projectStatusOptions.map((status) => (
                                                    <Listbox.Option
                                                        key={status.value}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={status}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    {status.label}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            {/* Project Type Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Type *
                                </label>
                                <Listbox value={selectedProjectType} onChange={setSelectedProjectType}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                                            <span className="block truncate">{selectedProjectType.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {projectTypeOptions.map((type) => (
                                                    <Listbox.Option
                                                        key={type.value}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={type}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    {type.label}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>

                        {/* Project Details Section - Responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms Configuration
                                </label>
                                <input
                                    type="text"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2, 3, 4 BHK"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Development Size
                                </label>
                                <input
                                    type="text"
                                    name="devSize"
                                    value={formData.devSize}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 15 Acres"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Units
                                </label>
                                <input
                                    type="text"
                                    name="totalUnits"
                                    value={formData.totalUnits}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1200 Units"
                                />
                            </div>
                        </div>

                        {/* Property Specifications - Stack on mobile, 2 columns on tablet, 4 on desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carpet Area
                                </label>
                                <input
                                    type="text"
                                    name="carpetArea"
                                    value={formData.carpetArea}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1200 sq.ft."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Super Area
                                </label>
                                <input
                                    type="text"
                                    name="superArea"
                                    value={formData.superArea}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1400 sq.ft."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Floor Range
                                </label>
                                <input
                                    type="text"
                                    name="floorRange"
                                    value={formData.floorRange}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2-15"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Floors
                                </label>
                                <input
                                    type="number"
                                    name="totalFloors"
                                    value={formData.totalFloors}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 20"
                                />
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    RERA Number
                                </label>
                                <input
                                    type="text"
                                    name="reraNumber"
                                    value={formData.reraNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., PR/12345/2019"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Possession Date
                                </label>
                                <input
                                    type="date"
                                    name="possessionDate"
                                    value={formData.possessionDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Developer
                                </label>
                                <input
                                    type="text"
                                    name="developer"
                                    value={formData.developer}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Developer name"
                                />
                            </div>
                        </div>

                        {/* Financial Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Amount
                                </label>
                                <input
                                    type="text"
                                    name="bookingAmount"
                                    value={formData.bookingAmount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., ₹ 5 Lakhs"
                                />
                            </div>

                            {/* Payment Plan Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Plan
                                </label>
                                <Listbox value={selectedPaymentPlan} onChange={setSelectedPaymentPlan}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                                            <span className="block truncate">{selectedPaymentPlan.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {paymentPlanOptions.map((plan) => (
                                                    <Listbox.Option
                                                        key={plan.value}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={plan}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    {plan.label}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Charges
                                </label>
                                <input
                                    type="text"
                                    name="additionalCharges"
                                    value={formData.additionalCharges}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., GST, Maintenance"
                                />
                            </div>
                        </div>

                        {/* Amenities Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                <input
                                    type="text"
                                    value={amenityInput}
                                    onChange={(e) => setAmenityInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                    className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add custom amenity"
                                />
                                <button
                                    type="button"
                                    onClick={addAmenity}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm sm:text-base whitespace-nowrap"
                                >
                                    Add Amenity
                                </button>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-2">Common Amenities:</p>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {commonAmenities.map(amenity => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => addCommonAmenity(amenity)}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm hover:bg-blue-200 whitespace-nowrap"
                                        >
                                            + {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {formData.amenities.map(amenity => (
                                    <span
                                        key={amenity}
                                        className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(amenity)}
                                            className="text-red-500 hover:text-red-700 text-xs"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* IMAGES UPLOAD SECTION */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1 text-sm sm:text-base">Project Images *</label>

                            <div
                                className="border-2 border-dashed border-gray-300 p-4 sm:p-5 text-center cursor-pointer rounded-lg hover:border-blue-500 transition-colors"
                                onClick={() => document.getElementById("projectImages").click()}
                            >
                                <p className="text-gray-500 text-sm sm:text-base">Click to upload images</p>
                                <p className="text-xs text-gray-400 mt-1">Max 5MB per image</p>
                            </div>

                            <input
                                type="file"
                                id="projectImages"
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleProjectImageUpload}
                            />

                            {/* PREVIEW GRID - Responsive grid */}
                            {formData.images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected images ({formData.images.length}):
                                    </p>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={img.tempId} className="relative border rounded-lg p-2 bg-gray-50">
                                                <img
                                                    src={img.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 sm:h-32 w-full object-cover rounded"
                                                />

                                                {/* REMOVE BUTTON */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(img)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                                                >
                                                    ✕
                                                </button>

                                                {/* CAPTION INPUT */}
                                                <input
                                                    type="text"
                                                    className="mt-2 w-full border rounded px-2 py-1 text-xs sm:text-sm"
                                                    value={img.caption || ""}
                                                    onChange={(e) => updateCaption(img.tempId, e.target.value)}
                                                    placeholder="Image Caption"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe the project features, amenities, etc."
                            />
                        </div>

                        {/* Highlights */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Highlights
                            </label>
                            <textarea
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Key selling points and features"
                            />
                        </div>

                        {/* Buttons - Stack on mobile, row on larger screens */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
                            >
                                {loading ? 'Adding Project...' : 'Add Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProjectForm;