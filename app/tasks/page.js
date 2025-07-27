'use client'
import React, { useState, useEffect } from 'react';
import {
  Plus, Bookmark, User, ChevronDown, Filter, LayoutGrid, List, Settings, HelpCircle, Search, Clock, Calendar, CheckCircle, XCircle,
  ArrowUp, ArrowDown, Paperclip, MessageSquare, Edit, Trash2
} from 'lucide-react'; // Using lucide-react for icons
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // For Kanban board drag-and-drop

// --- Dummy Data ---
const initialTasks = [
  {
    id: 1,
    title: 'Marketing strategy',
    priority: 'High',
    status: 'In progress',
    progress: 70, // Percentage
    dueDate: '2025-07-28', // Use full date for better sorting/comparison
    remaining: '00:30',
    overdue: false,
    assignedTo: ['P', 'B'], // Initials
    attachments: true,
    comments: false,
    bookmarked: false,
  },
  {
    id: 2,
    title: 'New contract template',
    priority: 'High',
    status: 'Needs review',
    progress: 90,
    dueDate: '2025-07-28',
    remaining: '00:00',
    overdue: false,
    assignedTo: ['P'],
    attachments: false,
    comments: true,
    bookmarked: true,
  },
  {
    id: 3,
    title: 'New estimation for Fineline Inc. project',
    priority: 'High',
    status: 'Needs attention',
    progress: 40,
    dueDate: '2024-12-19', // Past date for overdue
    remaining: '-03:00',
    overdue: true,
    assignedTo: ['B', 'M'],
    attachments: true,
    comments: true,
    bookmarked: false,
  },
  {
    id: 4,
    title: 'Quarter budget analysis',
    priority: 'High',
    status: 'Needs input',
    progress: 20,
    dueDate: '2025-01-11',
    remaining: '00:00',
    overdue: false,
    assignedTo: ['W', 'J'],
    attachments: false,
    comments: false,
    bookmarked: false,
  },
  {
    id: 5,
    title: 'Launch marketing campaign',
    priority: 'High',
    status: 'In progress',
    progress: 60,
    dueDate: '2025-01-11',
    remaining: '00:00',
    overdue: false,
    assignedTo: ['W', 'J'],
    attachments: false,
    comments: false,
    bookmarked: true,
  },
  {
    id: 6,
    title: 'Planning and data collection',
    priority: 'High',
    status: 'Planned',
    progress: 10,
    dueDate: '2025-01-11',
    remaining: '00:00',
    overdue: false,
    assignedTo: [],
    attachments: false,
    comments: false,
    bookmarked: false,
  },
  {
    id: 7,
    title: 'Contract and other documentation',
    priority: 'Medium',
    status: 'Needs input',
    progress: 30,
    dueDate: '2025-07-30',
    remaining: '00:26',
    overdue: false,
    assignedTo: ['P', 'B'],
    attachments: true,
    comments: false,
    bookmarked: false,
  },
  {
    id: 8,
    title: 'Sales pitch script & roleplay',
    priority: 'Medium',
    status: 'Needs attention',
    progress: 50,
    dueDate: '2024-12-22', // Past date for overdue
    remaining: '03:35',
    overdue: true,
    assignedTo: ['P', 'M'],
    attachments: false,
    comments: true,
    bookmarked: false,
  },
  {
    id: 9,
    title: 'Find a place for client meetings',
    priority: 'Medium',
    status: 'In progress',
    progress: 80,
    dueDate: '2025-12-29',
    remaining: '00:15',
    overdue: false,
    assignedTo: ['W', 'J'],
    attachments: true,
    comments: false,
    bookmarked: true,
  },
];

// --- Helper Functions ---
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

// --- Sub-Components ---

