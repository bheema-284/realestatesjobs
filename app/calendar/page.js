'use client';
import React, { useContext, useState } from 'react';
import {
  addMonths, addDays,
  format
} from 'date-fns';
import Sidebar from '@/components/calendar/sidebar';
import CalendarHeader from '@/components/calendar/calendarheader';
import MonthView from '@/components/calendar/monthview';
import WeekView from '@/components/calendar/weekview';
import DayView from '@/components/calendar/dayview';
import ListView from '@/components/calendar/listview';
import EventDrawer from '@/components/calendar/eventdrawer';
import RootContext from '@/components/config/rootcontext';

const categories = ['View all', 'Personal', 'Family', 'Business', 'Holiday', 'ETC'];

const categoryColors = {
  'View all': '#b91c1c',
  Personal: '#dc2626',
  Business: '#e0193a',
  Family: '#facc15',
  Holiday: '#4ade80',
  ETC: '#38bdf8',
};

export default function Calendar() {
  const [view, setView] = useState('month');
  const { rootContext, setRootContext } = useContext(RootContext);
  const myDate = new Date(); // This would be today's date and time
  const formattedDate = format(myDate, 'yyyy-MM-dd'); // Result: "2025-07-26" (for today)
  const [currentDate, setCurrentDate] = useState(new Date(formattedDate));
  const events = rootContext.schedule;
  console.log("events", events)
  const [filters, setFilters] = useState(categories);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // NEW 
  const filteredEvents = events.filter(evt => filters.includes(evt.category));

  const nav = (dir, viewMode) => {
    const delta = dir === 'next' ? 1 : -1;

    switch (viewMode) {
      case 'month':
      case 'list':
        setCurrentDate(prev => addMonths(prev, delta));
        break;
      case 'week':
        setCurrentDate(prev => addDays(prev, delta * 7));
        break;
      case 'day':
        setCurrentDate(prev => addDays(prev, delta));
        break;
      default:
        break;
    }
  };

  const addEvent = (event) => {
    setRootContext((prev) => {
      const updatedSchedule = [...prev.schedule, event];
      return {
        ...prev,
        schedule: updatedSchedule,
      };
    });
    setShowDrawer(false);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-yellow-600 font-semibold"
        >
          ☰ Filters
        </button>
        <h1 className="text-lg font-semibold">Calendar</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`z-40 fixed md:static bg-white md:block transition-transform duration-300 ease-in-out 
          w-64 border-r border-gray-200 h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >

        <div className="md:hidden px-4 py-2 border-b">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 text-sm flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          onAdd={() => {
            setShowDrawer(true);
            setSidebarOpen(false); // close sidebar on mobile after action
          }}
          categoryColors={categoryColors}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          onNext={() => nav('next', view)}
          onPrev={() => nav('prev', view)}
          onToday={() => setCurrentDate(new Date('2025-07-18'))}
          filters={filters}
          setFilters={setFilters}
          onAdd={() => setShowDrawer(true)}
        />

        <div className="mt-4">
          {view === 'month' && (
            <MonthView date={currentDate} events={filteredEvents} categoryColors={categoryColors} />
          )}
          {view === 'week' && (
            <WeekView date={currentDate} events={filteredEvents} categoryColors={categoryColors} />
          )}
          {view === 'day' && (
            <DayView date={currentDate} events={filteredEvents} categoryColors={categoryColors} />
          )}
          {view === 'list' && (
            <ListView events={filteredEvents} categoryColors={categoryColors} />
          )}
        </div>
      </main>

      {/* Drawer */}
      <EventDrawer
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSave={addEvent}
        categories={categories}
      />
    </div>
  );
}
