'use client';
import React, { useContext, useState } from 'react';
import {
  Plus, Bookmark, User, Search
} from 'lucide-react';
import AddEditTaskModal from '@/components/task/addnewtask';
import KanbanBoard from '@/components/task/kanbanboard';
import TimesheetView from '@/components/task/timesheet';
import RecurringTasksView from '@/components/task/recurringtask';
import TaskBundlesView from '@/components/task/taskbundles';
import TaskListView from '@/components/task/tasklist';
import RootContext from '@/components/config/rootcontext';

const TasksDashboard = () => {
  const { rootContext, setRootContext } = useContext(RootContext);
  const tasks = rootContext.tasksColumns;
  const [activeTab, setActiveTab] = useState('Task list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const currentUserInitials = 'P';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const filteredTasks = tasks.map((column) => {
    const filteredColumnTasks = column.tasks.filter((task) => {
      const title = task?.title?.toLowerCase() || '';
      const assignedTo = Array.isArray(task.assignedTo) ? task.assignedTo : [];
      const isBookmarked = task.bookmarked ?? false;

      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesBookmark = !showBookmarked || isBookmarked;
      const matchesMyTasks = !showMyTasks || assignedTo.includes(currentUserInitials);

      return matchesSearch && matchesBookmark && matchesMyTasks;
    });

    return {
      ...column,
      tasks: filteredColumnTasks,
    };
  });

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatMinutes = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}min`;
  };

  const allFilteredTasks = filteredTasks.flatMap(col => col.tasks || []);
  const currentTotalTasks = allFilteredTasks.length;
  const totalTimeSpent = allFilteredTasks.reduce((sum, task) => sum + parseTime(task.timeSpent || '0:00'), 0);
  const totalDuration = allFilteredTasks.reduce((sum, task) => sum + parseTime(task.duration || '0:00'), 0);
  const totalRemaining = allFilteredTasks.reduce((sum, task) => {
    if (task.status === 'Done') return sum;
    const total = parseTime(task.duration || '0:00');
    const spent = parseTime(task.timeSpent || '0:00');
    return sum + Math.max(total - spent, 0);
  }, 0);
  const totalTodo = allFilteredTasks.filter(task => task.status !== 'Done').length;
  const currentOverdueTasks = allFilteredTasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'Done').length;

  const summary = [
    { name: "Total", value: currentTotalTasks },
    { name: "Time spent", value: formatMinutes(totalTimeSpent) },
    { name: "Duration", value: formatMinutes(totalDuration) },
    { name: "To Do", value: totalTodo },
    { name: "Remaining", value: formatMinutes(totalRemaining) },
    { name: "Overdue", value: currentOverdueTasks },
  ];

  const handleSaveTask = (updatedTask) => {
    setRootContext((prev) => {
      const updatedTasks = [...prev.tasksColumns];

      for (const column of updatedTasks) {
        column.tasks = column.tasks.filter((t) => t.id !== updatedTask.id);
      }

      const targetColumn = updatedTasks.find(c => c.title === updatedTask.status);
      if (targetColumn) {
        targetColumn.tasks.push(updatedTask);
      } else {
        updatedTasks.push({ title: updatedTask.status, tasks: [updatedTask] });
      }

      return {
        ...prev,
        tasksColumns: updatedTasks,
      };
    });
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setRootContext((prev) => {
        const updated = prev.tasksColumns.map(col => ({
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        }));
        return { ...prev, tasksColumns: updated };
      });
    }
  };

  const handleMarkAsDone = (taskId) => {
    setRootContext((prev) => {
      const updated = prev.tasksColumns.map(col => {
        const updatedTasks = col.tasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'Done', progress: 100, remaining: '00:00' }
            : task
        );
        return { ...col, tasks: updatedTasks };
      });
      return { ...prev, tasksColumns: updated };
    });
  };

  const handleToggleBookmark = (taskId) => {
    setRootContext((prev) => {
      const updated = prev.tasksColumns.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.id === taskId ? { ...task, bookmarked: !task.bookmarked } : task
        )
      }));
      return { ...prev, tasksColumns: updated };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="w-full flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          {['Task list', 'Task board', 'Timesheet', 'Recurring tasks', 'Task bundles'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tab ? 'bg-yellow-200 text-black shadow' : 'text-gray-700 hover:bg-yellow-100'}`}>
              {tab}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-3 items-center">
          <button onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-lime-400 text-white text-sm font-medium rounded-md hover:bg-lime-500 transition">
            <Plus className="h-4 w-4 mr-2" /> New
          </button>
          <button onClick={() => setShowBookmarked(!showBookmarked)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${showBookmarked ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Bookmark className={`h-4 w-4 mr-2 ${showBookmarked ? 'text-yellow-500' : 'text-gray-500'}`} fill={showBookmarked ? 'currentColor' : 'none'} />
            Bookmarks
          </button>
          <button onClick={() => setShowMyTasks(!showMyTasks)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${showMyTasks ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <User className={`h-4 w-4 mr-2 ${showMyTasks ? 'text-blue-500' : 'text-gray-500'}`} />
            My tasks
          </button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-2 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-center divide-x divide-gray-200">
          {summary.map((item, ind) => (
            <div key={ind} className="px-4">
              <p className="text-sm text-gray-500">{item.name}</p>
              <p className="text-xl font-semibold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {activeTab === 'Task list' && <TaskListView groupedTasks={filteredTasks} onToggleBookmark={handleToggleBookmark} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} onMarkAsDone={handleMarkAsDone} />}
        {activeTab === 'Task board' && <KanbanBoard tasks={filteredTasks} />}
        {activeTab === 'Timesheet' && <TimesheetView tasks={filteredTasks} />}
        {activeTab === 'Recurring tasks' && <RecurringTasksView tasks={filteredTasks} />}
        {activeTab === 'Task bundles' && <TaskBundlesView tasks={filteredTasks} />}
      </div>

      <AddEditTaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleSaveTask}
        task={taskToEdit}
      />
    </div>
  );
};

export default TasksDashboard;