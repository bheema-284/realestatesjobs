import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const toDoItemsFromBackend = [
    {
        id: uuidv4(),
        content: {
            title: "Brainstorming",
            description: "Brainstorming brings team members' diverse experience into play.",
            priority: ["Low", "Medium", "High"],
            comments: 12,
            files: 10,
        },
    },
    {
        id: uuidv4(),
        content: {
            title: "Research",
            description: "User research helps you to create an optimal product for users.",
            priority: ["Low", "Medium", "High"],
            comments: 0,
            files: 3,
        },
    },
    {
        id: uuidv4(),
        content: {
            title: "Wireframes",
            description: "Low fidelity wireframes include the most basic content and visuals.",
            priority: ["Low", "Medium", "High"],
            comments: 10,
            files: 12,
        },
    },
];

const inProgressItemsFromBackend = [
    {
        id: uuidv4(),
        content: {
            title: "Onboarding Illustrations ",
            description: "",
            images: [],
            priority: ["Low", "Medium", "High"],
            comments: 14,
            files: 9,
        },
    },
    {
        id: uuidv4(),
        content: {
            title: "Moodboard",
            description: "",
            images: [],
            priority: ["Low", "Medium", "High"],
            comments: 15,
            files: 10,
        },
    },
];

const doneItemsFromBackend = [
    {
        id: uuidv4(),
        content: {
            title: "Mobile App Design ",
            description: "",
            images: [],
            priority: ["Low", "Medium", "High"],
            comments: 12,
            files: 15,
        },
    },
    {
        id: uuidv4(),
        content: {
            title: "Design System",
            description: "It just needs to adapt the UI from what you did before ",
            images: [],
            priority: ["Low", "Medium", "High"],
            comments: 12,
            files: 15,
        },
    },
];

const columnsFromBackend = {
    [uuidv4()]: {
        name: "To Do",
        items: toDoItemsFromBackend,
    },
    [uuidv4()]: {
        name: "In Progress",
        items: inProgressItemsFromBackend,
    },
    [uuidv4()]: {
        name: "Done",
        items: doneItemsFromBackend,
    },
};

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in same column, do nothing
    if (source.droppableId === destination.droppableId) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    // Remove item from source
    const [moved] = sourceItems.splice(source.index, 1);

    // Append to end of destination column
    destItems.push(moved);

    setColumns({
        ...columns,
        [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
        },
        [destination.droppableId]: {
            ...destColumn,
            items: destItems,
        },
    });
};


function KanbanBoard() {
    const [columns, setColumns] = useState(columnsFromBackend);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                {Object.entries(columns).map(([columnId, column], index) => {
                    return (
                        <Droppable droppableId={columnId} key={columnId} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                            {(provided, snapshot) => {
                                return (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            background: snapshot.isDraggingOver ? "lightgrey" : "#F5F5F5",
                                            padding: 16,
                                            width: "100%",
                                            minHeight: 500,
                                            margin: "5px 0",
                                            borderRadius: "0.5rem",
                                        }}>
                                        {/* Header */}
                                        <div className={`flex items-center justify-between py-4 mb-6 border-b-4 ${column.name === "To Do" && "border-[#5030E5]"} ${column.name === "In Progress" && "border-[#FFA500]"}  ${column.name === "Done" && "border-[#8BC48A]"}`}>
                                            <div className="w-50 flex items-center justify-start">
                                                <div className={`w-2 h-2 rounded-full ${column.name === "To Do" && "bg-[#5030E5]"} ${column.name === "In Progress" && "bg-[#FFA500]"}  ${column.name === "Done" && "bg-[#8BC48A]"}`}></div>
                                                <p className=" text-[#0D062D] text-base mx-2 font-semibold leading-5 tracking-normal text-left">{column.name}</p>
                                                <span className="bg-[#E0E0E0] font-medium rounded-full w-6 h-6  flex items-center justify-center">
                                                    <span className="text-[#625F6D]">{column.items.length > 0 ? column.items.length : 0} </span>
                                                </span>
                                            </div>

                                            <button type="button" className="text-[#5030E5] hover:text-white bg-[#5030E5] bg-opacity-20 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                                </svg>
                                            </button>
                                        </div>
                                        {column.items.map((item, index) => {
                                            return (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided) => {
                                                        return (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    userSelect: "none",
                                                                    borderRadius: "0.5rem",
                                                                    margin: "0 0 8px 0",
                                                                    minHeight: "50px",
                                                                    color: "white",
                                                                    ...provided.draggableProps.style,
                                                                }}>
                                                                {/* {item.content} */}
                                                                <div className="bg-[#FFFFFF] rounded-lg p-4 my-4">
                                                                    <div className="flex items-center justify-between">
                                                                        {column.name === "Done" ? <span className="bg-[#83C29D] bg-opacity-20 text-[#68B266] text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Completed</span> : <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{item.content.title === "Research" || item.content.title === "Wireframes" ? item.content.priority[2] : item.content.priority[0]}</span>}
                                                                        <span className="flex items-center justify-between">
                                                                            <div className="w-1 h-1 bg-black rounded-full"></div>
                                                                            <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
                                                                            <div className="w-1 h-1 bg-black rounded-full"></div>
                                                                        </span>
                                                                    </div>
                                                                    <h5 className="text-[#0D062D] py-2 text-lg font-semibold leading-5 tracking-normal text-left">{item.content.title}</h5>

                                                                    {item.content.description ? (
                                                                        <p className="text-[#787486] pb-2 pr-2 text-xs font-normal leading-4 tracking-normal text-left">{item.content.description}</p>
                                                                    ) : item.content.images.length > 1 ? (
                                                                        <div className="grid grid-cols-2 gap-2 items-center justify-center">
                                                                            <img src={item.content.images[0]} width="100%" />
                                                                            <img src={item.content.images[1]} width="100%" />
                                                                        </div>
                                                                    ) : (
                                                                        <img src={item.content.images[0]} />
                                                                    )}

                                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 pt-4">
                                                                        <span className="flex items-center justify-start lg:justify-center ">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#787486]">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                                            </svg>
                                                                            <span className="text-[#787486] pl-1 text-xs font-medium leading-4 tracking-normal text-left">
                                                                                <span>{item.content.comments} </span> comments
                                                                            </span>
                                                                        </span>

                                                                        <span className="flex items-center justify-start lg:justify-end ">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#787486]">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                                            </svg>

                                                                            <span className="text-[#787486] pl-1 text-xs font-medium leading-4 tracking-normal text-left">
                                                                                <span>{item.content.files}</span> files
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                );
                            }}
                        </Droppable>
                    );
                })}
            </DragDropContext>
        </div>
    );
}

export default KanbanBoard;