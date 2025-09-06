'use client'
import AutoScrollLogos from "./common/autoscrolllogs";
import Slider from "./common/slider";

export default function HomePage() {
    const dummyData = [
        { image: "/add1.jpg" },
        { image: "/add2.jpg" },
        { image: "/add3.jpg" },
        { image: "/add4.jpg" },
        { image: "/add5.jpg" },
        { image: "/add6.jpg" },
        { image: "/add7.jpg" },
        { image: "/add8.jpg" },
        { image: "/add9.jpg" },
        { image: "/add10.jpg" }
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
            title: "Job Listings",
            description: "Browse thousands of real estate job opportunities from top companies.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l5 5z" /><path d="M7 11h2v2H7zM11 11h2v2H11zM15 11h2v2H15z" /></svg>
            )
        },
        {
            title: "Resume Builder",
            description: "Create a professional resume that stands out to recruiters.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
            )
        },
        {
            title: "Career Advice",
            description: "Get expert tips and articles to advance your real estate career.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14h-1v-4h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H9v2h3v2h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" /></svg>
            )
        }
    ];

    const topCities = [
        { name: "Mumbai", jobs: "200+ Jobs", image: "https://images.unsplash.com/photo-1571286399127-14259b3d077b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Pune", jobs: "150+ Jobs", image: "https://images.unsplash.com/photo-1594950346765-1d48d28923a1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Delhi", jobs: "180+ Jobs", image: "https://images.unsplash.com/photo-1566236976722-6b944203a3d2?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Bangalore", jobs: "220+ Jobs", image: "https://images.unsplash.com/photo-1593466107565-d04b6b1a9f99?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Chennai", jobs: "100+ Jobs", image: "https://images.unsplash.com/photo-1616427848243-d3c4c9d1a1b1?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Hyderabad", jobs: "130+ Jobs", image: "https://images.unsplash.com/photo-1597549721799-a4b3d75a894a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ];


    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Existing Slider Section */}
                <div className="mb-12">
                    <Slider data={dummyData} />
                </div>

                {/* Our Services Section */}
                <section className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ourServices.map((service, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-center mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.title}</h3>
                                <p className="text-gray-500">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Cities Section */}
                <section className="py-12 bg-gray-100 rounded-lg">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Explore Jobs by City</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                        {topCities.map((city, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden shadow-lg group">
                                <img src={city.image} alt={city.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white">
                                    <h3 className="text-xl font-bold">{city.name}</h3>
                                    <p className="text-sm">{city.jobs}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Top Recruiters Section with Auto-Scroll */}
                <section className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Top Recruiters</h2>
                    <AutoScrollLogos logos={topRecruiters} />
                </section>

            </div>
        </div>
    );
}