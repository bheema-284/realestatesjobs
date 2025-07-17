export const runtime = "edge";

import React from 'react';

const dummyTasks = [
  { id: 1, title: 'Schedule Interview', status: 'Pending', assignedTo: 'HR Team', dueDate: '2025-07-20' },
  { id: 2, title: 'Follow-up with Candidate', status: 'In Progress', assignedTo: 'Recruiter A', dueDate: '2025-07-18' },
  { id: 3, title: 'Create Job Posting', status: 'Completed', assignedTo: 'Marketing', dueDate: '2025-07-15' },
  { id: 4, title: 'Verify Candidate Documents', status: 'Pending', assignedTo: 'Operations', dueDate: '2025-07-22' },
];

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function TaskPage() {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-10 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700">
          Task
        </h1>
        <p className="text-sm text-gray-500 mt-2">Real Estate Jobs Task Management</p>
      </div>

      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-50 p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyTasks.map((task) => (
              <tr key={task.id} className="block md:table-row hover:bg-gray-50">
                <td className="block md:table-cell py-2 px-4 font-medium text-gray-700">
                  <span className="md:hidden font-semibold">Task: </span>
                  {task.title}
                </td>
                <td className="block md:table-cell py-2 px-4 text-gray-600">
                  <span className="md:hidden font-semibold">Assigned To: </span>
                  {task.assignedTo}
                </td>
                <td className="block md:table-cell py-2 px-4 text-gray-600">
                  <span className="md:hidden font-semibold">Due Date: </span>
                  {task.dueDate}
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
      </div>
    </div>
  );
}
