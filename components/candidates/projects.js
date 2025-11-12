'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentPlusIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';

// Move static options outside component to prevent re-renders
const statusOptions = [
  'Completed',
  'In Progress',
  'Under Construction',
  'Planning Phase',
  'On Hold',
  'Cancelled'
];

const propertyTypeOptions = [
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed-Use',
  'Hospitality',
  'Retail',
  'Office Space',
  'Warehouse',
  'Land Development',
  'Renovation',
  'Infrastructure',
  'Public Works'
];

const roleOptions = [
  'Real Estate Developer',
  'Project Manager',
  'Property Manager',
  'Real Estate Agent',
  'Broker',
  'Leasing Consultant',
  'Portfolio Manager',
  'Asset Manager',
  'Construction Manager',
  'Site Supervisor',
  'Real Estate Analyst',
  'Investment Analyst',
  'Valuation Specialist',
  'Market Researcher',
  'Facilities Manager',
  'Property Consultant',
  'Sales Manager',
  'Marketing Manager',
  'Business Development Manager',
  'Acquisition Specialist',
  'Disposition Manager'
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'In Progress':
    case 'Under Construction':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Planning Phase':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'On Hold':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Extract form component to its own file-level component
const ProjectForm = React.memo(({
  formData,
  onChange,
  onSave,
  onCancel,
  serviceCall,
  isEditing = false
}) => {
  console.log('ProjectForm rendering'); // Debug log

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-orange-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DocumentPlusIcon className="w-5 h-5" />
        {isEditing ? `Edit Project - ${formData.name}` : 'Add New Real Estate Project'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
            disabled={serviceCall}
            placeholder="Enter real estate project name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
            disabled={serviceCall}
            placeholder="Describe the real estate project, scope, and your contributions"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select property type</option>
            {propertyTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
            disabled={serviceCall}
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Size</label>
          <input
            type="text"
            name="projectSize"
            value={formData.projectSize}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="e.g., 50,000 sq ft, 100 units"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="e.g., $5M, ₹50 Crores"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="e.g., 18 months, Q2 2023 - Q4 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client/Developer</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="Client or development company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select your role</option>
            {roleOptions.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="Number of team members"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Technologies/Tools Used</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="CRM, Property Management Software, AutoCAD, MS Project (comma separated)"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities</label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="Describe your main responsibilities in this real estate project"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="Notable achievements, ROI, occupancy rates, sales figures"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Link/Portfolio</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            disabled={serviceCall}
            placeholder="https://example-project.com"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={serviceCall}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
        >
          <CheckIcon className="w-4 h-4" />
          {serviceCall ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          disabled={serviceCall}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
        >
          <XMarkIcon className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
});

ProjectForm.displayName = 'ProjectForm';

// Extract project item component
const ProjectItem = React.memo(({
  project,
  index,
  onEdit,
  onDelete,
  serviceCall,
  isEditing,
  formData,
  onChange,
  onSave,
  onCancel
}) => {
  console.log('ProjectItem rendering:', index); // Debug log

  return (
    <li className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {isEditing ? (
        <ProjectForm
          formData={formData}
          onChange={onChange}
          onSave={onSave}
          onCancel={onCancel}
          serviceCall={serviceCall}
          isEditing={true}
        />
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-gray-900">{project.name}</h4>
            <p className="text-sm text-gray-700 mt-1">{project.description}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              {project.propertyType && (
                <p className="flex items-center gap-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span className="font-medium">Property Type:</span> {project.propertyType}
                </p>
              )}
              {project.location && (
                <p className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="font-medium">Location:</span> {project.location}
                </p>
              )}
              {project.role && (
                <p className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span className="font-medium">Role:</span> {project.role}
                </p>
              )}
              {project.teamSize && (
                <p>
                  <span className="font-medium">Team Size:</span> {project.teamSize}
                </p>
              )}
              {project.projectSize && (
                <p>
                  <span className="font-medium">Project Size:</span> {project.projectSize}
                </p>
              )}
              {project.budget && (
                <p>
                  <span className="font-medium">Budget:</span> {project.budget}
                </p>
              )}
              {project.client && (
                <p className="md:col-span-2">
                  <span className="font-medium">Client:</span> {project.client}
                </p>
              )}
              {project.status && (
                <div className="md:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              )}
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Tools & Technologies:</span> {project.technologies.join(', ')}
                </p>
              </div>
            )}

            {project.timeline && (
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Timeline:</span> {project.timeline}
              </p>
            )}

            {project.responsibilities && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Responsibilities:</span> {project.responsibilities}
              </p>
            )}

            {project.achievements && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Achievements:</span> {project.achievements}
              </p>
            )}

            {project.link && (
              <p className="text-xs mt-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  View Project Details
                </a>
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Edit Project"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Delete Project"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
});

ProjectItem.displayName = 'ProjectItem';

export default function Projects({ profile, setRootContext, mutated }) {
  const [projects, setProjects] = useState(profile.projects || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceCall, setServiceCall] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    propertyType: '',
    location: '',
    projectSize: '',
    budget: '',
    timeline: '',
    client: '',
    status: 'Completed',
    teamSize: '',
    role: '',
    responsibilities: '',
    achievements: '',
    technologies: '',
    link: ''
  });

  // API call to update user projects
  const updateUserProjects = async (updatedProjects) => {
    setServiceCall(true);
    try {
      const formData = new FormData();
      formData.append("id", profile._id);
      formData.append("name", profile.name || "");
      formData.append("email", profile.email || "");
      formData.append("role", "applicant");

      // Append all profile data to maintain consistency
      if (profile.summary) formData.append("summary", profile.summary);
      if (profile.experience) formData.append("experience", JSON.stringify(profile.experience));
      if (profile.education) formData.append("education", JSON.stringify(profile.education));
      if (profile.applications) formData.append("applications", JSON.stringify(profile.applications));
      if (profile.services) formData.append("services", JSON.stringify(profile.services));
      if (profile.marketing) formData.append("marketing", JSON.stringify(profile.marketing));

      // Append updated projects
      formData.append("projects", JSON.stringify(updatedProjects));

      const res = await fetch('/api/users', {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      setServiceCall(false);

      if (res.ok) {
        setProjects(updatedProjects);
        mutated(); // Refresh the data

        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Projects updated successfully"
          }
        }));

        return true;
      } else {
        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "error",
            position: "Failed",
            message: data.error || "Failed to update projects"
          }
        }));
        return false;
      }
    } catch (err) {
      console.error("Update Error:", err);
      setServiceCall(false);
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Something went wrong while updating projects"
        }
      }));
      return false;
    }
  };

  const handleEdit = useCallback((index) => {
    const project = projects[index];
    setEditingIndex(index);
    setFormData({
      ...project,
      technologies: project.technologies ? project.technologies.join(', ') : ''
    });
    setIsAdding(false);
  }, [projects]);

  const handleAdd = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      propertyType: '',
      location: '',
      projectSize: '',
      budget: '',
      timeline: '',
      client: '',
      status: 'Completed',
      teamSize: '',
      role: '',
      responsibilities: '',
      achievements: '',
      technologies: '',
      link: ''
    });
    setIsAdding(true);
    setEditingIndex(null);
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim()) {
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Validation Error",
          message: "Project Name and Description are required fields"
        }
      }));
      return;
    }

    let updatedProjects;
    const projectData = {
      ...formData,
      technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech) : []
    };

    if (isAdding) {
      updatedProjects = [...projects, projectData];
    } else if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectData;
    } else {
      return;
    }

    const success = await updateUserProjects(updatedProjects);

    if (success) {
      setIsAdding(false);
      setEditingIndex(null);
    }
  };

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setEditingIndex(null);
  }, []);

  const handleDelete = useCallback(async (index) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    const updatedProjects = projects.filter((_, i) => i !== index);
    await updateUserProjects(updatedProjects);
  }, [projects]);

  // Stable handleChange function
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoize the projects list to prevent unnecessary re-renders
  const projectsList = useMemo(() => {
    return projects.map((project, idx) => (
      <ProjectItem
        key={idx}
        project={project}
        index={idx}
        onEdit={handleEdit}
        onDelete={handleDelete}
        serviceCall={serviceCall}
        isEditing={editingIndex === idx}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    ));
  }, [projects, editingIndex, formData, serviceCall, handleEdit, handleDelete, handleChange, handleCancel]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br mt-5 from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-yellow-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-orange-800 border-b pb-3 border-orange-300">My Real Estate Projects</h2>
          {!isAdding && editingIndex === null && projects.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={serviceCall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              {serviceCall ? 'Loading...' : 'Add Project'}
            </button>
          )}
        </div>

        {/* Add Form at Top */}
        {isAdding && (
          <ProjectForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
            serviceCall={serviceCall}
          />
        )}

        {/* Projects List */}
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projectsList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No real estate projects available.</p>
            {!isAdding && editingIndex === null && (
              <button
                onClick={handleAdd}
                disabled={serviceCall}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium mx-auto"
              >
                <PlusIcon className="w-5 h-5" />
                {serviceCall ? 'Loading...' : 'Add Your First Project'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}