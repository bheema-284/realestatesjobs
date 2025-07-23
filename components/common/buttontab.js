'use client';
import React, { useState, useRef } from 'react';

export default function ButtonTab({ tabs, activeTab, setActiveTab }) {
    const [indicatorStyle, setIndicatorStyle] = useState({}); // State for the moving indicator's style
    const tabRefs = useRef([]); // Ref to store references to each tab button
    const tabContainerRef = useRef(null); // Ref for the main tab container

    const handleTabClick = (index,) => {
        const tab = tabRefs.current[index];
        setActiveTab(index)
        if (tab) {
            setIndicatorStyle({
                width: tab.offsetWidth,
                left: tab.offsetLeft,
                opacity: 1,
            });
        }
    };

    const handleMouseEnter = (index) => {
        const tab = tabRefs.current[index];
        if (tab) {
            setIndicatorStyle({
                width: tab.offsetWidth,
                left: tab.offsetLeft,
                opacity: 1,
            });
        }
    };

    const handleMouseLeave = () => {
        setIndicatorStyle({
            opacity: 0,
        });
    };


    return (
        <div
            ref={tabContainerRef}
            className="flex flex-row justify-between bg-white rounded-t-md relative overflow-hidden"
            onMouseLeave={handleMouseLeave}
        >
            {/* Moving background indicator */}
            <span
                className="absolute bottom-0 h-full bg-gray-200 rounded-t-md transition-all duration-300 ease-in-out z-0"
                style={{
                    ...indicatorStyle,
                    transition: 'all 0.3s ease-in-out, opacity 0.2s ease-in-out',
                }}
            ></span>
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    ref={el => tabRefs.current[index] = el} // Assign ref to each button
                    className={`py-1 px-3 rounded-t-md transition-colors relative font-medium z-10
                            transition-colors duration-300 ease-in-out
                            ${activeTab === index
                            ? 'bg-indigo-900 text-white' // Active tab text color (bg handled by indicator)
                            : 'text-gray-700' // Non-active tab text color
                        }`}
                    onClick={() => handleTabClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}// Listen for mouse entering individual tab
                >
                    <span className="flex flex-wrap items-center justify-center gap-1">
                        <span>{tab.name}</span>
                    </span>
                </button>
            ))}
        </div>
    );
}
