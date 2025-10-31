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
                <div className="relative text-right z-10">
                    <div className="w-auto h-24 mb-2">
                        <Image
                            src="/about/aboutus.png"
                            width={200}
                            height={10}
                            alt="About Us"
                            className="ml-auto"
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
                        Welcome to <b>Real Estate Jobs, Inc</b> – India’s first and only dedicated job portal exclusively designed
                        for the real estate industry.Whether you are a job seeker looking to build a career in real estate or an employer searching for top talent, we are here to connect you with the right opportunities and resources
                    </p>
                </div>
            </div>

            {/* Who We Are */}
            <div className="bg-white py-10">
                <div className="w-[90%] mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-4">Who We Are</h2>
                    <p className="text-lg leading-relaxed">
                        At <b>Real Estate Jobs</b>, we understand the specialized needs of the real estate sector.
                        From sales and marketing roles to technical and managerial positions, we cater to the entire spectrum of real estate job opportunities. Our platform is the brainchild of <b>Vikrant Rathod</b>, a recruitment expert with over 15 years of experience, who envisioned a one-stop destination for matching real estate professionals with companies.
                    </p>
                </div>
            </div>

            {/* About RE Jobs with new design - Image Right, Inset, Red Dots */}
            <div className="relative w-full sm:w-[90%] mx-auto bg-cover bg-center bg-no-repeat py-12">
                <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold mb-3">
                                About <span className="text-[#1c4676]">RE JOBS</span>
                            </h2>
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

                <div className="relative w-[90%] text-gray-800 mx-auto space-y-10">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Mission Image */}
                        <Image
                            src="/about/mission.webp"
                            width={600}
                            height={500}
                            alt="mission"
                            className="rounded-lg shadow-lg"
                        />
                        <div>
                            <div className="w-full h-26 text-left">
                                <Image
                                    src="/about/ourmission.png"
                                    width={200}
                                    height={100}
                                    alt="Our Mission"
                                    className="mr-auto scale-116" // aligns image to right
                                />
                            </div>
                            <p className="text-lg">
                                To revolutionize recruitment in the real estate sector by providing a seamless and
                                efficient platform that connects skilled professionals with the right employers.
                                We aim to support the growth of real estate businesses by helping them build
                                high-performing teams while empowering job seekers to advance their careers.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center text-right">
                        <div>
                            <div className="w-full h-26 text-left">
                                <Image
                                    src="/about/ourvision.png"
                                    width={200}
                                    height={100}
                                    alt="Our Vision"
                                    className="ml-auto scale-116" // aligns image to right
                                />
                            </div>
                            <p className="text-lg">
                                To be the go-to hub for real estate employment across India, driving innovation,
                                trust, and collaboration in the hiring process.
                            </p>
                        </div>
                        {/* Vision Image */}
                        <Image
                            src="/about/vision.webp"
                            width={600}
                            height={500}
                            alt="vision"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>


            {/* Core Values */}
            <div className="bg-gray-100 py-12">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-5xl font-bold text-center mb-6">Our Core Values</h2>
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
                                <i className="fas fa-check-circle text-yellow-500 text-xl mt-1"></i>
                                <div>
                                    <div className="flex gap-3 text-lg">
                                        <CheckCircleIcon width={28} height={28} className="text-yellow-500" aria-hidden="true" />
                                        <h5 className="font-semibold">{item.title}</h5>
                                    </div>
                                    <p className="text-gray-600 text-sm">{item.value}</p>
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
                            Unlike generic job portals, our platform is dedicated solely to the real estate sector,
                            ensuring specialized opportunities for candidates and a highly targeted talent pool for employers.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Comprehensive Job Listings</p>
                        <p className="text-gray-700">
                            From entry-level positions to senior leadership roles, we cover all aspects of real estate,
                            including sales, marketing, construction, HR, legal, operations, and more.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Easy-to-Use Platform</p>
                        <p className="text-gray-700">
                            Designed with simplicity and efficiency in mind, our portal makes job searching and hiring a hassle-free experience.
                        </p>
                    </li>
                    <li>
                        <p className="mb-2 text-lg font-semibold">Insights &amp; Resources</p>
                        <p className="text-gray-700">
                            We provide industry updates, career advice, and tips to help job seekers and employers
                            stay ahead in the ever-evolving real estate landscape.
                        </p>
                    </li>
                </ul>
            </div>
            <div className="container mx-auto text-center py-10">
                <h2 className="font-bold text-xl md:text-2xl mb-6">
                    TO EXPLORE REAL ESTATE JOB PORTAL CREATE YOUR ACCOUNT BELOW
                </h2>

                <div className="flex flex-wrap justify-center gap-6 py-5">
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
