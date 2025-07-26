'use client';
import React, { useState } from 'react';
import {
  addMonths, addDays
} from 'date-fns';
import Sidebar from '@/components/calendar/sidebar';
import CalendarHeader from '@/components/calendar/calendarheader';
import MonthView from '@/components/calendar/monthview';
import WeekView from '@/components/calendar/weekview';
import DayView from '@/components/calendar/dayview';
import ListView from '@/components/calendar/listview';
import EventDrawer from '@/components/calendar/eventdrawer';

const categories = ['View all', 'Personal', 'Family', 'Business', 'Holiday', 'ETC'];

const categoryColors = {
  'View all': '#b91c1c',
  Personal: '#dc2626',
  Business: '#e0193a',
  Family: '#facc15',
  Holiday: '#4ade80',
  ETC: '#38bdf8',
};

const dummyEvents = [
  { title: 'Property Listing Review', date: '2025-07-05', category: 'Business' },
  { title: 'Client Site Visit - Downtown Flats', date: '2025-07-06', category: 'Personal' },
  { title: 'Photography Session - Villa Bella', date: '2025-07-07', category: 'Business' },
  { title: 'Design Brochure for Metro Heights', date: '2025-07-08', category: 'ETC' },
  { title: 'Team Meeting: Sales Strategy', date: '2025-07-09', category: 'Business' },
  { title: 'Client Call - NRI Investment Inquiry', date: '2025-07-10', category: 'Family' },
  { title: 'Office Holiday - Real Estate Summit', date: '2025-07-11', category: 'Holiday' },
  { title: 'Follow Up - Landlord Agreement', date: '2025-07-12', category: 'Business' },
  { title: 'Marketing Campaign Launch', date: '2025-07-13', category: 'ETC' },
  { title: 'Open House - Green View Apartments', date: '2025-07-14', category: 'Business' },
  { title: 'Lunch with Partner Broker', date: '2025-07-15', category: 'Personal' },
  { title: 'Client Visit - Commercial Complex', date: '2025-07-16', category: 'Business' },
  { title: 'Budget Planning for Next Quarter', date: '2025-07-17', category: 'Business' },
  { title: 'Listing Update - New Launches', date: '2025-07-18', category: 'Business' },
  { title: 'Team Outing - Beach Resort', date: '2025-07-19', category: 'Holiday' },
  { title: 'Prepare Legal Documents', date: '2025-07-20', category: 'ETC' },
  { title: 'Final Walkthrough - Riverside Homes', date: '2025-07-21', category: 'Personal' },
  { title: 'Social Media Ad Boost', date: '2025-07-22', category: 'Business' },
  { title: 'Investor Call - Land Deal', date: '2025-07-23', category: 'Business' },
  { title: 'Meet Architect - Skyline Towers', date: '2025-07-24', category: 'Business' }
];


export default function Calendar() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date('2025-07-18'));
  const [events, setEvents] = useState(dummyEvents);
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
    setEvents(prev => [...prev, event]);
    setShowDrawer(false);
  };

  return (
    <div className="flex flex-col md:flex-row">
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
      <main className="flex-1 overflow-y-auto px-4 py-2 sm:px-6 md:px-8 bg-white">
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
