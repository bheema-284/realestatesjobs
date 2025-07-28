'use client';
import React, { useState } from 'react';
import {
    Bookmark,
    Paperclip,
    MessageSquare,
    Clock,
    CheckCircle,
    Edit,
    Trash2,
    MoreVertical
} from 'lucide-react';

const TaskItem = ({
    task,
    onToggleBookmark,
    onEditTask,
    onDeleteTask,
    onMarkAsDone,
}) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'In progress': return 'bg-green-100 text-green-700';
            case 'Needs review': return 'bg-yellow-100 text-yellow-700';
            case 'Needs attention': return 'bg-red-100 text-red-700';
            case 'Needs input': return 'bg-orange-100 text-orange-700';
            case 'Planned': return 'bg-gray-100 text-gray-700';
            case 'Done': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        if (progress > 0) return 'bg-orange-500';
        return 'bg-gray-300';
    };

    const dummyCandidates = Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return {
            name: letter,
            image: `https://i.pravatar.cc/150?u=${letter}`,
        };
    });

    return (
        <div className="flex flex-wrap sm:flex-nowrap items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 group relative">
            {/* Checkbox */}
            <div className="w-1/12 sm:w-10 flex justify-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
            </div>

            {/* Priority / Bookmark */}
            <div className="w-1/12 sm:w-10 flex justify-center relative items-center">
                {!task.bookmarked && (
                    <span className={`transition-opacity duration-200 ${task.bookmarked || 'group-hover:opacity-0'}`}>
                        {task.priority === 'High' && <span className="text-red-500 text-lg">!</span>}
                        {task.priority === 'Medium' && <span className="text-orange-500 text-lg">!</span>}
                        {task.priority === 'Low' && <span className="text-blue-500 text-lg">!</span>}
                    </span>
                )}
                <Bookmark
                    className={`h-4 w-4 absolute cursor-pointer transition-opacity duration-200
                    ${task.bookmarked ? 'text-yellow-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}
                    onClick={() => onToggleBookmark(task.id)}
                    fill={task.bookmarked ? 'currentColor' : 'none'}
                />
            </div>

            {/* Task Title */}
            <div className="w-full sm:flex-1 px-2 text-sm text-gray-800 font-medium cursor-pointer hover:underline" onClick={() => onEditTask(task)}>
                {task.title}
            </div>

            {/* Status */}
            <div className="w-1/2 sm:w-32 px-2 mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>

            {/* Progress */}
            <div className="w-1/2 sm:w-32 px-2 mt-2 sm:mt-0">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${getProgressColor(task.progress)}`} style={{ width: `${task.progress}%` }}></div>
                </div>
            </div>

            {/* Due Date */}
            <div className="w-1/2 sm:w-28 px-2 mt-2 sm:mt-0 text-sm text-gray-600">
                {task.dueDate}
            </div>

            {/* Remaining */}
            <div className={`w-1/2 sm:w-24 px-2 mt-2 sm:mt-0 text-sm ${task.overdue ? 'text-red-500' : 'text-gray-600'}`}>
                {task.remaining}
            </div>

            {/* Assigned To */}
            <div className="w-full sm:w-24 flex -space-x-1 overflow-hidden px-2 mt-2 sm:mt-0">
                {task.assignedTo.map((name, idx) => {
                    const candidate = dummyCandidates.find(c => c.name.toLowerCase() === name.toLowerCase());
                    return candidate ? (
                        <img
                            key={idx}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                            src={candidate.image}
                            alt={candidate.name}
                            title={candidate.name}
                        />
                    ) : (
                        <span
                            key={idx}
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-semibold ring-2 ring-white"
                            title={name}
                        >
                            {name[0]}
                        </span>
                    );
                })}
            </div>

            {/* Attachments / Comments */}
            <div className="w-full sm:w-20 flex items-center justify-end space-x-2 pr-4 mt-2 sm:mt-0">
                {task.attachments && <Paperclip className="h-4 w-4 text-gray-400" />}
                {task.comments && <MessageSquare className="h-4 w-4 text-gray-400" />}
            </div>

            {/* Mobile Toggle Button */}
            <div className="absolute right-2 top-2 sm:hidden">
                <MoreVertical
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    onClick={() => setShowActions(prev => !prev)}
                />
            </div>

            {/* Action Buttons (Desktop & Mobile Controlled) */}
            <div
                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2 bg-white z-10
                ${showActions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto transition-opacity duration-200`}
            >
                <Clock className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-600 cursor-pointer" onClick={() => onMarkAsDone(task.id)} />
                <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer" onClick={() => onEditTask(task)} />
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600 cursor-pointer" onClick={() => onDeleteTask(task.id)} />
            </div>
        </div>
    );
};

export default TaskItem;
