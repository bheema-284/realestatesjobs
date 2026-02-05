'use client'
import { useContext, useEffect, useState } from "react";
import AutoScrollLogos from "./common/autoscrolllogs";
import Slider from "./common/slider";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import RootContext from "./config/rootcontext";
import { useSWRFetch } from "./config/useswrfetch";

export default function HomePage() {
    const router = useRouter();
    const { rootContext, setRootContext } = useContext(RootContext);
    const { data: companyData = [], error, isLoading } = useSWRFetch(`/api/companies`);
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

    const jobCategories = [
        {
            icon: '/icons/tel.png',
            title: 'Tele Caller',
            description: 'Engage & Convert',
        },
        {
            icon: '/icons/cp.png',
            title: 'Channel Partners',
            description: 'Collaborate & Earn',
        },
        {
            icon: '/icons/realestate.png',
            title: 'Real Estate Sales',
            description: 'Sell Property Faster',
        },
        {
            icon: '/icons/crm.png',
            title: 'CRM Executive',
            description: 'Manage Client Relations',
        },
        {
            icon: '/icons/digital.png',
            title: 'Digital Marketing',
            description: 'Promote & Convert',
        },
        {
            icon: '/icons/hrandop.png',
            title: 'HR & Operations',
            description: 'People & Process',
        },
        {
            icon: '/icons/accounts.png',
            title: 'Accounts & Auditing',
            description: 'Ensure Financial Clarity',
        },
        {
            icon: '/icons/legal.png',
            title: 'Legal',
            description: 'Safeguard Deals & Compliance',
        },
        {
            icon: '/icons/architects.png',
            title: 'Architects',
            description: 'Design Smart & Aesthetic Spaces',
        },
        {
            icon: '/icons/webdev.png',
            title: 'Web Development',
            description: 'Build Real Estate Tech',
        }
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

    const recruiters = [
        { id: 1001, name: "DLF Ltd.", logo: "/company/dlf.png" },
        { id: 1002, name: "Honer Properties", logo: "/company/honer.jpg" },
        { id: 1003, name: "Brigade Group", logo: "/company/brigade.jpeg" },
        { id: 1004, name: "Cyber City.", logo: "/company/cybercity.jpg" },
        { id: 1005, name: "Jayabheri Properties", logo: "/company/jayabheri.jpg" },
        { id: 1006, name: "Muppa Group", logo: "/company/muppa.jpeg" },
        { id: 1007, name: "Prestige Group", logo: "/company/prestigegroup.png" },
        { id: 1008, name: "My Home Group.", logo: "/company/myhomegroup.png" },
        { id: 1009, name: "Radhey Properties", logo: "/company/radhey.jpg" },
        { id: 1010, name: "Rajpushpa Group", logo: "/company/rajpushpagroup.jpg" },
        { id: 1011, name: "NCC Ltd.", logo: "/company/ncc.jpg" },
        { id: 1012, name: "Ramkey Group", logo: "/company/ramkeygroup.jpg" },
        { id: 1013, name: "Lodha Group", logo: "/company/lodha.jpg" },
        { id: 1014, name: "Phoenix Mills", logo: "/company/images.jpeg" },
    ];


    const companies = companyData.map((company, index) => {
        // Function to get initials from company name
        const getCompanyInitials = (companyName) => {
            if (!companyName) return 'CO';

            const words = companyName.split(' ');

            if (words.length === 1) {
                // For single word names, take first 2-3 characters
                return companyName.substring(0, 3).toUpperCase();
            } else {
                // For multiple words, take first letters of first two words
                return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
            }
        };

        const initials = getCompanyInitials(company.name);

        return {
            id: company._id || 2000 + (index + 1),
            name: company.name || "",
            logo: (!company.profileImage || company.profileImage === "") ? `https://placehold.co/48x48/F0F0F0/000000?text=${initials}` : company.profileImage || `https://placehold.co/48x48/F0F0F0/000000?text=${initials}`
        };
    }) || [];

    const topRecruiters = [...recruiters, companies]
    console.log("topRecruiters", topRecruiters)
    // Slug creation function - consistent across components
    const createSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    // Handler for all location/city clicks
    const handleLocationClick = (locationName) => {
        // Example: "Jobs in Hyderabad" -> "hyderabad"
        // Example: "Delhi NCR" -> "delhi-ncr"

        // Strip "Jobs in " prefix if present
        const cleanName = locationName.replace(/^Jobs in\s+/i, '').trim();
        const slug = createSlug(cleanName);

        // Navigate to the /jobs page with the location query parameter
        router.push(`/jobs?location=${slug}`);
    };

    const AllLocations = () => (
        <div className=" w-full sm:w-[80%] m-auto px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">All Locations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {locations.map((location, index) => (
                    <button
                        key={index}
                        onClick={() => handleLocationClick(location)}
                        className={`bg-white text-center rounded-lg p-4 shadow-sm transition-transform duration-300 hover:scale-105 bg-gray-100 hover:bg-purple-700 hover:text-white`}
                    >
                        <span className="font-semibold text-lg">{location}</span>
                    </button>
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

    const viewSyllabus = () => {
        setRootContext({
            ...rootContext,
            toast: {
                show: true,
                dismiss: true,
                type: "info",
                title: "Syllabus Status",
                message: "The full curriculum syllabus is being finalized by our experts. Check back soon for the complete course structure and learning modules!",
            },
        });
    }

    const viewAbout = () => {
        setRootContext({
            ...rootContext,
            toast: {
                show: true,
                dismiss: true,
                type: "info",
                title: "Certifications Program Update",
                message: "Our professional certification program is currently under review and will be launched soon. Get ready to elevate your career!",
            },
        });
    }

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
            <div className="mx-auto py-5 rounded-3xl bg-white cursor-pointer w-full my-10">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-center">
                        Real Estate Certifications Programs
                    </h3>
                    <div className="relative overflow-hidden rounded-3xl mt-20">
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
                                                <button onClick={viewSyllabus} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-purple-200">
                                                    View Syllabus
                                                </button>
                                                <button onClick={viewAbout} className="bg-purple-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-purple-800">
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


    const onMoreInfo = () => {
        setRootContext({
            ...rootContext,
            toast: {
                show: true,
                dismiss: true,
                type: "info",
                title: "Access Restricted",
                message: "Our Exclusive Services program is coming soon! Keep an eye out for premium features and expert consulting access.",
            },
        });
    }

    const OurServices = () => {
        return (
            <div className="py-8 w-full mx-auto">
                <h2 className="text-3xl font-bold text-center mt-10 text-gray-800">Our Recruitment Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
                    {ourServices.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="flex w-full h-80 justify-center mb-4">
                                <img
                                    src={service.icon}
                                    alt={service.title}
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.title}</h3>
                                <p className="text-gray-500">{service.description}</p>
                            </div>
                            <div className="my-3">
                                <button onClick={onMoreInfo} className="bg-orange-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 hover:bg-orange-800">
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
        { x: 50, y: 0 }, // right
        { x: 0, y: 50 }, // bottom
    ];

    function JobCategories() {
        const controls = useAnimation();
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.2,
        });

        useEffect(() => {
            if (inView) {
                controls.start("visible");
            }
        }, [inView, controls]);

        const handleCategoryClick = (title) => {
            const slug = createSlug(title);
            // Uses category query parameter
            router.push(`/jobs?category=${slug}`);
        };

        return (
            <div
                ref={ref}
                className="flex my-5 flex-col items-center justify-center w-full mx-auto sm:w-[80%]"
            >
                <h1 className="text-4xl sm:text-3xl font-normal text-gray-700 mb-10 text-center">
                    Click to unlock your{" "}
                    <span className="font-semibold text-gray-900">
                        Dream Real Estate Jobs
                    </span>{" "}
                    below
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 w-full mt-5">
                    {jobCategories.map((job, index) => {
                        const dir = directions[index % directions.length];

                        return (
                            <div
                                key={index}
                                // **Action:** Call the handler function
                                onClick={() => handleCategoryClick(job.title)}
                                className="flex flex-col group p-4 bg-white rounded-xl shadow-md hover:bg-blue-900 transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer text-center"
                            >
                                {/* ... (motion.img component remains the same) ... */}
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

    function ExploreJobsByCity() {
        const [hoveredCity, setHoveredCity] = useState(null);

        // Animation variants
        const directions = [
            { x: -50, y: 0 }, // from left
            { x: 50, y: 0 },  // from right
            { x: 0, y: -50 }, // from top
            { x: 0, y: 50 },  // from bottom
        ];

        return (
            <div className="py-12 rounded-lg w-full mx-auto sm:w-[80%]">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
                    Explore Jobs by City
                </h2>
                <div className="mt-5 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-8 w-full px-4 mx-auto max-w-full-xl">
                    {topCities.map((city, index) => {
                        const direction = directions[index % directions.length]; // cycle directions
                        return (
                            <motion.div
                                key={index}
                                className="w-24 h-24 cursor-pointer"
                                initial={{ opacity: 0, x: direction.x, y: direction.y }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div
                                    className="relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                                    onMouseEnter={() => setHoveredCity(city.name)}
                                    onMouseLeave={() => setHoveredCity(null)}
                                    // **Action:** Call the handler function
                                    onClick={() => handleLocationClick(city.name)}
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
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const handleLogoClick = (companyId) => {
        const path = `/companies/${companyId}`;
        router.push(`${path}`)
    };


    return (
        <div className="w-full mx-auto w-full">
            {/* Existing Slider Section */}
            <div className="mb-12">
                <Slider data={dummyData} imageSize={"500px"} />
            </div>

            {/* Dream Jobs */}
            <div className="my-10">
                <JobCategories />
            </div>

            {/* Top Cities Section */}
            <ExploreJobsByCity />
            <RealStats />
            {/* Our Top Recruiters Section with Auto-Scroll */}
            <div className="py-12">
                <h2 className="text-4xl font-bold text-center mb-10">Our Top Recruiters</h2>
                <AutoScrollLogos logos={topRecruiters} onLogoClick={rootContext?.user?.role !== "recruiter" && handleLogoClick} />
            </div>
            {/* All Locations Section */}
            <AllLocations />
            {/* Our Services Section */}
            <OurServices />
            <div className="my-10">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Our Exclusive Services</h2>
                <div className="mx-auto w-full sm:w-[80%] rounded-lg mt-20">
                    <Slider data={ads} imageSize={"200px"} rounded={"rounded-lg"} />
                </div>
            </div>
            <CertificationsCarousel />
        </div>
    );
}