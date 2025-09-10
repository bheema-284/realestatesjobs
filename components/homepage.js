'use client'
import { useEffect, useState } from "react";
import AutoScrollLogos from "./common/autoscrolllogs";
import Slider from "./common/slider";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function HomePage() {

    const dummyData = [
        { image: "/cover/add1.jpg" },
        { image: "/cover/add2.jpg" },
        { image: "/cover/add3.jpg" },
        { image: "/cover/add4.jpg" },
        { image: "/cover/add5.jpg" },
        { image: "/cover/add6.jpg" },
        { image: "/cover/add7.jpg" },
        { image: "/cover/add8.jpg" },
        { image: "/cover/add9.jpg" },
        { image: "/cover/add10.jpg" },
        { image: "/cover/add11.jpg" },
        { image: "/cover/add12.jpg" },
        { image: "/cover/add13.jpg" },
        { image: "/cover/add14.jpg" },
        { image: "/cover/add15.jpg" }
    ];

    const topRecruiters = [
        { name: "DLF Ltd.", logo: "/company/dlf.png" },
        { name: "Honer Properties", logo: "/company/honer.jpg" },
        { name: "Brigade Group", logo: "/company/brigade.jpeg" },
        { name: "Cyber City.", logo: "/company/cybercity.jpg" },
        { name: "Jayabheri Properties", logo: "/company/jayabheri.jpg" },
        { name: "Muppa Group", logo: "/company/muppa.jpeg" },
        { name: "Prestige Group", logo: "/company/prestigegroup.png" },
        { name: "My Home Group.", logo: "/company/myhomegroup.png" },
        { name: "Radhey Properties", logo: "/company/radhey.jpg" },
        { name: "Rajpushpa Group", logo: "/company/rajpushpagroup.jpg" },
        { name: "NCC Ltd.", logo: "/company/ncc.jpg" },
        { name: "Ramkey Group", logo: "/company/ramkeygroup.jpg" },
        { name: "Lodha Group", logo: "/company/lodha.jpg" },
        { name: "Phoenix Mills", logo: "/company/images.jpeg" },
    ];

    const ourServices = [
        {
            title: "Ai Talent Pool",
            description: "Procurement of talent as per market Predictions.",
            icon: "/ourservices/layer_3.png"
        },
        {
            title: "AI Recruit",
            description: "real time Ai Recruitor to Increase Accuracy for hire.",
            icon: "/ourservices/layer_2.png"
        },
        {
            title: "Ai Jobs Search",
            description: "For better enhanced recruitment services.",
            icon: "/ourservices/layer_1.png"
        }
    ];

    const topCities = [
        { name: "Hyderabad", jobs: "130+ Jobs", imageBlack: "/cities/hyderabad_black.png", imageColor: "/cities/hyderabad_color.png" },
        { name: "Bangalore", jobs: "220+ Jobs", imageBlack: "/cities/bengaluru_black.png", imageColor: "/cities/bengaluru_color.png" },
        { name: "Mumbai", jobs: "200+ Jobs", imageBlack: "/cities/mumbai_black.png", imageColor: "/cities/mumbai_color.png" },
        { name: "Delhi NCR", jobs: "180+ Jobs", imageBlack: "/cities/delhi_black.png", imageColor: "/cities/delhi_color.png" },
        { name: "Chennai", jobs: "100+ Jobs", imageBlack: "/cities/chennai_black.png", imageColor: "/cities/chennai_color.png" },
        { name: "Kolkata", jobs: "150+ Jobs", imageBlack: "/cities/kolkata_black.png", imageColor: "/cities/kolkata_color.png" },
    ];
    const [hoveredCity, setHoveredCity] = useState(null);

    const jobCategories = [
        {
            icon: '/icons/cp.png',
            title: 'Channel Partners',
            description: 'Collaborate & Earn',
        },
        {
            icon: '/icons/hrandop.png',
            title: 'HR & Operations',
            description: 'People & Process',
        },
        {
            icon: '/icons/realestate.png',
            title: 'Real Estate Sales',
            description: 'Sell Property Faster',
        },
        {
            icon: '/icons/tel.png',
            title: 'Tele Caller',
            description: 'Engage & Convert',
        },
        {
            icon: '/icons/digital.png',
            title: 'Digital Marketing',
            description: 'Promote & Convert',
        },
        {
            icon: '/icons/webdev.png',
            title: 'Web Development',
            description: 'Build Real Estate Tech',
        },
        {
            icon: '/icons/crm.png',
            title: 'CRM Executive',
            description: 'Manage Client Relations',
        },
        {
            icon: '/icons/accounts.png',
            title: 'Accounts & Auditing',
            description: 'Ensure Financial Clarity',
        },
    ];

    const certifications = [
        {
            image: '/rejobs/programme1.png',
            title: "MICA's Advanced Certificate In Digital Marketing and Communication",
            org: 'MICA',
            duration: '31 Weeks',
            features: ['1-1 Mentorship & Job Support'],
        },
        {
            image: '/rejobs/programme2.png',
            title: 'Post Graduate Certificate in Data Science & AI (Executive)',
            org: 'IITB',
            duration: '8-8.5 Months',
            features: ['Exclusive Job Portal'],
        },
        {
            image: '/rejobs/programme1.png',
            title: 'Post Graduate Certificate in Machine Learning and Deep Learning (Executive)',
            org: 'IITB',
            duration: '8 Months',
            features: ['5+ Industry Projects, Case Studies'],
        }
    ];

    const locations = [
        'Jobs in Hyderabad',
        'Jobs in Bengaluru',
        'Jobs in Mumbai',
        'Jobs in Delhi NCR',
        'Jobs in Chennai',
        'Jobs in Kolkata',
        'Jobs in Kochi',
        'Jobs in Jaipur',
        'Jobs in Ahmedabad',
        'Jobs in Ayodhya',
        'Jobs in Tirupati',
        'Jobs in Shirdi',
    ];

    const AllLocations = () => (
        <div className=" w-full sm:w-[80%] m-auto px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">All Locations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {locations.map((location, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`bg-white text-center rounded-lg p-4 shadow-sm transition-transform duration-300 hover:scale-105 bg-gray-100 hover:bg-purple-700 hover:text-white`}
                    >
                        <span className="font-semibold text-lg">{location}</span>
                    </a>
                ))}
            </div>
        </div>
    );

    const RealStats = () => (
        <div className="bg-[#1c4676] text-white py-8 mt-8 mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Real Estate Jobs Stats</h3>
            <p className="text-lg mb-12 max-w-3xl mx-auto font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Soluta in laboriosam ipsum, magnam ullam possimus reiciendis, architecto dolore excepturi odit neque temporibus reprehenderit magni labore assumenda ea iusto nihil sit.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { count: '1930+', label: 'Candidates' },
                    { count: '1660+', label: 'Jobs Posted' },
                    { count: '1120+', label: 'Jobs Filled' },
                    { count: '400+', label: 'Companies' },
                ].map((stat, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="text-4xl md:text-3xl font-extrabold text-amber-300">{stat.count}</div>
                        <div className="text-sm md:text-lg font-medium mt-2">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    const CertificationsCarousel = () => {
        // duplicate items for seamless loop
        const loopedCerts = [...certifications, ...certifications];

        useEffect(() => {
            const handleScroll = (e) => {
                const root = document.documentElement;

                if (e.deltaY > 0) {
                    // scrolling down → move right
                    root.style.setProperty("--scroll-direction", "reverse");
                } else {
                    // scrolling up → move left
                    root.style.setProperty("--scroll-direction", "normal");
                }
            };

            window.addEventListener("wheel", handleScroll);
            return () => window.removeEventListener("wheel", handleScroll);
        }, []);

        return (
            <div className="mx-auto py-5 rounded-3xl bg-white cursor-pointer w-screen">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Trending Certifications Programs
                    </h3>
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="flex animate-scroll">
                            {loopedCerts.map((cert, index) => (
                                <div key={index} className="w-96 flex-shrink-0 px-4">
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className="w-full h-48 object-cover rounded-t-xl"
                                        />
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h4 className="text-xl font-semibold mb-2">{cert.title}</h4>
                                            <p className="text-gray-600 text-sm">{cert.org}</p>
                                            <ul className="list-disc list-inside text-gray-500 text-sm my-2">
                                                <li>{cert.duration}</li>
                                                {cert.features.map((feature, i) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                            </ul>
                                            <div className="mt-auto flex justify-between pt-4">
                                                <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-purple-200">
                                                    View Syllabus
                                                </button>
                                                <button className="bg-purple-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-purple-800">
                                                    Know More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <style jsx global>{`
            .animate-scroll {
              display: flex;
              width: max-content;
              animation: scroll 40s linear infinite;
              animation-direction: var(--scroll-direction, normal);
            }

            @keyframes scroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
                    </div>
                </div>
            </div>
        );
    };

    const ads = [
        {
            id: 1,
            image: '/rejobs/slide4.jpg',
            alt: 'Discover our new product',
            cta: 'Shop Now',
            link: '/shop/product-a',
        },
        {
            id: 2,
            image: '/rejobs/slide5.jpg',
            alt: 'Get a free consultation',
            cta: 'Shop Now',
            link: '/shop',
        }
    ];

    const OurServices = () => {
        return (
            <div className="py-12 w-full mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Recruitment Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ourServices.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={service.icon}
                                    alt={service.title}
                                    className="w-full h-72 object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.title}</h3>
                                <p className="text-gray-500">{service.description}</p>
                            </div>
                            <div className="my-3">
                                <button className="bg-orange-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-orange-800">
                                    More Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const directions = [
        { x: -50, y: 0 }, // left
        { x: 0, y: -50 }, // top
        { x: 50, y: 0 },  // right
        { x: 0, y: 50 },  // bottom
    ];

    function JobCategories() {
        const controls = useAnimation();
        const [ref, inView] = useInView({
            triggerOnce: true, // ✅ animate once
            threshold: 0.2,    // ✅ adjust if needed
        });

        useEffect(() => {
            if (inView) {
                controls.start("visible");
            }
        }, [inView, controls]);

        return (
            <div
                ref={ref}
                className="flex my-5 flex-col items-center justify-center w-full mx-auto sm:w-[80%]"
            >
                <h1 className="text-2xl sm:text-3xl font-normal text-gray-700 mb-5 text-center">
                    Click to unlock your{" "}
                    <span className="font-semibold text-gray-900">
                        Dream Real Estate Jobs
                    </span>{" "}
                    below
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl w-full">
                    {jobCategories.map((job, index) => {
                        const dir = directions[index % directions.length];

                        return (
                            <div
                                key={index}
                                className="flex flex-col group p-4 bg-white rounded-xl shadow-md hover:bg-blue-900 transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer text-center"
                            >
                                {/* ✅ Only animate the image */}
                                <motion.img
                                    src={job.icon}
                                    alt={job.title}
                                    className="h-14 w-auto object-contain mx-auto"
                                    initial="hidden"
                                    animate={controls}
                                    variants={{
                                        hidden: { opacity: 0, x: dir.x, y: dir.y },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            y: 0,
                                            transition: {
                                                duration: 0.8,
                                                delay: index * 0.2,
                                                ease: "easeOut",
                                            },
                                        },
                                    }}
                                />

                                {/* ✅ Text stays static */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-white">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 group-hover:text-white">
                                        {job.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }


    const Footer = () => (
        <footer
            className="text-white py-12 px-6 mt-8"
            style={{
                backgroundColor: "#1c4676",                   // solid blue base
                backgroundImage: 'url("/rejobs/india.png")', // world map
                backgroundSize: "100% 100%",                 // ✅ spread whole footer, no cut
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "multiply",             // keeps image + blue color
            }}
        >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <Image
                        src="https://realestatejobs.co.in/images/logo.png"
                        alt="logo"
                        width={120}
                        height={30}
                        priority
                    />
                    <p className="text-sm font-light">
                        Welcome to Real Estate Jobs, Inc - India's first and only dedicated job portal exclusively designed for the real estate industry. Whether you are a job seeker looking to build a career in real estate or an employer searching for top talent, we are here to connect you with the right opportunities and resources.
                    </p>
                </div>
                <div className="col-span-1">
                    <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm font-light">
                        <li><a href="/" className="hover:text-amber-400">Home</a></li>
                        <li><a href="/jobs" className="hover:text-amber-400">Job Listings</a></li>
                        <li><a href="/companies" className="hover:text-amber-400">Companies</a></li>
                        <li><a href="/about" className="hover:text-amber-400">About Us</a></li>
                        <li><a href="/login" className="hover:text-amber-400">Login</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-bold mb-4">Jobs by Category</h4>
                    <ul className="space-y-2 text-sm font-light">
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">Channel Partners</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">HR & Operations</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">Real Estate Sales</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">Tele Caller</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">DigitalMarketing</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">Web Development</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">CRM Executive</a></li>
                        <li><a href="#" className="hover:text-orange-400 hover:font-bold block">Accounts & Auditing</a></li>
                    </ul>
                </div>
                <div className="col-span-1 mb-4">
                    <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                    <address className="not-italic text-sm font-light space-y-2">
                        <p><strong>Corporate Office:</strong><br />7th Floor, Block 2, My Home Hub, Madhapur, Patrika Nagar, HITEC City, Hyderabad</p>
                    </address>
                </div>
            </div>
            <div className="p-3 my-5 rounded-lg text-center text-sm font-light flex flex-col md:flex-row justify-between items-center" style={{ backgroundColor: 'rgba(99, 99, 144, 0.5)' }}>
                <p className="mb-4 md:mb-0">&copy; 2025 Real Estate Jobs. All rights reserved.</p>
                <div className="flex space-x-4 cursor-pointer">
                    <FaFacebook />
                    <FaTwitter />
                    <FaInstagram />
                    <FaLinkedin />
                </div>
            </div>
        </footer>
    );

    return (
        <div className="w-full mx-auto w-screen">
            {/* Existing Slider Section */}
            <div className="mb-12">
                <Slider data={dummyData} imageSize={"380px"} />
            </div>

            {/* Dream Jobs */}
            <div className="my-10">
                <JobCategories />
            </div>

            {/* Top Cities Section */}
            <div className="py-12 rounded-lg w-full mx-auto sm:w-[80%]">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Explore Jobs by City</h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-8 w-full px-4 mx-auto max-w-screen-xl">
                    {topCities.map((city, index) => (
                        <div
                            key={index} className="w-24 h-24 cursor-pointer">
                            <div
                                className="relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                                onMouseEnter={() => setHoveredCity(city.name)}
                                onMouseLeave={() => setHoveredCity(null)}
                            >
                                <img
                                    src={hoveredCity === city.name ? city.imageColor : city.imageBlack}
                                    alt={city.name}
                                    className="w-full h-full object-contain transition-transform duration-300"
                                />
                            </div>
                            <div className="text-gray-900 text-center">
                                <h3 className="text-xl font-semibold">{city.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <RealStats />
            {/* Our Top Recruiters Section with Auto-Scroll */}
            <div className="py-12">
                <h2 className="text-3xl font-bold text-center mb-10">Our Top Recruiters</h2>
                <AutoScrollLogos logos={topRecruiters} />
            </div>
            <AllLocations />
            {/* Our Services Section */}
            <OurServices />
            <div className="my-5">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Exclusive Services</h2>
                <div className="mx-auto w-full sm:w-[80%] rounded-lg">
                    <Slider data={ads} imageSize={"200px"} rounded={"rounded-lg"} />
                </div>
            </div>
            <CertificationsCarousel />
            <Footer />
        </div>
    );
}