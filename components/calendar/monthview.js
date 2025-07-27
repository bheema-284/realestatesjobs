// MonthView.jsx
import React, { useState, useRef } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, format, isToday, isWithinInterval, parseISO } from 'date-fns'; // Added parseISO
import EventPopup from './eventpopup';
import EventDrawer from './eventdrawer';

export default function MonthView({ date, events, categoryColors }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupEvents, setPopupEvents] = useState([]);
  const [popupDate, setPopupDate] = useState('');
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [editData, setEditDate] = useState({});
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday is 0
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Sunday is 0
  const [showDrawer, setShowDrawer] = useState(false);
  const calendarRef = useRef(null);

  const openPopup = (clickedElement, dayDate, eventsForDay) => {
    if (!clickedElement || !calendarRef.current) return;

    const dayRect = clickedElement.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();

    const popupWidth = 280;
    const popupHeight = Math.min(eventsForDay.length * 30 + 100, 300);
    const horizontalOffset = 10;
    const verticalOffset = 10;

    let top = dayRect.top - calendarRect.top;
    let left = dayRect.left - calendarRect.left;

    // --- Horizontal Positioning (Prefer right, fallback to left) ---
    let calculatedLeft = left + dayRect.width + horizontalOffset;

    if (calculatedLeft + popupWidth > calendarRect.width) {
      calculatedLeft = left - popupWidth - horizontalOffset;
      if (calculatedLeft < 0) {
        calculatedLeft = 0;
      }
    }

    // --- Vertical Positioning (Prefer aligning top, fallback to aligning bottom) ---
    let calculatedTop = top;

    if (calculatedTop + popupHeight > calendarRect.height) {
      calculatedTop = (dayRect.bottom - calendarRect.top) - popupHeight - verticalOffset;
      if (calculatedTop < 0) {
        calculatedTop = 0;
      }
    }

    setPopupPosition({ top: calculatedTop, left: calculatedLeft });
    setPopupDate(format(dayDate, 'PPP'));
    setPopupEvents(eventsForDay);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupEvents([]);
    setPopupDate('');
    setPopupPosition({ top: 0, left: 0 });
  };

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      // Filter events that either start on this day OR span across this day
      const dayEvents = events.filter(event => {
        const eventStartDate = parseISO(event.startDate);
        const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
        return isWithinInterval(day, { start: eventStartDate, end: eventEndDate });
      });

      const isCurrentMonth = isSameMonth(day, monthStart);
      const isTodayDate = isToday(day);

      const displayEvents = dayEvents.slice(0, 2);
      const remainingEventsCount = dayEvents.length - 2;

      days.push(
        <div
          className={`border border-gray-200 p-1 h-28 text-xs align-top relative flex flex-col ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                     ${isTodayDate ? 'border-yellow-500 ring-1 ring-yellow-500' : ''}
                    `}
          key={formattedDate}
        >
          <div className={`font-semibold text-right pr-1 ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
            {format(day, 'd')}
          </div>
          <div className="space-y-1 mt-1 overflow-hidden flex-grow">
            {displayEvents.map((event, idx) => {
              const eventStartDate = parseISO(event.startDate);
              const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
              let eventDisplayTitle = event.title;

              if (!isSameMonth(eventStartDate, eventEndDate) || format(eventStartDate, 'd') !== format(eventEndDate, 'd')) {
                eventDisplayTitle = `${format(eventStartDate, 'd')}-${format(eventEndDate, 'd')} ${event.title}`;
              }

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: hexToRgba(categoryColors[event.category], 0.1),
                    color: categoryColors[event.category]
                  }}
                  onClick={() => editForm(event)}
                  className={`truncate rounded px-1 py-0.5 text-sm cursor-pointer`}
                >
                  {eventDisplayTitle}
                </div>
              );
            })}

            {/* +X more button at the bottom */}
            {remainingEventsCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPopup(e.currentTarget.closest('.border.border-gray-200'), formattedDate, dayEvents);
                }}
                className="w-full text-center hover:bg-gray-200 text-sm text-gray-600 hover:text-gray-800 focus:outline-none mt-0.5"
              >
                +{remainingEventsCount} more
              </button>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7 border-b border-gray-200 last:border-b-0" key={format(day, 'yyyy-MM-dd')}>{days}</div>);
    days = [];
  }

  const editForm = (item) => {
    setEditDate(item)
    setShowDrawer(true)
  }

  const categories = ['View all', 'Personal', 'Family', 'Business', 'Holiday', 'ETC'];
  return (
    <div ref={calendarRef} className="border border-gray-200 mt-5 overflow-hidden relative">
      <div className="grid grid-cols-7 bg-gray-100 text-gray-700 font-semibold text-sm border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div key={dayName} className="text-center py-2">{dayName}</div>
        ))}
      </div>
      {rows}

      {showPopup && (
        <EventPopup
          date={popupDate}
          events={popupEvents}
          position={popupPosition}
          onClose={closePopup}
          categoryColors={categoryColors}
          editForm={editForm}
        />
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

// Helper function to convert hex to RGBA for background with opacity
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