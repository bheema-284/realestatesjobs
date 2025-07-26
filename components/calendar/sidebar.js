'use client';
import React, { useState } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, eachDayOfInterval,
    isSameMonth, isToday, getMonth, setMonth, getYear, setYear
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Sidebar({ filters, setFilters, onAdd, categoryColors }) {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState(addMonths(today, 1));
    const [selectedMonth, setSelectedMonth] = useState(getMonth(addMonths(today, 1)));
    const [selectedYear, setSelectedYear] = useState(getYear(addMonths(today, 1)));

    const updateCalendarDate = (month, year) => {
        const updated = setMonth(setYear(new Date(), year), month);
        setCurrentDate(updated);
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        setSelectedMonth(newMonth);
        updateCalendarDate(newMonth, selectedYear);
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        if (!isNaN(newYear) && newYear >= 1900 && newYear <= 2100) {
            setSelectedYear(newYear);
            updateCalendarDate(selectedMonth, newYear);
        }
    };

    const allCategories = ['View all', 'Personal', 'Business', 'Family', 'Holiday', 'ETC'];

    const toggleFilter = (category) => {
        const contentCategories = allCategories.filter(cat => cat !== 'View all');
        setFilters(prev => {
            if (category === 'View all') {
                if (prev.includes('View all') && prev.length === contentCategories.length + 1) {
                    return [];
                } else {
                    return ['View all', ...contentCategories];
                }
            } else {
                let newFilters = prev.includes(category)
                    ? prev.filter(f => f !== category)
                    : [...prev, category];
                const allSelected = contentCategories.every(cat => newFilters.includes(cat));
                return allSelected
                    ? [...new Set([...newFilters, 'View all'])]
                    : newFilters.filter(f => f !== 'View all');
            }
        });
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
        <div className="w-full bg-white md:w-64 border-r border-gray-200 space-y-6 overflow-auto">
            {/* Add Event Button */}
            <div className='px-4 pt-1.5'>
                <button
                    onClick={onAdd}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded shadow"
                >
                    + Add Event
                </button>
            </div>

            <div className='border-b border-gray-200'></div>

            {/* Month & Year Selector */}
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => {
                            const newDate = subMonths(currentDate, 1);
                            setSelectedMonth(getMonth(newDate));
                            setSelectedYear(getYear(newDate));
                            setCurrentDate(newDate);
                        }}
                        className="rounded-md bg-gray-200 p-1"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    <div className="flex gap-1 items-center">
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="appearance-none rounded-md p-0.5 text-sm hover:bg-gray-200"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>{format(new Date(0, i), 'MMMM')}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={selectedYear}
                            onChange={handleYearChange}
                            min="1900"
                            max="2100"
                            className="w-16 text-center rounded-md p-0.5 text-sm hover:bg-gray-200"
                        />
                    </div>

                    <button
                        onClick={() => {
                            const newDate = addMonths(currentDate, 1);
                            setSelectedMonth(getMonth(newDate));
                            setSelectedYear(getYear(newDate));
                            setCurrentDate(newDate);
                        }}
                        className="rounded-md bg-gray-200 p-1"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-600 mt-5">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-sm">
                    {allDays.map((day, i) => (
                        <div
                            key={i}
                            className={`w-7 h-7 text-center leading-7 rounded cursor-pointer
                ${isToday(day) ? 'bg-yellow-200 text-gray-800 font-bold' : ''}
                ${isSameMonth(day, currentDate) ? 'text-gray-700' : 'text-gray-400'}
                hover:bg-gray-200`}
                        >
                            {format(day, 'd')}
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className='p-4'>
                <p className="font-semibold mb-2">Event Filters</p>
                {allCategories.map(cat => (
                    <label key={cat} className="flex items-center space-x-2 mb-1">
                        <input
                            type="checkbox"
                            checked={filters.includes(cat)}
                            onChange={() => toggleFilter(cat)}
                            style={{ accentColor: categoryColors[cat] }}
                            className="form-checkbox h-4 w-4 text-white rounded focus:ring-transparent"
                        />
                        <span className="text-sm">{cat}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
