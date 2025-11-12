import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function Slider({ data, imageSize = "400px", rounded }) {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [clickLocked, setClickLocked] = useState(false); // prevent spam clicks

    const slides = [data[data.length - 1], ...data, data[0]];
    const slideWidth = 100;
    const swipeThreshold = 50;

    const transitionTimeout = useRef(null);
    const preloadCache = useRef(new Set());

    // --- Smooth Click Handling ---
    const safeNextSlide = useCallback(() => {
        if (clickLocked) return;
        setClickLocked(true);
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => setClickLocked(false), 500); // unlock after animation
    }, [clickLocked]);

    const safePrevSlide = useCallback(() => {
        if (clickLocked) return;
        setClickLocked(true);
        setIsTransitioning(true);
        setCurrentSlide(prev => prev - 1);
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => setClickLocked(false), 500);
    }, [clickLocked]);

    // --- Auto-scroll ---
    useEffect(() => {
        if (isDragging) return;
        const autoScroll = setInterval(() => safeNextSlide(), 4000);
        return () => clearInterval(autoScroll);
    }, [safeNextSlide, isDragging]);

    // --- Transition Looping ---
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
    const handleImageLoad = (imageUrl) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageUrl);
            return newSet;
        });
    };

    const handleImageError = (e, imageUrl) => {
        e.target.src = "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg";
        handleImageLoad(imageUrl);
    };

    // --- Aggressive Preloading ---
    useEffect(() => {
        const preloadImages = () => {
            const indices = [
                currentSlide,
                currentSlide + 1,
                currentSlide - 1,
                currentSlide + 2,
                currentSlide - 2
            ];

            indices.forEach(i => {
                const index = (i + slides.length) % slides.length;
                const imgUrl = slides[index]?.image;
                if (imgUrl && !preloadCache.current.has(imgUrl)) {
                    preloadCache.current.add(imgUrl);
                    const img = new Image();
                    img.src = imgUrl;
                    img.onload = () => handleImageLoad(imgUrl);
                    img.onerror = () => handleImageLoad(imgUrl);
                }
            });
        };

        preloadImages();
    }, [currentSlide, slides]);

    // --- SWIPE HANDLERS ---
    const handleDragStart = (clientX) => {
        setIsTransitioning(false);
        setIsDragging(true);
        setDragStartX(clientX);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging) return;
        setDragDistance(clientX - dragStartX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsTransitioning(true);
        if (dragDistance > swipeThreshold) safePrevSlide();
        else if (dragDistance < -swipeThreshold) safeNextSlide();
        else setDragDistance(0);
    };

    const totalTranslateX = `calc(-${currentSlide * slideWidth}% + ${dragDistance}px)`;

    // --- Active Slide Data ---
    const getCurrentSlideData = () => {
        let actualIndex = currentSlide - 1;
        if (currentSlide === 0) actualIndex = data.length - 1;
        else if (currentSlide === slides.length - 1) actualIndex = 0;
        return data[actualIndex];
    };

    const currentSlideData = getCurrentSlideData();

    return (
        <div
            className={`relative w-full bg-white overflow-hidden ${rounded}`}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => isDragging && handleDragEnd()}
        >
            <div className="relative w-full" style={{ height: imageSize }}>
                {currentSlideData?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1 z-30">
                        {currentSlideData.status}
                    </span>
                )}

                {!loadedImages.has(slides[currentSlide]?.image) && slides[currentSlide]?.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                )}

                <div
                    className={`flex cursor-grab ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{ transform: `translateX(${totalTranslateX})` }}
                    onTransitionEnd={handleTransitionEnd}
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                >
                    {slides.map((item, index) => (
                        <div key={index} className="relative flex-none w-full h-full">
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

            {data?.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={safePrevSlide}
                        aria-label="Previous slide"
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={safeNextSlide}
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