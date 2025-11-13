import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ObjectId } from "bson"; // remove if not used elsewhere

function Slider({ data, imageSize = "400px", rounded }) {
    // Basic state
    const [currentSlide, setCurrentSlide] = useState(1); // slides arr uses clones
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef(0);
    const dragDistanceRef = useRef(0);

    // Slide structure (clone last and first)
    const slides = [data[data.length - 1], ...data, data[0]];

    // Queue & processor refs
    const targetSlideRef = useRef(1); // desired slide index in `slides`
    const processingRef = useRef(false); // whether processor loop is running
    const directionRef = useRef(0); // -1 or +1 direction current step
    const preloadCache = useRef(new Set());
    const slideWidth = 100;
    const swipeThreshold = 50;

    // Configuration - how many images ahead/behind to preload
    const PRELOAD_AHEAD = 25; // <-- aggressive preloading window

    // Helper to mark loaded images
    const markLoaded = useCallback((url) => {
        setLoadedImages(prev => {
            const s = new Set(prev);
            s.add(url);
            return s;
        });
    }, []);

    // Preload function - preloads a window around a given index
    const preloadWindow = useCallback((centerIndex) => {
        for (let offset = -PRELOAD_AHEAD; offset <= PRELOAD_AHEAD; offset++) {
            const i = (centerIndex + offset + slides.length) % slides.length;
            const url = slides[i]?.image;
            if (url && !preloadCache.current.has(url)) {
                preloadCache.current.add(url);
                const img = new Image();
                img.src = url;
                img.onload = () => markLoaded(url);
                img.onerror = () => markLoaded(url); // mark attempted
            }
        }
    }, [slides, markLoaded]);

    // Processor: advance one step toward targetSlideRef until equal
    const processQueueStep = useCallback(() => {
        if (processingRef.current) return; // already running
        processingRef.current = true;

        const step = async () => {
            try {
                // continue until currentSlide equals targetSlideRef
                while (targetSlideRef.current !== currentSlide) {
                    const desired = targetSlideRef.current;
                    // compute direction of next small step (-1 or +1)
                    const diff = desired - currentSlide;
                    // Normalize diff to shortest path across clones? we step linear through slides array
                    const stepDir = diff > 0 ? 1 : -1;
                    directionRef.current = stepDir;

                    // enable transition and step one slide
                    setIsTransitioning(true);
                    // update slide using function to capture latest
                    setCurrentSlide(prev => prev + stepDir);

                    // Wait for the transition to finish. We'll await a Promise that resolves on next animation frame
                    // and also use onTransitionEnd which will call continue. But since we can't await that easily here,
                    // we'll poll waiting for `isTransitioning` flip to false when loop reset occurs or wait fixed time.
                    // We choose to wait for the CSS duration (700ms) plus tiny buffer.
                    await new Promise(res => setTimeout(res, 720)); // must match CSS duration

                    // Preload window around new currentSlide
                    preloadWindow(currentSlide + stepDir);
                }
            } finally {
                processingRef.current = false;
            }
        };

        step();
    }, [currentSlide, preloadWindow]);

    // Public navigation — update targetRef then trigger processor
    const enqueueNext = useCallback(() => {
        targetSlideRef.current = targetSlideRef.current + 1;
        // process queue (if not already)
        requestAnimationFrame(() => processQueueStep());
    }, [processQueueStep]);

    const enqueuePrev = useCallback(() => {
        targetSlideRef.current = targetSlideRef.current - 1;
        requestAnimationFrame(() => processQueueStep());
    }, [processQueueStep]);

    // Handle transition end for loop reset (no visible jump)
    const handleTransitionEnd = useCallback(() => {
        // If we reached cloned first or cloned last, jump to real slide without transition
        if (currentSlide === slides.length - 1) {
            // jumped to cloned first -> switch to index 1 (real first)
            setIsTransitioning(false);
            setCurrentSlide(1);
            // ensure targetRef tracks new current (so queue logic continues correctly)
            targetSlideRef.current = Math.max(1, targetSlideRef.current - (slides.length - 2));
        } else if (currentSlide === 0) {
            // jumped to cloned last -> switch to last real index
            setIsTransitioning(false);
            setCurrentSlide(slides.length - 2);
            targetSlideRef.current = Math.min(slides.length - 2, targetSlideRef.current + (slides.length - 2));
        }

        // always preload around active slide
        preloadWindow(currentSlide);
    }, [currentSlide, slides.length, preloadWindow]);

    // Aggressive preloading on mount and slide change
    useEffect(() => {
        preloadWindow(currentSlide);
    }, [currentSlide, preloadWindow]);

    // Auto-scroll (respects queue — auto enqueues)
    useEffect(() => {
        if (isDragging) return;
        const id = setInterval(() => {
            enqueueNext();
        }, 4000);
        return () => clearInterval(id);
    }, [enqueueNext, isDragging]);

    // --- Image handlers ---
    const handleImageLoad = (url) => markLoaded(url);
    const handleImageError = (e, url) => {
        e.target.src = "https://images.travelxp.com/images/txpin/vector/general/errorimage.svg";
        markLoaded(url);
    };

    // --- Drag / Swipe handlers (cancel queue when user actively drags?) ---
    const onDragStart = (clientX) => {
        setIsTransitioning(false);
        setIsDragging(true);
        dragStartXRef.current = clientX;
        dragDistanceRef.current = 0;
    };
    const onDragMove = (clientX) => {
        if (!isDragging) return;
        dragDistanceRef.current = clientX - dragStartXRef.current;
        // we aren't updating visual drag state via React state to reduce re-renders; we store in ref and use inline style below
    };
    const onDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsTransitioning(true);

        const d = dragDistanceRef.current;
        dragDistanceRef.current = 0;

        if (d > swipeThreshold) {
            // swipe right -> prev
            enqueuePrev();
        } else if (d < -swipeThreshold) {
            enqueueNext();
        } else {
            // snap back
            // no change to queue
        }
    };

    // Derived translate including drag (we read ref for dragDistance)
    const dragPx = isDragging ? `${dragDistanceRef.current}px` : "0px";
    const totalTranslateX = `calc(-${currentSlide * slideWidth}% + ${dragPx})`;

    // Utility: get actual slide data (adjust clones)
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
            onMouseUp={onDragEnd}
            onMouseLeave={() => isDragging && onDragEnd()}
        >
            <div className="relative w-full" style={{ height: imageSize }}>
                {/* Fixed label */}
                {currentSlideData?.status && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-white text-[9px] font-semibold px-3 border border-white py-1 z-30">
                        {currentSlideData.status}
                    </span>
                )}

                {/* Loading indicator: show when the current slide image hasn't been loaded yet */}
                {!loadedImages.has(slides[currentSlide]?.image) && slides[currentSlide]?.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                )}

                <div
                    className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{ transform: `translateX(${totalTranslateX})` }}
                    onTransitionEnd={handleTransitionEnd}
                    onMouseDown={(e) => onDragStart(e.clientX)}
                    onMouseMove={(e) => onDragMove(e.clientX)}
                    onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
                    onTouchEnd={onDragEnd}
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

            {/* Buttons */}
            {data?.length > 1 && (
                <>
                    <button
                        type="button"
                        className="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={enqueuePrev}
                        aria-label="Previous slide"
                    >
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </span>
                    </button>

                    <button
                        type="button"
                        className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={enqueueNext}
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