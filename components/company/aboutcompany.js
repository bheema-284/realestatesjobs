// components/AboutCompany.js
import Image from "next/image";
import Link from "next/link";

export default function AboutCompany({ companyProfile }) {
    if (!companyProfile) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">Company not found</h2>
                <Link href="/" className="text-blue-600 underline">
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="p-10 max-w-6xl mx-auto">
            {/* Company Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white shadow-lg rounded-2xl p-6">
                <Image
                    src={companyProfile.logo}
                    alt={companyProfile.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-contain"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{companyProfile.name}</h1>
                    <p className="text-gray-600">{companyProfile.industry}</p>
                    <p className="mt-2 text-gray-700">
                        <span className="font-semibold">Location:</span> {companyProfile.location}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Established:</span>{" "}
                        {companyProfile.established}
                    </p>
                    <a
                        href={companyProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Visit Website
                    </a>
                </div>
            </div>
        </div>
    );
}
