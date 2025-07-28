'use client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RootContext from '../config/rootcontext';
import { useContext } from 'react';

const KanbanBoard = ({ tasks }) => {
    const statuses = ['Not picked', 'Needs input', 'Needs attention', 'Planned', 'In progress', 'Needs review', 'Done'];
    const { setRootContext } = useContext(RootContext);

    const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

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
            <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
            <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
        </div>
    );

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        setRootContext((prevRootState) => {
            const updatedTasks = [...prevRootState.tasks];

            const draggedIndex = updatedTasks.findIndex(
                (task) => task.id.toString() === draggableId
            );
            const [draggedTask] = updatedTasks.splice(draggedIndex, 1);

            // Update the status
            draggedTask.status = destination.droppableId;

            // Get all tasks in the destination column (after removal)
            const destinationTasks = updatedTasks.filter(
                (task) => task.status === destination.droppableId
            );

            // Find task at drop index in destination column
            const insertBeforeTask = destinationTasks[destination.index];

            if (insertBeforeTask) {
                // Find index of that task in global array
                const insertIndex = updatedTasks.findIndex(
                    (task) => task.id === insertBeforeTask.id
                );
                updatedTasks.splice(insertIndex, 0, draggedTask);
            } else {
                // Drop at end of column — insert after the last task in that column
                let lastIndexInColumn = -1;
                for (let i = updatedTasks.length - 1; i >= 0; i--) {
                    if (updatedTasks[i].status === destination.droppableId) {
                        lastIndexInColumn = i + 1;
                        break;
                    }
                }
                const insertIndex = lastIndexInColumn !== -1 ? lastIndexInColumn : updatedTasks.length;
                updatedTasks.splice(insertIndex, 0, draggedTask);
            }

            return {
                ...prevRootState,
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
            <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner h-screen">
                {statuses.map((status, index) => {
                    const statusTasks = getTasksByStatus(status);
                    const totalDuration = statusTasks.reduce((sum, t) => sum + timeToMinutes(t.duration || '00:00'), 0);
                    return (
                        <div key={index} className="flex-shrink-0 w-72 flex flex-col h-full">
                            <div className={`p-3 rounded-t-lg ${getStatusStyles(status)}`}>
                                <p className="text-sm font-semibold capitalize">{status}</p>
                                <div className="text-xs text-gray-700 mt-1">
                                    <div>Tasks: {statusTasks.length}</div>
                                    <div>Duration: {minutesToTime(totalDuration)}</div>
                                </div>
                            </div>
                            <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-gray-100 rounded-b-lg p-3 shadow-inner border border-t-0 border-gray-200 flex-1 overflow-y-auto h-full"
                                    >
                                        {statusTasks.map((task, index) => (
                                            <Draggable key={index} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-2"
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
    );
};

export default KanbanBoard;
