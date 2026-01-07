'use client';

import Image from "next/image";
import React, { useCallback, useEffect, useState, useRef } from "react";

function Slider({
    data,
    rounded = "sm:rounded-lg",
    className = "",
    fitMode = "cover", // 'cover', 'contain', or 'scale-down'
    imageSize = "200px sm:400px", // New prop for image size
    onChange
}) {
    const fallbackImg = "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg";
    const [imagesData, setImagesData] = useState([{ image: fallbackImg }]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const isMountedRef = useRef(true);
    const containerRef = useRef(null);
    const slideIntervalRef = useRef(null);

    const dataLength = imagesData.length;

    // Move to next slide
    const nextSlide = useCallback(() => {
        if (dataLength <= 1) return;

        requestAnimationFrame(() => {
            setIsTransitioning(true);
            const nextIndex = (currentIndex + 1) % dataLength;
            setTimeout(() => {
                setCurrentIndex(nextIndex);
            }, 10);
        });
    }, [currentIndex, dataLength]);

    // Move to previous slide
    const prevSlide = useCallback(() => {
        if (dataLength <= 1) return;

        requestAnimationFrame(() => {
            setIsTransitioning(true);
            const prevIndex = (currentIndex - 1 + dataLength) % dataLength;
            setTimeout(() => {
                setCurrentIndex(prevIndex);
            }, 10);
        });
    }, [currentIndex, dataLength]);

    // Auto-scroll
    useEffect(() => {
        if (dataLength <= 1 || !isActive) return;

        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(slideIntervalRef.current);
    }, [nextSlide, dataLength, isActive]);

    // Load new data
    useEffect(() => {
        const newData = data && data.length ? data : [{ image: fallbackImg }];
        setImagesData(newData);
        setCurrentIndex(0);
        if (onChange && newData.length > 0) {
            onChange(0);
        }
    }, [data, fallbackImg, onChange]);

    // Handle transition end
    const handleTransitionEnd = useCallback(() => {
        setIsTransitioning(false);
        if (onChange) {
            onChange(currentIndex);
        }
    }, [currentIndex, onChange]);

    const goToSlide = useCallback((index) => {
        if (dataLength <= 1 || index === currentIndex) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
        }, 10);
    }, [currentIndex, dataLength, onChange]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (dataLength <= 1) return;

            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevSlide, nextSlide, dataLength]);

    // Handle swipe for mobile
    useEffect(() => {
        if (!containerRef.current || dataLength <= 1) return;

        const container = containerRef.current;
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            const distance = startX - endX;

            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
            }
        };

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [nextSlide, prevSlide, dataLength]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            clearInterval(slideIntervalRef.current);
        };
    }, []);

    // Calculate slide positions
    const getSlideClasses = (index) => {
        if (index === currentIndex) return 'translate-x-0';
        if (index === (currentIndex - 1 + dataLength) % dataLength) return '-translate-x-full';
        if (index === (currentIndex + 1) % dataLength) return 'translate-x-full';
        return 'translate-x-full opacity-0';
    };

    // Get image fit classes based on fitMode
    const getImageFitClass = () => {
        switch (fitMode) {
            case 'contain':
                return 'object-contain';
            case 'cover':
                return 'object-cover';
            case 'scale-down':
                return 'object-scale-down'; // This fits without cropping
            default:
                return 'object-cover';
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden ${rounded} ${className}`}
            style={{ height: imageSize }}
        >
            {/* Slides container */}
            <div className="relative w-full h-full">
                {imagesData.map((slide, index) => (
                    <div
                        key={`slide-${index}`}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out ${getSlideClasses(index)} ${rounded}`}
                        onTransitionEnd={index === currentIndex ? handleTransitionEnd : undefined}
                    >
                        {/* Background container to handle overflow and centering */}
                        <div className={`relative w-full h-full ${rounded} overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800`}>
                            <Image
                                src={slide.image || fallbackImg}
                                alt={`Slide ${index + 1}`}
                                onError={(e) => {
                                    e.currentTarget.src = fallbackImg;
                                }}
                                fill
                                loading={index <= 1 ? 'eager' : 'lazy'}
                                className={
                                    fitMode === "contain" || fitMode === "scale-down"
                                        ? `${rounded} ${getImageFitClass()} max-w-full max-h-full`
                                        : `${rounded} ${getImageFitClass()} w-full h-full`
                                }
                                style={{
                                    // Additional styling for better fit
                                    objectFit: fitMode === 'scale-down' ? 'scale-down' : fitMode,
                                    objectPosition: 'center'
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Only show if more than 1 slide */}
            {dataLength > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots indicator - Only show if more than 1 slide */}
            {dataLength > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {imagesData.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentIndex === index
                                ? "bg-white scale-125"
                                : "bg-white/50 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Slider;