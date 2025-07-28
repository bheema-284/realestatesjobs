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

        // If no destination or dropped in the same place, do nothing
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        setRootContext((prevRootState) => {
            const newTasks = [...prevRootState.tasks];

            // Find the dragged task
            const draggedTaskIndex = newTasks.findIndex(task => task.id.toString() === draggableId);
            const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);

            // Update the status if moved to a different column
            draggedTask.status = destination.droppableId;

            // Reinsert the task at the new position
            // We need to re-filter the tasks for the destination column to get the correct index
            // since newTasks has already had the dragged task removed
            const tasksInDestinationColumn = newTasks.filter(task => task.status === destination.droppableId);

            // To find the actual insertion index in the global array,
            // we first collect all tasks that would appear before the insertion point
            // in the new state of tasks.
            let insertIndex = 0;
            let foundDropSpot = false;

            for (let i = 0; i < newTasks.length; i++) {
                if (newTasks[i].status === destination.droppableId) {
                    if (tasksInDestinationColumn.indexOf(newTasks[i]) === destination.index) {
                        insertIndex = i;
                        foundDropSpot = true;
                        break;
                    }
                }
                insertIndex = i + 1; // Default to inserting at the end if no specific spot found yet
            }

            // If we didn't find a specific insertion spot (e.g., dropping into an empty column
            // or at the very end of a column), we need to place it after the last task
            // of the destination column or at the absolute end if it's a new column.
            if (!foundDropSpot) {
                // Find the index of the last task in the destination column
                let lastTaskInDestinationColumnIndex = -1;
                for (let i = newTasks.length - 1; i >= 0; i--) {
                    if (newTasks[i].status === destination.droppableId) {
                        lastTaskInDestinationColumnIndex = i;
                        break;
                    }
                }
                insertIndex = lastTaskInDestinationColumnIndex !== -1 ? lastTaskInDestinationColumnIndex + 1 : newTasks.length;
            }


            // The above logic for finding the insertIndex is still a bit complex.
            // A more robust approach for `react-beautiful-dnd` with global state updates
            // often involves reconstructing the entire list of tasks, or carefully
            // managing insertion.

            // Let's simplify and directly work with the tasks within their columns,
            // then flatten them back.

            const columns = {};
            statuses.forEach(status => {
                columns[status] = prevRootState.tasks.filter(t => t.status === status);
            });

            // Remove from source column
            const sourceColumnTasks = Array.from(columns[source.droppableId]);
            const [removed] = sourceColumnTasks.splice(source.index, 1);
            columns[source.droppableId] = sourceColumnTasks;

            // Add to destination column
            const destinationColumnTasks = Array.from(columns[destination.droppableId]);
            removed.status = destination.droppableId; // Update status for the moved task
            destinationColumnTasks.splice(destination.index, 0, removed);
            columns[destination.droppableId] = destinationColumnTasks;

            // Flatten back into a single array
            const updatedTasks = statuses.flatMap(status => columns[status]);

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
                                            <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
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