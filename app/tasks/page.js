'use client'
import React, { useContext, useState } from 'react';
import {
  Plus, Bookmark, User, ChevronDown, Filter, LayoutGrid, List, Settings, HelpCircle, Search, Clock, Calendar, CheckCircle, XCircle,
  ArrowUp, ArrowDown, Paperclip, MessageSquare, Edit, Trash2
} from 'lucide-react'; // Using lucide-react for icons
import AddEditTaskModal from '@/components/task/addnewtask';
import KanbanBoard from '@/components/task/kanbanboard';
import TimesheetView from '@/components/task/timesheet';
import RecurringTasksView from '@/components/task/recurringtask';
import TaskBundlesView from '@/components/task/taskbundles';
import TaskListView from '@/components/task/tasklist';
import RootContext from '@/components/config/rootcontext';

const groupTasks = (tasks, groupBy) => {
  const grouped = {};
  if (groupBy === 'Priorities') {
    const priorityOrder = ['High', 'Medium', 'Low', 'None'];
    priorityOrder.forEach(p => grouped[p] = []);
    tasks.forEach(task => {
      grouped[task.priority] ? grouped[task.priority].push(task) : grouped['None'].push(task);
    });
  } else if (groupBy === 'Due date') {
    tasks.forEach(task => {
      const dueDate = task.dueDate || 'No Due Date';
      if (!grouped[dueDate]) {
        grouped[dueDate] = [];
      }
      grouped[dueDate].push(task);
    });
    // Sort due date groups chronologically (simple string sort for demo)
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'No Due Date') return 1;
      if (b === 'No Due Date') return -1;
      return new Date(a) - new Date(b);
    });
    const sortedGrouped = {};
    sortedKeys.forEach(key => sortedGrouped[key] = grouped[key]);
    return sortedGrouped;
  }
  return grouped;
};

const sortTasks = (tasks, sortBy) => {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'Due date') {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31'); // Push "No Due Date" to end
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      return dateA - dateB;
    } else if (sortBy === 'Title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};

const TasksDashboard = () => {
  const { rootContext, setRootContext } = useContext(RootContext);
  const tasks = rootContext.tasks;
  const [activeTab, setActiveTab] = useState('Task list');
  const [groupedBy, setGroupedBy] = useState('Priorities');
  const [sortedBy, setSortedBy] = useState('Due date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const currentUserInitials = 'P'; // Dummy current user

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // --- Filtering and Sorting Logic ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookmark = !showBookmarked || task.bookmarked;
    const matchesMyTasks = !showMyTasks || task.assignedTo.includes(currentUserInitials);
    return matchesSearch && matchesBookmark && matchesMyTasks;
  });

  const sortedAndFilteredTasks = sortTasks(filteredTasks, sortedBy);
  const groupedTasks = groupTasks(sortedAndFilteredTasks, groupedBy);

  // --- Handlers for Task Actions ---
  const handleSaveTask = (newTask) => {
    setRootContext((prev) => {
      const updatedTasks = taskToEdit
        ? prev.tasks.map((item) => (item.id === id ? v : item)) // update existing
        : [...prev.tasks, newTask]; // add new

      return {
        ...prev,
        tasks: updatedTasks,
      };
    });
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setRootContext((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== taskId),
      }));
    }
  };


  const handleMarkAsDone = (taskId) => {
    setRootContext((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Done', progress: 100, remaining: '00:00' }
          : task
      ),
    }));
  };


  const handleToggleBookmark = (taskId) => {
    setRootContext((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? { ...task, bookmarked: !task.bookmarked }
          : task
      ),
    }));
  };

  // Summary statistics (now based on filtered/sorted tasks)
  const currentTotalTasks = filteredTasks.length;
  const currentOverdueTasks = filteredTasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'Done').length;
  // For timeSpent, duration, to-do, remaining, you'd need to parse and sum actual time values
  const timeSpent = '75h 30min'; // Placeholder
  const duration = '87h 23min'; // Placeholder
  const toDo = '00 min'; // Placeholder
  const remaining = '25h 36min'; // Placeholder


  return (
    <>
      <div className="min-h-screen bg-gray-100 font-sans">

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto ">
          {/* Navigation Tabs */}
          <nav className="flex space-x-4 mb-6">
            {['Task list', 'Task board', 'Timesheet', 'Recurring tasks', 'Task bundles'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${activeTab === tab ? 'bg-yellow-200 text-black shadow' : 'text-gray-700 hover:bg-yellow-200'}`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                  className="flex items-center px-4 py-2 bg-lime-400 text-white text-sm font-medium rounded-md hover:bg-lime-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" /> New
                </button>
                <button
                  onClick={() => setShowBookmarked(!showBookmarked)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${showBookmarked ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${showBookmarked ? 'text-yellow-500' : 'text-gray-500'}`} fill={showBookmarked ? 'currentColor' : 'none'} /> Bookmarks
                </button>
                <button
                  onClick={() => setShowMyTasks(!showMyTasks)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${showMyTasks ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <User className={`h-4 w-4 mr-2 ${showMyTasks ? 'text-blue-500' : 'text-gray-500'}`} /> My tasks
                </button>
                <div className="relative">
                  <select
                    value={groupedBy}
                    onChange={(e) => setGroupedBy(e.target.value)}
                    className="appearance-none bg-gray-100 text-gray-700 text-sm font-medium py-2 pl-3 pr-8 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Priorities">Grouped by: Priorities</option>
                    <option value="Due date">Grouped by: Due date</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortedBy}
                    onChange={(e) => setSortedBy(e.target.value)}
                    className="appearance-none bg-gray-100 text-gray-700 text-sm font-medium py-2 pl-3 pr-8 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Due date">Sorted by: Due date</option>
                    <option value="Title">Sorted by: Title</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <button className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </button>
                <button className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200">
                  <List className="h-4 w-4 mr-2" /> View
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 grid grid-cols-6 text-center divide-x divide-gray-200">
            <div className="px-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-800">{currentTotalTasks}</p>
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-500">Time spent</p>
              <p className="text-xl font-semibold text-gray-800">{timeSpent}</p>
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-xl font-semibold text-gray-800">{duration}</p>
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-500">To do</p>
              <p className="text-xl font-semibold text-gray-800">{toDo}</p>
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-xl font-semibold text-gray-800">{remaining}</p>
            </div>
            <div className="px-4">
              <p className="text-sm text-red-500">Overdue</p>
              <p className="text-xl font-semibold text-red-600">{currentOverdueTasks}</p>
            </div>
          </div>

          {/* Conditional View Rendering */}
          {activeTab === 'Task list' && (
            <TaskListView
              groupedTasks={groupedTasks}
              onToggleBookmark={handleToggleBookmark}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMarkAsDone={handleMarkAsDone}
            />
          )}

          {activeTab === 'Task board' && (
            <KanbanBoard tasks={filteredTasks} />
          )}

          {activeTab === 'Timesheet' && <TimesheetView />}
          {activeTab === 'Recurring tasks' && <RecurringTasksView />}
          {activeTab === 'Task bundles' && <TaskBundlesView />}

        </div>
      </div>
      <AddEditTaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleSaveTask}
        task={taskToEdit}
      />
    </>
  );
};

export default TasksDashboard;
