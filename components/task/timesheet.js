'use client';
import React from 'react';
import {
    startOfWeek,
    addDays,
    format,
    isSameDay,
    parseISO,
} from 'date-fns';

const Timesheet = ({ tasks }) => {
    // Flatten task array from status groups
    const flatTasks = Object.values(tasks).flat();

    const current = new Date('2024-12-10'); // Example week
    const weekStart = startOfWeek(current, { weekStartsOn: 1 }); // Monday
    const days = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));

    // Converts '01:30' or '2h' or '90m' to total hours (float)
    const parseTimeToHours = (t) => {
        if (!t) return 0;
        if (t.includes(':')) {
            const [h, m] = t.split(':').map(Number);
            return h + m / 60;
        }
        if (t.includes('h')) return parseFloat(t.replace('h', ''));
        if (t.includes('m')) return parseFloat(t.replace('m', '')) / 60;
        return 0;
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-sm font-medium">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 4), 'MMM d, yyyy')}
                </h1>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition">
                    Submit week
                </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 border border-gray-200 rounded-t overflow-hidden bg-blue-50 text-gray-700">
                <div className="px-4 py-3 border-r border-gray-200 font-semibold">Task</div>
                {days.map((day, i) => (
                    <div
                        key={i}
                        className="px-2 py-3 text-center border-r border-gray-200"
                    >
                        {format(day, 'dd EEE')}
                    </div>
                ))}
                <div className="px-2 py-3 text-center font-semibold">Total</div>
            </div>

            {/* Task Rows */}
            {flatTasks.map((task, index) => {
                const taskDate = parseISO(task.dueDate);
                const row = days.map((day) =>
                    isSameDay(day, taskDate) ? task.timeSpent : '0h'
                );

                const total = row.reduce((acc, t) => acc + parseTimeToHours(t), 0);

                return (
                    <div
                        key={task.id}
                        className={`grid grid-cols-7 border border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                    >
                        <div className="px-4 py-3 border-r border-gray-200 whitespace-pre-wrap break-words text-gray-800">
                            {task.title}
                        </div>
                        {row.map((t, i) => (
                            <div
                                key={i}
                                className="px-2 py-3 border-r border-gray-200 text-center text-gray-700"
                            >
                                {t}
                            </div>
                        ))}
                        <div className="px-2 py-3 text-center font-semibold text-gray-800">
                            {total.toFixed(2)}h
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Timesheet;
