'use client';
import React, { useContext, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Input from '../common/input';
import { XMarkIcon } from '@heroicons/react/24/solid';
import RootContext from '../config/rootcontext';
const categoryColors = {
    Personal: '#dc2626',
    Business: '#e0193a',
    Family: '#facc15',
    Holiday: '#4ade80',
    ETC: '#38bdf8',
};

export default function EventDrawer({ show, onClose, onSave, categories }) {
    const { rootContext, setRootContext } = useContext(RootContext);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [url, setUrl] = useState('');
    const [guests, setGuests] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const allCategories = categories.filter(cat => cat !== 'View all');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category) {
            setError(true);
            return;
        }
        setError(false);

        const event = {
            title,
            category,
            startDate,
            endDate,
            allDay,
            url,
            guests,
            location,
            description,
        };
        setRootContext((prevContext) => {
            const newEvent = {
                id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                title,
                category,
                startDate,
                endDate,
                allDay,
                url,
                guests,
                location,
                description,
            };

            return {
                ...prevContext,
                schedule: [...prevContext.schedule, newEvent],
            };
        });
        onSave(event);
        onClose(); // Optionally close after save
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 z-50 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-semibold">Add Event</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-black hover:bg-gray-200 h-7 w-7 rounded-full text-xl"><XMarkIcon className='h-5 w-5 pl-1.5' /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
                {/* Title */}
                <div>
                    <Input
                        title={"Title"}
                        type="text"
                        placeholder="Meeting with Jane"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Label */}
                <div>
                    <Listbox value={category} onChange={setCategory}>
                        {({ open }) => (
                            <div className="relative">
                                <Listbox.Label className="block text-sm font-medium text-gray-500">Label</Listbox.Label>
                                <div className="relative mt-1">
                                    <Listbox.Button
                                        className={`relative w-full cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none ${error && !category ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <span className="flex items-center">
                                            {category && (
                                                <span
                                                    className="w-2 h-2 rounded-full mr-2"
                                                    style={{ backgroundColor: categoryColors[category] }}
                                                />
                                            )}
                                            {category || 'Select Event Label'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-50 ring-opacity-5 focus:outline-none">
                                        {allCategories.map((cat, idx) => (
                                            <Listbox.Option
                                                key={idx}
                                                value={cat}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-yellow-100 text-yellow-900' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className="absolute left-2 top-2 h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: categoryColors[cat] }}
                                                        />
                                                        <span className={`${selected ? 'font-medium' : 'font-normal'}`}>{cat}</span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-yellow-600">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                                {error && !category && (
                                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                                )}
                            </div>
                        )}
                    </Listbox>
                    {error && !category && (
                        <p className="text-red-500 text-xs mt-1">This field is required</p>
                    )}
                </div>

                {/* Dates */}
                <div>
                    <label className="block text-sm font-medium">Start date</label>
                    <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">End date</label>
                    <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {/* All day */}
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={allDay}
                        onChange={setAllDay}
                        className={`${allDay ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-5 w-10 items-center rounded-full`}
                    >
                        <span
                            className={`${allDay ? 'translate-x-5' : 'translate-x-1'
                                } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                    <span className="text-sm">All day</span>
                </div>

                {/* Event URL */}
                <div>
                    <Input
                        title={"Event URL"}
                        type="url"
                        placeholder="https://event.com/meeting"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                {/* Guests */}
                <div>
                    <Input
                        title={"Guests"}
                        type="text"
                        placeholder="Select guests"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>

                {/* Location */}
                <div>
                    <Input
                        title={"Location"}
                        type="text"
                        placeholder="Select Location"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className={`relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-purple-600 focus-within:border-purple-600 bg-white`}>
                    <label htmlFor="name" className={`label capitalize text-gray-700`}>Description</label>
                    <textarea
                        rows={3}
                        placeholder="Enter description"
                        className="block w-full border-0 p-0 text-gray-900 focus:ring-0 text-[1.125rem] mt-[0.188rem]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Submit / Cancel */}
                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
