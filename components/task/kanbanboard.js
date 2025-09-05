'use client';

import { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import RootContext from '../config/rootcontext';
import { MoreHorizontal } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/solid';
const KanbanBoard = () => {
    const defaultColors = [
        'bg-lime-200 text-lime-800',
        'bg-blue-200 text-blue-800',
        'bg-orange-200 text-orange-800',
        'bg-rose-200 text-rose-800',
        'bg-yellow-200 text-yellow-800',
        'bg-green-200 text-green-800',
        'bg-red-200 text-red-800',
        'bg-gray-200 text-gray-800',
        'bg-voilet-200 text-voilet-800',
    ];
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newColor, setNewColor] = useState('');
    const [menuOpen, setMenuOpen] = useState(null);
    const { rootContext, setRootContext } = useContext(RootContext);
    const [statusColors, setStatusColors] = useState(rootContext.tasksColumns.map(item => item.title).map((status, i) => [status, defaultColors[i % defaultColors.length]]));
    const getStatusColor = (status) => statusColors?.[status] || 'bg-gray-200 text-gray-800';
    const [columns, setColumns] = useState(rootContext.tasksColumns || []);

    const namedColorClasses = {
        red: 'bg-red-200 text-red-800',
        green: 'bg-green-200 text-green-800',
        yellow: 'bg-yellow-200 text-yellow-800',
        blue: 'bg-blue-200 text-blue-800',
        gray: 'bg-gray-200 text-gray-800',
        purple: 'bg-purple-200 text-purple-800',
        voilet: 'bg-voilet-200 text-voilet-800',
    };
    const dummyCandidates = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return {
            name: letter,
            image: `https://i.pravatar.cc/150?u=${letter}`,
        };
    });
    // const columns = rootContext.tasksColumns || []
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
        const destColIndex = columns.findIndex(col => col.id === destination.droppableId);

        if (sourceColIndex === -1 || destColIndex === -1) return;

        const sourceTasks = Array.from(columns[sourceColIndex].tasks);
        const destTasks = Array.from(columns[destColIndex].tasks);

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedTask);

        const updated = [...columns];
        updated[sourceColIndex] = { ...columns[sourceColIndex], tasks: sourceTasks };
        updated[destColIndex] = { ...columns[destColIndex], tasks: destTasks };

        setColumns(updated);
    };


    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const minutesToTime = (mins) => {
        const h = String(Math.floor(mins / 60)).padStart(2, '0');
        const m = String(mins % 60).padStart(2, '0');
        return `${h}:${m}`;
    };
    const handleModalSubmit = () => {
        const trimmed = newStatus.trim();

        if (trimmed) {
            setRootContext(prev => {
                const alreadyExists = prev.tasksColumns.some(col => col.title.toLowerCase() === trimmed.toLowerCase());
                if (alreadyExists) return prev;

                const newColumn = {
                    title: trimmed,
                    tasks: [],
                };

                return {
                    ...prev,
                    tasksColumns: [...prev.tasksColumns, newColumn],
                };
            });

            // Optional: update color map
            setStatusColors(prev => ({
                ...prev,
                [trimmed]: namedColorClasses[newColor] || 'bg-gray-200 text-gray-800',
            }));
        }

        // Reset modal state
        setNewStatus('');
        setNewColor('gray');
        setShowModal(false);
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

    const KanbanTaskCard = ({ task }) => (
        <div className="bg-white p-3 relative rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-grab select-none">
            <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-sm text-gray-800 flex-1 line-clamp-2 pr-2">{task.title}</p>
                {task.assignedTo?.length > 0 && (
                    <div className="flex -space-x-1 mt-0.5">
                        {task.assignedTo.slice(0, 3).map((initial, idx) => {
                            const user = dummyCandidates.find((c) => c.name === initial);
                            return (
                                <img
                                    key={idx}
                                    src={user?.image}
                                    alt={initial}
                                    className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                />
                            );
                        })}
                        {task.assignedTo.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-300 text-[10px] text-gray-800 font-medium ring-2 ring-white flex items-center justify-center leading-none">
                                +{task.assignedTo.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
            <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
        </div>
    );
    const totalDuration = columns.flatMap(group => group.tasks).reduce((sum, t) => sum + timeToMinutes(t.duration || '00:00'), 0);
    return (
        <div className="flex justify-center">
            <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner h-screen">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((column) => (
                        <Droppable droppableId={column.id} key={column.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="..."
                                >
                                    {column.tasks.map((task, index) => (
                                        <Draggable draggableId={task.id} index={index} key={task.id}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <KanbanTaskCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}

                </DragDropContext>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Add New Column</h2>
                        <input
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            placeholder="Enter column status"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <select
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            {Object.keys(namedColorClasses).map((colorKey) => (
                                <option key={colorKey} value={colorKey} className="capitalize">
                                    {colorKey}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalSubmit}
                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;