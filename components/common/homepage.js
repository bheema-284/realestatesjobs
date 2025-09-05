'use client'
import Slider from "./slider";

export default function HomePage() {
    const dummyData = [
        {
            images: [
                { aspect: "16:9", image: "https://picsum.photos/800/600?random=3" },
                { aspect: "4:3", image: "https://picsum.photos/800/600?random=2" }
            ]
        },
        {
            images: [
                { aspect: "16:9", image: "https://picsum.photos/1920/1080?random=6" },
                { aspect: "4:3", image: "https://picsum.photos/800/600?random=2" }
            ]
        },
        {
            images: [
                { aspect: "16:9", image: "https://picsum.photos/1920/1080?random=8" },
                { aspect: "4:3", image: "https://picsum.photos/800/600?random=2" }
            ]
        }
    ];

    return (
        <div className="text-[20px] text-red-500 flex justify-center items-center px-5 mt-32">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700">
                <Slider data={dummyData} />
            </h1>
        </div>
    );
}
