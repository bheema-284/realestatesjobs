import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState, useRef, useEffect } from "react";

const Carousel = ({ customArrow, showSearch, customStyle, showOnhover, children }) => {
    const maxScrollWidth = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carousel = useRef(null);

    const movePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevState) => prevState - 1);
        }
    };

    const moveNext = () => {
        if (
            carousel.current !== null &&
            carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
        ) {
            setCurrentIndex((prevState) => prevState + 1);
        }
    };

    const isDisabled = (direction) => {
        if (direction === "prev") {
            return currentIndex <= 0;
        }

        if (direction === "next" && carousel.current !== null) {
            return (
                carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
            );
        }

        return false;
    };

    useEffect(() => {
        if (carousel !== null && carousel.current !== null) {
            carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
        }
    }, [currentIndex]);

    useEffect(() => {
        maxScrollWidth.current = carousel.current
            ? carousel.current.scrollWidth - carousel.current.offsetWidth
            : 0;
    }, []);

    return (
        <div className={`relative touch-auto ${showOnhover && "group/carousel"}`}>
            <div
                className={`left hidden h-full w-full lg:absolute lg:flex lg:justify-between`}
            >
                <button
                    style={{ zIndex: "9" }}
                    onClick={(e) => { movePrev(); e.stopPropagation() }}
                    disabled={isDisabled("prev")}
                    className={`${customStyle || ""} ${customArrow
                        ? "h-full opacity-10 "
                        : "rounded-full hover:opacity-100"
                        } m-0 my-auto w-7 cursor-pointer p-0 text-center ${showSearch && "bg-white opacity-50"} text-black opacity-10 drop-shadow-2xl transition-all duration-300 ease-in-out hover:opacity-100 disabled:opacity-0 lg:w-9 z-50`}
                >
                    <ChevronLeftIcon className="opacity-100" />
                </button>

                <button
                    onClick={(e) => { moveNext(); e.stopPropagation() }}
                    disabled={isDisabled("next")}
                    className={`${customStyle || ""}  ${customArrow ? "h-full opacity-10" : "rounded-full hover:opacity-100"
                        } m-0 my-auto flex w-7 cursor-pointer items-center ${showSearch && "bg-white opacity-50"} justify-center p-0 text-center text-black opacity-10 drop-shadow-2xl transition-all duration-300 ease-in-out hover:opacity-100 disabled:opacity-0 lg:w-9 z-50`}
                >
                    <ChevronRightIcon />
                </button>
            </div>
            <div
                ref={carousel}
                className="relative flex gap-2 overflow-hidden overflow-x-scroll carousel-container touch-auto scroll-smooth scrollbar-hide lg:gap-3 xl:gap-4"
            >
                {children}
            </div>
        </div>
    );
};
export default Carousel;
