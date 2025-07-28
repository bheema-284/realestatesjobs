'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './kanbancard';

const initialColumns = [
    {
        title: 'Backlog',
        tasks: [
            { id: '1', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' },
            { id: '2', title: 'Provide documentation on integrations', date: 'Sep 12' },
            { id: '3', title: 'Design shopping cart dropdown', date: 'Sep 9', type: 'Design' },
            { id: '4', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' },
            { id: '5', title: 'Test checkout flow', date: 'Sep 15', type: 'QA' }
        ]
    },
    {
        title: 'In Progress',
        tasks: [
            { id: '6', title: 'Design shopping cart dropdown', date: 'Sep 9', type: 'Design' },
            { id: '7', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' },
            { id: '8', title: 'Provide documentation on integrations', date: 'Sep 12', type: 'Backend' }
        ]
    },
    {
        title: 'Review',
        tasks: [
            { id: '9', title: 'Provide documentation on integrations', date: 'Sep 12' },
            { id: '10', title: 'Design shopping cart dropdown', date: 'Sep 9', type: 'Design' },
            { id: '11', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' },
            { id: '12', title: 'Design shopping cart dropdown', date: 'Sep 9', type: 'Design' },
            { id: '13', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' }
        ]
    },
    {
        title: 'Done',
        tasks: [
            { id: '14', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' },
            { id: '15', title: 'Design shopping cart dropdown', date: 'Sep 9', type: 'Design' },
            { id: '16', title: 'Add discount code to checkout page', date: 'Sep 14', type: 'Feature Request' }
        ]
    }
];

const KanbanBoard = () => {
    const [columns, setColumns] = useState(initialColumns);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceColIndex = source.droppableId;
        const destColIndex = destination.droppableId;

        const sourceCol = [...columns[sourceColIndex].tasks];
        const destCol = [...columns[destColIndex].tasks];

        const [movedTask] = sourceCol.splice(source.index, 1);
        destCol.splice(destination.index, 0, movedTask);

        const updated = [...columns];
        updated[sourceColIndex] = { ...columns[sourceColIndex], tasks: sourceCol };
        updated[destColIndex] = { ...columns[destColIndex], tasks: destCol };
        setColumns(updated);
    };

    return (
        <div className="flex justify-center">
            <div className="min-h-screen flex overflow-x-scroll py-12">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((column, colIndex) => (
                        <Droppable droppableId={colIndex.toString()} key={column.title}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 rounded-lg px-3 py-3 mr-4 column-width"
                                >
                                    <p className="text-gray-700 font-semibold font-sans tracking-wide text-sm">
                                        {column.title}
                                    </p>
                                    {column.tasks.map((task, index) => (
                                        <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`mt-3 cursor-move ${snapshot.isDragging ? 'ghost-card' : ''}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TaskCard task={task} />
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
        </div>
    );
};

export default KanbanBoard;
