import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomImage } from './customimage';

function Slider(props) {
    const { data } = props;
    const _retunimage = (arr, ratio) => {
        console.log("arr", arr)
        if (Array.isArray(arr)) {
            let corrImage = arr.find((item) => item.aspect === ratio);
            return corrImage?.image;
        } else return ""
    };
    const [currentSlide, setCurrentSlide] = useState(0);
    const nextSlide = useCallback((index) => {
        setCurrentSlide(index || (currentSlide + 1) % data?.length || 0);
    }, [currentSlide, data?.length]);

    useEffect(() => {
        const autoScrollInterval = setInterval(nextSlide, 3000);

        return () => {
            clearInterval(autoScrollInterval);
        };
    }, [nextSlide]);

    return (
        <div id="default-carousel" className="relative w-full bg-white" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden md:h-[750px] flex">
                {data?.map((item, index) => (
                    <div
                        key={index}
                        className={`duration-700 ease-in-out transition-opacity ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                        data-carousel-item
                    >
                        {Array.isArray(item.images) && item.images.length > 0 && <CustomImage
                            fill={true}
                            priority={false}
                            src={_retunimage(item.images || [], "16:9")}
                            alt={"carousel"}
                            className={"object-cover lg:group-hover/item:delay-500 lg:group-hover/item:rounded-r-none"}
                            sizes={"100vw"}
                            style={{ objectFit: "fill" }}
                        />}
                        {(!item.images || item.images.length === 0) && <Image
                            src={"https://images.travelxp.com/images/txpin/vector/general/errorimage.svg"}
                            alt={"error image"}
                            priority={false}
                            fill={true}
                            sizes={"100vw"}
                            className={'lg:w-full object-cover aspect-[16/9]'}
                        />}
                    </div>
                ))}
            </div>
            {/* Slider indicators */}
            {data?.length > 1 && <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                {data?.map((_, index) => (
                    <button
                        onClick={() => nextSlide(index)}
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-red-700 opacity-80' : 'bg-red-200 opacity-50'}`}
                        aria-current={currentSlide === index ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                        data-carousel-slide-to={index}
                    />
                ))}
            </div>}
        </div>
    );
}

export default Slider;
