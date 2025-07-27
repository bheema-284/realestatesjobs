'use client';
import React from 'react';
import TaskItem from './taskitem';

const TaskListView = ({
    groupedTasks,
    onToggleBookmark,
    onEditTask,
    onDeleteTask,
    onMarkAsDone
}) => {
    return (
        <>
            {/* Task List Header Row */}
            <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 py-3 px-4 flex items-center text-xs font-semibold text-gray-600 uppercase">
                <div className="w-32 flex-1 px-2">Task</div>
                <div className="w-32 px-2">Status</div>
                <div className="w-32 px-2">Progress</div>
                <div className="w-28 px-2">Due date</div>
                <div className="w-24 px-2">Remaining</div>
                <div className="w-24 px-2">Assigned To</div>
                <div className="w-20 pr-4 text-right">Actions</div>
            </div>

            {/* Task List Body */}
            <div className="bg-white rounded-b-lg shadow-md">
                {Object.keys(groupedTasks).map(priorityGroup => {
                    const tasksInGroup = groupedTasks[priorityGroup];
                    if (tasksInGroup.length === 0) return null;

                    return (
                        <div key={priorityGroup} className="border-t border-gray-200 first:border-t-0">
                            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between text-sm font-semibold text-gray-700">
                                <span>{priorityGroup} priority</span>
                                <span className="text-gray-500">{tasksInGroup.length} tasks</span>
                            </div>
                            <div>
                                {tasksInGroup.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggleBookmark={onToggleBookmark}
                                        onEditTask={onEditTask}
                                        onDeleteTask={onDeleteTask}
                                        onMarkAsDone={onMarkAsDone}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TaskListView;
