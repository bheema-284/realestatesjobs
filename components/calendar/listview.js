// ListView.jsx
import React from 'react';
import { format, parseISO, eachDayOfInterval } from 'date-fns'; // Import eachDayOfInterval

// Helper function to convert hex to RGBA for consistency
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

export default function ListView({ events, categoryColors }) {
    // Use a temporary array to store all event instances (including expanded multi-day ones)
    const allEventsForDisplay = [];

    events.forEach(event => {
        // Parse start and end dates for date-fns operations
        const startDate = parseISO(event.startDate);
        // If no endDate, it's a single-day event, so endDate is the same as startDate
        const endDate = event.endDate ? parseISO(event.endDate) : startDate;

        // Get all days within the event's interval
        const daysInEvent = eachDayOfInterval({ start: startDate, end: endDate });

        daysInEvent.forEach(day => {
            // Create a "display" event object for each day it spans
            // We pass the original event details along, but associate it with 'day'
            allEventsForDisplay.push({
                ...event,
                displayDate: format(day, 'yyyy-MM-dd'), // The date this instance should be displayed under
                isMultiDay: event.endDate && event.startDate !== event.endDate, // Flag for styling/info if needed
            });
        });
    });

    // Group the expanded events by their displayDate
    const eventsByDate = allEventsForDisplay.reduce((acc, event) => {
        const dateKey = event.displayDate;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        // Sort events within each day: all-day first, then by time
        acc[dateKey].push(event);
        return acc;
    }, {});

    // Sort dates chronologically
    const sortedDates = Object.keys(eventsByDate).sort((a, b) =>
        parseISO(a).getTime() - parseISO(b).getTime()
    );

    // Sort events within each day: all-day first, then by time
    // This sorting happens AFTER grouping for better control
    sortedDates.forEach(dateKey => {
        eventsByDate[dateKey].sort((a, b) => {
            // Prioritize all-day events
            if (!a.time && b.time) return -1;
            if (a.time && !b.time) return 1;

            // Then sort by time if both have times
            if (a.time && b.time) {
                const timeA = parseISO(`2000-01-01T${a.time}:00`); // Use a dummy date for time comparison
                const timeB = parseISO(`2000-01-01T${b.time}:00`);
                return timeA.getTime() - timeB.getTime();
            }

            // Otherwise, maintain original order (e.g., if both are all-day)
            return 0;
        });
    });

    return (
        <div className="space-y-4">
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
                                {format(parseISO(dateKey), 'EEEE')}
                            </span>
                        </div>

                        {/* Events for the day */}
                        <div>
                            {eventsByDate[dateKey].map((event, idx) => (
                                <div key={`${event.title}-${event.startDate}-${idx}`} className="flex items-center border-b border-gray-100 last:border-b-0 px-4 py-3">
                                    <div className="text-gray-600 text-sm w-20 flex-shrink-0">
                                        {event.time ? format(parseISO(`2000-01-01T${event.time}:00`), 'h:mm a') : 'all-day'}
                                    </div>
                                    <div className="flex items-center flex-grow ml-4">
                                        {/* Colored Dot */}
                                        <div
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: categoryColors[event.category] }}
                                        ></div>
                                        <p className="text-gray-800 text-sm font-medium">
                                            {event.title}
                                            {event.isMultiDay && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    ({format(parseISO(event.startDate), 'MMM d')} - {format(parseISO(event.endDate), 'MMM d')})
                                                </span>
                                            )}
                                        </p>
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