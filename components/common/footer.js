'use client'; // <-- MUST be a client component to use useRouter and onClick handlers

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // <-- 1. Import useRouter

const Footer = () => {
    const router = useRouter(); // <-- 2. Initialize router

    const jobCategories = [
        'Channel Partners',
        'HR & Operations',
        'Real Estate Sales',
        'Tele Caller',
        'Digital Marketing',
        'Web Development',
        'CRM Executive',
        'Accounts & Auditing',
        'Legal',
        'Architects',
    ];

    const createSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleCategoryClick = (title) => {
        const slug = createSlug(title);
        // Navigate to the /jobs page and set the category query parameter
        router.push(`/jobs?category=${slug}`);
    };

    return (
        <div
            className="text-white py-12 px-6 w-full z-50"
            style={{
                backgroundColor: "#1c4676",
            }}
        >
            <div className="w-full sm:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 z-50">
                {/* Logo + About */}
                <div className="col-span-1 md:col-span-1">
                    <Image
                        src="/logo.webp"
                        alt="logo"
                        width={300}
                        height={100}
                        priority
                    />
                    <div className="my-5">
                        <p className="text-sm sm:text-md md:text-lg font-light">
                            Welcome to Real Estate Jobs, Inc - India's first and only dedicated job portal exclusively designed for the real estate industry. Whether you are a job seeker looking to build a career in real estate or an employer searching for top talent, we are here to connect you with the right opportunities and resources.
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1">
                    <h4 className="text-lg sm:text-xl font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm sm:text-md md:text-lg font-light w-full sm:w-20">
                        <li><Link href="/" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Home</Link></li>
                        <li><Link href="/jobs" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Job Listings</Link></li>
                        <li><Link href="/companies" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Companies</Link></li>
                        <li><Link href="/about" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">About Us</Link></li>
                        <li><Link href="/login" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Login</Link></li>
                    </ul>
                </div>

                {/* Jobs by Category */}
                <div className="col-span-1">
                    <h4 className="text-lg sm:text-xl font-bold mb-4">Jobs by Category</h4>
                    <ul className="space-y-2 text-sm sm:text-md md:text-lg font-light w-full sm:w-34">
                        {/* Iterate over jobCategories and use the onClick handler */}
                        {jobCategories.map((category) => (
                            <li key={category}>
                                <button
                                    onClick={() => handleCategoryClick(category)}
                                    className="text-sm sm:text-md md:text-lg font-light p-0 border-none bg-transparent text-left w-full hover:text-orange-400 transition-colors duration-300 hover:font-semibold"
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="col-span-1 mb-4">
                    <h4 className="text-lg sm:text-xl font-bold mb-4">Contact Us</h4>
                    <address className="not-italic text-sm sm:text-md md:text-lg font-light space-y-2">
                        <p>
                            <strong>Corporate Office:</strong><br />
                            2nd Floor, YS RAO Towers, Madhapur Rd, Sri Rama Colony, Jubilee Hills, Hyderabad, Telangana 500033
                        </p>
                    </address>
                </div>
            </div>

            {/* Bottom Section */}
            <div
                className="p-5 my-8 w-full sm:w-[85%] mx-auto rounded-lg text-center text-sm sm:text-md md:text-lg font-light flex flex-col md:flex-row justify-between items-center"
                style={{ backgroundColor: 'rgba(99, 99, 144, 0.5)' }}
            >
                <p className="mb-4 md:mb-0">&copy; 2025 Real Estate Jobs. All rights reserved.</p>
                <div className="flex space-x-4 cursor-pointer">
                    <FaFacebook className="hover:text-amber-400 transition-colors duration-300" />
                    <FaTwitter className="hover:text-amber-400 transition-colors duration-300" />
                    <FaInstagram className="hover:text-amber-400 transition-colors duration-300" />
                    <FaLinkedin className="hover:text-amber-400 transition-colors duration-300" />
                </div>
            </div>
        </div>)
}

export default Footer;