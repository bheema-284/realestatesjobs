'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentPlusIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';

// Move static options outside component to prevent re-renders
const statusOptions = [
  'Applied',
  'Under Review',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Received',
  'Offer Accepted',
  'Rejected',
  'Withdrawn'
];

const propertyTypeOptions = [
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed-Use',
  'Hospitality',
  'Retail',
  'Office Space',
  'Land Development'
];

const experienceOptions = [
  'Entry Level',
  '1-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const licenseOptions = [
  'Not Required',
  'Real Estate License',
  'Broker License',
  'Appraisal License',
  'Property Management License'
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Offer Received':
    case 'Offer Accepted':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Rejected':
    case 'Withdrawn':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Interview Scheduled':
    case 'Interview Completed':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Extract form component to its own file-level component
const ApplicationForm = React.memo(({
  formData,
  onChange,
  onSave,
  onCancel,
  serviceCall,
  isEditing = false
}) => {
  console.log('ApplicationForm rendering'); // Debug log

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DocumentPlusIcon className="w-5 h-5" />
        {isEditing ? `Edit Application - ${formData.jobTitle}` : 'Add New Real Estate Application'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={serviceCall}
            placeholder="e.g., Real Estate Agent, Property Manager"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={serviceCall}
            placeholder="Real estate company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type Focus</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          >
            <option value="">Select property type</option>
            {propertyTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
          <select
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          >
            <option value="">Select experience level</option>
            {experienceOptions.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Required</label>
          <select
            name="licenseRequired"
            value={formData.licenseRequired}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          >
            <option value="">Select license type</option>
            {licenseOptions.map(license => (
              <option key={license} value={license}>{license}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commission Structure</label>
          <input
            type="text"
            name="commissionStructure"
            value={formData.commissionStructure}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
            placeholder="e.g., 60/40 split, Base + Commission"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Compensation</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={onChange}
            placeholder="e.g., $50,000 - $70,000 + Commission"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
            placeholder="Hiring manager name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={serviceCall}
            placeholder="contact@company.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the real estate job role and responsibilities..."
            disabled={serviceCall}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional notes about the application process..."
            disabled={serviceCall}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={serviceCall}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
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

ApplicationForm.displayName = 'ApplicationForm';

// Extract application item component
const ApplicationItem = React.memo(({
  application,
  index,
  onEdit,
  onWithdraw,
  serviceCall,
  isEditing,
  formData,
  onChange,
  onSave,
  onCancel
}) => {
  console.log('ApplicationItem rendering:', index); // Debug log

  return (
    <li className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {isEditing ? (
        <ApplicationForm
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
            <h4 className="font-semibold text-lg text-gray-900">{application.jobTitle}</h4>
            <p className="text-sm text-gray-700 mt-1">{application.company}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {application.propertyType && (
                <p className="flex items-center gap-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span className="font-medium">Property Type:</span> {application.propertyType}
                </p>
              )}
              {application.location && (
                <p className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="font-medium">Location:</span> {application.location}
                </p>
              )}
              {application.experienceRequired && (
                <p>
                  <span className="font-medium">Experience:</span> {application.experienceRequired}
                </p>
              )}
              {application.licenseRequired && application.licenseRequired !== 'Not Required' && (
                <p>
                  <span className="font-medium">License:</span> {application.licenseRequired}
                </p>
              )}
              {application.salary && (
                <p className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span className="font-medium">Compensation:</span> {application.salary}
                </p>
              )}
              {application.appliedDate && (
                <p className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-medium">Applied:</span> {application.appliedDate}
                </p>
              )}
              {application.status && (
                <div className="md:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              )}
            </div>

            {application.commissionStructure && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Commission:</span> {application.commissionStructure}
              </p>
            )}

            {application.contactPerson && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Contact:</span> {application.contactPerson}
                {application.contactEmail && ` (${application.contactEmail})`}
              </p>
            )}

            {application.followUpDate && (
              <p className="text-xs text-yellow-600 mt-1">
                <span className="font-medium">Follow-up:</span> {application.followUpDate}
              </p>
            )}

            {application.notes && (
              <p className="text-sm text-gray-600 mt-2 border-t pt-2">{application.notes}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Edit Application"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onWithdraw(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Withdraw Application"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
});

ApplicationItem.displayName = 'ApplicationItem';

export default function Applications({ profile, setRootContext, mutated }) {
  const [applications, setApplications] = useState(profile.applications || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceCall, setServiceCall] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    jobDescription: '',
    location: '',
    salary: '',
    notes: '',
    propertyType: '',
    experienceRequired: '',
    licenseRequired: '',
    commissionStructure: '',
    contactPerson: '',
    contactEmail: '',
    followUpDate: ''
  });

  // API call to update user applications
  const updateUserApplications = async (updatedApplications) => {
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
      if (profile.projects) formData.append("projects", JSON.stringify(profile.projects));
      if (profile.services) formData.append("services", JSON.stringify(profile.services));
      if (profile.marketing) formData.append("marketing", JSON.stringify(profile.marketing));

      // Append updated applications
      formData.append("applications", JSON.stringify(updatedApplications));

      const res = await fetch('/api/users', {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      setServiceCall(false);

      if (res.ok) {
        setApplications(updatedApplications);
        mutated(); // Refresh the data

        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Applications updated successfully"
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
            message: data.error || "Failed to update applications"
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
          message: "Something went wrong while updating applications"
        }
      }));
      return false;
    }
  };

  const handleEdit = useCallback((index) => {
    const application = applications[index];
    setEditingIndex(index);
    setFormData({
      ...application,
      propertyType: application.propertyType || '',
      experienceRequired: application.experienceRequired || '',
      licenseRequired: application.licenseRequired || '',
      commissionStructure: application.commissionStructure || '',
      contactPerson: application.contactPerson || '',
      contactEmail: application.contactEmail || '',
      followUpDate: application.followUpDate || ''
    });
    setIsAdding(false);
  }, [applications]);

  const handleAdd = useCallback(() => {
    setFormData({
      jobTitle: '',
      company: '',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      jobDescription: '',
      location: '',
      salary: '',
      notes: '',
      propertyType: '',
      experienceRequired: '',
      licenseRequired: '',
      commissionStructure: '',
      contactPerson: '',
      contactEmail: '',
      followUpDate: ''
    });
    setIsAdding(true);
    setEditingIndex(null);
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.jobTitle.trim() || !formData.company.trim()) {
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Validation Error",
          message: "Job Title and Company are required fields"
        }
      }));
      return;
    }

    let updatedApplications;

    if (isAdding) {
      updatedApplications = [...applications, formData];
    } else if (editingIndex !== null) {
      updatedApplications = [...applications];
      updatedApplications[editingIndex] = formData;
    } else {
      return;
    }

    const success = await updateUserApplications(updatedApplications);

    if (success) {
      setIsAdding(false);
      setEditingIndex(null);
    }
  };

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setEditingIndex(null);
  }, []);

  const handleWithdraw = useCallback(async (index) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    const updatedApplications = applications.filter((_, i) => i !== index);
    await updateUserApplications(updatedApplications);
  }, [applications]);

  // Stable handleChange function
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoize the applications list to prevent unnecessary re-renders
  const applicationsList = useMemo(() => {
    return applications.map((application, idx) => (
      <ApplicationItem
        key={idx}
        application={application}
        index={idx}
        onEdit={handleEdit}
        onWithdraw={handleWithdraw}
        serviceCall={serviceCall}
        isEditing={editingIndex === idx}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    ));
  }, [applications, editingIndex, formData, serviceCall, handleEdit, handleWithdraw, handleChange, handleCancel]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 mt-5 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-blue-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-blue-800 border-b pb-3 border-blue-300">My Real Estate Job Applications</h2>
          {!isAdding && editingIndex === null && applications.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={serviceCall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              {serviceCall ? 'Loading...' : 'Add Application'}
            </button>
          )}
        </div>

        {/* Add Form at Top */}
        {isAdding && (
          <ApplicationForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
            serviceCall={serviceCall}
          />
        )}

        {/* Applications List */}
        {applications.length > 0 ? (
          <ul className="space-y-4">
            {applicationsList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <DocumentPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No job applications available.</p>
            {!isAdding && editingIndex === null && (
              <button
                onClick={handleAdd}
                disabled={serviceCall}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium mx-auto"
              >
                <PlusIcon className="w-5 h-5" />
                {serviceCall ? 'Loading...' : 'Add Your First Application'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}