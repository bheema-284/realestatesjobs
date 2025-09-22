import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data, imageSize = "400px", rounded }) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Clone first and last slides
    const slides = [data[data.length - 1], ...data, data[0]];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => prev + 1);
        setIsTransitioning(true);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => prev - 1);
        setIsTransitioning(true);
    }, []);

    // Auto-scroll
    useEffect(() => {
        const autoScrollInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(autoScrollInterval);
    }, [nextSlide]);

    // Handle reset after transition ends
    const handleTransitionEnd = () => {
        if (currentSlide === slides.length - 1) {
            // reached cloned first
            setIsTransitioning(false);
            setCurrentSlide(1);
        } else if (currentSlide === 0) {
            // reached cloned last
            setIsTransitioning(false);
            setCurrentSlide(slides.length - 2);
        } else {
            setIsTransitioning(true);
        }
    };

    return (
        <div className={`relative w-full bg-white overflow-hidden ${rounded}`}>
            <div className="relative w-full" style={{ height: imageSize }}>
                {/* ✅ Fixed label (always top-left, doesn’t move with images) */}
                {data[currentSlide - 1]?.status && <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1">
                    {data[currentSlide - 1]?.status}
                    {/* we use currentSlide-1 since slides array has extra clone at start */}
                </span>}
                {/* Slides wrapper */}
                <div
                    className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
                        }`}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((item, index) => (
                        <div key={index} className="relative flex-none w-full h-full">
                            <div className="w-full" style={{ height: imageSize }}>
                                {item?.image ? (
                                    <img
                                        src={item.image}
                                        alt={`carousel-${index}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <img
                                        src="https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"
                                        alt="error"
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next buttons */}
            {data?.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
                        onClick={prevSlide}
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
                        onClick={nextSlide}
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                            <ChevronRightIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>
                </>
            )}
        </div>

    );
}

export default Slider;