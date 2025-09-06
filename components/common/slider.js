import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

function Slider({ data }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(
        (index) => {
            setCurrentSlide(index ?? (currentSlide + 1) % (data?.length || 1));
        },
        [currentSlide, data?.length]
    );

    useEffect(() => {
        const autoScrollInterval = setInterval(nextSlide, 3000);

        return () => {
            clearInterval(autoScrollInterval);
        };
    }, [nextSlide]);

    return (
        <div id="default-carousel" className="relative w-full bg-white" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative h-72 w-full overflow-hidden">
                {/* Image container */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {data?.map((item, index) => (
                        <div key={index} className="flex-none w-full" data-carousel-item>
                            {item?.image ? (
                                <img
                                    src={item.image}
                                    alt={`carousel-${index}`}
                                    className="object-cover w-full h-full lg:group-hover/item:delay-500 lg:group-hover/item:rounded-r-none"
                                />
                            ) : (
                                <Image
                                    src="https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"
                                    alt="error image"
                                    priority={false}
                                    fill={true}
                                    sizes="100vw"
                                    className="lg:w-full object-cover aspect-[16/9]"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Slider indicators */}
            {data?.length > 1 && (
                <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                    {data.map((_, index) => (
                        <button
                            onClick={() => nextSlide(index)}
                            key={index}
                            type="button"
                            className={`w-3 h-3 rounded-full ${currentSlide === index
                                ? 'bg-red-700 opacity-80'
                                : 'bg-red-200 opacity-50'
                                }`}
                            aria-current={currentSlide === index ? 'true' : 'false'}
                            aria-label={`Slide ${index + 1}`}
                            data-carousel-slide-to={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Slider;