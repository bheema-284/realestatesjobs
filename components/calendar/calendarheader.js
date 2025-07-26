
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function CalendarHeader({
    view,
    setView,
    currentDate,
    onNext,
    onPrev }) {

    const listData = ['month', 'week', 'day', 'list']
    return (
        <div className="flex flex-col lg:flex-row mt-5 justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-2 text-2xl">
                <button onClick={onPrev} className="px-2 py-1"><ChevronLeftIcon className='w-4 h-4 text-2xl font-semibold' /></button>
                <button onClick={onNext} className="px-2 py-1"><ChevronRightIcon className='w-4 h-4 text-2xl font-semibold' /></button>
                <h2 className="ml-4 text-2xl font-semibold">
                    {view === 'week'
                        ? `${format(currentDate, 'MMM d')} – ${format(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6), 'd, yyyy')}`
                        : view === 'day'
                            ? format(currentDate, 'MMMM d, yyyy')
                            : view === 'list'
                                ? format(currentDate, 'MMMM yyyy')
                                : format(currentDate, 'MMMM yyyy')}
                </h2>

            </div>
            <div className="inline-flex rounded-md shadow-sm">
                {listData.map((v, index) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`
                    px-3 py-1 text-sm font-medium relative focus:outline-none focus:z-10
                   ${view === v ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}
                  ${view === v ? 'border-yellow-600' : 'border-yellow-400'}
                    border-y border-l 
                    ${index === listData.length - 1 ? 'border-r' : ''} 
                    ${index === 0 ? 'rounded-l-md' : ''} 
                    ${index === listData.length - 1 ? 'rounded-r-md' : ''}
                    ${index > 0 ? '-ml-px' : ''} 
                `}>{v.charAt(0).toUpperCase() + v.slice(1)} </button>))}
            </div>
        </div>
    );
}

