'use client'
import Image from "next/image";
import Link from "next/link";
import { UserIcon, UsersIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import RootContext from "./config/rootcontext";
import { useContext } from "react";

export default function AboutPage() {
    const { rootContext } = useContext(RootContext);
    const isLoggedIn = rootContext.authenticated;
    const handleRedirect = (path) => {
        if (isLoggedIn) {
            router.push('/'); // Redirect to home if already logged in
        } else {
            router.push(path); // Otherwise go to signup/login
        }
    };
    return (
        <div className="w-screen">
            {/* Inner Banner */}
            <div
                className="relative flex items-start justify-end w-full h-[70vh] bg-no-repeat bg-right bg-cover px-6 sm:px-12"
                style={{
                    backgroundImage: "url('/about/aboutbgimage.jpeg')",
                    backgroundSize: "cover", // ensures full image visible
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Optional overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-l from-white/60 via-white/40 to-transparent"></div>

                {/* Top-right content */}
                <div className="relative text-center sm:text-right z-10">
                    <div className="w-auto h-24 mb-2">
                        <Image
                            src="/about/aboutus.png"
                            width={200}
                            height={10}
                            alt="About Us"
                            className="sm:ml-auto text-center"
                        />
                    </div>
                    <p className="text-xl leading-snug text-black">
                        Welcome to <span className="font-semibold">realestatejobs.co.in</span> —
                        Your Gateway to a Thriving Real Estate Career!
                    </p>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white py-10">
                <div className="w-[90%] mx-auto">
                    <p className="text-center text-lg leading-relaxed">
                        Welcome to <b>Real Estate Jobs, Inc</b> – India’s first and only dedicated job portal exclusively designed for the real estate industry.
                    </p>
                    <p className="text-center text-lg leading-relaxed">
                        We serve as the bridge between real estate professionals and leading employers, offering a specialized platform where opportunities meet expertise. Whether you are a job seeker aspiring to build a rewarding career in real estate or an employer looking to hire skilled professionals, our mission is to connect you with the right people, positions, and resources.
                    </p>
                    <p className="text-center text-lg leading-relaxed">
                        From sales and marketing roles to property management, construction, architecture, and interior design, Real Estate Jobs, Inc. provides a one-stop destination for everything related to real estate careers. With a user-friendly interface, verified listings, and industry insights, we help you navigate the property job market with confidence and precision.
                    </p>
                    <p className="text-center text-lg leading-relaxed">
                        Join us today and be part of India’s fastest-growing real estate career network – where every opportunity is built to last.
                    </p>
                </div>
            </div>

            {/* Who We Are */}
            <div className="bg-white py-10">
                <div className="w-[90%] mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-4">Who We Are</h2>
                    <p className="text-lg leading-relaxed">
                        At <b>Real Estate Jobs</b>, we understand that the real estate industry is unlike any other — dynamic, evolving, and deeply dependent on skilled professionals who can turn visions into value. From sales and marketing executives who drive business growth to technical experts, architects, engineers, and project managers who shape the skyline, we cater to the entire spectrum of real estate job opportunities across India.
                    </p>
                    <p className="text-lg leading-relaxed">
                        The platform is the brainchild of Vikrant Rathod — a Real Estate Expert, Technology Inventor & Product Builder, HR & Operations Leader, holder of 3 HR Tech Patents, Event Management Strategist, and Creative Designer who has been at the forefront of driving transformative ventures across multiple industries. With over 15 years of experience, Vikrant combines his deep understanding of human capital, business operations, and technology innovation to revolutionize how real estate professionals and companies connect.
                    </p>
                    <p className="text-lg leading-relaxed">
                        His vision for Real Estate Jobs was to create a one-stop, technology-driven destination that bridges the gap between talent and opportunity — offering a reliable, transparent, and insight-driven ecosystem tailored exclusively for the real estate sector.
                    </p>
                    <p className="text-lg leading-relaxed">
                        At Real Estate Jobs, our mission goes beyond listings. We aim to empower careers, strengthen organizations, and elevate the standards of recruitment in the real estate industry through innovation, data intelligence, and a people-first approach.
                    </p>
                </div>
            </div>

            {/* About RE Jobs with new design - Image Right, Inset, Red Dots */}
            <div className="relative w-full sm:w-[90%] mx-auto bg-cover bg-center bg-no-repeat py-12">
                <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
                    <h2 className="text-3xl font-bold mb-3 text-center">
                        About <span className="text-[#1c4676]">RE JOBS</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed">
                                Welcome to{" "}
                                <Link href="/" className="text-[#1c4676] underline inline">
                                    www.realestatejobs.co.in
                                </Link>{" "}
                                – India’s first and only dedicated job portal exclusively designed
                                for the real estate industry. Whether you are a job seeker looking to
                                build a career in real estate or an employer searching for top
                                talent, we are here to connect you with the right opportunities and
                                resources.
                            </p>
                            <p className="text-lg leading-relaxed">
                                At RE JOBS, we bridge the gap between real estate professionals and industry-leading employers, creating a trusted platform that unites opportunity, talent, and growth under one roof. Whether you are a job seeker aiming to build a strong and rewarding career in real estate, or an employer searching for qualified and verified candidates, RE JOBS connects you to the right people and positions with precision and purpose.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Our platform caters to every segment of the real estate ecosystem — from sales, marketing, brokerage, and property management to construction, architecture, project planning, finance, and facility operations. By focusing exclusively on the real estate sector, RE JOBS ensures that every listing, profile, and connection is highly relevant, industry-specific, and result-driven.
                            </p>
                        </div>

                        {/* Right Side */}
                        <div className="relative flex justify-center md:justify-end">
                            {/* Red Dots Background */}
                            <div
                                className="absolute -top-10 -right-10 w-[420px] h-[460px] rounded-lg -z-10"
                                style={{
                                    backgroundImage: 'radial-gradient(#fecaca 4px, transparent 4px)', // light red
                                    backgroundSize: '20px 20px',
                                }}
                            ></div>


                            {/* Image Box */}
                            <div className="relative w-[420px] h-[360px] bg-black rounded-lg shadow-lg flex items-center justify-center">
                                <img
                                    src="/about/banner.avif"
                                    alt="logo"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div
                className="relative bg-cover bg-center bg-no-repeat text-white py-12"
                style={{ backgroundImage: "url('/about/bgimage.jpeg')" }}
            >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-white/30"></div>

                <div className="relative w-[90%] text-gray-800 mx-auto space-y-16">
                    {/* Mission Section */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Mission Image - shown above on mobile */}
                        <div className="order-1 md:order-1 flex justify-center">
                            <Image
                                src="/about/mission.webp"
                                width={600}
                                height={500}
                                alt="mission"
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                            />
                        </div>

                        {/* Mission Content */}
                        <div className="order-2 md:order-2 flex flex-col items-start space-y-6">
                            <div className="w-full h-24 text-left sm:pl-6 sm:pl-14">
                                <Image
                                    src="/about/ourmission.png"
                                    width={250}
                                    height={10}
                                    alt="Our Mission"
                                    className="scale-110 sm:scale-125 md:scale-150 transition-transform duration-300"
                                />
                            </div>
                            <p className="text-base sm:text-lg leading-relaxed text-left">
                                To revolutionize recruitment in the real estate sector by providing a seamless and
                                efficient platform that connects skilled professionals with the right employers.
                                We aim to support the growth of real estate businesses by helping them build
                                high-performing teams while empowering job seekers to advance their careers.
                            </p>
                        </div>
                    </div>

                    {/* Vision Section */}
                    <div className="grid md:grid-cols-2 gap-8 items-center text-right">
                        {/* Vision Image - shown above on mobile */}
                        <div className="order-1 md:order-2 flex justify-center">
                            <Image
                                src="/about/vision.webp"
                                width={600}
                                height={500}
                                alt="vision"
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                            />
                        </div>

                        {/* Vision Content */}
                        <div className="order-2 md:order-1 flex flex-col items-end space-y-6">
                            <div className="w-full h-24 text-start sm:text-right pr-6 sm:pr-14">
                                <Image
                                    src="/about/ourvision.png"
                                    width={250}
                                    height={10}
                                    alt="Our Vision"
                                    className="sm:ml-auto scale-110 sm:scale-125 md:scale-150 transition-transform duration-300"
                                />
                            </div>
                            <p className="text-base sm:text-lg leading-relaxed text-start sm:text-right">
                                To be the go-to hub for real estate employment across India, driving innovation,
                                trust, and collaboration in the hiring process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Core Values */}
            <div className="bg-gray-100 py-12">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold text-center mb-6">Our Core Values</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: "Service Beyond Self", value: "We prioritize the needs of our community and clients above personal gain, striving to make a positive impact through compassion, dedication, and meaningful action." },
                            { title: "Sustainability", value: "We are committed to environmentally and socially responsible practices that ensure long-term well-being for future generations and the planet." },
                            { title: "Empowerment", value: "We believe in nurturing talent, encouraging innovation, and providing opportunities for individuals and teams to grow, lead, and succeed." },
                            { title: "Integrity", value: "We uphold the highest standards of honesty, ethics, and moral principles in all our decisions and interactions." },
                            { title: "Accountability", value: "We take full responsibility for our actions and outcomes, delivering on promises and owning both our successes and challenges.v" },
                            { title: "Transparency", value: "We foster trust through open communication, clarity in our processes, and a commitment to honesty in all that we do." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start bg-white p-4 rounded shadow">
                                <i className="fas fa-check-circle text-yellow-500 text-xl sm:text-2xl md:text-3xl mt-1"></i>
                                <div>
                                    <div className="flex gap-3 text-lg sm:text-xl md:text-2xl">
                                        <CheckCircleIcon width={28} height={28} className="text-yellow-500" aria-hidden="true" />
                                        <h5 className="font-semibold">{item.title}</h5>
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-md md:text-lg">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-12 px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">What We Offer</h2>
                <ul className="space-y-6">
                    <li>
                        <p className="mb-2 text-lg font-semibold">Exclusive Real Estate Focus</p>
                        <p className="text-gray-700">
                            At RE JOBS, we don’t just list jobs — we specialize in the real estate industry. Unlike generic job portals, our platform is built exclusively for real estate professionals, ensuring relevant opportunities for candidates and a precisely targeted talent pool for employers. Every listing, connection, and feature is designed to meet the unique needs of this dynamic sector.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Comprehensive Career Opportunities</p>
                        <p className="text-gray-700">
                            From entry-level associates to senior leadership positions, RE JOBS covers the full spectrum of real estate roles. Explore opportunities across sales, marketing, construction, architecture, HR, finance, legal, operations, and property management — all under one trusted platform.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Smart & User-Friendly Platform</p>
                        <p className="text-gray-700">
                            Our technology-driven, intuitive platform makes job searching and hiring effortless. With advanced filters, easy navigation, and seamless communication tools, RE JOBS ensures that both candidates and employers can connect quickly, efficiently, and transparently.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Insights, Resources & Industry Updates</p>
                        <p className="text-gray-700">
                            Stay informed and ahead of the curve with our curated industry insights, career guidance, and market trends. Whether you’re building your career or scaling your organization, RE JOBS provides expert advice, data-driven resources, and growth-oriented tools to support your journey in the real estate domain.
                        </p>
                    </li>
                </ul>
            </div>
            <div className="container mx-auto text-center py-10 px-2">
                <h2 className="font-bold text-xl md:text-2xl mb-6">
                    TO EXPLORE REAL ESTATE JOB PORTAL CREATE YOUR ACCOUNT BELOW
                </h2>

                <div className="flex flex-wrap justify-center gap-6 py-5 px-2">
                    {/* Applicants Card */}
                    <div className="w-full md:w-1/3 sm:h-32">
                        <div onClick={() => handleRedirect('/login')} className="bg-[#1c4676] text-white h-full rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center">
                            <UserIcon className="h-20 w-20 mt-2" />
                            <h5 className="text-lg font-semibold mb-5">Real Estate APPLICANTS</h5>
                        </div>
                    </div>

                    {/* Recruiters Card */}
                    <div className="w-full md:w-1/3 sm:h-32">
                        <div onClick={() => handleRedirect('/login')} className="bg-[#1c4676] text-white h-full rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center">
                            <UsersIcon className="h-20 w-20 mt-2" />
                            <h5 className="text-lg font-semibold mb-5">Real Estate RECRUITERS</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
