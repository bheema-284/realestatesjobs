'use client';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Fragment, useEffect, useState } from 'react';
import Input from '../common/input';
export default function AddEditTaskModal({ isOpen, onClose, onSave, task }) {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        priority: 'Medium',
        status: 'Not picked',
        progress: 0,
        dueDate: '',
        remaining: '',
        overdue: false,
        assignedTo: '',
        attachments: false,
        comments: false,
        bookmarked: false,
        description: '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                id: task?.id || `t${Date.now()}`,
                title: task?.title || '',
                priority: task?.priority || 'Medium',
                status: task?.status || 'Not picked',
                progress: task?.progress || 0,
                dueDate: task?.dueDate || '',
                remaining: task?.remaining || '',
                overdue: task?.overdue || false,
                assignedTo: task?.assignedTo?.join(', ') || '',
                attachments: task?.attachments || false,
                comments: task?.comments || false,
                bookmarked: task?.bookmarked || false,
                description: task?.description || '',
            });
        }
    }, [isOpen, task]);

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     const val = type === 'checkbox' ? checked : value;
    //     setFormData((prev) => ({ ...prev, [name]: val }));
    // };

    const handleChange = (field) => (e) => {
        const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target?.value ?? e;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            assignedTo: formData.assignedTo
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            progress: Number(formData.progress),
        };
        onSave(formattedData);
        onClose();
    };

    const statusList = ['Not picked', 'In progress', 'Needs review', 'Needs attention', 'Needs input', 'Planned', 'Done']

    const getStatusColor = (status) => {
        switch (status) {
            case 'Not picked': return 'bg-gray-400';
            case 'In progress': return 'bg-blue-500';
            case 'Needs review': return 'bg-yellow-400';
            case 'Needs attention': return 'bg-red-500';
            case 'Needs input': return 'bg-pink-500';
            case 'Planned': return 'bg-purple-500';
            case 'Done': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500 text-white';       // Bright red
            case 'Medium':
                return 'bg-yellow-400 text-black';    // Yellow
            case 'Low':
                return 'bg-green-500 text-white';     // Green
            case 'None':
                return 'bg-gray-300 text-black';      // Neutral gray
            default:
                return 'bg-gray-100 text-gray-700';   // Fallback
        }
    };

    const allCategories = [
        "Attachments",
        "Comments",
        "Bookmarked",
        "Overdue"
    ]

    const categoryMap = {
        Attachments: 'attachments',
        Comments: 'comments',
        Bookmarked: 'bookmarked',
        Overdue: 'overdue',
    };

    const categoryColors = {
        'Overdue': '#b91c1c',
        "Attachments": '#dc2626',
        'Bookmarked': '#facc15',
        "Comments": '#4ade80',
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                                    {task ? 'Edit Task' : 'Add Task'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        title="Title"
                                        type="text"
                                        placeholder="Meeting with Jane"
                                        className="w-full mt-1 p-2 border rounded text-sm"
                                        value={formData.title}
                                        onChange={handleChange('title')}
                                    />
                                    <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white">
                                        <label className="text-gray-700 text-sm font-medium">Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Enter description"
                                            className="block w-full border-0 p-0 text-gray-900 focus:ring-0 text-sm mt-1"
                                            value={formData.description}
                                            onChange={handleChange('description')}
                                        />
                                    </div>

                                    <Listbox value={formData.priority} onChange={handleChange('priority')}>
                                        {({ open }) => (
                                            <div className="relative">
                                                <Listbox.Label className="block text-sm font-medium text-gray-500">Label</Listbox.Label>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className={`relative w-full cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none ${!formData.priority ? 'border-red-500' : 'border-gray-300'}`}>
                                                        <span className="flex items-center">
                                                            <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(formData.priority)}`} />
                                                            {formData.priority || 'Select Event Label'}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-50 ring-opacity-5 focus:outline-none">
                                                        {['High', 'Medium', 'Low', 'None'].map((cat, idx) => (
                                                            <Listbox.Option key={idx} value={cat} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-yellow-100 text-yellow-900' : 'text-gray-900'}`}>
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={`absolute left-2 top-2 h-3 w-3 rounded-full ${getPriorityColor(cat)}`} />
                                                                        <span className={selected ? 'font-medium' : 'font-normal'}>{cat}</span>
                                                                        {selected && <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-yellow-600"><CheckIcon className="h-5 w-5" /></span>}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </div>
                                            </div>
                                        )}
                                    </Listbox>
                                    <Listbox value={formData.status} onChange={handleChange('status')}>
                                        {({ open }) => (
                                            <div className="relative">
                                                <Listbox.Label className="block text-sm font-medium text-gray-500">Label</Listbox.Label>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className={`relative w-full cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none ${!formData.status ? 'border-red-500' : 'border-gray-300'}`}>
                                                        <span className="flex items-center">
                                                            <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(formData.status)}`} />
                                                            {formData.status || 'Select Event Label'}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-50 ring-opacity-5 focus:outline-none">
                                                        {statusList.map((cat, idx) => (
                                                            <Listbox.Option key={idx} value={cat} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-yellow-100 text-yellow-900' : 'text-gray-900'}`}>
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={`absolute left-2 top-2 h-3 w-3 rounded-full ${getStatusColor(cat)}`} />
                                                                        <span className={selected ? 'font-medium' : 'font-normal'}>{cat}</span>
                                                                        {selected && <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-yellow-600"><CheckIcon className="h-5 w-5" /></span>}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </div>
                                            </div>
                                        )}
                                    </Listbox>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange("dueDate")}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <Input
                                        title="remaining"
                                        type="text"
                                        laceholder="Remaining (e.g., 01:30)"
                                        className="w-full mt-1 p-2 border rounded text-sm"
                                        value={formData.remaining}
                                        onChange={handleChange('remaining')}
                                    />
                                    <Input
                                        title="progress"
                                        type="text"
                                        placeholder="Progress (%)"
                                        className="w-full mt-1 p-2 border rounded text-sm"
                                        value={formData.progress}
                                        onChange={handleChange('progress')}
                                    />
                                    <Input
                                        title="assignedTo"
                                        type="text"
                                        placeholder="Assigned to (e.g., P, B)"
                                        className="w-full mt-1 p-2 border rounded text-sm"
                                        value={formData.assignedTo}
                                        onChange={handleChange('assignedTo')}
                                    />
                                    <div className="flex items-center gap-2">
                                        {allCategories.map(cat => (
                                            <label key={cat} className="flex items-center space-x-2 mb-1">
                                                <input
                                                    type="checkbox"
                                                    checked={formData[categoryMap[cat]]}
                                                    onChange={handleChange(categoryMap[cat])}
                                                    style={{ accentColor: categoryColors[cat] }}
                                                    className="form-checkbox h-4 w-4 text-white rounded focus:ring-transparent"
                                                />
                                                <span className="text-sm">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {task ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
