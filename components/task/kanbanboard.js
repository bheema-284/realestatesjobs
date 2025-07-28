'use client'
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = {
    "To Do": [
        { id: '1', title: 'Add GitHub Login', description: 'Implement OAuth login' },
        { id: '2', title: 'Project Setup', description: 'Set up Tailwind & React' }
    ],
    "In Progress": [
        { id: '3', title: 'Build Kanban UI', description: 'Create layout and components' }
    ],
    "Done": [
        { id: '4', title: 'Initialize Repo', description: 'Push to GitHub' }
    ]
};

const KanbanBoard = () => {
    const [columns, setColumns] = useState(initialTasks);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const [removed] = sourceCol.splice(source.index, 1);
        destCol.splice(destination.index, 0, removed);

        setColumns({
            ...columns,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol,
        });
    };

    const TaskCard = ({ task }) => {
        return (
            <div className="bg-white p-3 rounded-xl shadow border text-sm text-gray-700">
                <h3 className="font-semibold mb-1">{task.title}</h3>
                <p className="text-xs text-gray-500">{task.description}</p>
            </div>
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-4 p-4 overflow-x-auto">
                {Object.entries(columns).map(([columnId, tasks]) => (
                    <div key={columnId} className="flex-1 min-w-[250px]">
                        <h2 className="text-lg font-bold mb-2">{columnId}</h2>
                        <Droppable droppableId={columnId}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 rounded-xl p-2 space-y-3 min-h-[200px]"
                                >
                                    {tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
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
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
