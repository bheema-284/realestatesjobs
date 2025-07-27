// WeekView.jsx
import React, { useState } from 'react';
import { startOfWeek, addDays, format, startOfDay, addHours, isSameHour, parseISO, isWithinInterval, parse } from 'date-fns';
import EventDrawer from './eventdrawer';

// Helper function to convert hex to RGBA for consistency
const hexToRgba = (hex, alpha = 1) => {
  let r = 0, g = 0, b = 0;
  // Handle "#RRGGBB" or "RRGGBB"
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }
  // Handle "RGB" format by duplicating
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

export default function WeekView({ date, events, categoryColors }) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday is 0
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [showDrawer, setShowDrawer] = useState(false);
  const [editData, setEditDate] = useState({});
  const categories = ['View all', 'Personal', 'Family', 'Business', 'Holiday', 'ETC'];
  // Generate time slots from 6 AM to 11 PM
  const timeSlots = [];
  const startHour = 6; // 6 AM
  const endHour = 23; // 11 PM (23:00)
  const editForm = (item) => {
    setEditDate(item)
    setShowDrawer(true)
  }
  for (let i = startHour; i <= endHour; i++) {
    timeSlots.push(addHours(startOfDay(weekStart), i)); // Use weekStart for consistent time obj creation
  }

  return (
    <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
      {/* Header Row: Days of the Week */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-gray-100 text-gray-700 font-semibold text-sm border-b border-gray-200">
        <div className="py-2"></div> {/* Empty corner cell */}
        {days.map((day, i) => (
          <div key={i} className="text-center py-2 border-l border-gray-200">
            {format(day, 'EEE M/d')} {/* e.g., Sun 6/29 */}
          </div>
        ))}
      </div>

      {/* All-Day Row */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] divide-x divide-gray-200 border-b border-gray-200 text-center">
        <div className="pr-2 text-sm text-gray-600 py-2 text-center">All-Day</div>
        {days.map((day, dayIndex) => {
          const currentDayStart = startOfDay(day);
          const currentDayEnd = addHours(currentDayStart, 23); // Roughly end of the day

          // Filter for all-day and multi-day events
          const allDayAndMultiDayEvents = events.filter(e => {
            if (e.time) return false; // Exclude timed events from this row

            const eventStartDate = parse(e.startDate, 'yyyy-MM-dd', new Date());
            const eventEndDate = e.endDate ? parse(e.endDate, 'yyyy-MM-dd', new Date()) : eventStartDate;

            // Check if the current day falls within the event's start and end dates (inclusive)
            return (
              isWithinInterval(currentDayStart, { start: startOfDay(eventStartDate), end: startOfDay(eventEndDate) })
            );
          });

          return (
            <div key={dayIndex} className="py-2 pl-3 flex flex-col space-y-1">
              {allDayAndMultiDayEvents.length > 0 ? (
                allDayAndMultiDayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: hexToRgba(categoryColors[event.category], 0.1),
                      color: categoryColors[event.category]
                    }}
                    onClick={() => editForm(event)}
                    className="rounded px-2 py-1 text-xs line-clamp-2 text-center cursor-pointer"
                  >
                    {event.title}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic"></p> // Keep empty for spacing
              )}
            </div>
          );
        })}
      </div>

      {/* Time Slots and Events Grid */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] divide-x divide-gray-200">
        {timeSlots.map((slot, slotIndex) => (
          <React.Fragment key={format(slot, 'HH')}>
            {/* Time Label */}
            <div className="text-right pr-2 text-sm text-gray-600 border-b border-gray-200 py-3">
              {format(slot, 'ha')} {/* e.g., 6AM, 7AM */}
            </div>
            {/* Event Content Area for each day */}
            {days.map((day, dayIndex) => {
              const formattedDayStr = format(day, 'yyyy-MM-dd');
              const slotEvents = events.filter(event =>
                event.startDate === formattedDayStr && // Event must start on this specific day for timed slot
                event.time &&
                isSameHour(parseISO(`${formattedDayStr}T${event.time}:00`), slot)
              );
              return (
                <div key={dayIndex} className="border-b border-gray-200 py-3 pl-3 flex flex-col space-y-1 relative min-h-[40px]">
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
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {showDrawer && <EventDrawer
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        categories={categories}
        editData={editData}
      />}
    </div>
  );
}