// Add/Edit Task Modal Component
const AddEditTaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Medium');
  const [status, setStatus] = useState(task ? task.status : 'Planned');
  const [dueDate, setDueDate] = useState(task ? task.dueDate : '');
  const [assignedTo, setAssignedTo] = useState(task ? task.assignedTo.join(', ') : '');

  // Reset form when modal opens for a new task
  useEffect(() => {
    if (isOpen && !task) {
      setTitle('');
      setPriority('Medium');
      setStatus('Planned');
      setDueDate('');
      setAssignedTo('');
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: task ? task.id : `t${Date.now()}`,
      title,
      priority,
      status,
      dueDate,
      assignedTo: assignedTo.split(',').map(s => s.trim()).filter(Boolean),
      progress: task ? task.progress : 0, // Default progress for new tasks
      remaining: task ? task.remaining : '00:00', // Placeholder
      overdue: task ? task.overdue : false, // Placeholder, would be calculated
      attachments: task ? task.attachments : false,
      comments: task ? task.comments : false,
      bookmarked: task ? task.bookmarked : false,
    };
    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="None">None</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {['Planned', 'In progress', 'Needs review', 'Needs attention', 'Needs input', 'Done'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (initials, comma-separated)</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., P, B, M"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// TaskItem Component
const TaskItem = ({ task, onToggleBookmark, onEditTask, onDeleteTask, onMarkAsDone }) => {
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

  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 group relative">
      {/* Checkbox */}
      <div className="w-10 flex justify-center">
        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
      </div>

      {/* Priority Icon / Bookmark */}
      <div className="w-10 flex justify-center relative">
        {/* Default priority icon (hidden if bookmarked or on hover) */}
        {!task.bookmarked && (
          <span className={`transition-opacity duration-200 ${task.bookmarked || 'group-hover:opacity-0'}`}>
            {task.priority === 'High' && <span className="text-red-500 text-lg">!</span>}
            {task.priority === 'Medium' && <span className="text-orange-500 text-lg">!</span>}
            {task.priority === 'Low' && <span className="text-blue-500 text-lg">!</span>}
          </span>
        )}
        {/* Bookmark icon always visible if bookmarked, otherwise on hover */}
        <Bookmark
          className={`h-4 w-4 absolute cursor-pointer transition-opacity duration-200
            ${task.bookmarked ? 'text-yellow-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}
          onClick={() => onToggleBookmark(task.id)}
          fill={task.bookmarked ? 'currentColor' : 'none'}
        />
      </div>

      {/* Task Title */}
      <div className="flex-1 px-2 text-sm text-gray-800 font-medium cursor-pointer hover:underline" onClick={() => onEditTask(task)}>
        {task.title}
      </div>

      {/* Status */}
      <div className="w-32 px-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-32 px-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${getProgressColor(task.progress)}`} style={{ width: `${task.progress}%` }}></div>
        </div>
      </div>

      {/* Due Date */}
      <div className="w-28 px-2 text-sm text-gray-600">
        {task.dueDate}
      </div>

      {/* Remaining Time */}
      <div className={`w-24 px-2 text-sm ${task.overdue ? 'text-red-500' : 'text-gray-600'}`}>
        {task.remaining}
      </div>

      {/* Assigned To */}
      <div className="w-24 flex -space-x-1 overflow-hidden px-2">
        {task.assignedTo.map((initial, idx) => (
          <span key={idx} className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-semibold ring-2 ring-white">
            {initial}
          </span>
        ))}
      </div>

      {/* Attachments & Comments Icons */}
      <div className="w-20 flex items-center justify-end space-x-2 pr-4">
        {task.attachments && <Paperclip className="h-4 w-4 text-gray-400" />}
        {task.comments && <MessageSquare className="h-4 w-4 text-gray-400" />}
      </div>

      {/* Action Icons (More, Done, Edit, Delete) - visible on hover */}
      <div className="absolute right-0 top-0 bottom-0 flex justify-end items-center space-x-2 pr-4 pl-8 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        <Clock className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-600 cursor-pointer" onClick={() => onMarkAsDone(task.id)} />
        <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer" onClick={() => onEditTask(task)} />
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600 cursor-pointer" onClick={() => onDeleteTask(task.id)} />
      </div>
    </div>
  );
};

// Kanban Board Component


const KanbanBoard = ({ tasks, setTasks }) => {
  const statuses = ['Not picked', 'In progress', 'Needs review', 'Needs attention', 'Needs input', 'Planned', 'Done'];

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

    const task = tasks.find(t => t.id.toString() === draggableId);
    if (!task) return;

    const newTasks = tasks.map(t =>
      t.id === task.id ? { ...t, status: destination.droppableId } : t
    );

    setTasks(newTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-50 rounded-lg shadow-inner min-h-[500px]">
        {statuses.map(status => {
          const statusTasks = getTasksByStatus(status);
          return (
            <Droppable droppableId={status} key={status}>
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


// Placeholder Views for other tabs
const TimesheetView = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 h-64 flex items-center justify-center">
    <p>Timesheet view content will go here.</p>
  </div>
);

const RecurringTasksView = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 h-64 flex items-center justify-center">
    <p>Recurring Tasks view content will go here.</p>
  </div>
);

const TaskBundlesView = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 h-64 flex items-center justify-center">
    <p>Task Bundles view content will go here.</p>
  </div>
);


// --- Main TasksDashboard Component ---
const TasksDashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
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
    if (taskToEdit) {
      setTasks(tasks.map(task => (task.id === newTask.id ? newTask : task)));
    } else {
      setTasks([...tasks, newTask]);
    }
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    // Using a custom modal/dialog instead of window.confirm for better UI/UX
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleMarkAsDone = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'Done', progress: 100, remaining: '00:00' } : task
    ));
  };

  const handleToggleBookmark = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, bookmarked: !task.bookmarked } : task
    ));
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
          <>
            {/* Task List Header Row */}
            <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 py-3 px-4 flex items-center text-xs font-semibold text-gray-600 uppercase">
              <div className="w-10 flex justify-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
              </div>
              <div className="w-10 flex justify-center"></div> {/* For Priority Icon */}
              <div className="flex-1 px-2">Task</div>
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
                          onToggleBookmark={handleToggleBookmark}
                          onEditTask={handleEditTask}
                          onDeleteTask={handleDeleteTask}
                          onMarkAsDone={handleMarkAsDone}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'Task board' && (
          <KanbanBoard tasks={filteredTasks} setTasks={setTasks} />
        )}

        {activeTab === 'Timesheet' && <TimesheetView />}
        {activeTab === 'Recurring tasks' && <RecurringTasksView />}
        {activeTab === 'Task bundles' && <TaskBundlesView />}

      </div>

      {/* Add/Edit Task Modal */}
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
