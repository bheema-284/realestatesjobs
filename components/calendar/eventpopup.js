// EventPopup.jsx
import React, { useEffect, useRef } from 'react';

// Helper function to convert hex to RGBA for background with opacity
// Ensure this is accessible, e.g., copy from MonthView or import from a utility file
const hexToRgba = (hex, alpha = 1) => {
    let r = 0, g = 0, b = 0;
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function EventPopup({ date, events, position, onClose, categoryColors }) {
    const popupRef = useRef(null);

    // Click outside to close logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Add event listener only if the popup is visible
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]); // Dependency array: re-run if onClose changes

    return (
        <div
            ref={popupRef}
            className="absolute bg-white p-4 rounded-lg shadow-xl border border-gray-300 z-30"
            style={{ top: position.top, left: position.left, width: '250px' }} // Fixed width, adjust as needed
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
                &times;
            </button>
            <h3 className="font-semibold text-gray-800 mb-3">{date}</h3>
            {events.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: hexToRgba(categoryColors[event.category], 0.1),
                                color: categoryColors[event.category]
                            }}
                            className={`rounded px-2 py-1 text-sm`}
                        >
                            <p className="font-medium">{event.title}</p>
                            {event.time && <p className="text-xs text-opacity-80">{event.time}</p>}
                            {event.description && <p className="text-xs text-opacity-80 mt-0.5">{event.description}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No events for this day.</p>
            )}
        </div>
    );
}