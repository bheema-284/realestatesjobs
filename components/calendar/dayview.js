// DayView.jsx
import React from 'react';
import { format, startOfDay, addHours, isSameHour, parseISO } from 'date-fns';

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

export default function DayView({ date, events, categoryColors }) { // Added categoryColors prop
    const dayStr = format(date, 'yyyy-MM-dd');
    const todayEvents = events.filter(e => e.date === dayStr);

    // Filter all-day events
    const allDayEvents = todayEvents.filter(event => !event.time);

    // Generate time slots from 6 AM to 11 PM
    const timeSlots = [];
    const startHour = 6; // 6 AM
    const endHour = 23; // 11 PM (23:00)

    for (let i = startHour; i <= endHour; i++) {
        timeSlots.push(addHours(startOfDay(date), i));
    }

    return (
        <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
            {/* Date Header - Already present in the design implicitly above the time grid */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="text-md font-semibold text-gray-800">
                    {format(date, 'MMMM d, yyyy')}
                </h3>
                <span className="text-sm text-gray-600">
                    {format(date, 'EEEE')}
                </span>
            </div>

            {/* Main Day View Grid */}
            <div className="grid grid-cols-[80px_1fr] divide-x divide-gray-200"> {/* Fixed width for time column */}
                {/* All-Day Row */}
                <div className="col-span-2 border-b border-gray-200">
                    <div className="grid grid-cols-[80px_1fr] divide-x divide-gray-200 min-h-[40px] items-center">
                        <div className="text-right pr-2 text-sm text-gray-600 py-2">All-Day</div>
                        <div className="py-2 pl-3 flex flex-col space-y-1">
                            {allDayEvents.length > 0 ? (
                                allDayEvents.map((event, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            backgroundColor: hexToRgba(categoryColors[event.category], 0.1),
                                            color: categoryColors[event.category]
                                        }}
                                        className="rounded px-2 py-1 text-xs truncate"
                                    >
                                        {event.title}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 italic">No all-day events.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Time Slots */}
                {timeSlots.map((slot, index) => {
                    const slotEvents = todayEvents.filter(event =>
                        event.time && isSameHour(parseISO(`${dayStr}T${event.time}:00`), slot)
                    );

                    return (
                        <React.Fragment key={format(slot, 'HH')}>
                            {/* Time Label */}
                            <div className={`text-right pr-2 text-sm text-gray-600 border-b border-gray-200 py-3 ${index === 0 ? 'border-t-0' : ''}`}>
                                {format(slot, 'ha')} {/* e.g., 6AM, 7AM, 12PM */}
                            </div>
                            {/* Event Content Area */}
                            <div className="border-b border-gray-200 py-3 pl-3 flex flex-col space-y-1 relative">
                                {slotEvents.map((event, eventIdx) => (
                                    <div
                                        key={eventIdx}
                                        style={{
                                            backgroundColor: hexToRgba(categoryColors[event.category], 0.1),
                                            color: categoryColors[event.category]
                                        }}
                                        className="rounded px-2 py-1 text-xs truncate"
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}