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

// Extract marketing item component
const MarketingItem = React.memo(({
  campaign,
  index,
  onEdit,
  onDelete,
  serviceCall,
}) => {
  console.log('MarketingItem rendering:', index); // Debug log

  return (
    <li className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
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
        </div>
        {/* Marketing List */}
        {marketingData.length > 0 ? (
          <ul className="space-y-6">
            {marketingList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No marketing campaigns available.</p>
          </div>
        )}
      </div>
    </div>
  );
}