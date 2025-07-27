'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import RootContext from '../config/rootcontext';
import Input from '../common/input';

const categoryColors = {
    Personal: '#dc2626',
    Business: '#e0193a',
    Family: '#facc15',
    Holiday: '#4ade80',
    ETC: '#38bdf8',
};

export default function EventDrawer({ show, onClose, onSave, categories, editData }) {
    const { rootContext, setRootContext } = useContext(RootContext);

    const [form, setForm] = useState({
        title: '',
        category: '',
        startDate: '',
        endDate: '',
        allDay: false,
        url: '',
        guests: '',
        location: '',
        description: ''
    });

    const [error, setError] = useState(false);
    const allCategories = categories.filter(cat => cat !== 'View all');

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.title || '',
                category: editData.category || '',
                startDate: editData.startDate || '',
                endDate: editData.endDate || '',
                allDay: editData.allDay || false,
                url: editData.url || '',
                guests: editData.guests || '',
                location: editData.location || '',
                description: editData.description || ''
            });
        }
    }, [editData]);

    const handleChange = (field) => (e) => {
        const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target?.value ?? e;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.category) {
            setError(true);
            return;
        }

        setError(false);

        const isEdit = Boolean(editData?.id);
        const id = isEdit ? editData.id : `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const event = { ...form, id };

        setRootContext((prev) => {
            const updatedSchedule = isEdit
                ? prev.schedule.map((item) => (item.id === id ? event : item)) // update existing
                : [...prev.schedule, event]; // add new

            return {
                ...prev,
                schedule: updatedSchedule,
            };
        });

        onSave && onSave(event);
        onClose();
    };


    return (
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 z-50 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-semibold">{editData ? 'Edit Event' : 'Add Event'}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-black hover:bg-gray-200 h-7 w-7 rounded-full text-xl">
                    <XMarkIcon className="h-5 w-5 pl-1.5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
                {/* Title */}
                <Input
                    title="Title"
                    type="text"
                    placeholder="Meeting with Jane"
                    className="w-full mt-1 p-2 border rounded text-sm"
                    value={form.title}
                    onChange={handleChange('title')}
                />

                {/* Category */}
                <div>
                    <Listbox value={form.category} onChange={handleChange('category')}>
                        {({ open }) => (
                            <div className="relative">
                                <Listbox.Label className="block text-sm font-medium text-gray-500">Label</Listbox.Label>
                                <div className="relative mt-1">
                                    <Listbox.Button className={`relative w-full cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none ${error && !form.category ? 'border-red-500' : 'border-gray-300'}`}>
                                        <span className="flex items-center">
                                            {form.category && <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryColors[form.category] }} />}
                                            {form.category || 'Select Event Label'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-50 ring-opacity-5 focus:outline-none">
                                        {allCategories.map((cat, idx) => (
                                            <Listbox.Option key={idx} value={cat} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-yellow-100 text-yellow-900' : 'text-gray-900'}`}>
                                                {({ selected }) => (
                                                    <>
                                                        <span className="absolute left-2 top-2 h-3 w-3 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                                                        <span className={selected ? 'font-medium' : 'font-normal'}>{cat}</span>
                                                        {selected && <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-yellow-600"><CheckIcon className="h-5 w-5" /></span>}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                                {error && !form.category && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                            </div>
                        )}
                    </Listbox>
                </div>

                {/* Dates */}
                <div>
                    <label className="block text-sm font-medium">Start date</label>
                    <input type="date" className="w-full mt-1 p-2 border rounded text-sm" value={form.startDate} onChange={handleChange('startDate')} />
                </div>

                <div>
                    <label className="block text-sm font-medium">End date</label>
                    <input type="date" className="w-full mt-1 p-2 border rounded text-sm" value={form.endDate} onChange={handleChange('endDate')} />
                </div>

                {/* All day switch */}
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={form.allDay}
                        onChange={(val) => setForm((prev) => ({ ...prev, allDay: val }))}
                        className={`${form.allDay ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-5 w-10 items-center rounded-full`}
                    >
                        <span className={`${form.allDay ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                    </Switch>
                    <span className="text-sm">All day</span>
                </div>

                {/* Other fields */}
                <Input title="Event URL" type="url" placeholder="https://event.com/meeting" className="w-full mt-1 p-2 border rounded text-sm" value={form.url} onChange={handleChange('url')} />
                <Input title="Guests" type="text" placeholder="Select guests" className="w-full mt-1 p-2 border rounded text-sm" value={form.guests} onChange={handleChange('guests')} />
                <Input title="Location" type="text" placeholder="Select Location" className="w-full mt-1 p-2 border rounded text-sm" value={form.location} onChange={handleChange('location')} />

                {/* Description */}
                <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
                    <label className="text-gray-700 text-sm font-medium">Description</label>
                    <textarea
                        rows={3}
                        placeholder="Enter description"
                        className="block w-full border-0 p-0 text-gray-900 focus:ring-0 text-sm mt-1"
                        value={form.description}
                        onChange={handleChange('description')}
                    />
                </div>

                {/* Submit / Cancel */}
                <div className="flex justify-end gap-2 pt-4">
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded">Submit</button>
                    <button type="button" onClick={onClose} className="border border-gray-300 text-gray-700 px-3 py-1 rounded">Cancel</button>
                </div>
            </form>
        </div>
    );
}
