"use client";
import { useState, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RootContext from '../config/rootcontext';
import { Plus, MoreHorizontal } from 'lucide-react';

const KanbanBoard = ({ tasks }) => {
    const activeStatuses = Object.keys(tasks);

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
    const { setRootContext } = useContext(RootContext);
    const [statusColors, setStatusColors] = useState(
        Object.fromEntries(Object.keys(tasks).map((status, i) => [status, defaultColors[i % defaultColors.length]]))
    );

    const namedColorClasses = {
        red: 'bg-red-200 text-red-800',
        green: 'bg-green-200 text-green-800',
        yellow: 'bg-yellow-200 text-yellow-800',
        blue: 'bg-blue-200 text-blue-800',
        gray: 'bg-gray-200 text-gray-800',
        purple: 'bg-purple-200 text-purple-800',
        voilet: 'bg-voilet-200 text-voilet-800',
    };


    const getStatusColor = (status) => statusColors?.[status] || 'bg-gray-200 text-gray-800';


    const dummyCandidates = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return {
            name: letter,
            image: `https://i.pravatar.cc/150?u=${letter}`,
        };
    });

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
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
        </div>
    );

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        setRootContext((prevRootState) => {
            const sourceList = [...(prevRootState.tasks[source.droppableId] || [])];
            const destList = [...(prevRootState.tasks[destination.droppableId] || [])];

            const [movedTask] = sourceList.splice(source.index, 1);
            movedTask.status = destination.droppableId;
            destList.splice(destination.index, 0, movedTask);

            return {
                ...prevRootState,
                tasks: {
                    ...prevRootState.tasks,
                    [source.droppableId]: sourceList,
                    [destination.droppableId]: destList,
                },
            };
        });
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
                const updatedTasks = { ...prev.tasks };

                if (!updatedTasks[trimmed]) {
                    updatedTasks[trimmed] = [];
                }

                return {
                    ...prev,
                    tasks: updatedTasks,
                };
            });

            // ✅ Add this block to update local statusColors too
            setStatusColors(prev => ({
                ...prev,
                [trimmed]: namedColorClasses[newColor] || 'bg-gray-200 text-gray-800',
            }));
        }

        setNewStatus('');
        setNewColor('gray');
        setShowModal(false);
    };



    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner h-screen">
                    {activeStatuses.map((status, index) => {
                        const statusTasks = tasks[status] || [];
                        const totalDuration = statusTasks.reduce((sum, t) => sum + timeToMinutes(t.duration || '00:00'), 0);

                        return (
                            <div key={index} className="flex-shrink-0 w-72 flex flex-col h-full">
                                <div>
                                    <div className='flex justify-end'>
                                        {index === activeStatuses.length - 1 && (
                                            <button onClick={() => setShowModal(true)} className="text-gray-700 hover:text-gray-900">
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className={`p-3 ${index === activeStatuses.length - 1 ? "mt-0" : "mt-5"} rounded-t-lg ${getStatusColor(status)} flex justify-between items-center`}>
                                        <div>
                                            <div className='flex gap-5 justify-between'>
                                                <p className="text-sm font-semibold capitalize">{status}</p>
                                                <div className="relative">
                                                    <button onClick={() => setMenuOpen(index)}>
                                                        <MoreHorizontal className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                                    </button>
                                                    {menuOpen === index && (
                                                        <div className="absolute left-0 right-0 top-6 bg-white border rounded shadow p-2 text-sm z-10 w-44">
                                                            <button className="block px-2 py-1 hover:bg-gray-100 w-full text-left">Change Title</button>
                                                            <div className="block px-2 py-1 text-left">
                                                                <p className="mb-1 text-xs text-gray-500">Change Color:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {defaultColors.map((colorClass, i) => (
                                                                        <button
                                                                            key={i}
                                                                            onClick={() => {
                                                                                setStatusColors((prev) => ({
                                                                                    ...prev,
                                                                                    [status]: colorClass,
                                                                                }));
                                                                                setMenuOpen(null);
                                                                            }}
                                                                            className={`w-5 h-5 rounded-full ${colorClass.split(' ')[0]}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-700 mt-1">
                                                <div>Tasks: {statusTasks.length}</div>
                                                <div>Duration: {minutesToTime(totalDuration)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="bg-gray-100 rounded-b-lg p-3 shadow-inner border border-t-0 border-gray-200 flex-1 overflow-y-auto h-full"
                                        >
                                            {statusTasks.map((task, index) => (
                                                <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 transition-shadow duration-200 ${snapshot.isDragging ? 'shadow-md' : ''}`}
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
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

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
        </>
    );
};

export default KanbanBoard;