'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentPlusIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';

// Move static options outside component to prevent re-renders
const campaignTypeOptions = [
  'Property Listing Promotion',
  'Brand Awareness',
  'Lead Generation',
  'Open House Promotion',
  'New Development Launch',
  'Rental Property Marketing',
  'Commercial Property Campaign',
  'Luxury Property Marketing',
  'Seasonal Promotion',
  'Referral Program',
  'Social Media Campaign',
  'Email Marketing',
  'Content Marketing',
  'PPC Advertising',
  'SEO Campaign'
];

const platformOptions = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter/X',
  'Google Ads',
  'Zillow',
  'Realtor.com',
  'Trulia',
  'Redfin',
  'YouTube',
  'TikTok',
  'Pinterest',
  'Email Marketing',
  'Direct Mail',
  'Print Media',
  'Outdoor Advertising'
];

const statusOptions = [
  'Planning',
  'Active',
  'Paused',
  'Completed',
  'Cancelled'
];

const targetAudienceOptions = [
  'First-time Home Buyers',
  'Luxury Property Buyers',
  'Real Estate Investors',
  'Commercial Tenants',
  'Rental Seekers',
  'Property Sellers',
  'Developers',
  'International Buyers',
  'Retirees',
  'Young Professionals',
  'Families'
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Planning':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Paused':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Completed':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'Cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Extract form component to its own file-level component
const MarketingForm = React.memo(({
  formData,
  onChange,
  onSave,
  onCancel,
  serviceCall,
  isEditing = false
}) => {
  console.log('MarketingForm rendering'); // Debug log

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-red-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DocumentPlusIcon className="w-5 h-5" />
        {isEditing ? `Edit Campaign - ${formData.campaignName}` : 'Add New Marketing Campaign'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name *
          </label>
          <input
            type="text"
            name="campaignName"
            value={formData.campaignName}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
            placeholder="e.g., Luxury Condo Launch, Spring Home Buying Campaign"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type *</label>
          <select
            name="campaignType"
            value={formData.campaignType}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select campaign type</option>
            {campaignTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
          >
            <option value="">Select platform</option>
            {platformOptions.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
          >
            <option value="">Select target audience</option>
            {targetAudienceOptions.map(audience => (
              <option key={audience} value={audience}>{audience}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
            placeholder="e.g., $5,000, ₹50,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impressions</label>
          <input
            type="text"
            name="impressions"
            value={formData.impressions}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="e.g., 100,000+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clicks</label>
          <input
            type="text"
            name="clicks"
            value={formData.clicks}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="e.g., 5,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Rate</label>
          <input
            type="text"
            name="conversionRate"
            value={formData.conversionRate}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="e.g., 3.5%"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Leads Generated</label>
          <input
            type="number"
            name="leadsGenerated"
            value={formData.leadsGenerated}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="Number of leads"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Lead</label>
          <input
            type="text"
            name="costPerLead"
            value={formData.costPerLead}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="e.g., $50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ROI</label>
          <input
            type="text"
            name="roi"
            value={formData.roi}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="e.g., 250%"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            disabled={serviceCall}
            placeholder="Detailed description of the campaign objectives, strategy, and target properties"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Performance Indicators</label>
          <textarea
            name="kpis"
            value={formData.kpis}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="Main KPIs and success metrics for this campaign"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Properties/Locations</label>
          <textarea
            name="targetProperties"
            value={formData.targetProperties}
            onChange={onChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={serviceCall}
            placeholder="Specific properties, locations, or property types targeted"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={serviceCall}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
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

MarketingForm.displayName = 'MarketingForm';

// Extract marketing item component
const MarketingItem = React.memo(({
  campaign,
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
  console.log('MarketingItem rendering:', index); // Debug log

  return (
    <li className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {isEditing ? (
        <MarketingForm
          formData={formData}
          onChange={onChange}
          onSave={onSave}
          onCancel={onCancel}
          serviceCall={serviceCall}
          isEditing={true}
        />
      ) : (
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-grow">
            <h4 className="font-bold text-xl text-gray-900 mb-1">{campaign.campaignName}</h4>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Platform:</span> {campaign.platform}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Type:</span> {campaign.campaignType}
            </p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              {campaign.targetAudience && (
                <p>
                  <span className="font-medium">Target:</span> {campaign.targetAudience}
                </p>
              )}
              <p className="flex items-center gap-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span className="font-medium">Budget:</span> {campaign.budget}
              </p>
              <p className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">Period:</span> {campaign.startDate} to {campaign.endDate}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {campaign.impressions && campaign.impressions !== 'N/A' && (
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-gray-700">
                    <EyeIcon className="w-4 h-4" />
                    <span className="font-medium">Impressions</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{campaign.impressions}</p>
                </div>
              )}
              {campaign.clicks && campaign.clicks !== 'N/A' && (
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-gray-700">
                    <CursorArrowRaysIcon className="w-4 h-4" />
                    <span className="font-medium">Clicks</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{campaign.clicks}</p>
                </div>
              )}
              {campaign.conversionRate && campaign.conversionRate !== 'N/A' && (
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-gray-700">
                    <ChartBarIcon className="w-4 h-4" />
                    <span className="font-medium">Conversion</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{campaign.conversionRate}</p>
                </div>
              )}
              {campaign.leadsGenerated && (
                <div className="text-center">
                  <p className="font-medium text-gray-700">Leads</p>
                  <p className="text-lg font-semibold text-gray-900">{campaign.leadsGenerated}</p>
                </div>
              )}
            </div>

            {campaign.costPerLead && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Cost Per Lead:</span> {campaign.costPerLead}
              </p>
            )}

            {campaign.roi && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">ROI:</span> {campaign.roi}
              </p>
            )}

            {campaign.targetProperties && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Target Properties:</span> {campaign.targetProperties}
              </p>
            )}

            {campaign.kpis && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">KPIs:</span> {campaign.kpis}
              </p>
            )}

            {campaign.description && (
              <p className="text-sm text-gray-800 mt-3 leading-relaxed border-t pt-3">
                {campaign.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex gap-2 md:flex-col">
            <button
              onClick={() => onEdit(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Edit Campaign"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(index)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Delete Campaign"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
});

MarketingItem.displayName = 'MarketingItem';

export default function MarketingPage({ profile, setRootContext, mutated }) {
  const [marketingData, setMarketingData] = useState(profile.marketing || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceCall, setServiceCall] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: '',
    platform: '',
    status: 'Planning',
    targetAudience: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    impressions: '',
    clicks: '',
    conversionRate: '',
    leadsGenerated: '',
    costPerLead: '',
    roi: '',
    description: '',
    kpis: '',
    targetProperties: ''
  });

  // API call to update user marketing data
  const updateUserMarketing = async (updatedMarketing) => {
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
      if (profile.services) formData.append("services", JSON.stringify(profile.services));

      // Append updated marketing data
      formData.append("marketing", JSON.stringify(updatedMarketing));

      const res = await fetch('/api/users', {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      setServiceCall(false);

      if (res.ok) {
        setMarketingData(updatedMarketing);
        mutated(); // Refresh the data

        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Marketing campaigns updated successfully"
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
            message: data.error || "Failed to update marketing campaigns"
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
          message: "Something went wrong while updating marketing campaigns"
        }
      }));
      return false;
    }
  };

  const handleEdit = useCallback((index) => {
    const campaign = marketingData[index];
    setEditingIndex(index);
    setFormData({
      ...campaign,
      // Ensure all fields are included
      campaignType: campaign.campaignType || '',
      targetAudience: campaign.targetAudience || '',
      leadsGenerated: campaign.leadsGenerated || '',
      costPerLead: campaign.costPerLead || '',
      roi: campaign.roi || '',
      kpis: campaign.kpis || '',
      targetProperties: campaign.targetProperties || ''
    });
    setIsAdding(false);
  }, [marketingData]);

  const handleAdd = useCallback(() => {
    setFormData({
      campaignName: '',
      campaignType: '',
      platform: '',
      status: 'Planning',
      targetAudience: '',
      budget: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      impressions: '',
      clicks: '',
      conversionRate: '',
      leadsGenerated: '',
      costPerLead: '',
      roi: '',
      description: '',
      kpis: '',
      targetProperties: ''
    });
    setIsAdding(true);
    setEditingIndex(null);
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.campaignName.trim() || !formData.campaignType || !formData.platform || !formData.budget.trim()) {
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Validation Error",
          message: "Campaign Name, Type, Platform, and Budget are required fields"
        }
      }));
      return;
    }

    let updatedMarketing;

    if (isAdding) {
      updatedMarketing = [...marketingData, { ...formData, id: Date.now() }];
    } else if (editingIndex !== null) {
      updatedMarketing = [...marketingData];
      updatedMarketing[editingIndex] = formData;
    } else {
      return;
    }

    const success = await updateUserMarketing(updatedMarketing);

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
    if (!window.confirm('Are you sure you want to delete this marketing campaign?')) {
      return;
    }

    const updatedMarketing = marketingData.filter((_, i) => i !== index);
    await updateUserMarketing(updatedMarketing);
  }, [marketingData]);

  // Stable handleChange function
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoize the marketing list to prevent unnecessary re-renders
  const marketingList = useMemo(() => {
    return marketingData.map((campaign, idx) => (
      <MarketingItem
        key={campaign.id || idx}
        campaign={campaign}
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
  }, [marketingData, editingIndex, formData, serviceCall, handleEdit, handleDelete, handleChange, handleCancel]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br mt-5 from-red-50 to-pink-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-red-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-red-800 border-b pb-3 border-red-300">My Real Estate Marketing Campaigns</h2>
          {!isAdding && editingIndex === null && marketingData.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={serviceCall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              {serviceCall ? 'Loading...' : 'Add Campaign'}
            </button>
          )}
        </div>

        {/* Add Form at Top */}
        {isAdding && (
          <MarketingForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
            serviceCall={serviceCall}
          />
        )}

        {/* Marketing List */}
        {marketingData.length > 0 ? (
          <ul className="space-y-6">
            {marketingList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No marketing campaigns available.</p>
            {!isAdding && editingIndex === null && (
              <button
                onClick={handleAdd}
                disabled={serviceCall}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium mx-auto"
              >
                <PlusIcon className="w-5 h-5" />
                {serviceCall ? 'Loading...' : 'Add Your First Campaign'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}