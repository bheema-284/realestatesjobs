'use client';
import React, { useState, useCallback, useMemo, useContext } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';
import RootContext from '../config/rootcontext';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
    case 'COMPLETED':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'In Progress':
    case 'Under Construction':
    case 'ONGOING':
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

// Extract project item component
const ProjectItem = React.memo(({
  project,
  index,
  onDelete,
  serviceCall,
  canEdit // Add canEdit prop
}) => {
  // Normalize project data to handle both formats
  const normalizedProject = useMemo(() => {
    return {
      name: project.name || project.title || 'Untitled Project',
      description: project.description || '',
      propertyType: project.propertyType || '',
      location: project.location || '',
      projectSize: project.projectSize || '',
      budget: project.budget || '',
      timeline: project.timeline || '',
      client: project.client || '',
      status: project.status || 'Completed',
      teamSize: project.teamSize || '',
      role: project.role || '',
      responsibilities: project.responsibilities || '',
      achievements: project.achievements || '',
      technologies: project.technologies || [],
      link: project.link || '',
      images: project.images || [],
      id: project.id || null, // For the second format
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    };
  }, [project]);

  return (
    <li className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-gray-900">{normalizedProject.name}</h4>
          <p className="text-sm text-gray-700 mt-1">{normalizedProject.description}</p>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            {normalizedProject.propertyType && (
              <p className="flex items-center gap-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span className="font-medium">Property Type:</span> {normalizedProject.propertyType}
              </p>
            )}
            {normalizedProject.location && (
              <p className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-medium">Location:</span> {normalizedProject.location}
              </p>
            )}
            {normalizedProject.role && (
              <p className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" />
                <span className="font-medium">Role:</span> {normalizedProject.role}
              </p>
            )}
            {normalizedProject.teamSize && (
              <p>
                <span className="font-medium">Team Size:</span> {normalizedProject.teamSize}
              </p>
            )}
            {normalizedProject.projectSize && (
              <p>
                <span className="font-medium">Project Size:</span> {normalizedProject.projectSize}
              </p>
            )}
            {normalizedProject.budget && (
              <p>
                <span className="font-medium">Budget:</span> {normalizedProject.budget}
              </p>
            )}
            {normalizedProject.client && (
              <p className="md:col-span-2">
                <span className="font-medium">Client:</span> {normalizedProject.client}
              </p>
            )}
            {normalizedProject.status && (
              <div className="md:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(normalizedProject.status)}`}>
                  {normalizedProject.status}
                </span>
              </div>
            )}
          </div>

          {normalizedProject.technologies && normalizedProject.technologies.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Tools & Technologies:</span> {normalizedProject.technologies.join(', ')}
              </p>
            </div>
          )}

          {normalizedProject.timeline && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Timeline:</span> {normalizedProject.timeline}
            </p>
          )}

          {normalizedProject.responsibilities && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Responsibilities:</span> {normalizedProject.responsibilities}
            </p>
          )}

          {normalizedProject.achievements && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Achievements:</span> {normalizedProject.achievements}
            </p>
          )}

          {/* Display images if available */}
          {normalizedProject.images && normalizedProject.images.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Project Images:</p>
              <div className="flex gap-2 overflow-x-auto">
                {normalizedProject.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image.url}
                    alt={image.caption || `Project image ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {normalizedProject.link && (
            <p className="text-xs mt-2">
              <a
                href={normalizedProject.link}
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

        {/* Only show action buttons if canEdit is true */}
        {canEdit && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onDelete(normalizedProject.id, index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Delete Project"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
});

ProjectItem.displayName = 'ProjectItem';

export default function Projects({ profile, setRootContext, mutated }) {
  const [projects, setProjects] = useState(profile.projects || []);
  const [serviceCall, setServiceCall] = useState(false);
  const { rootContext } = useContext(RootContext);
  const canEdit = rootContext?.user?.role === "applicant"; // Determine if the user can edit
  // DELETE Service for projects
  const deleteProject = async (projectId, index) => {
    // Only allow deletion if user can edit
    if (!canEdit) return;

    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setServiceCall(true);
    try {
      // Use the DELETE endpoint for projects with IDs
      if (projectId) {
        const deleteRes = await fetch(`/api/applicants/projects?applicantId=${profile._id}&projectId=${projectId}`, {
          method: 'DELETE',
        });

        const result = await deleteRes.json();

        if (result.success) {
          // Remove from local state
          const updatedProjects = projects.filter((_, i) => i !== index);
          setProjects(updatedProjects);

          setRootContext(prevContext => ({
            ...prevContext,
            toast: {
              show: true,
              dismiss: true,
              type: "success",
              position: "Success",
              message: "Project deleted successfully"
            }
          }));
          mutated(); // Refresh the data
        } else {
          setRootContext(prevContext => ({
            ...prevContext,
            toast: {
              show: true,
              dismiss: true,
              type: "error",
              position: "Failed",
              message: result.error || "Failed to delete project"
            }
          }));
        }
      } else {
        // For projects without IDs, show error
        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "error",
            position: "Failed",
            message: "Cannot delete project: Project ID not found"
          }
        }));
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Something went wrong while deleting the project"
        }
      }));
    } finally {
      setServiceCall(false);
    }
  };

  // Handle edit function (you can implement this later)
  const handleEdit = useCallback((index) => {
    // Only allow edit if user can edit
    if (!canEdit) return;

    // Add your edit implementation here
    console.log('Edit project at index:', index);
  }, [canEdit]);

  // Memoize the projects list
  const projectsList = useMemo(() => {
    return projects.map((project, idx) => (
      <ProjectItem
        key={project.id || idx}
        project={project}
        index={idx}
        onDelete={deleteProject}
        serviceCall={serviceCall}
        canEdit={canEdit} // Pass canEdit to ProjectItem
      />
    ));
  }, [projects, serviceCall, deleteProject, canEdit]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br mt-5 from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-yellow-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-orange-800 border-b pb-3 border-orange-300">My Real Estate Projects</h2>
        </div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projectsList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No real estate projects available.</p>
          </div>
        )}
      </div>
    </div>
  );
}