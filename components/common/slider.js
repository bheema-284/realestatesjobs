import React, { useCallback, useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data, imageSize = "400px", rounded }) {
    const [imagesData, setImagesData] = useState(data || []);
    const [currentSlide, setCurrentSlide] = useState(0); // Start from 0 for simpler logic
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());

    // State for swiping logic
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    // Refs for auto-scroll and cleanup
    const autoScrollRef = useRef(null);
    const isMountedRef = useRef(true);
    const sliderContainerRef = useRef(null);

    const slideWidth = 100;
    const swipeThreshold = 50;
    const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds

    // --- Sync data prop with state ---
    useEffect(() => {
        if (data && data.length > 0) {
            console.log("🔄 Slider received data:", data.length, "images");
            setImagesData(data);
            setCurrentSlide(0);
            setLoadedImages(new Set());
        }
    }, [data]);

    // --- Navigation Functions ---
    const nextSlide = useCallback(() => {
        if (imagesData.length <= 1 || !isMountedRef.current) return;

        setCurrentSlide((prev) => {
            const next = prev + 1;
            return next >= imagesData.length ? 0 : next;
        });
        setIsTransitioning(true);

        console.log("➡️ Next slide:", currentSlide + 1, "of", imagesData.length);
    }, [imagesData.length, currentSlide]);

    const prevSlide = useCallback(() => {
        if (imagesData.length <= 1 || !isMountedRef.current) return;

        setCurrentSlide((prev) => {
            const next = prev - 1;
            return next < 0 ? imagesData.length - 1 : next;
        });
        setIsTransitioning(true);

        console.log("⬅️ Previous slide:", currentSlide - 1, "of", imagesData.length);
    }, [imagesData.length, currentSlide]);

    // --- FIXED Auto-scroll Effect ---
    useEffect(() => {
        if (imagesData.length <= 1) {
            // Clear interval if only one image
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
                autoScrollRef.current = null;
            }
            return;
        }

        // Clear any existing interval first
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }

        console.log("🔄 Starting auto-scroll with", imagesData.length, "images");

        // Start new interval
        autoScrollRef.current = setInterval(() => {
            if (isMountedRef.current && !isDragging) {
                nextSlide();
            }
        }, AUTO_SCROLL_INTERVAL);

        // Cleanup on unmount or dependency change
        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
                autoScrollRef.current = null;
            }
        };
    }, [imagesData.length, isDragging, nextSlide]);

    // --- Infinite Loop Logic ---
    const handleTransitionEnd = useCallback(() => {
        if (!isMountedRef.current) return;

        setDragDistance(0);
        setIsTransitioning(false);

        console.log("🔄 Transition ended at slide:", currentSlide);
    }, [currentSlide]);

    // --- Image Loading Handlers ---
    const handleImageLoad = useCallback((imageUrl) => {
        if (!isMountedRef.current) return;
        console.log("✅ Image loaded:", imageUrl);
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    const handleImageError = useCallback((e, imageUrl) => {
        if (!isMountedRef.current) return;
        console.warn("❌ Failed to load image:", imageUrl);
        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%239ca3af'%3EImage%3C/text%3E%3C/svg%3E";

        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    // --- Preload images ---
    useEffect(() => {
        if (imagesData.length <= 1) return;

        console.log("📥 Preloading images...");

        imagesData.forEach((item, index) => {
            const imageUrl = item?.image;
            if (imageUrl && !loadedImages.has(imageUrl)) {
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => handleImageLoad(imageUrl);
                img.onerror = () => handleImageLoad(imageUrl);
                console.log(`📥 Preloading image ${index + 1}:`, imageUrl);
            }
        });
    }, [imagesData, loadedImages, handleImageLoad]);

    // --- SWIPE HANDLERS ---
    const handleDragStart = useCallback((clientX) => {
        if (imagesData.length <= 1) return;
        console.log("🖱️ Drag started");
        setIsTransitioning(false);
        setIsDragging(true);
        setDragStartX(clientX);

        // Pause auto-scroll during interaction
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    }, [imagesData.length]);

    const handleDragMove = useCallback((clientX) => {
        if (!isDragging || imagesData.length <= 1) return;
        const newDragDistance = clientX - dragStartX;
        setDragDistance(newDragDistance);
    }, [isDragging, dragStartX, imagesData.length]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging || imagesData.length <= 1) return;

        console.log("🖱️ Drag ended");
        setIsDragging(false);
        setIsTransitioning(true);

        if (dragDistance > swipeThreshold) {
            prevSlide();
        } else if (dragDistance < -swipeThreshold) {
            nextSlide();
        } else {
            setDragDistance(0);
        }

        // Restart auto-scroll after interaction
        if (!autoScrollRef.current && imagesData.length > 1) {
            autoScrollRef.current = setInterval(nextSlide, AUTO_SCROLL_INTERVAL);
        }
    }, [isDragging, dragDistance, imagesData.length, prevSlide, nextSlide]);

    // Event Handlers
    const onMouseDown = (e) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        handleDragMove(e.clientX);
    };

    const onMouseUp = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        handleDragEnd();
    };

    const onMouseLeave = (e) => {
        if (isDragging) {
            e.preventDefault();
            handleDragEnd();
        }
    };

    const onTouchStart = (e) => {
        e.preventDefault();
        handleDragStart(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        handleDragMove(e.touches[0].clientX);
    };

    const onTouchEnd = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        handleDragEnd();
    };

    // Calculate transform
    const totalTranslateX = imagesData.length > 0
        ? `translateX(calc(-${currentSlide * slideWidth}% + ${dragDistance}px))`
        : 'translateX(0)';

    // Get current slide data
    const currentSlideData = imagesData[currentSlide];

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
                autoScrollRef.current = null;
            }
        };
    }, []);

    // Debug current state
    useEffect(() => {
        console.log("🎠 Slider State:", {
            totalImages: imagesData.length,
            currentSlide,
            isTransitioning,
            isDragging,
            loadedImages: loadedImages.size
        });
    }, [imagesData.length, currentSlide, isTransitioning, isDragging, loadedImages.size]);

    // Early return if no data
    if (!data || data.length === 0) {
        return (
            <div className={`relative w-full bg-white overflow-hidden ${rounded}`} style={{ height: imageSize }}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500">No images available</div>
                </div>
            </div>
        );
    }

    // Single image case
    if (data.length === 1) {
        const singleImage = data[0];
        return (
            <div className={`relative w-full bg-white overflow-hidden ${rounded}`} style={{ height: imageSize }}>
                {singleImage?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1 z-30">
                        {singleImage.status}
                    </span>
                )}
                <div className="w-full h-full">
                    <img
                        src={singleImage.image}
                        alt="carousel"
                        className="object-cover w-full h-full"
                        loading="eager"
                        onLoad={() => handleImageLoad(singleImage.image)}
                        onError={(e) => handleImageError(e, singleImage.image)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={sliderContainerRef}
            className={`relative w-full bg-white overflow-hidden ${rounded}`}
            style={{ height: imageSize }}
        >
            <div className="relative w-full h-full">
                {/* Fixed label */}
                {currentSlideData?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1 z-30">
                        {currentSlideData.status}
                    </span>
                )}

                {/* Loading indicator */}
                {!loadedImages.has(currentSlideData?.image) && currentSlideData?.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-gray-600">Loading image {currentSlide + 1} of {imagesData.length}</span>
                    </div>
                )}

                {/* Slides wrapper */}
                <div
                    className={`flex h-full cursor-grab active:cursor-grabbing ${isTransitioning && !isDragging ? "transition-transform duration-500 ease-in-out" : ""
                        }`}
                    style={{
                        transform: totalTranslateX,
                        width: `${imagesData.length * 100}%`
                    }}
                    onTransitionEnd={handleTransitionEnd}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {imagesData.map((item, index) => (
                        <div
                            key={`${item?.image || 'empty'}-${index}`}
                            className="flex-none w-full h-full"
                            style={{ width: `${100 / imagesData.length}%` }}
                        >
                            <div className="w-full h-full">
                                {item?.image ? (
                                    <img
                                        src={item.image}
                                        alt={`carousel-${index}`}
                                        className="object-cover w-full h-full select-none"
                                        draggable="false"
                                        loading={index === currentSlide ? "eager" : "lazy"}
                                        onLoad={() => handleImageLoad(item.image)}
                                        onError={(e) => handleImageError(e, item.image)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <div className="text-gray-400 text-sm">No image</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation buttons */}
            {imagesData.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-1/2 left-2 z-20 flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    <button
                        type="button"
                        className="absolute top-1/2 right-2 z-20 flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Slide indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                        {imagesData.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50'
                                    }`}
                                onClick={() => {
                                    setCurrentSlide(index);
                                    setIsTransitioning(true);
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default React.memo(Slider);