import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data, imageSize = "400px", rounded }) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set()); // Track loaded images

    // State for swiping logic
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    // Clone first and last slides for infinite loop
    const slides = [data[data.length - 1], ...data, data[0]];
    const slideWidth = 100; // Represents 100% width of the container
    const swipeThreshold = 50; // Minimum distance (in pixels) to register a swipe

    // --- Navigation Functions ---
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => prev + 1);
        setIsTransitioning(true);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => prev - 1);
        setIsTransitioning(true);
    }, []);

    // --- Auto-scroll Effect ---
    useEffect(() => {
        // Prevent auto-scroll while dragging to avoid conflicts
        if (isDragging) return;

        const autoScrollInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(autoScrollInterval);
    }, [nextSlide, isDragging]);

    // --- Infinite Loop Logic ---
    const handleTransitionEnd = () => {
        // Reset the drag distance and re-enable transitions
        setDragDistance(0);
        setIsTransitioning(true);

        if (currentSlide === slides.length - 1) {
            // Reached cloned first slide, jump to real first slide (index 1)
            setIsTransitioning(false);
            setCurrentSlide(1);
        } else if (currentSlide === 0) {
            // Reached cloned last slide, jump to real last slide (index slides.length - 2)
            setIsTransitioning(false);
            setCurrentSlide(slides.length - 2);
        }
    };

    // --- Image Loading Handlers ---
    const handleImageLoad = (imageUrl) => {
        setLoadedImages(prev => new Set(prev).add(imageUrl));
    };

    const handleImageError = (e, imageUrl) => {
        console.warn(`Failed to load image: ${imageUrl}`);
        // Set error image
        e.target.src = "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg";
        // Mark as loaded to prevent loading attempts
        setLoadedImages(prev => new Set(prev).add(imageUrl));
    };

    // Preload adjacent images for smoother transitions
    useEffect(() => {
        const preloadImages = () => {
            const currentIndex = currentSlide;
            const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : slides.length - 1;
            const nextIndex = (currentIndex + 1) % slides.length;

            [currentIndex, prevIndex, nextIndex].forEach(index => {
                const imageUrl = slides[index]?.image;
                if (imageUrl && !loadedImages.has(imageUrl)) {
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = () => handleImageLoad(imageUrl);
                    img.onerror = () => handleImageLoad(imageUrl); // Still mark as attempted
                }
            });
        };

        preloadImages();
    }, [currentSlide, slides, loadedImages]);

    // --- SWIPE HANDLERS ---
    const handleDragStart = (clientX) => {
        setIsTransitioning(false); // Disable transition for drag
        setIsDragging(true);
        setDragStartX(clientX);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging) return;
        const newDragDistance = clientX - dragStartX;
        setDragDistance(newDragDistance);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        setIsTransitioning(true); // Re-enable transition for snap-back/slide

        // Determine if a swipe threshold was met
        if (dragDistance > swipeThreshold) {
            // Swiped right (to the previous slide)
            prevSlide();
        } else if (dragDistance < -swipeThreshold) {
            // Swiped left (to the next slide)
            nextSlide();
        } else {
            // Not enough drag, snap back to the current slide without changing index.
            // This is handled automatically because we re-enable the transition.
            setDragDistance(0);
        }
    };

    // MOUSE handlers
    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onMouseUp = handleDragEnd;
    const onMouseLeave = (e) => isDragging && handleDragEnd(); // Stop dragging if mouse leaves the area

    // TOUCH handlers
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = handleDragEnd;

    // Calculate the total translation including the swipe offset
    const totalTranslateX = `calc(-${currentSlide * slideWidth}% + ${dragDistance}px)`;

    // Get current slide data (adjusting for cloned slides)
    const getCurrentSlideData = () => {
        let actualIndex = currentSlide - 1;
        if (currentSlide === 0) {
            actualIndex = data.length - 1; // Last real slide
        } else if (currentSlide === slides.length - 1) {
            actualIndex = 0; // First real slide
        }
        return data[actualIndex];
    };

    const currentSlideData = getCurrentSlideData();

    return (
        <div
            className={`relative w-full bg-white overflow-hidden ${rounded}`}
            // Add global mouse listeners to handle the release outside the container
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
                    style={{ transform: `translateX(${totalTranslateX})` }}
                    onTransitionEnd={handleTransitionEnd}

                    // Mouse and Touch Event Handlers
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {slides.map((item, index) => (
                        <div key={index} className="relative flex-none w-full h-full">
                            <div className="w-full" style={{ height: imageSize }}>
                                {item?.image ? (
                                    <img
                                        src={item.image}
                                        alt={`carousel-${index}`}
                                        className="object-cover w-full h-full select-none" // Fixed: object-fit to object-cover
                                        draggable="false" // Prevents default browser drag behavior on images
                                        onLoad={() => handleImageLoad(item.image)}
                                        onError={(e) => handleImageError(e, item.image)}
                                        loading="lazy" // Add lazy loading for better performance
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

            {/* Prev / Next buttons (Z-index updated to be below the status label but above slides) */}
            {data?.length > 1 && (
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

export default Slider;