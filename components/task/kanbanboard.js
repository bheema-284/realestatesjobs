'use client'
import { MessageSquare, Paperclip } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // For Kanban board drag-and-drop
import RootContext from '../config/rootcontext';
import { useContext } from 'react';

const KanbanBoard = ({ tasks }) => {
    const statuses = ['Not picked', 'In progress', 'Needs review', 'Needs attention', 'Needs input', 'Planned', 'Done'];
    const { setRootContext } = useContext(RootContext);

    const getTasksByStatus = (status) =>
        tasks.filter((task) => task.status === status);

    const getStatusColor = (status) => {
        switch (status) {
            case 'In progress': return 'bg-green-100 text-green-700';
            case 'Needs review': return 'bg-yellow-100 text-yellow-700';
            case 'Needs attention': return 'bg-red-100 text-red-700';
            case 'Needs input': return 'bg-orange-100 text-orange-700';
            case 'Planned': return 'bg-gray-100 text-gray-700';
            case 'Done': return 'bg-blue-100 text-blue-700';
            case 'Not picked': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const KanbanTaskCard = ({ task }) => (
        <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow transition-shadow duration-150 cursor-grab select-none">
            <p className="font-medium text-sm text-gray-800">{task.title}</p>
            <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
            <div className="flex items-center text-xs text-gray-500 mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
                {task.attachments && <Paperclip className="h-3 w-3 ml-auto text-gray-400" />}
                {task.comments && <MessageSquare className="h-3 w-3 ml-1 text-gray-400" />}
            </div>
            {task.assignedTo?.length > 0 && (
                <div className="flex -space-x-1 overflow-hidden mt-2">
                    {task.assignedTo.map((initial, idx) => (
                        <span key={idx} className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-[10px] font-semibold ring-1 ring-white">
                            {initial}
                        </span>
                    ))}
                </div>
            )}
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-50 rounded-lg shadow-inner min-h-[500px]">
                {statuses.map(status => {
                    const statusTasks = getTasksByStatus(status);
                    return (
                        <Droppable droppableId={status} key={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 shadow-inner border border-gray-200"
                                >
                                    <h3 className="font-semibold text-gray-800 mb-3 capitalize">
                                        {status} ({statusTasks.length})
                                    </h3>
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