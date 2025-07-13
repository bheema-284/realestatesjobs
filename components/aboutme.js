'use client';
import React, { useState, useEffect } from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const dummyLogos = [
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
    'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
];

export default function AboutMe({ profile }) {
    const [editingSummary, setEditingSummary] = useState(false);
    const [tempSummary, setTempSummary] = useState('');
    const [summary, setSummary] = useState(profile.summary || '');

    const [experience, setExperience] = useState(profile.experience || []);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [tempExperience, setTempExperience] = useState({});

    const [education, setEducation] = useState(profile.education || []);
    const [editingEducationIndex, setEditingEducationIndex] = useState(null);

    useEffect(() => {
        setSummary(profile.summary || '');
        setExperience(profile.experience || []);
        setEducation(profile.education || []);
    }, [profile]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Summary */}
                <section className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Summary of {profile.name}</h3>
                        <div className="flex gap-2">
                            {editingSummary ? (
                                <>
                                    <button onClick={() => { setSummary(tempSummary); setEditingSummary(false); }} className="text-sm text-blue-600">Save</button>
                                    <button onClick={() => setEditingSummary(false)} className="text-sm text-gray-600">Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => { setEditingSummary(true); setTempSummary(summary); }}>
                                    <PencilIcon className="w-4 h-4 text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                    {editingSummary ? (
                        <textarea className="mt-2 w-full p-2 border rounded text-sm" rows={6} value={tempSummary} onChange={(e) => setTempSummary(e.target.value)} />
                    ) : (
                        <p className="text-sm mt-2 whitespace-pre-line text-gray-700">{summary}</p>
                    )}
                </section>

                {/* Experience */}
                <section className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">EXPERIENCE</h3>
                        <button onClick={() => setExperience([...experience, { company: '', location: '', role: '', logo: dummyLogos[0] }])}>
                            <PlusIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index} className="flex justify-between items-center border rounded p-3 bg-gray-50">
                                {editingExperienceIndex === index ? (
                                    <div className="flex flex-col gap-1 w-full">
                                        <label className="text-sm">Company</label>
                                        <input className="border p-1 text-sm rounded" value={exp.company} onChange={(e) => {
                                            const updated = [...experience];
                                            updated[index].company = e.target.value;
                                            setExperience(updated);
                                        }} />
                                        <label className="text-sm">Location</label>
                                        <input className="border p-1 text-sm rounded" value={exp.location} onChange={(e) => {
                                            const updated = [...experience];
                                            updated[index].location = e.target.value;
                                            setExperience(updated);
                                        }} />
                                        <label className="text-sm">Role</label>
                                        <input className="border p-1 text-sm rounded" value={exp.role} onChange={(e) => {
                                            const updated = [...experience];
                                            updated[index].role = e.target.value;
                                            setExperience(updated);
                                        }} />
                                        <div className="flex gap-2 mt-2">
                                            <button className="text-sm text-blue-600" onClick={() => setEditingExperienceIndex(null)}>Save</button>
                                            <button className="text-sm text-gray-600" onClick={() => setEditingExperienceIndex(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" || dummyLogos[index]}
                                                alt="Logo"
                                                className="w-12 h-12 object-contain border rounded"
                                            />
                                            <div>
                                                <h4 className="text-sm font-bold uppercase">{exp.company}</h4>
                                                <p className="text-xs text-gray-600">{exp.location}</p>
                                                <p className="text-xs text-gray-600">{exp.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            setEditingExperienceIndex(index);
                                            setTempExperience({ ...exp });
                                        }}>
                                            <PencilIcon className="w-4 h-4 text-blue-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Qualification */}
                <section className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">QUALIFICATION</h3>
                        <button onClick={() => setEducation([...education, { degree: '', board: '', years: '' }])}>
                            <PlusIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 items-end">
                                {editingEducationIndex === index ? (
                                    <>
                                        <div>
                                            <label className="text-sm">Degree</label>
                                            <input className="border p-2 rounded text-sm w-full" value={edu.degree} onChange={(e) => {
                                                const updated = [...education];
                                                updated[index].degree = e.target.value;
                                                setEducation(updated);
                                            }} />
                                        </div>
                                        <div>
                                            <label className="text-sm">Board</label>
                                            <input className="border p-2 rounded text-sm w-full" value={edu.board} onChange={(e) => {
                                                const updated = [...education];
                                                updated[index].board = e.target.value;
                                                setEducation(updated);
                                            }} />
                                        </div>
                                        <div>
                                            <label className="text-sm">Years</label>
                                            <input className="border p-2 rounded text-sm w-full mb-1" value={edu.years} onChange={(e) => {
                                                const updated = [...education];
                                                updated[index].years = e.target.value;
                                                setEducation(updated);
                                            }} />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button className="text-sm text-blue-600" onClick={() => setEditingEducationIndex(null)}>Save</button>
                                            <button className="text-sm text-gray-600" onClick={() => setEditingEducationIndex(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input className="border p-2 rounded text-sm" value={edu.degree} readOnly onClick={() => setEditingEducationIndex(index)} />
                                        <input className="border p-2 rounded text-sm" value={edu.board} readOnly onClick={() => setEditingEducationIndex(index)} />
                                        <input className="border p-2 rounded text-sm" value={edu.years} readOnly onClick={() => setEditingEducationIndex(index)} />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}