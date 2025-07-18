'use client'
export const runtime = "edge";

import RootContext from '@/components/config/rootcontext';
import TaskModal from '@/components/createtasks';
import React, { useContext, useState } from 'react';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};



export default function TaskPage() {

  const { rootContext, setRootContext } = useContext(RootContext);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", stage: "", date: "", percent: 0 });
  function handleAddTask() {
    setRootContext((prevContext) => ({
      ...prevContext,
      tasks: [...prevContext.tasks, newTask],
    }));
    setNewTask({ title: "", stage: "", date: "", percent: 0 });
    setShowTaskForm(false);
  }

  const dummyTasks = rootContext.tasks || [
    { id: 1, percent: 40, title: 'Schedule Interview', status: 'Pending', assignedTo: 'HR Team', date: '2025-07-20' },
    { id: 2, percent: 30, title: 'Follow-up with Candidate', status: 'In Progress', assignedTo: 'Recruiter A', date: '2025-07-18' },
    { id: 3, percent: 80, title: 'Create Job Posting', status: 'Completed', assignedTo: 'Marketing', date: '2025-07-15' },
    { id: 4, percent: 12, title: 'Verify Candidate Documents', status: 'Pending', assignedTo: 'Operations', date: '2025-07-22' },
  ];
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 pb-10 font-sans">
      <div className='flex gap-5 justify-between items-center'>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700">
            Task
          </h1>
          <p className="text-sm text-gray-500 mt-2">Real Estate Jobs Task Management</p>
        </div>
        <button className="px-4 py-2 rounded bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 hover:from-orange-500 hover:via-purple-600 hover:to-purple-800" onClick={() => setShowTaskForm(true)}>Add</button>
      </div>

      {(!dummyTasks || dummyTasks.length === 0) ? <div className="mb-8">
        <h1 className="text-sm sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700">
          No Task available
        </h1>
      </div> : <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-50 p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyTasks.map((task, index) => (
              <tr key={index} className="block md:table-row hover:bg-gray-50">
                <td className="block md:table-cell py-2 px-4 font-medium text-gray-700">
                  <span className="md:hidden font-semibold">Task: </span>
                  {task.title}
                </td>
                <td className="block md:table-cell py-2 px-4 text-gray-600">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-blue-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${task.percent}, 100`}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {task.percent}%
                    </div>
                  </div>
                </td>
                <td className="block md:table-cell py-2 px-4 text-gray-600">
                  <span className="md:hidden font-semibold">Due Date: </span>
                  {task.date}
                </td>
                <td className="block md:table-cell py-2 px-4">
                  <span className="md:hidden font-semibold">Status: </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[task.status]}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
      {showTaskForm && <TaskModal newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} showTaskForm={showTaskForm} setShowTaskForm={setShowTaskForm} />}
    </div>
  );
}
