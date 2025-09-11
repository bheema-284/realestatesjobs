import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
    <footer
        className="text-white py-12 px-6 w-full z-50"
        style={{
            backgroundColor: "#1c4676",
            backgroundImage: 'url("/rejobs/india.png")',
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply",
        }}
    >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 z-50">
            {/* Logo + About */}
            <div className="col-span-1 md:col-span-1">
                <Image
                    src="https://realestatejobs.co.in/images/logo.png"
                    alt="logo"
                    width={120}
                    height={30}
                    priority
                />
                <div className="my-5">
                    <p className="text-sm font-light">
                        Welcome to Real Estate Jobs, Inc - India's first and only dedicated job portal exclusively designed for the real estate industry. Whether you are a job seeker looking to build a career in real estate or an employer searching for top talent, we are here to connect you with the right opportunities and resources.
                    </p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm font-light w-full sm:w-20">
                    <li><a href="/" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Home</a></li>
                    <li><a href="/jobs" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Job Listings</a></li>
                    <li><a href="/companies" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Companies</a></li>
                    <li><a href="/about" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">About Us</a></li>
                    <li><a href="/login" className="hover:text-amber-400 transition-colors duration-300 hover:font-bold">Login</a></li>
                </ul>
            </div>

            {/* Jobs by Category */}
            <div className="col-span-1">
                <h4 className="text-lg font-bold mb-4">Jobs by Category</h4>
                <ul className="space-y-2 text-sm font-light w-full sm:w-34">
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Channel Partners</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">HR & Operations</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Real Estate Sales</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Tele Caller</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Digital Marketing</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Web Development</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">CRM Executive</a></li>
                    <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:font-semibold">Accounts & Auditing</a></li>
                </ul>
            </div>

            {/* Contact */}
            <div className="col-span-1 mb-4">
                <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                <address className="not-italic text-sm font-light space-y-2">
                    <p>
                        <strong>Corporate Office:</strong><br />
                        7th Floor, Block 2, My Home Hub, Madhapur, Patrika Nagar, HITEC City, Hyderabad
                    </p>
                </address>
            </div>
        </div>

        {/* Bottom Section */}
        <div
            className="p-3 my-5 rounded-lg text-center text-sm font-light flex flex-col md:flex-row justify-between items-center"
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
    </footer>
);

export default Footer;
