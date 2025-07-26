// ListView.jsx
import React from 'react';
import { format, parseISO } from 'date-fns';

// Helper function to convert hex to RGBA for consistency (optional, but good practice)
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


export default function ListView({ events, categoryColors }) { // Added categoryColors prop
    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const dateKey = event.date; // event.date is already 'yyyy-MM-dd'
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});

    // Sort dates chronologically
    const sortedDates = Object.keys(eventsByDate).sort((a, b) =>
        parseISO(a).getTime() - parseISO(b).getTime()
    );

    return (
        <div className="space-y-4"> {/* Increased space between date groups */}
            {sortedDates.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming events.</p>
            ) : (
                sortedDates.map(dateKey => (
                    <div key={dateKey} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Date Header */}
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-md font-semibold text-gray-800">
                                {format(parseISO(dateKey), 'MMMM d, yyyy')}
                            </h3>
                            <span className="text-sm text-gray-600">
                                {format(parseISO(dateKey), 'EEEE')} {/* Day of the week */}
                            </span>
                        </div>

                        {/* Events for the day */}
                        <div>
                            {eventsByDate[dateKey].map((event, idx) => (
                                <div key={idx} className="flex items-center border-b border-gray-100 last:border-b-0 px-4 py-3">
                                    <div className="text-gray-600 text-sm w-20 flex-shrink-0">
                                        {event.time || 'all-day'} {/* Display time if available, otherwise 'all-day' */}
                                    </div>
                                    <div className="flex items-center flex-grow ml-4">
                                        {/* Colored Dot */}
                                        <div
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: categoryColors[event.category] }}
                                        ></div>
                                        <p className="text-gray-800 text-sm font-medium">{event.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}