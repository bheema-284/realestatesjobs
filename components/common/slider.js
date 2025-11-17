import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data, imageSize = "400px", rounded }) {
    const [imagesData, setImagesData] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());

    // State for swiping logic
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    // Clone first and last slides for infinite loop - memoize this calculation
    const slides = imagesData.length > 0
        ? [imagesData[imagesData.length - 1], ...imagesData, imagesData[0]]
        : [];

    const slideWidth = 100;
    const swipeThreshold = 50;

    // --- Sync data prop with state ---
    useEffect(() => {
        if (data && data.length > 0) {
            setImagesData(data);
            // Reset current slide when data changes
            setCurrentSlide(1);
            // Clear loaded images cache when data changes
            setLoadedImages(new Set());
        }
    }, [data]);

    // --- Navigation Functions ---
    const nextSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentSlide((prev) => prev + 1);
        setIsTransitioning(true);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentSlide((prev) => prev - 1);
        setIsTransitioning(true);
    }, [slides.length]);

    // --- Auto-scroll Effect ---
    useEffect(() => {
        if (isDragging || slides.length <= 1) return;

        const autoScrollInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(autoScrollInterval);
    }, [nextSlide, isDragging, slides.length]);

    // --- Infinite Loop Logic ---
    const handleTransitionEnd = () => {
        setDragDistance(0);
        setIsTransitioning(true);

        if (currentSlide === slides.length - 1) {
            setIsTransitioning(false);
            setCurrentSlide(1);
        } else if (currentSlide === 0) {
            setIsTransitioning(false);
            setCurrentSlide(slides.length - 2);
        }
    };

    // --- Image Loading Handlers ---
    const handleImageLoad = useCallback((imageUrl) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    const handleImageError = useCallback((e, imageUrl) => {
        e.target.src = "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg";
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    // Preload adjacent images for smoother transitions
    useEffect(() => {
        if (slides.length <= 1) return;

        const preloadImages = () => {
            const currentIndex = currentSlide;
            const prevIndex = currentSlide - 1 >= 0 ? currentSlide - 1 : slides.length - 1;
            const nextIndex = (currentSlide + 1) % slides.length;

            [currentIndex, prevIndex, nextIndex].forEach(index => {
                const imageUrl = slides[index]?.image;
                if (imageUrl && !loadedImages.has(imageUrl)) {
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = () => handleImageLoad(imageUrl);
                    img.onerror = () => handleImageLoad(imageUrl);
                }
            });
        };

        preloadImages();
    }, [currentSlide, slides, loadedImages, handleImageLoad]);

    // --- SWIPE HANDLERS ---
    const handleDragStart = (clientX) => {
        if (slides.length <= 1) return;
        setIsTransitioning(false);
        setIsDragging(true);
        setDragStartX(clientX);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging || slides.length <= 1) return;
        const newDragDistance = clientX - dragStartX;
        setDragDistance(newDragDistance);
    };

    const handleDragEnd = () => {
        if (!isDragging || slides.length <= 1) return;

        setIsDragging(false);
        setIsTransitioning(true);

        if (dragDistance > swipeThreshold) {
            prevSlide();
        } else if (dragDistance < -swipeThreshold) {
            nextSlide();
        } else {
            setDragDistance(0);
        }
    };

    // MOUSE handlers
    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onMouseUp = handleDragEnd;
    const onMouseLeave = (e) => isDragging && handleDragEnd();

    // TOUCH handlers
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = handleDragEnd;

    // Calculate the total translation including the swipe offset
    const totalTranslateX = slides.length > 0
        ? `calc(-${currentSlide * slideWidth}% + ${dragDistance}px)`
        : 'translateX(0)';

    // Get current slide data (adjusting for cloned slides)
    const getCurrentSlideData = () => {
        if (imagesData.length === 0) return null;

        let actualIndex = currentSlide - 1;
        if (currentSlide === 0) {
            actualIndex = imagesData.length - 1;
        } else if (currentSlide === slides.length - 1) {
            actualIndex = 0;
        }
        return imagesData[actualIndex];
    };

    const currentSlideData = getCurrentSlideData();

    // Early return if no data
    if (!data || data.length === 0) {
        return (
            <div className={`relative w-full bg-white overflow-hidden ${rounded}`} style={{ height: imageSize }}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <img
                        src="https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"
                        alt="No images available"
                        className="object-contain w-1/2 h-1/2"
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full bg-white overflow-hidden ${rounded}`}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <div className="relative w-full" style={{ height: imageSize }}>
                {/* Fixed label (always top-left, doesn't move with images) */}
                {currentSlideData?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1 z-30">
                        {currentSlideData.status}
                    </span>
                )}

                {/* Loading indicator */}
                {!loadedImages.has(slides[currentSlide]?.image) && slides[currentSlide]?.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {/* Slides wrapper - Swiping enabled here */}
                <div
                    className={`flex cursor-grab ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{ transform: totalTranslateX }}
                    onTransitionEnd={handleTransitionEnd}

                    // Mouse and Touch Event Handlers
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {slides.map((item, index) => (
                        <div key={`${item?.image || 'empty'}-${index}`} className="relative flex-none w-full h-full">
                            <div className="w-full" style={{ height: imageSize }}>
                                {item?.image ? (
                                    <img
                                        src={item.image}
                                        alt={`carousel-${index}`}
                                        className="object-cover w-full h-full select-none"
                                        draggable="false"
                                        onLoad={() => handleImageLoad(item.image)}
                                        onError={(e) => handleImageError(e, item.image)}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <img
                                            src="https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"
                                            alt="error"
                                            className="object-contain w-1/2 h-1/2 select-none"
                                            draggable="false"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next buttons - Only show if there are multiple images */}
            {imagesData.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                            <ChevronRightIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>
                </>
            )}
        </div>
    );
}

export default React.memo(Slider);