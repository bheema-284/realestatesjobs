import React, { useState, useRef, useEffect } from "react";

const AutoScrollLogos = ({ logos, scrollSpeed = 0.5, onLogoClick }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Duplicate logos for seamless loop
    const loopedLogos = [...logos, ...logos];

    // Automatic scrolling
    useEffect(() => {
        let animationFrameId;
        const animateScroll = () => {
            if (containerRef.current && !isDragging) {
                const { scrollLeft, scrollWidth } = containerRef.current;
                const halfScrollWidth = scrollWidth / 2;

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

    // MOUSE EVENTS
    const handleMouseDown = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - containerRef.current.offsetLeft);
            setScrollLeft(containerRef.current.scrollLeft);
            e.preventDefault();
        }
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        handleScrollLogic(x);
    };

    // TOUCH EVENTS (for mobile)
    const handleTouchStart = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
            setScrollLeft(containerRef.current.scrollLeft);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        handleScrollLogic(x);
    };

    const handleTouchEnd = () => setIsDragging(false);

    // Common scroll logic (used by both mouse and touch)
    const handleScrollLogic = (x) => {
        const walk = x - startX;
        const newScrollLeft = scrollLeft - walk;

        const { scrollWidth } = containerRef.current;
        const halfScrollWidth = scrollWidth / 2;

        if (newScrollLeft <= 0) {
            containerRef.current.scrollLeft = newScrollLeft + halfScrollWidth;
        } else if (newScrollLeft >= halfScrollWidth) {
            containerRef.current.scrollLeft = newScrollLeft - halfScrollWidth;
        } else {
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
            {/* Gradient overlays */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Logos */}
            <div className="flex w-max">
                {loopedLogos.map((recruiter, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 mx-10 flex items-center justify-center"
                        style={{ width: 200 }}
                        onClick={() => onLogoClick(recruiter.id)}
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

export default AutoScrollLogos;
