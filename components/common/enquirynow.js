"use client";
import Image from "next/image";
import { useState } from "react";

export default function EnquiryForm({ drawerOpen, setDrawerOpen }) {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        whatsapp: false,
        email: "",
        projectType: "",
        newsletter: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="h-screen overflow-y-scroll flex items-center justify-center bg-white">
            <div className="w-full max-w-md border border-gray-200 shadow-sm p-6 rounded-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold tracking-wide text-gray-900">
                        ENQUIRE NOW
                    </h2>
                    <button onClick={() => setDrawerOpen({
                        open: false,
                        image: ""
                    })} className="text-gray-600 hover:text-black text-xl font-light">
                        ✕
                    </button>
                </div>
                {drawerOpen.image !== "" && <Image
                    src={
                        drawerOpen.image ||
                        "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"
                    }
                    alt={"image"}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                />}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800">
                            Your Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-b border-gray-400 focus:border-yellow-700 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800">
                            Mobile<span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center border-b border-gray-400">
                            <select
                                className="outline-none bg-transparent text-gray-600 text-sm pr-2"
                                defaultValue="+91"
                            >
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                            </select>
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Your Mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="flex-1 py-2 outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* WhatsApp checkbox */}
                        <label className="flex items-start mt-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="whatsapp"
                                checked={formData.whatsapp}
                                onChange={handleChange}
                                className="w-4 h-4 mt-1 border-yellow-700 rounded-sm accent-yellow-700"
                            />
                            <span className="ml-2">
                                Do you have WhatsApp activated on this number?
                            </span>
                        </label>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800">
                            Your Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-b border-gray-400 focus:border-yellow-700 outline-none py-2 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Project Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800">
                            Projects Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full border-b border-gray-400 focus:border-yellow-700 outline-none py-2 bg-transparent text-gray-700"
                        >
                            <option value="">Select Project Type</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Industrial">Industrial</option>
                        </select>
                    </div>

                    {/* Newsletter */}
                    <label className="flex items-start text-sm text-gray-700">
                        <input
                            type="checkbox"
                            name="newsletter"
                            checked={formData.newsletter}
                            onChange={handleChange}
                            className="w-4 h-4 mt-1 border-yellow-700 rounded-sm accent-yellow-700"
                        />
                        <span className="ml-2">
                            Yes, I want to stay informed and receive newsletter and marketing
                            updates.
                        </span>
                    </label>

                    {/* Terms */}
                    <p className="text-xs text-gray-700">
                        By submitting this form you agree to the{" "}
                        <span className="font-semibold text-yellow-800">
                            Terms and Conditions
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-yellow-800">Privacy Policy</span>.
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full border border-yellow-800 text-yellow-800 py-2 font-semibold rounded-md hover:bg-yellow-800 hover:text-white transition-all duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
