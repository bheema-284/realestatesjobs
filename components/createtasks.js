'use client';

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import dayjs from "dayjs";
import Calendar from "./common/calendar";
import Input from "./common/input";
const TaskModal = ({ newTask, setNewTask, handleAddTask, showTaskForm, setShowTaskForm }) => {
    function convertDate(dateStr) {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (datePattern.test(dateStr)) {
            const [day, month, year] = dateStr.split("-");
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    }
    const formatDateTime = (value, format, type) => {
        const date = type === "utc" ? dayjs.utc(convertDate(value)) : dayjs(convertDate(value));
        return date.format(format).toString();
    };
    return (
        <div className="w-full mx-auto p-4">
            <Transition appear show={showTaskForm} as={Fragment}>
                <Dialog as="div" className="relative shadow-xl z-50" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-5">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Add New TAsk
                                        </Dialog.Title>
                                        <XMarkIcon className="h-5 fill-gray-900 hover:cursor-pointer hover:font-bold" onClick={() => setShowTaskForm(false)} />
                                    </div>
                                    <div className="mt-4 space-y-4">
                                        <Input
                                            title={"Task Title"}
                                            type={"text"}
                                            placeholder={"Enter task title"}
                                            value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            required={true}
                                        />
                                        <Input
                                            title={"Task Stage"}
                                            type={"text"}
                                            placeholder={"Enter stage"}
                                            value={newTask.stage} onChange={(e) => setNewTask({ ...newTask, stage: e.target.value })}
                                            required={true}
                                        />
                                        <Calendar
                                            title={"Date"}
                                            type={"date"}
                                            required={true}
                                            min={formatDateTime(new Date(), "YYYY-MM-DD")}
                                            value={formatDateTime(new Date(newTask.date), "YYYY-MM-DD")}
                                            fromOnchange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                            containerStyle={"w-full"}
                                        />

                                        <Input
                                            title={"Progress %"}
                                            type={"text"}
                                            placeholder={"Enter Progress"}
                                            value={newTask.percent} onChange={(e) => setNewTask({ ...newTask, percent: e.target.value })}
                                            required={true}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm" onClick={() => setShowTaskForm(false)}>Cancel</button>
                                            <button className="bg-green-400 text-gray-800 px-4 py-2 rounded text-sm" onClick={handleAddTask}>Add</button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>

    );
};

export default TaskModal;
