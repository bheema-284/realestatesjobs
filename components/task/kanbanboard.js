'use client'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // For Kanban board drag-and-drop
import RootContext from '../config/rootcontext';
import { useContext } from 'react';

const KanbanBoard = ({ tasks }) => {
    const statuses = ['Not picked', 'Needs input', 'Needs attention', 'Planned', 'In progress', 'Needs review', 'Done'];
    const { setRootContext } = useContext(RootContext);

    const getTasksByStatus = (status) =>
        tasks.filter((task) => task.status === status);

    const getStatusColor = (status) => {
        switch (status) {
            case 'In progress': return 'bg-lime-100 text-lime-600';
            case 'Needs review': return 'bg-blue-100 text-blue-600';
            case 'Needs attention': return 'bg-orange-100 text-orange-600';
            case 'Needs input': return 'bg-rose-100 text-rose-600';
            case 'Planned': return 'bg-yellow-100 text-yellow-600';
            case 'Done': return 'bg-green-100 text-green-600';
            case 'Not picked': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const dummyCandidates = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i); // A-Z
        return {
            name: letter,
            image: `https://i.pravatar.cc/150?u=${letter}`
        };
    });

    const KanbanTaskCard = ({ task }) => (
        <div className="bg-white p-3 relative rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-grab select-none">

            {/* Title and Assigned Avatars on same line */}
            <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-sm text-gray-800 flex-1 line-clamp-2 pr-2">
                    {task.title}
                </p>

                {task.assignedTo?.length > 0 && (
                    <div className="flex -space-x-1 mt-0.5">
                        {task.assignedTo.map((initial, idx) => {
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
                    </div>
                )}
            </div>

            {/* Due Date */}
            <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>

            {/* Status with background color */}
            <div className="flex items-center mt-2">
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                    )}`}
                >
                    {task.status}
                </span>
            </div>
        </div>
    );


    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        setRootContext((prev) => {
            const task = prev.tasks.find((t) => t.id.toString() === draggableId);
            if (!task) return prev;

            const updatedTasks = prev.tasks.map((t) =>
                t.id === task.id ? { ...t, status: destination.droppableId } : t
            );

            return {
                ...prev,
                tasks: updatedTasks,
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'In progress': return 'bg-lime-200 text-lime-800';
            case 'Needs review': return 'bg-blue-200 text-blue-800';
            case 'Needs attention': return 'bg-orange-200 text-orange-800';
            case 'Needs input': return 'bg-rose-200 text-rose-800';
            case 'Planned': return 'bg-yellow-200 text-yellow-800';
            case 'Done': return 'bg-green-200 text-green-800';
            case 'Not picked': return 'bg-red-200 text-red-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-50 rounded-lg shadow-inner min-h-[500px]">
                {statuses.map(status => {
                    const statusTasks = getTasksByStatus(status);
                    const totalDuration = statusTasks.reduce((sum, t) => sum + timeToMinutes(t.duration || '00:00'), 0);
                    return (
                        <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 shadow-inner border border-gray-200"
                                >
                                    <div className={`p-2 mb-2 text-sm font-semibold rounded capitalize ${getStatusStyles(status)}`}>
                                        <p>{status}</p>
                                        <div className="text-xs text-gray-600 mb-2">
                                            <div>Tasks: {statusTasks.length}</div>
                                            <div>Duration: {minutesToTime(totalDuration)}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 min-h-[100px]">
                                        {statusTasks.map((task, index) => (
                                            <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`transition-shadow duration-200 ${snapshot.isDragging ? 'shadow-md' : ''}`}
                                                    >
                                                        <KanbanTaskCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    );

                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard