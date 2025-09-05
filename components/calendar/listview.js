import React, { useState } from 'react';
import { format, parseISO, eachDayOfInterval, isSameMonth, startOfMonth, endOfMonth } from 'date-fns';
import EventDrawer from './eventdrawer';


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

// Now expects 'date' as a prop, which is a Date object or a date string
export default function ListView({ date, events, categoryColors }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [editData, setEditDate] = useState({});

    const editForm = (item) => {
        setEditDate(item);
        setShowDrawer(true);
    };

    // Determine the month to filter by based on the date prop.
    // If date is a string, parse it. If it's a Date object, use it directly.
    // If date is not provided, default to the current date's month.
    const monthToFilter = date
        ? (date instanceof Date ? date : parseISO(date))
        : new Date(); // Default to current date if no date is provided

    const targetMonthStart = startOfMonth(monthToFilter);
    const targetMonthEnd = endOfMonth(monthToFilter);

    // Use a temporary array to store all event instances (including expanded multi-day ones)
    // Filter events to only include those that fall within the selected month
    const allEventsForDisplay = [];
    events.forEach(event => {
        const startDate = parseISO(event.startDate);
        const endDate = event.endDate ? parseISO(event.endDate) : startDate;

        // Check if the event's start or end date is within the selected month,
        // or if it spans across the selected month.
        const eventStartsInMonth = isSameMonth(startDate, monthToFilter);
        const eventEndsInMonth = isSameMonth(endDate, monthToFilter);
        // This condition checks if an event starts before the target month and ends after it,
        // meaning it spans across the entire target month.
        const eventSpansTargetMonth = startDate < targetMonthStart && endDate > targetMonthEnd;


        if (eventStartsInMonth || eventEndsInMonth || eventSpansTargetMonth) {
            const daysInEvent = eachDayOfInterval({ start: startDate, end: endDate });

            daysInEvent.forEach(day => {
                // Only add the event instance if the specific day falls within the selected month
                if (isSameMonth(day, monthToFilter)) {
                    allEventsForDisplay.push({
                        ...event,
                        displayDate: format(day, 'yyyy-MM-dd'), // The date this instance should be displayed under
                        isMultiDay: event.endDate && event.startDate !== event.endDate, // Flag for styling/info if needed
                    });
                }
            });
        }
    });

    // Group the expanded events by their displayDate
    const eventsByDate = allEventsForDisplay.reduce((acc, event) => {
        const dateKey = event.displayDate;
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

    // Sort events within each day: all-day first, then by time
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

    const categories = ['View all', 'Personal', 'Family', 'Business', 'Holiday', 'ETC'];

    return (
        <div className="space-y-4">
            {sortedDates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No events found for {format(monthToFilter, 'MMMM yyyy')}.</p>
            ) : (
                sortedDates.map((dateKey, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                        <p onClick={() => editForm(event)} className="cursor-pointer text-gray-800 text-sm font-medium">
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
            {showDrawer && <EventDrawer
                show={showDrawer}
                onClose={() => setShowDrawer(false)}
                categories={categories}
                editData={editData}
            />}
        </div>
    );
}