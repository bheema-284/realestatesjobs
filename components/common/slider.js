import React, { useCallback, useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data = [], imageSize = "400px", rounded = "" }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [imageErrors, setImageErrors] = useState(new Set());
    const autoScrollRef = useRef(null);

    const AUTO_SCROLL_INTERVAL = 5000;

    // Debug data
    useEffect(() => {
        console.log("🔄 Slider State:", {
            totalImages: data?.length || 0,
            currentSlide,
            loadedImages: Array.from(loadedImages),
            imageErrors: Array.from(imageErrors)
        });
    }, [data, currentSlide, loadedImages, imageErrors]);

    // Normalize data
    const normalizedData = React.useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) {
            return data.filter(item => item != null);
        }
        return [data];
    }, [data]);

    // Navigation functions
    const nextSlide = useCallback(() => {
        if (normalizedData.length <= 1) return;

        setCurrentSlide(prev => {
            const next = prev + 1;
            return next >= normalizedData.length ? 0 : next;
        });
        setIsTransitioning(true);
    }, [normalizedData.length]);

    const prevSlide = useCallback(() => {
        if (normalizedData.length <= 1) return;

        setCurrentSlide(prev => {
            const next = prev - 1;
            return next < 0 ? normalizedData.length - 1 : next;
        });
        setIsTransitioning(true);
    }, [normalizedData.length]);

    // Auto-scroll
    useEffect(() => {
        if (normalizedData.length <= 1) {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
            return;
        }

        autoScrollRef.current = setInterval(() => {
            nextSlide();
        }, AUTO_SCROLL_INTERVAL);

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [normalizedData.length, nextSlide]);

    // Get image URL
    const getImageUrl = useCallback((item) => {
        if (!item) return null;

        // Handle string directly
        if (typeof item === 'string') return item;

        // Handle object with image property
        return item.image || item.url || item.src || item.imageUrl;
    }, []);

    // FIXED: Image loading handler - mark as loaded immediately if already cached
    const handleImageLoad = useCallback((imageUrl, index) => {
        console.log("✅ Image loaded successfully:", imageUrl, "at index:", index);
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    const handleImageError = useCallback((e, imageUrl, index) => {
        console.error("❌ Image failed to load:", imageUrl, "at index:", index);

        setImageErrors(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });

        // Still mark as "loaded" to remove loading indicator
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    }, []);

    // FIXED: Check if image is already loaded from cache
    const checkImageLoaded = useCallback((imageUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                console.log("🔄 Image already cached:", imageUrl);
                setLoadedImages(prev => {
                    const newSet = new Set(prev);
                    newSet.add(imageUrl);
                    return newSet;
                });
                resolve(true);
            };
            img.onerror = () => {
                console.log("🔄 Image not in cache:", imageUrl);
                resolve(false);
            };
            img.src = imageUrl;
        });
    }, []);

    // FIXED: Pre-check cached images on mount
    useEffect(() => {
        if (normalizedData.length === 0) return;

        console.log("🔍 Checking cached images...");

        normalizedData.forEach(async (item) => {
            const imageUrl = getImageUrl(item);
            if (imageUrl) {
                await checkImageLoaded(imageUrl);
            }
        });
    }, [normalizedData, getImageUrl, checkImageLoaded]);

    // Handle transition end
    const handleTransitionEnd = useCallback(() => {
        setIsTransitioning(false);
    }, []);

    // Handle indicator click
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        setIsTransitioning(true);
    }, []);

    // FIXED: Check if current image should show loading
    const shouldShowLoading = React.useMemo(() => {
        if (normalizedData.length === 0) return false;

        const currentImageUrl = getImageUrl(normalizedData[currentSlide]);
        if (!currentImageUrl) return false;

        const isLoading = !loadedImages.has(currentImageUrl);
        console.log("⏳ Loading check:", {
            currentSlide,
            currentImageUrl,
            isLoading,
            isInLoadedSet: loadedImages.has(currentImageUrl)
        });

        return isLoading;
    }, [normalizedData, currentSlide, getImageUrl, loadedImages]);

    // Early return for no data
    if (!normalizedData || normalizedData.length === 0) {
        return (
            <div
                className={`relative w-full bg-gray-200 overflow-hidden flex items-center justify-center ${rounded}`}
                style={{ height: imageSize }}
            >
                <div className="text-gray-500 text-center p-4">
                    <div className="text-lg font-semibold mb-2">No Images Available</div>
                    <div className="text-sm">Please check your data source</div>
                </div>
            </div>
        );
    }

    // Single image case
    if (normalizedData.length === 1) {
        const singleItem = normalizedData[0];
        const imageUrl = getImageUrl(singleItem);
        const isLoading = imageUrl && !loadedImages.has(imageUrl);

        return (
            <div
                className={`relative w-full bg-white overflow-hidden ${rounded}`}
                style={{ height: imageSize }}
            >
                {singleItem?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-xs font-semibold px-3 py-1 z-30 rounded">
                        {singleItem.status}
                    </span>
                )}

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-gray-600">Loading image...</span>
                    </div>
                )}

                <div className="w-full h-full">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Property"
                            className="w-full h-full object-cover"
                            onLoad={() => handleImageLoad(imageUrl, 0)}
                            onError={(e) => handleImageError(e, imageUrl, 0)}
                            // FIXED: Add crossOrigin attribute for better loading
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="w-full h-full bg-red-100 flex items-center justify-center">
                            <div className="text-red-500 text-center">
                                <div className="text-lg font-semibold mb-1">Invalid Image Data</div>
                                <div className="text-sm">No valid image URL found</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Multiple images case
    return (
        <div
            className={`relative w-full bg-white overflow-hidden ${rounded}`}
            style={{ height: imageSize }}
        >
            {/* Status badge */}
            {normalizedData[currentSlide]?.status && (
                <span className="absolute top-3 left-3 bg-orange-300 text-white text-xs font-semibold px-3 py-1 z-30 rounded">
                    {normalizedData[currentSlide].status}
                </span>
            )}

            {/* FIXED: Loading indicator with better logic */}
            {shouldShowLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600">
                        Loading {currentSlide + 1} of {normalizedData.length}
                    </span>
                </div>
            )}

            {/* Slides container */}
            <div
                className={`flex h-full ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''
                    }`}
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${normalizedData.length * 100}%`
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {normalizedData.map((item, index) => {
                    const imageUrl = getImageUrl(item);
                    const isError = imageErrors.has(imageUrl);

                    return (
                        <div
                            key={`slide-${index}-${imageUrl || 'no-image'}`}
                            className="flex-none w-full h-full"
                            style={{ width: `${100 / normalizedData.length}%` }}
                        >
                            <div className="w-full h-full">
                                {imageUrl ? (
                                    <>
                                        {isError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-20">
                                                <div className="text-red-500 text-center">
                                                    <div className="text-lg font-semibold mb-1">Failed to load</div>
                                                    <div className="text-sm">{imageUrl}</div>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={imageUrl}
                                            alt={`Property view ${index + 1}`}
                                            className={`w-full h-full object-cover ${isError ? 'opacity-30' : ''
                                                }`}
                                            onLoad={() => handleImageLoad(imageUrl, index)}
                                            onError={(e) => handleImageError(e, imageUrl, index)}
                                            // FIXED: Important for cached images
                                            crossOrigin="anonymous"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-yellow-100 flex items-center justify-center border-2 border-yellow-300">
                                        <div className="text-yellow-700 text-center p-4">
                                            <div className="text-lg font-semibold mb-1">No Image URL</div>
                                            <div className="text-sm mb-2">Slide {index + 1}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation buttons */}
            {normalizedData.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-1/2 left-4 z-20 flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={prevSlide}
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    <button
                        type="button"
                        className="absolute top-1/2 right-4 z-20 flex items-center justify-center w-10 h-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={nextSlide}
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Slide indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                        {normalizedData.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${index === currentSlide
                                        ? 'bg-white scale-110'
                                        : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Slide counter */}
                    <div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {currentSlide + 1} / {normalizedData.length}
                    </div>
                </>
            )}
        </div>
    );
}

export default React.memo(Slider);