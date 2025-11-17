'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentPlusIcon,
  CheckIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  HomeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';

// Move static options outside component to prevent re-renders
const serviceCategoryOptions = [
  'Property Sales',
  'Property Management',
  'Real Estate Consulting',
  'Investment Advisory',
  'Valuation Services',
  'Leasing Services',
  'Property Development',
  'Market Research',
  'Portfolio Management',
  'Asset Management',
  'Facility Management',
  'Brokerage Services',
  'Legal & Compliance',
  'Tax Advisory',
  'Mortgage Services'
];

const pricingModelOptions = [
  'Commission Based',
  'Fixed Fee',
  'Hourly Rate',
  'Percentage of Transaction',
  'Retainer',
  'Performance Based',
  'Hybrid Model'
];

const experienceLevelOptions = [
  'Entry Level',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

// Extract form component to its own file-level component
const ServiceForm = React.memo(({
  formData,
  onChange,
  onSave,
  onCancel,
  serviceCall,
  isEditing = false
}) => {
  console.log('ServiceForm rendering'); // Debug log

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-green-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DocumentPlusIcon className="w-5 h-5" />
        {isEditing ? `Edit Service - ${formData.name}` : 'Add New Real Estate Service'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            disabled={serviceCall}
            placeholder="e.g., Property Valuation, Commercial Leasing"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            disabled={serviceCall}
            placeholder="Detailed description of the service, benefits, and value proposition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select category</option>
            {serviceCategoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model *</label>
          <select
            name="pricingModel"
            value={formData.pricingModel}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select pricing model</option>
            {pricingModelOptions.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price</label>
          <input
            type="text"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="e.g., $500, 2% commission"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
          >
            <option value="">Select experience level</option>
            {experienceLevelOptions.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
          <input
            type="text"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="e.g., 2-4 weeks, 48 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
          <input
            type="text"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="e.g., Mumbai, National, International"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
          <textarea
            name="keyFeatures"
            value={formData.keyFeatures}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="List key features and benefits of your service (one per line)"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Clients</label>
          <textarea
            name="targetClients"
            value={formData.targetClients}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="Describe your ideal clients or target market"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Success Metrics</label>
          <textarea
            name="successMetrics"
            value={formData.successMetrics}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="Key performance indicators or success measurements"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tools & Technologies</label>
          <input
            type="text"
            name="toolsTechnologies"
            value={formData.toolsTechnologies}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={serviceCall}
            placeholder="CRM software, valuation tools, marketing platforms (comma separated)"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={serviceCall}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
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

ServiceForm.displayName = 'ServiceForm';

// Extract service item component
const ServiceItem = React.memo(({
  service,
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
  console.log('ServiceItem rendering:', index); // Debug log

  return (
    <li className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {isEditing ? (
        <ServiceForm
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
            <h4 className="font-semibold text-lg text-gray-900">{service.name}</h4>
            <p className="text-sm text-gray-700 mt-1">{service.description}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              {service.category && (
                <p className="flex items-center gap-1">
                  <BuildingStorefrontIcon className="w-4 h-4" />
                  <span className="font-medium">Category:</span> {service.category}
                </p>
              )}
              {service.pricingModel && (
                <p className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span className="font-medium">Pricing:</span> {service.pricingModel}
                </p>
              )}
              {service.startingPrice && (
                <p>
                  <span className="font-medium">Starting Price:</span> {service.startingPrice}
                </p>
              )}
              {service.experienceLevel && (
                <p>
                  <span className="font-medium">Experience:</span> {service.experienceLevel}
                </p>
              )}
              {service.deliveryTime && (
                <p className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-medium">Delivery Time:</span> {service.deliveryTime}
                </p>
              )}
              {service.serviceArea && (
                <p className="md:col-span-2">
                  <span className="font-medium">Service Area:</span> {service.serviceArea}
                </p>
              )}
            </div>

            {service.keyFeatures && (
              <div className="mt-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Key Features:</span>
                  <div className="mt-1 text-gray-500">
                    {service.keyFeatures.split('\n').map((feature, idx) => (
                      feature.trim() && <div key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {service.targetClients && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Target Clients:</span> {service.targetClients}
              </p>
            )}

            {service.successMetrics && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Success Metrics:</span> {service.successMetrics}
              </p>
            )}

            {service.toolsTechnologies && (
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-medium">Tools & Technologies:</span> {service.toolsTechnologies}
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Edit Service"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Delete Service"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
});

ServiceItem.displayName = 'ServiceItem';

export default function Services({ profile, setRootContext, mutated }) {
  const [services, setServices] = useState(profile.services || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceCall, setServiceCall] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricingModel: '',
    startingPrice: '',
    experienceLevel: '',
    deliveryTime: '',
    serviceArea: '',
    keyFeatures: '',
    targetClients: '',
    successMetrics: '',
    toolsTechnologies: ''
  });

  // API call to update user services
  const updateUserServices = async (updatedServices) => {
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
      if (profile.projects) formData.append("projects", JSON.stringify(profile.projects));
      if (profile.marketing) formData.append("marketing", JSON.stringify(profile.marketing));

      // Append updated services
      formData.append("services", JSON.stringify(updatedServices));

      const res = await fetch('/api/users', {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      setServiceCall(false);

      if (res.ok) {
        setServices(updatedServices);
        mutated(); // Refresh the data

        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Services updated successfully"
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
            message: data.error || "Failed to update services"
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
          message: "Something went wrong while updating services"
        }
      }));
      return false;
    }
  };

  const handleEdit = useCallback((index) => {
    const service = services[index];
    setEditingIndex(index);
    setFormData({
      ...service,
      // Ensure all fields are included
      category: service.category || '',
      pricingModel: service.pricingModel || '',
      startingPrice: service.startingPrice || '',
      experienceLevel: service.experienceLevel || '',
      deliveryTime: service.deliveryTime || '',
      serviceArea: service.serviceArea || '',
      keyFeatures: service.keyFeatures || '',
      targetClients: service.targetClients || '',
      successMetrics: service.successMetrics || '',
      toolsTechnologies: service.toolsTechnologies || ''
    });
    setIsAdding(false);
  }, [services]);

  const handleAdd = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      category: '',
      pricingModel: '',
      startingPrice: '',
      experienceLevel: '',
      deliveryTime: '',
      serviceArea: '',
      keyFeatures: '',
      targetClients: '',
      successMetrics: '',
      toolsTechnologies: ''
    });
    setIsAdding(true);
    setEditingIndex(null);
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim() || !formData.category || !formData.pricingModel) {
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Validation Error",
          message: "Service Name, Description, Category, and Pricing Model are required fields"
        }
      }));
      return;
    }

    let updatedServices;

    if (isAdding) {
      updatedServices = [...services, formData];
    } else if (editingIndex !== null) {
      updatedServices = [...services];
      updatedServices[editingIndex] = formData;
    } else {
      return;
    }

    const success = await updateUserServices(updatedServices);

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
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    const updatedServices = services.filter((_, i) => i !== index);
    await updateUserServices(updatedServices);
  }, [services]);

  // Stable handleChange function
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoize the services list to prevent unnecessary re-renders
  const servicesList = useMemo(() => {
    return services.map((service, idx) => (
      <ServiceItem
        key={idx}
        service={service}
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
  }, [services, editingIndex, formData, serviceCall, handleEdit, handleDelete, handleChange, handleCancel]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br mt-5 from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-green-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-green-800 border-b pb-3 border-green-300">My Real Estate Services</h2>
        </div>
        {/* Services List */}
        {services.length > 0 ? (
          <ul className="space-y-4">
            {servicesList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <BuildingStorefrontIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No real estate services available.</p>
          </div>
        )}
      </div>
    </div>
  );
}