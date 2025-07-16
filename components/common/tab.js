'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState(0); // State to manage the active tab (clicked)
    const [indicatorStyle, setIndicatorStyle] = useState({}); // State for the moving indicator's style
    const tabRefs = useRef([]); // Ref to store references to each tab button
    const tabContainerRef = useRef(null); // Ref for the main tab container

    // Define your tabs here. You can expand this with more sections.
    const tabs = [
        { name: 'About Me', component: <div>Content for About Me</div> },
        { name: 'Applications', component: <div>Content for Applications</div> },
        { name: 'Marketing', component: <div>Content for Marketing</div> },
        { name: 'Projects', component: <div>Content for Projects</div> },
        { name: 'Services', component: <div>Content for Services</div> },
    ];

    // Function to calculate and set indicator style for a given tab index
    const updateIndicatorStyle = (index) => {
        if (tabRefs.current[index]) {
            const targetButton = tabRefs.current[index];
            setIndicatorStyle({
                width: targetButton.offsetWidth,
                left: targetButton.offsetLeft,
            });
        }
    };

    // Effect to set initial indicator position to the active tab
    // and recalculate on activeTab change or window resize
    useEffect(() => {
        updateIndicatorStyle(activeTab);

        const handleResize = () => {
            updateIndicatorStyle(activeTab);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [activeTab]);

    // Handle hover effect: move indicator to hovered tab
    const handleMouseEnter = (index) => {
        updateIndicatorStyle(index);
    };

    // Handle mouse leave from the entire tab container: move indicator back to active tab
    const handleMouseLeave = () => {
        updateIndicatorStyle(activeTab);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Tab Navigation */}
            <div
                ref={tabContainerRef}
                className="hidden sm:flex gap-4 text-sm mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200 relative"
                onMouseLeave={handleMouseLeave} // Listen for mouse leaving the entire tab container
            >
                {/* Moving background indicator */}
                <span
                    className="absolute bottom-0 h-full bg-gray-100 rounded-md transition-all duration-300 ease-in-out z-0"
                    style={indicatorStyle}
                ></span>

                {tabs.map((tab, index) => (
                    <button
                        key={tab.name}
                        ref={el => tabRefs.current[index] = el} // Assign ref to each button
                        className={`relative py-2 px-4 rounded-md font-medium z-10
                            transition-colors duration-300 ease-in-out
                            ${activeTab === index
                                ? 'text-indigo-800' // Active tab text color (bg handled by indicator)
                                : 'text-gray-700' // Non-active tab text color
                            }`}
                        onClick={() => setActiveTab(index)}
                        onMouseEnter={() => handleMouseEnter(index)} // Listen for mouse entering individual tab
                    >
                        {/* Text content */}
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {tabs[activeTab].component}
            </div>
        </div>
    );
}
