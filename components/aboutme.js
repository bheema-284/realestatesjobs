'use client';
import React, { useState, useEffect } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const dummyLogos = [
    'https://placehold.co/48x48/F0F0F0/000000?text=Google',
    'https://placehold.co/48x48/F0F0F0/000000?text=Facebook',
    'https://placehold.co/48x48/F0F0F0/000000?text=LinkedIn',
    'https://placehold.co/48x48/F0F0F0/000000?text=Microsoft',
    'https://placehold.co/48x48/F0F0F0/000000?text=YouTube',
];

export default function AboutMe({ profile }) {
    // State for Summary section
    const [editingSummary, setEditingSummary] = useState(false);
    const [tempSummary, setTempSummary] = useState('');
    const [summary, setSummary] = useState(profile.summary || 'Write a brief summary about yourself, your skills, and your professional goals.');

    // State for Experience section
    const [experience, setExperience] = useState(profile.experience || []);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [tempExperience, setTempExperience] = useState({ company: '', location: '', role: '', logo: dummyLogos[0], startDate: '', endDate: '', description: '' });

    // State for Education section
    const [education, setEducation] = useState(profile.education || []);
    const [editingEducationIndex, setEditingEducationIndex] = useState(null);
    const [tempEducation, setTempEducation] = useState({ degree: '', board: '', years: '' });

    // Global state to disable other actions when one is in progress
    const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);

    // Effect to update states when profile prop changes
    useEffect(() => {
        setSummary(profile.summary || 'Write a brief summary about yourself, your skills, and your professional goals.');
        setExperience(profile.experience || []);
        setEducation(profile.education || []);
    }, [profile]);

    // Effect to manage the global adding/editing state
    useEffect(() => {
        setIsAddingOrEditing(editingSummary || editingExperienceIndex !== null || editingEducationIndex !== null);
    }, [editingSummary, editingExperienceIndex, editingEducationIndex]);

    // Handlers for Summary section
    const handleSaveSummary = () => {
        setSummary(tempSummary);
        setEditingSummary(false);
    };

    const handleCancelSummary = () => {
        setEditingSummary(false);
        setTempSummary(summary); // Revert to original summary
    };

    // Handlers for Experience section
    const handleAddExperience = () => {
        setExperience([...experience, { company: '', location: '', role: '', logo: dummyLogos[0], startDate: '', endDate: '', description: '', showDescription: false }]);
        setEditingExperienceIndex(experience.length); // Set to the new item's index
        setTempExperience({ company: '', location: '', role: '', logo: dummyLogos[0], startDate: '', endDate: '', description: '' });
    };

    const handleEditExperience = (index) => {
        setEditingExperienceIndex(index);
        setTempExperience({ ...experience[index] });
    };

    const handleSaveExperience = (index) => {
        const updated = [...experience];
        updated[index] = { ...tempExperience, showDescription: updated[index]?.showDescription || false }; // Preserve showDescription state
        setExperience(updated);
        setEditingExperienceIndex(null);
    };

    const handleCancelExperience = () => {
        if (editingExperienceIndex !== null && !experience[editingExperienceIndex]?.company) {
            // If it was a new, unsaved entry, remove it
            setExperience(experience.filter((_, i) => i !== editingExperienceIndex));
        }
        setEditingExperienceIndex(null);
        setTempExperience({ company: '', location: '', role: '', logo: dummyLogos[0], startDate: '', endDate: '', description: '' }); // Reset temp state
    };

    const handleDeleteExperience = (index) => {
        const updated = experience.filter((_, i) => i !== index);
        setExperience(updated);
        setEditingExperienceIndex(null); // Close editing if the deleted item was being edited
    };

    const handleExperienceChange = (e, field) => {
        setTempExperience({ ...tempExperience, [field]: e.target.value });
    };

    const toggleDescription = (index) => {
        const updated = [...experience];
        updated[index].showDescription = !updated[index].showDescription;
        setExperience(updated);
    };

    // Handlers for Education section
    const handleAddEducation = () => {
        setEducation([...education, { degree: '', board: '', years: '' }]);
        setEditingEducationIndex(education.length); // Set to the new item's index
        setTempEducation({ degree: '', board: '', years: '' });
    };

    const handleEditEducation = (index) => {
        setEditingEducationIndex(index);
        setTempEducation({ ...education[index] });
    };

    const handleSaveEducation = (index) => {
        const updated = [...education];
        updated[index] = { ...tempEducation };
        setEducation(updated);
        setEditingEducationIndex(null);
    };

    const handleCancelEducation = () => {
        if (editingEducationIndex !== null && !education[editingEducationIndex]?.degree) {
            // If it was a new, unsaved entry, remove it
            setEducation(education.filter((_, i) => i !== editingEducationIndex));
        }
        setEditingEducationIndex(null);
        setTempEducation({ degree: '', board: '', years: '' }); // Reset temp state
    };

    const handleDeleteEducation = (index) => {
        const updated = education.filter((_, i) => i !== index);
        setEducation(updated);
        setEditingEducationIndex(null); // Close editing if the deleted item was being edited
    };

    const handleEducationChange = (e, field) => {
        setTempEducation({ ...tempEducation, [field]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 md:space-y-10">
                {/* Summary Section */}
                <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Summary of {profile.name || 'Your Profile'}</h3>
                        <div className="flex space-x-3">
                            {editingSummary ? (
                                <>
                                    <button
                                        onClick={handleSaveSummary}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelSummary}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setEditingSummary(true); }}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    aria-label="Edit summary"
                                    disabled={isAddingOrEditing} // Disable if any other section is being edited
                                >
                                    <PencilIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-gray-600'}`} />
                                </button>
                            )}
                        </div>
                    </div>
                    {editingSummary ? (
                        <textarea
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg text-base text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
                            rows={6}
                            value={tempSummary}
                            onChange={(e) => setTempSummary(e.target.value)}
                            placeholder="Write a comprehensive summary about your professional journey..."
                        />
                    ) : (
                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                            {summary || 'No summary available. Click the pencil icon to add one.'}
                        </p>
                    )}
                </section>

                {/* Experience Section */}
                <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">EXPERIENCE</h3>
                        <button
                            onClick={handleAddExperience}
                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                            aria-label="Add experience"
                            disabled={isAddingOrEditing} // Disable if any other section is being edited
                        >
                            <PlusIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-white'}`} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {experience.length === 0 && (
                            <p className="text-gray-600 text-center py-4">No experience added yet. Click the '+' button to add one.</p>
                        )}
                        {experience.map((exp, index) => (
                            <div key={index} className="flex flex-col border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                                {editingExperienceIndex === index ? (
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                                <input
                                                    id={`company-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempExperience.company}
                                                    onChange={(e) => handleExperienceChange(e, 'company')}
                                                    placeholder="Company Name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`location-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    id={`location-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempExperience.location}
                                                    onChange={(e) => handleExperienceChange(e, 'location')}
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <input
                                                    id={`role-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempExperience.role}
                                                    onChange={(e) => handleExperienceChange(e, 'role')}
                                                    placeholder="Your Role"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    id={`startDate-${index}`}
                                                    type="month"
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempExperience.startDate}
                                                    onChange={(e) => handleExperienceChange(e, 'startDate')}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">End Date (or 'Present')</label>
                                                <input
                                                    id={`endDate-${index}`}
                                                    type="text" // Use text for "Present" option
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempExperience.endDate}
                                                    onChange={(e) => handleExperienceChange(e, 'endDate')}
                                                    placeholder="e.g., 2023-01 or Present"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    id={`description-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                                                    rows={4}
                                                    value={tempExperience.description}
                                                    onChange={(e) => handleExperienceChange(e, 'description')}
                                                    placeholder="Describe your responsibilities and achievements in this role."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button
                                                onClick={() => handleSaveExperience(index)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelExperience}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full">
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex items-center gap-4 mb-2">
                                                <img
                                                    src={exp.logo || dummyLogos[index % dummyLogos.length]} // Fallback to dummy logo
                                                    alt={`${exp.company} Logo`}
                                                    className="w-12 h-12 object-contain border border-gray-200 rounded-full p-1 bg-white shadow-sm"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/F0F0F0/000000?text=Logo'; }} // Fallback on error
                                                />
                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-900">{exp.role}</h4>
                                                    <p className="text-sm text-gray-700">{exp.company} &bull; {exp.location}</p>
                                                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditExperience(index)}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                    aria-label="Edit experience"
                                                    disabled={isAddingOrEditing && editingExperienceIndex !== index} // Disable if another item is being edited
                                                >
                                                    <PencilIcon className={`w-5 h-5 ${isAddingOrEditing && editingExperienceIndex !== index ? 'text-gray-400' : 'text-blue-600'}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExperience(index)}
                                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                    aria-label="Delete experience"
                                                    disabled={isAddingOrEditing} // Disable if any other section is being edited
                                                >
                                                    <TrashIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-red-600'}`} />
                                                </button>
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => toggleDescription(index)}
                                                    className="text-sm text-blue-600 hover:underline focus:outline-none"
                                                >
                                                    {exp.showDescription ? 'Show Less' : 'Know More'}
                                                </button>
                                                {exp.showDescription && (
                                                    <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Qualification Section */}
                <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">QUALIFICATION</h3>
                        <button
                            onClick={handleAddEducation}
                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                            aria-label="Add education"
                            disabled={isAddingOrEditing} // Disable if any other section is being edited
                        >
                            <PlusIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-white'}`} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {education.length === 0 && (
                            <p className="text-gray-600 text-center py-4">No education added yet. Click the '+' button to add one.</p>
                        )}
                        {education.map((edu, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                                {editingEducationIndex === index ? (
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                                <input
                                                    id={`degree-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempEducation.degree}
                                                    onChange={(e) => handleEducationChange(e, 'degree')}
                                                    placeholder="e.g., Bachelor's Degree"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`board-${index}`} className="block text-sm font-medium text-gray-700 mb-1">University/Board</label>
                                                <input
                                                    id={`board-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempEducation.board}
                                                    onChange={(e) => handleEducationChange(e, 'board')}
                                                    placeholder="University/Board Name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`years-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                                                <input
                                                    id={`years-${index}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempEducation.years}
                                                    onChange={(e) => handleEducationChange(e, 'years')}
                                                    placeholder="e.g., 2018 - 2022"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button
                                                onClick={() => handleSaveEducation(index)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEducation}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900">{edu.degree}</h4>
                                            <p className="text-sm text-gray-700">{edu.board}</p>
                                            <p className="text-xs text-gray-500">{edu.years}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditEducation(index)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                aria-label="Edit education"
                                                disabled={isAddingOrEditing && editingEducationIndex !== index} // Disable if another item is being edited
                                            >
                                                <PencilIcon className={`w-5 h-5 ${isAddingOrEditing && editingEducationIndex !== index ? 'text-gray-400' : 'text-blue-600'}`} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEducation(index)}
                                                className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                aria-label="Delete education"
                                                disabled={isAddingOrEditing} // Disable if any other section is being edited
                                            >
                                                <TrashIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-red-600'}`} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
