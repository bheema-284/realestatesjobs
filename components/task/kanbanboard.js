const KanbanBoard = () => {
    // Define the different statuses for the Kanban board columns.
    const statuses = ['Not picked', 'Needs input', 'Needs attention', 'Planned', 'In progress', 'Needs review', 'Done'];
    // Access the rootState and setRootContext function from the RootContext to update global state.
    const { rootState, setRootContext } = useContext(RootContext);
    const tasks = rootState.tasks; // Get tasks from the rootState

    /**
     * Filters tasks based on their status to populate each Kanban column.
     * @param {string} status - The status to filter tasks by.
     * @returns {Array} - An array of tasks matching the given status.
     */
    const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

    /**
     * Returns Tailwind CSS classes for the background and text color of a task card's status pill.
     * @param {string} status - The status of the task.
     * @returns {string} - Tailwind CSS classes for styling.
     */
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

    // Dummy data for assigned candidates/users to display avatars.
    const dummyCandidates = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return {
            name: letter,
            image: `https://i.pravatar.cc/150?u=${letter}`, // Using pravatar for dummy images
        };
    });

    /**
     * Represents a single Kanban task card.
     * @param {object} props - The component props.
     * @param {object} props.task - The task object containing title, assignedTo, dueDate, and status.
     */
    const KanbanTaskCard = ({ task }) => (
        <div className="bg-white p-3 relative rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 cursor-grab select-none">
            <div className="flex justify-between items-start gap-2">
                {/* Task title, truncated if too long */}
                <p className="font-medium text-sm text-gray-800 flex-1 line-clamp-2 pr-2">{task.title}</p>
                {/* Display assigned users' avatars if available */}
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
            {/* Task due date */}
            <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
            <div className="flex items-center mt-2">
                {/* Task status pill with dynamic styling */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
        </div>
    );

    /**
     * Handles the end of a drag operation. Updates the task's status and order based on the new column and position.
     * @param {object} result - The result object from react-beautiful-dnd.
     */
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // If dropped outside a droppable area, do nothing.
        if (!destination) {
            return;
        }

        // Update the global context with the new task status and order.
        setRootContext((prevRootState) => {
            // Create mutable copies of the task lists for source and destination columns.
            // This allows us to modify them without directly mutating the previous state.
            let sourceColumnTasks = prevRootState.tasks.filter(task => task.status === source.droppableId);
            let destinationColumnTasks = prevRootState.tasks.filter(task => task.status === destination.droppableId);

            // Remove the dragged task from its source column's list.
            // The `source.index` is relative to `sourceColumnTasks`.
            const [draggedItem] = sourceColumnTasks.splice(source.index, 1);

            // If moving to a different column, update its status.
            if (source.droppableId !== destination.droppableId) {
                draggedItem.status = destination.droppableId;
            }

            // Insert the dragged task into the destination column's list at the specified index.
            // The `destination.index` is relative to `destinationColumnTasks`.
            destinationColumnTasks.splice(destination.index, 0, draggedItem);

            // Reconstruct the full tasks array by iterating through all defined statuses.
            // This ensures that the order of columns is maintained, and within each column,
            // the order of tasks (after splice operations) is preserved.
            const newTasks = statuses.flatMap(status => {
                if (status === source.droppableId) {
                    return sourceColumnTasks;
                } else if (status === destination.droppableId) {
                    return destinationColumnTasks;
                } else {
                    // For columns not involved in the drag, keep their original tasks and order.
                    return prevRootState.tasks.filter(task => task.status === status);
                }
            });

            // Return the new state with the updated tasks array.
            return { ...prevRootState, tasks: newTasks };
        });
    };

    /**
     * Converts a time string (e.g., "01:30") into total minutes.
     * @param {string} timeStr - The time string in "HH:MM" format.
     * @returns {number} - The total duration in minutes.
     */
    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    /**
     * Converts total minutes back into a time string (e.g., "01:30").
     * @param {number} mins - The total duration in minutes.
     * @returns {string} - The time string in "HH:MM" format.
     */
    const minutesToTime = (mins) => {
        const h = String(Math.floor(mins / 60)).padStart(2, '0');
        const m = String(mins % 60).padStart(2, '0');
        return `${h}:${m}`;
    };

    /**
     * Returns Tailwind CSS classes for the background and text color of a status column header.
     * @param {string} status - The status of the column.
     * @returns {string} - Tailwind CSS classes for styling.
     */
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
        // DragDropContext wraps the entire draggable area.
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner h-screen">
                {/* Map over each status to create a Kanban column */}
                {statuses.map((status, index) => {
                    const statusTasks = getTasksByStatus(status); // Get tasks for the current status
                    // Calculate the total duration of tasks in the current column
                    const totalDuration = statusTasks.reduce((sum, t) => sum + timeToMinutes(t.duration || '00:00'), 0);
                    return (
                        <div key={index} className="flex-shrink-0 w-72 flex flex-col h-full">
                            {/* Column header with status name, task count, and total duration */}
                            <div className={`p-3 rounded-t-lg ${getStatusStyles(status)}`}>
                                <p className="text-sm font-semibold capitalize">{status}</p>
                                <div className="text-xs text-gray-700 mt-1">
                                    <div>Tasks: {statusTasks.length}</div>
                                    <div>Duration: {minutesToTime(totalDuration)}</div>
                                </div>
                            </div>
                            {/* Droppable area for tasks within this column */}
                            <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-gray-100 rounded-b-lg p-3 shadow-inner border border-t-0 border-gray-200 flex-1 overflow-y-auto h-full"
                                    >
                                        {/* Map over tasks in the current status to create draggable task cards */}
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
                                        {/* Placeholder for when items are dragged within or out of the droppable */}
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