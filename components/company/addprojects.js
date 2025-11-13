"use client";
import { useState, Fragment, useContext } from "react";
import { useRouter } from "next/navigation";
import { Combobox, Dialog, Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import RootContext from "../config/rootcontext";
import { Mutated } from "../config/useswrfetch";

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
        highlights: ""
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [amenityInput, setAmenityInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState({ value: "ONGOING", label: "ONGOING" });
    const [selectedProjectType, setSelectedProjectType] = useState({ value: "Apartments", label: "Apartments" });
    const [selectedPaymentPlan, setSelectedPaymentPlan] = useState({ value: "", label: "Select Payment Plan" });
    const { setRootContext } = useContext(RootContext);
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return false;
            }
            return true;
        });
        setImageFiles(prev => [...prev, ...validFiles]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the complete project data
            const projectData = {
                id: generateProjectId(),
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
                images: [] // Will be populated after upload
            };

            // Create FormData for multipart upload
            const submitData = new FormData();
            submitData.append("id", companyId);

            // Create updated projects array
            const updatedProjects = [...existingProjects, projectData];
            submitData.append("projects", JSON.stringify(updatedProjects));

            // Append image files
            imageFiles.forEach((file, index) => {
                submitData.append(`projectImage_${updatedProjects.length - 1}_${index}`, file);
            });

            // Call the PUT endpoint to update user projects
            const response = await fetch('/api/users', {
                method: 'PUT',
                body: submitData
            });

            const result = await response.json();

            if (result.success) {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: 'Project added successfully!',
                    },
                }));
                mutated()
                onClose();
                router.refresh();
            } else {
                  setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Faied",
                    message: result.error || 'Failed to add project',
                },
            }));
            }
        } catch (error) {
            console.error('Error adding project:', error);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Faied",
                    message: 'Error adding project. Please try again.',
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Real Estate Project</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., DLF Cyber City, Gurugram"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <span className="block truncate">{selectedStatus.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <span className="block truncate">{selectedProjectType.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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

                        {/* Project Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms Configuration
                                </label>
                                <input
                                    type="text"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1200 Units"
                                />
                            </div>
                        </div>

                        {/* Property Specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carpet Area
                                </label>
                                <input
                                    type="text"
                                    name="carpetArea"
                                    value={formData.carpetArea}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 20"
                                />
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    RERA Number
                                </label>
                                <input
                                    type="text"
                                    name="reraNumber"
                                    value={formData.reraNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Developer name"
                                />
                            </div>
                        </div>

                        {/* Financial Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Amount
                                </label>
                                <input
                                    type="text"
                                    name="bookingAmount"
                                    value={formData.bookingAmount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <span className="block truncate">{selectedPaymentPlan.label}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., GST, Maintenance"
                                />
                            </div>
                        </div>

                        {/* Amenities Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={amenityInput}
                                    onChange={(e) => setAmenityInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add custom amenity"
                                />
                                <button
                                    type="button"
                                    onClick={addAmenity}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-2">Common Amenities:</p>
                                <div className="flex flex-wrap gap-2">
                                    {commonAmenities.map(amenity => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => addCommonAmenity(amenity)}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                                        >
                                            + {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map(amenity => (
                                    <span
                                        key={amenity}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(amenity)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Project Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You can select multiple images. Recommended: 16:9 ratio, max 5MB each
                            </p>

                            {/* Preview selected images */}
                            {imageFiles.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {imageFiles.map((file, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Key selling points and features"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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