import React, { useState, useRef, useEffect } from "react";

// Component for the auto-scrolling logo carousel.
// It automatically scrolls forward and can be dragged by the user.
const AutoScrollLogos = ({ logos, scrollSpeed = 0.5 }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Duplicate logos to create a seamless, infinite loop effect
    const loopedLogos = [...logos, ...logos];

    // Handles the automatic scrolling animation.
    useEffect(() => {
        let animationFrameId;
        const animateScroll = () => {
            if (containerRef.current && !isDragging) {
                const { scrollLeft, scrollWidth } = containerRef.current;
                const halfScrollWidth = scrollWidth / 2;

                // Check if we've scrolled past the first set of logos
                // and seamlessly reset to the beginning to loop
                if (scrollLeft >= halfScrollWidth) {
                    containerRef.current.scrollLeft = scrollLeft - halfScrollWidth;
                } else {
                    containerRef.current.scrollLeft += scrollSpeed;
                }
            }
            animationFrameId = requestAnimationFrame(animateScroll);
        };

        animationFrameId = requestAnimationFrame(animateScroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isDragging, scrollSpeed]);

    // Handle mouse drag-to-scroll functionality.
    const handleMouseDown = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            // Get initial position and current scroll position
            setStartX(e.pageX - containerRef.current.offsetLeft);
            setScrollLeft(containerRef.current.scrollLeft);
            e.preventDefault();
        }
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    // The core logic for handling both forward and reverse drag-to-scroll.
    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX);
        const newScrollLeft = scrollLeft - walk;

        const { scrollWidth } = containerRef.current;
        const halfScrollWidth = scrollWidth / 2;

        // Logic to handle seamless looping in both directions
        if (newScrollLeft <= 0) {
            // If scrolled to the beginning, jump to the same spot in the duplicated set
            containerRef.current.scrollLeft = newScrollLeft + halfScrollWidth;
        } else if (newScrollLeft >= halfScrollWidth) {
            // If scrolled to the end, jump to the same spot in the first set
            containerRef.current.scrollLeft = newScrollLeft - halfScrollWidth;
        } else {
            // Otherwise, scroll normally
            containerRef.current.scrollLeft = newScrollLeft;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden py-6 bg-transparent"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
            {/* Gradient overlays for a faded edge effect */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

            {/* The main row of logos */}
            <div className="flex w-max">
                {loopedLogos.map((recruiter, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 mx-10 flex items-center justify-center"
                        style={{ width: 200 }}
                    >
                        <img
                            src={recruiter.logo}
                            alt={recruiter.name}
                            className="h-28 w-auto object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AutoScrollLogos
