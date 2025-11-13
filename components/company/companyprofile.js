'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import {
    PencilIcon,
    XMarkIcon,
    TrophyIcon,
    StarIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    LightBulbIcon,
    CheckBadgeIcon,
    PhoneIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    MapPinIcon,
    CalendarIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/solid';

// Memoized Edit Section Components - Defined outside to prevent re-renders
const EditLeadershipSection = React.memo(({ tempProfile, onArrayFieldChange, onAddArrayField, onRemoveArrayField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Leadership Team</h4>
                <button
                    onClick={() => onAddArrayField('leadership', {
                        name: '',
                        position: '',
                        bio: '',
                        image: '',
                        department: ''
                    })}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Member
                </button>
            </div>

            {tempProfile.leadership?.map((leader, index) => (
                <div key={leader.id || index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h5 className="font-medium">Team Member {index + 1}</h5>
                        <button
                            onClick={() => onRemoveArrayField('leadership', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={leader.name}
                                onChange={(e) => onArrayFieldChange('leadership', index, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <input
                                type="text"
                                value={leader.position}
                                onChange={(e) => onArrayFieldChange('leadership', index, 'position', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                value={leader.bio}
                                onChange={(e) => onArrayFieldChange('leadership', index, 'bio', e.target.value)}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                value={leader.department}
                                onChange={(e) => onArrayFieldChange('leadership', index, 'department', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

const EditWhyChooseUsSection = React.memo(({ tempProfile, onArrayFieldChange, onAddArrayField, onRemoveArrayField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Why Choose Us</h4>
                <button
                    onClick={() => onAddArrayField('whyChooseUs', {
                        title: '',
                        description: ''
                    })}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Reason
                </button>
            </div>

            {tempProfile.whyChooseUs?.map((reason, index) => (
                <div key={reason.id || index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h5 className="font-medium">Reason {index + 1}</h5>
                        <button
                            onClick={() => onRemoveArrayField('whyChooseUs', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={reason.title}
                                onChange={(e) => onArrayFieldChange('whyChooseUs', index, 'title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={reason.description}
                                onChange={(e) => onArrayFieldChange('whyChooseUs', index, 'description', e.target.value)}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

const EditServicesSection = React.memo(({ tempProfile, onArrayFieldChange, onAddArrayField, onRemoveArrayField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Services</h4>
                <button
                    onClick={() => onAddArrayField('services', 'New Service')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {tempProfile.services?.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={service}
                        onChange={(e) => onArrayFieldChange('services', index, '', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter service name"
                    />
                    <button
                        onClick={() => onRemoveArrayField('services', index)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}

            {(!tempProfile.services || tempProfile.services.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    No services added yet. Click "Add Service" to get started.
                </div>
            )}
        </div>
    );
});

const EditAchievementsSection = React.memo(({ tempProfile, onArrayFieldChange, onAddArrayField, onRemoveArrayField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Awards & Certifications</h4>
                <div className="flex gap-2">
                    <button
                        onClick={() => onAddArrayField('achievements', {
                            title: '',
                            year: new Date().getFullYear().toString(),
                            description: '',
                            issuer: ''
                        })}
                        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Award
                    </button>
                    <button
                        onClick={() => onAddArrayField('certifications', {
                            name: '',
                            issuer: '',
                            year: new Date().getFullYear().toString()
                        })}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Certification
                    </button>
                </div>
            </div>

            <div>
                <h5 className="font-semibold mb-4">Awards</h5>
                {tempProfile.achievements?.map((achievement, index) => (
                    <div key={achievement.id || index} className="border border-gray-200 rounded-lg p-4 space-y-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h6 className="font-medium">Award {index + 1}</h6>
                            <button
                                onClick={() => onRemoveArrayField('achievements', index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={achievement.title}
                                    onChange={(e) => onArrayFieldChange('achievements', index, 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="text"
                                    value={achievement.year}
                                    onChange={(e) => onArrayFieldChange('achievements', index, 'year', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={achievement.description}
                                    onChange={(e) => onArrayFieldChange('achievements', index, 'description', e.target.value)}
                                    rows="2"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                                <input
                                    type="text"
                                    value={achievement.issuer}
                                    onChange={(e) => onArrayFieldChange('achievements', index, 'issuer', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h5 className="font-semibold mb-4">Certifications</h5>
                {tempProfile.certifications?.map((certification, index) => (
                    <div key={certification.id || index} className="border border-gray-200 rounded-lg p-4 space-y-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h6 className="font-medium">Certification {index + 1}</h6>
                            <button
                                onClick={() => onRemoveArrayField('certifications', index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={certification.name}
                                    onChange={(e) => onArrayFieldChange('certifications', index, 'name', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="text"
                                    value={certification.year}
                                    onChange={(e) => onArrayFieldChange('certifications', index, 'year', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                                <input
                                    type="text"
                                    value={certification.issuer}
                                    onChange={(e) => onArrayFieldChange('certifications', index, 'issuer', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const EditValuesSection = React.memo(({ tempProfile, onArrayFieldChange, onAddArrayField, onRemoveArrayField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Company Values</h4>
                <button
                    onClick={() => onAddArrayField('values', 'New Value')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Value
                </button>
            </div>

            {tempProfile.values?.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onArrayFieldChange('values', index, '', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter company value"
                    />
                    <button
                        onClick={() => onRemoveArrayField('values', index)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}

            {(!tempProfile.values || tempProfile.values.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    No values added yet. Click "Add Value" to get started.
                </div>
            )}
        </div>
    );
});

const EditVisionSection = React.memo(({ tempProfile, onInputChange, onSave, onCancel, isSaving }) => (
    <EditSection
        section="vision"
        title="Our Vision"
        onSave={onSave}
        onCancel={onCancel}
        isSaving={isSaving}
    >
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
                <textarea
                    value={tempProfile.vision}
                    onChange={(e) => onInputChange('vision', e.target.value)}
                    rows="8"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg leading-relaxed"
                    placeholder="What is your company's vision for the future? What do you aspire to achieve in the long term? Describe the ideal future you want to create..."
                />
                <p className="text-sm text-gray-500 mt-2">
                    Your vision should inspire and guide your company's long-term direction.
                </p>
            </div>
        </div>
    </EditSection>
));

const EditMissionSection = React.memo(({ tempProfile, onInputChange, onSave, onCancel, isSaving }) => (
    <EditSection
        section="mission"
        title="Our Mission"
        onSave={onSave}
        onCancel={onCancel}
        isSaving={isSaving}
    >
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                <textarea
                    value={tempProfile.mission}
                    onChange={(e) => onInputChange('mission', e.target.value)}
                    rows="8"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg leading-relaxed"
                    placeholder="What is your company's core purpose? How do you achieve your vision? Describe what you do, how you do it, and who you serve..."
                />
                <p className="text-sm text-gray-500 mt-2">
                    Your mission should define your company's purpose and approach to business.
                </p>
            </div>
        </div>
    </EditSection>
));

const EditSection = React.memo(({ section, title, children, onSave, onCancel, isSaving }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">Edit {title}</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
));

// Company Landing Page Component
function CompanyLandingPage({ profile, setRootContext, mutated }) {
    const [editing, setEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState({});
    const [activeEditSection, setActiveEditSection] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize tempProfile only once when profile changes
    useEffect(() => {
        if (profile) {
            setTempProfile({
                // Basic Info
                name: profile.name || '',
                email: profile.email || '',
                mobile: profile.mobile || '',
                company: profile.company || '',
                position: profile.position || '',

                // Company Details
                industry: profile.industry || 'Real Estate',
                location: profile.location || '',
                established: profile.established || new Date().getFullYear(),
                website: profile.website || '',
                contactPerson: profile.contactPerson || profile.name || '',
                phone: profile.phone || '',

                // Core Content
                tagline: profile.tagline || 'Building Dreams, Creating Legacies',
                description: profile.description || '',
                about: profile.about || '',
                vision: profile.vision || '',
                mission: profile.mission || '',
                values: Array.isArray(profile.values)
                    ? profile.values.map(item => typeof item === 'string' ? item : item.title || item.name || '')
                    : ['Integrity', 'Excellence', 'Innovation', 'Customer Focus'],

                // Leadership
                leadership: profile.leadership || [
                    {
                        id: 1,
                        name: profile.name || 'Company Founder',
                        position: profile.position || 'Founder & CEO',
                        bio: 'Leading the company with vision and dedication.',
                        image: '',
                        department: 'Executive'
                    }
                ],

                // Achievements
                achievements: profile.achievements || [
                    {
                        id: 1,
                        title: 'Best Real Estate Developer 2023',
                        year: '2023',
                        description: 'Awarded for excellence in residential development',
                        issuer: 'Real Estate Excellence Awards'
                    }
                ],

                // Certifications
                certifications: profile.certifications || [
                    {
                        id: 1,
                        name: 'RERA Certified',
                        issuer: 'Real Estate Regulatory Authority',
                        year: '2023'
                    }
                ],

                // Why Choose Us
                whyChooseUs: profile.whyChooseUs || [
                    {
                        id: 1,
                        title: 'Trust & Transparency',
                        description: 'We believe in complete transparency in all our dealings'
                    },
                    {
                        id: 2,
                        title: 'Quality Construction',
                        description: 'Premium quality materials and superior craftsmanship'
                    },
                    {
                        id: 3,
                        title: 'Timely Delivery',
                        description: 'We deliver projects on time, every time'
                    }
                ],

                // Services
                services: Array.isArray(profile.services)
                    ? profile.services.map(item => typeof item === 'string' ? item : item.title || item.name || '')
                    : ['Residential Development', 'Commercial Projects', 'Property Management', 'Real Estate Consulting'],

                // Statistics
                statistics: profile.statistics || [
                    { label: 'Projects Completed', value: '50+' },
                    { label: 'Happy Customers', value: '1000+' },
                    { label: 'Years Experience', value: '10+' },
                    { label: 'Cities Presence', value: '5+' }
                ],

                // Social Media
                socialMedia: profile.socialMedia || {
                    linkedin: '',
                    twitter: '',
                    facebook: '',
                    instagram: ''
                }
            });
        }
    }, [profile]);

    // Stable callback functions to prevent re-renders
    const handleInputChange = useCallback((field, value) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleArrayFieldChange = useCallback((field, index, key, value) => {
        setTempProfile(prev => {
            // For simple string arrays (services, values)
            if (key === '') {
                return {
                    ...prev,
                    [field]: prev[field].map((item, i) =>
                        i === index ? value : item
                    )
                };
            }

            // For object arrays
            return {
                ...prev,
                [field]: prev[field].map((item, i) =>
                    i === index ? { ...item, [key]: value } : item
                )
            };
        });
    }, []);

    const addArrayField = useCallback((field, defaultValue) => {
        setTempProfile(prev => {
            // For simple string arrays (services, values)
            if (typeof defaultValue === 'string') {
                return {
                    ...prev,
                    [field]: [...prev[field], defaultValue]
                };
            }

            // For object arrays (leadership, achievements, certifications, whyChooseUs)
            return {
                ...prev,
                [field]: [...prev[field], { ...defaultValue, id: Date.now() + Math.random() }]
            };
        });
    }, []);

    const removeArrayField = useCallback((field, index) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!profile?._id) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("id", profile._id);

            // Define which fields should be treated as simple arrays (comma-separated)
            const simpleArrays = ['values', 'services'];
            // Define which fields should be treated as object arrays (JSON)
            const objectArrays = ['leadership', 'achievements', 'certifications', 'whyChooseUs', 'statistics'];
            // Define which fields should be treated as objects (JSON)
            const objectFields = ['socialMedia'];

            // Add all company profile fields
            Object.keys(tempProfile).forEach(key => {
                const value = tempProfile[key];

                if (value === null || value === undefined || value === '') {
                    return; // Skip empty values
                }

                // Handle arrays
                if (Array.isArray(value)) {
                    if (value.length === 0) return; // Skip empty arrays

                    if (simpleArrays.includes(key)) {
                        // Simple string arrays - send as comma-separated
                        formData.append(key, value.join(','));
                    } else if (objectArrays.includes(key)) {
                        // Object arrays - send as JSON
                        formData.append(key, JSON.stringify(value));
                    } else {
                        // Default for other arrays - send as JSON
                        formData.append(key, JSON.stringify(value));
                    }
                }
                // Handle objects
                else if (typeof value === 'object') {
                    if (objectFields.includes(key) || Object.keys(value).length > 0) {
                        formData.append(key, JSON.stringify(value));
                    }
                }
                // Handle primitive values
                else {
                    formData.append(key, value.toString());
                }
            });

            console.log('Sending form data:', Object.fromEntries(formData.entries()));

            const res = await fetch('/api/users', {
                method: 'PUT',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setEditing(false);
                setActiveEditSection(null);
                mutated();
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        position: "Success",
                        message: "Company profile updated successfully"
                    }
                }));
            } else {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        position: "Failed",
                        message: data.error || "Failed to update profile"
                    }
                }));
            }
        } catch (err) {
            console.error("Update Error:", err);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    position: "Failed",
                    message: "Something went wrong while updating profile"
                }
            }));
        } finally {
            setIsSaving(false);
        }
    }, [tempProfile, profile?._id, mutated, setRootContext]);

    const handleCancel = useCallback(() => {
        setEditing(false);
        setActiveEditSection(null);
        // Reset to original profile data
        if (profile) {
            setTempProfile({
                name: profile.name || '',
                email: profile.email || '',
                mobile: profile.mobile || '',
                company: profile.company || '',
                position: profile.position || '',
                industry: profile.industry || 'Real Estate',
                location: profile.location || '',
                established: profile.established || new Date().getFullYear(),
                website: profile.website || '',
                contactPerson: profile.contactPerson || profile.name || '',
                phone: profile.phone || '',
                tagline: profile.tagline || 'Building Dreams, Creating Legacies',
                description: profile.description || '',
                about: profile.about || '',
                vision: profile.vision || '',
                mission: profile.mission || '',
                values: Array.isArray(profile.values)
                    ? profile.values.map(item => typeof item === 'string' ? item : item.title || item.name || '')
                    : ['Integrity', 'Excellence', 'Innovation', 'Customer Focus'],
                leadership: profile.leadership || [],
                achievements: profile.achievements || [],
                certifications: profile.certifications || [],
                whyChooseUs: profile.whyChooseUs || [],
                services: Array.isArray(profile.services)
                    ? profile.services.map(item => typeof item === 'string' ? item : item.title || item.name || '')
                    : [],
                statistics: profile.statistics || [],
                socialMedia: profile.socialMedia || {}
            });
        }
    }, [profile]);

    const startEditingSection = useCallback((section) => {
        setEditing(true);
        setActiveEditSection(section);
    }, []);

    // View Mode - Comprehensive Mini Landing Page
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 rounded-3xl overflow-hidden mb-12">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative px-8 py-16 text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">{tempProfile.company || tempProfile.name}</h1>
                    <p className="text-2xl mb-6 opacity-90">{tempProfile.tagline}</p>
                    <p className="text-xl max-w-3xl mx-auto opacity-80">{tempProfile.description}</p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
                        {tempProfile.statistics?.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-blue-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Company Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">About Our Company</h2>
                    <button
                        onClick={() => startEditingSection('about')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit About
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {tempProfile.about || 'No company story provided yet. We are committed to excellence and building lasting relationships with our clients.'}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center gap-3">
                                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">Industry</p>
                                    <p className="text-gray-600">{tempProfile.industry || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPinIcon className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">Location</p>
                                    <p className="text-gray-600">{tempProfile.location || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">Established</p>
                                    <p className="text-gray-600">{tempProfile.established || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserGroupIcon className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">Leadership</p>
                                    <p className="text-gray-600">{tempProfile.leadership?.length || 0} Members</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Company Description</h4>
                            <p className="text-gray-700 leading-relaxed">
                                {tempProfile.description || 'No company description provided yet. We strive to deliver exceptional value and quality in everything we do.'}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-2xl p-6">
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Our Tagline</h4>
                            <p className="text-lg text-purple-700 font-medium">
                                {tempProfile.tagline || 'Building Dreams, Creating Legacies'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Vision Section - Completely Separate */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Our Vision</h2>
                    <button
                        onClick={() => startEditingSection('vision')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Vision
                    </button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <LightBulbIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            {tempProfile.vision || 'No vision statement provided yet. Our vision guides our long-term direction and inspires us to achieve greatness.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Mission Section - Completely Separate */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
                    <button
                        onClick={() => startEditingSection('mission')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Mission
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <StarIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            {tempProfile.mission || 'No mission statement provided yet. Our mission defines our purpose and guides our daily operations and decisions.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership Team Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Leadership Team</h2>
                    <button
                        onClick={() => startEditingSection('leadership')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Team
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tempProfile.leadership?.map((leader, index) => (
                        <div key={leader.id || index} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                                {leader.image ? (
                                    <img src={leader.image} alt={leader.name} className="w-20 h-20 rounded-full object-cover" />
                                ) : (
                                    leader.name.split(' ').map(n => n[0]).join('')
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{leader.name}</h3>
                            <p className="text-blue-600 font-semibold mb-3">{leader.position}</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
                            {leader.department && (
                                <div className="mt-3 inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    {leader.department}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Why Choose Us?</h2>
                    <button
                        onClick={() => startEditingSection('whyChooseUs')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Reasons
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tempProfile.whyChooseUs?.map((reason, index) => (
                        <div key={reason.id || index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="text-3xl font-bold text-blue-600 mb-4">{index + 1}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Our Services</h2>
                    <button
                        onClick={() => startEditingSection('services')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Services
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tempProfile.services?.map((service, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckBadgeIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Awards & Certifications Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Awards & Certifications</h2>
                    <button
                        onClick={() => startEditingSection('achievements')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Awards
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Awards */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <TrophyIcon className="w-8 h-8 text-yellow-500" />
                            Awards & Recognition
                        </h3>
                        <div className="space-y-4">
                            {tempProfile.achievements?.map((achievement, index) => (
                                <div key={achievement.id || index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                            {achievement.year}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{achievement.description}</p>
                                    <p className="text-sm text-gray-500">by {achievement.issuer}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                            <CheckBadgeIcon className="w-8 h-8 text-green-500" />
                            Certifications
                        </h3>
                        <div className="space-y-4">
                            {tempProfile.certifications?.map((certification, index) => (
                                <div key={certification.id || index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{certification.name}</h4>
                                    <p className="text-gray-600 mb-2">Issued by {certification.issuer}</p>
                                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                        {certification.year}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Values Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900">Our Values</h2>
                    <button
                        onClick={() => startEditingSection('values')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Values
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tempProfile.values?.map((value, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <StarIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl text-white p-12 mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-xl opacity-90">Ready to work with us? Contact our team today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <PhoneIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <p className="font-semibold">Phone</p>
                        <p className="opacity-80">{tempProfile.mobile || 'Not provided'}</p>
                    </div>
                    <div className="text-center">
                        <EnvelopeIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <p className="font-semibold">Email</p>
                        <p className="opacity-80">{tempProfile.email}</p>
                    </div>
                    <div className="text-center">
                        <MapPinIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <p className="font-semibold">Location</p>
                        <p className="opacity-80">{tempProfile.location || 'Not specified'}</p>
                    </div>
                    <div className="text-center">
                        <GlobeAltIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <p className="font-semibold">Website</p>
                        <p className="opacity-80">
                            {tempProfile.website ? (
                                <a href={tempProfile.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                    Visit Website
                                </a>
                            ) : 'Not provided'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Edit Modals */}
            {activeEditSection === 'about' && (
                <EditSection
                    section="about"
                    title="About Company"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                <input
                                    type="text"
                                    value={tempProfile.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Real Estate, Construction"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={tempProfile.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Company location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                                <input
                                    type="text"
                                    value={tempProfile.established}
                                    onChange={(e) => handleInputChange('established', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 2020"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Leadership Team Size</label>
                                <input
                                    type="text"
                                    value={tempProfile.leadership?.length || 0}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Manage team members in Leadership section</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Tagline</label>
                            <input
                                type="text"
                                value={tempProfile.tagline}
                                onChange={(e) => handleInputChange('tagline', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter compelling tagline"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                            <textarea
                                value={tempProfile.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief company description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Story</label>
                            <textarea
                                value={tempProfile.about}
                                onChange={(e) => handleInputChange('about', e.target.value)}
                                rows="6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tell your company story..."
                            />
                        </div>
                    </div>
                </EditSection>
            )}

            {activeEditSection === 'vision' && (
                <EditVisionSection
                    tempProfile={tempProfile}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                />
            )}

            {activeEditSection === 'mission' && (
                <EditMissionSection
                    tempProfile={tempProfile}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                />
            )}

            {activeEditSection === 'leadership' && (
                <EditSection
                    section="leadership"
                    title="Leadership Team"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <EditLeadershipSection
                        tempProfile={tempProfile}
                        onArrayFieldChange={handleArrayFieldChange}
                        onAddArrayField={addArrayField}
                        onRemoveArrayField={removeArrayField}
                    />
                </EditSection>
            )}

            {activeEditSection === 'whyChooseUs' && (
                <EditSection
                    section="whyChooseUs"
                    title="Why Choose Us"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <EditWhyChooseUsSection
                        tempProfile={tempProfile}
                        onArrayFieldChange={handleArrayFieldChange}
                        onAddArrayField={addArrayField}
                        onRemoveArrayField={removeArrayField}
                    />
                </EditSection>
            )}

            {activeEditSection === 'services' && (
                <EditSection
                    section="services"
                    title="Services"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <EditServicesSection
                        tempProfile={tempProfile}
                        onArrayFieldChange={handleArrayFieldChange}
                        onAddArrayField={addArrayField}
                        onRemoveArrayField={removeArrayField}
                    />
                </EditSection>
            )}

            {activeEditSection === 'achievements' && (
                <EditSection
                    section="achievements"
                    title="Awards & Certifications"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <EditAchievementsSection
                        tempProfile={tempProfile}
                        onArrayFieldChange={handleArrayFieldChange}
                        onAddArrayField={addArrayField}
                        onRemoveArrayField={removeArrayField}
                    />
                </EditSection>
            )}

            {activeEditSection === 'values' && (
                <EditSection
                    section="values"
                    title="Company Values"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                >
                    <EditValuesSection
                        tempProfile={tempProfile}
                        onArrayFieldChange={handleArrayFieldChange}
                        onAddArrayField={addArrayField}
                        onRemoveArrayField={removeArrayField}
                    />
                </EditSection>
            )}
        </div>
    );
}

export default React.memo(CompanyLandingPage);