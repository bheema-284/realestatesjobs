import React from 'react';
// Dummy data for Premium Services
const premiumServices = [
    {
        id: 1,
        title: "Exclusive Project Portfolio Access",
        description: "Gain VIP access to new project launches, pre-sale inventories, and high-value, off-market investment opportunities before they are released to the general public.",
        icon: "🗝️",
        features: ["Early Bird Pricing", "Priority Booking Slot", "Dedicated Relationship Manager"],
        color: "bg-indigo-50 border-indigo-200",
        text: "text-indigo-800",
    },
    {
        id: 2,
        title: "Personalized Financial Structuring",
        description: "Tailored advisory services to optimize your capital structure, including customized loan arrangements, tax-efficient investment vehicles, and wealth management strategies.",
        icon: "💰",
        features: ["Tax Optimization Review", "Low-Interest Debt Sourcing", "REIT Investment Analysis"],
        color: "bg-green-50 border-green-200",
        text: "text-green-800",
    },
    {
        id: 3,
        title: "Due Diligence & Legal Vetting (360°)",
        description: "Comprehensive legal and technical vetting of properties, ensuring clear titles, RERA compliance, and structural integrity, managed by a dedicated in-house legal team.",
        icon: "⚖️",
        features: ["Full Legal Clearance Report", "Structural Audit & Certification", "10-Year Litigation History Check"],
        color: "bg-red-50 border-red-200",
        text: "text-red-800",
    },
    {
        id: 4,
        title: "Bespoke Interior & Property Management",
        description: "End-to-end property solutions, from custom interior design and furnishing to post-handover maintenance, rental management, and resale facilitation.",
        icon: "🏡",
        features: ["Turnkey Interior Solutions", "Guaranteed Rental Yields", "Quarterly Maintenance Service"],
        color: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
    },
];

export default function CompanyServices() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <header className="bg-gray-800 text-white py-12 px-6 sm:px-10">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight">
                        Our <span className="text-amber-400">Premium Services</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-300">
                        Elevate your real estate journey with exclusive tools and dedicated expert support.
                    </p>
                </div>
            </header>

            {/* Services Grid */}
            <section className="py-16 px-6 sm:px-10 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10">
                    {premiumServices.map((service) => (
                        <div
                            key={service.id}
                            className={`p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl ${service.color} border-2`}
                        >
                            <div className={`text-4xl mb-4 ${service.text}`}>
                                {service.icon}
                            </div>
                            <h2 className={`text-2xl font-bold mb-3 ${service.text}`}>
                                {service.title}
                            </h2>
                            <p className="text-gray-600 mb-5">{service.description}</p>

                            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-t pt-3 mt-4">
                                Exclusive Benefits:
                            </h3>
                            <ul className="space-y-1 list-disc list-inside text-sm text-gray-600">
                                {service.features.map((feature, index) => (
                                    <li key={index} className="font-medium text-gray-700">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action Banner (Conceptual use of the image) */}
            <section
                className="bg-cover bg-center bg-gray-900 py-20 mt-10"
            // In a real application, you would use a background image like this:
            // style={{ backgroundImage: `url(${REBZ_FOOTER_IMAGE})` }} 
            >
                <div className="max-w-4xl mx-auto text-center p-6 bg-black bg-opacity-40 rounded-lg">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Invest with Confidence?
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Connect with a dedicated expert to discuss your premium requirements.
                    </p>
                    <button className="px-8 py-3 bg-amber-400 text-gray-900 font-bold rounded-full text-lg shadow-xl hover:bg-amber-500 transition duration-300 transform hover:scale-105">
                        Request a Consultation
                    </button>
                </div>
            </section>
        </div>
    );
}