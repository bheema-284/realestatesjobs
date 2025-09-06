import React from 'react';

const AutoScrollLogos = ({ logos }) => {
    return (
        <div className="relative w-full overflow-hidden py-4 cursor-pointer">
            <div className="flex animate-scroll-left whitespace-nowrap">
                {/* Duplicate the logos to create a seamless loop */}
                {[...logos, ...logos].map((recruiter, index) => (
                    <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
                        <img src={recruiter.logo} alt={recruiter.name} className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                ))}
            </div>
            {/* Add a keyframe animation in your global CSS (e.g., globals.css) */}
            <style jsx global>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%); /* Adjust based on the number of original logos and spacing */
                    }
                }
                .animate-scroll-left {
                    animation: scroll-left 40s linear infinite; /* Adjust duration for speed */
                }
            `}</style>
        </div>
    );
};

export default AutoScrollLogos;