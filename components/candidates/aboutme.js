'use client';
import React, { useState, useEffect, useContext } from 'react';
import { PencilIcon, PlusIcon, TrashIcon, DocumentArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Mutated } from '../config/useswrfetch';
import RootContext from '../config/rootcontext';
import Loader from '../common/loader';

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
    const [summary, setSummary] = useState(profile?.summary || 'Write a brief summary about yourself, your skills, and your professional goals.');

    // State for Experience section
    const [experience, setExperience] = useState([]);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [tempExperience, setTempExperience] = useState({
        company: '',
        location: '',
        role: '',
        logo: dummyLogos[0],
        startDate: '',
        endDate: '',
        description: '',
        document: null,
        documentUrl: ''
    });
    const [uploadingExpDoc, setUploadingExpDoc] = useState(null);
    const [expDocumentPreview, setExpDocumentPreview] = useState({ show: false, file: null, index: null });
    const [expDocumentView, setExpDocumentView] = useState({ show: false, url: '', fileName: '', type: 'experience', index: null });

    // State for Education section
    const [education, setEducation] = useState([]);
    const [editingEducationIndex, setEditingEducationIndex] = useState(null);
    const [tempEducation, setTempEducation] = useState({
        degree: '',
        board: '',
        startYear: '',
        endYear: '',
        document: null,
        documentUrl: ''
    });
    const [uploadingEduDoc, setUploadingEduDoc] = useState(null);
    const [eduDocumentPreview, setEduDocumentPreview] = useState({ show: false, file: null, index: null });
    const [eduDocumentView, setEduDocumentView] = useState({ show: false, url: '', fileName: '', type: 'education', index: null });

    const { rootContext, setRootContext } = useContext(RootContext);
    const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
    const [serviceCall, setServiceCall] = useState(false);

    // Check if user can edit (passed from parent)
    const isApplicant = rootContext?.user?.role !== 'company';

    // Use users API instead of employees API
    const mutated = Mutated(profile?._id ? `/api/users?id=${profile?._id}` : null);

    // Sort experiences by start date (most recent first)
    const sortExperiences = (experiences) => {
        return experiences.sort((a, b) => {
            const dateA = new Date(a.startDate || '1970-01-01');
            const dateB = new Date(b.startDate || '1970-01-01');
            return dateB - dateA;
        });
    };

    // Sort education by end year (most recent first)
    const sortEducation = (education) => {
        return education.sort((a, b) => {
            const yearA = parseInt(a.endYear || a.years?.split('-')[1] || '1970');
            const yearB = parseInt(b.endYear || b.years?.split('-')[1] || '1970');
            return yearB - yearA;
        });
    };

    // Effect to update states when profile prop changes
    useEffect(() => {
        setSummary(profile?.summary || 'Write a brief summary about yourself, your skills, and your professional goals.');

        const sortedExperiences = sortExperiences(profile?.experience || []);
        const sortedEducation = sortEducation(profile?.education || []);

        setExperience(sortedExperiences);
        setEducation(sortedEducation);
    }, [profile]);

    // Effect to manage the global adding/editing state
    useEffect(() => {
        setIsAddingOrEditing(editingSummary || editingExperienceIndex !== null || editingEducationIndex !== null);
    }, [editingSummary, editingExperienceIndex, editingEducationIndex]);

    // Generic update function using FormData for document uploads
    const updateProfileWithDocuments = async (updateData, documents = []) => {
        setServiceCall(true);
        try {
            const formData = new FormData();

            // 🆔 Always include user ID
            formData.append("id", profile?._id || 1);

            // 🔹 Append all fields in updateData
            Object.keys(updateData).forEach((key) => {
                const value = updateData[key];
                if (value !== undefined && value !== null) {
                    // Convert nested objects/arrays to JSON
                    if (typeof value === "object" && !(value instanceof File)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            // 🔹 Attach document files (experience, education, etc.)
            documents.forEach((doc) => {
                if (doc?.file) {
                    formData.append(`${doc.type}Doc_${doc.index}`, doc.file);
                }
            });

            // 🔹 Make PUT request to users API
            const res = await fetch(`/api/users`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setServiceCall(false);
                mutated(); // Refresh user data
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        title: "Success",
                        message: "Profile Updated Successfully",
                    },
                }));
                return true;
            } else {
                setServiceCall(false);
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to update profile",
                    },
                }));
                return false;
            }
        } catch (err) {
            setServiceCall(false);
            setRootContext((prevContext) => ({
                ...prevContext,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: "Something went wrong while updating profile",
                },
            }));
            return false;
        }
    };

    // Handle document file selection for experience
    const handleExperienceDocumentChange = (e, index) => {
        if (!isApplicant) return;

        const file = e.target.files[0];
        if (file) {
            // Check file type (PDF, DOC, DOCX)
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Invalid File",
                        message: 'Please upload PDF or Word documents only',
                    },
                }));
                return;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "File Too Large",
                        message: 'File size should be less than 5MB',
                    },
                }));
                return;
            }

            if (editingExperienceIndex === index) {
                const tempUrl = URL.createObjectURL(file);
                setTempExperience(prev => ({
                    ...prev,
                    documentUrl: tempUrl,
                    document: file
                }));

                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        title: "Document Selected",
                        message: 'Document will be saved when you save the experience',
                    },
                }));
            } else {
                setExpDocumentPreview({
                    show: true,
                    file: file,
                    index: index
                });
            }

            e.target.value = '';
        }
    };

    // Handle document file selection for education
    const handleEducationDocumentChange = (e, index) => {
        if (!isApplicant) return;

        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Invalid File",
                        message: 'Please upload PDF or Word documents only',
                    },
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "File Too Large",
                        message: 'File size should be less than 5MB',
                    },
                }));
                return;
            }

            if (editingEducationIndex === index) {
                const tempUrl = URL.createObjectURL(file);
                setTempEducation(prev => ({
                    ...prev,
                    documentUrl: tempUrl,
                    document: file
                }));

                setRootContext((prevContext) => ({
                    ...prevContext,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        title: "Document Selected",
                        message: 'Document will be saved when you save the education',
                    },
                }));
            } else {
                setEduDocumentPreview({
                    show: true,
                    file: file,
                    index: index
                });
            }

            e.target.value = '';
        }
    };

    // Save experience document from preview
    const handleSaveExperienceDocument = async () => {
        if (!isApplicant || !expDocumentPreview.file || expDocumentPreview.index === null) return;

        setUploadingExpDoc(expDocumentPreview.index);

        const success = await updateProfileWithDocuments(
            { experience: experience },
            [{ type: 'experience', file: expDocumentPreview.file, index: expDocumentPreview.index }]
        );

        if (success) {
            const updated = [...experience];
            const tempUrl = URL.createObjectURL(expDocumentPreview.file);
            updated[expDocumentPreview.index] = {
                ...updated[expDocumentPreview.index],
                documentUrl: tempUrl,
                documentFile: expDocumentPreview.file
            };
            setExperience(updated);
        }

        setUploadingExpDoc(null);
        setExpDocumentPreview({ show: false, file: null, index: null });
    };

    // Save education document from preview
    const handleSaveEducationDocument = async () => {
        if (!isApplicant || !eduDocumentPreview.file || eduDocumentPreview.index === null) return;

        setUploadingEduDoc(eduDocumentPreview.index);

        const success = await updateProfileWithDocuments(
            { education: education },
            [{ type: 'education', file: eduDocumentPreview.file, index: eduDocumentPreview.index }]
        );

        if (success) {
            const updated = [...education];
            const tempUrl = URL.createObjectURL(eduDocumentPreview.file);
            updated[eduDocumentPreview.index] = {
                ...updated[eduDocumentPreview.index],
                documentUrl: tempUrl,
                documentFile: eduDocumentPreview.file
            };
            setEducation(updated);
        }

        setUploadingEduDoc(null);
        setEduDocumentPreview({ show: false, file: null, index: null });
    };

    // Cancel document upload from preview
    const handleCancelExperienceDocument = () => {
        setExpDocumentPreview({ show: false, file: null, index: null });
    };

    const handleCancelEducationDocument = () => {
        setEduDocumentPreview({ show: false, file: null, index: null });
    };

    // View document in modal
    const handleViewExperienceDocument = (url, index) => {
        const experienceItem = experience[index];
        setExpDocumentView({
            show: true,
            url: url,
            fileName: experienceItem?.documentFile?.name || `${experienceItem.company}_document.pdf`,
            type: 'experience',
            index: index
        });
    };

    const handleViewEducationDocument = (url, index) => {
        const educationItem = education[index];
        setEduDocumentView({
            show: true,
            url: url,
            fileName: educationItem?.documentFile?.name || `${educationItem.degree}_document.pdf`,
            type: 'education',
            index: index
        });
    };

    // Close document view modal
    const handleCloseDocumentView = () => {
        setExpDocumentView({ show: false, url: '', fileName: '', type: 'experience', index: null });
        setEduDocumentView({ show: false, url: '', fileName: '', type: 'education', index: null });
    };

    // Delete entire experience entry
    const handleRemoveExperience = async (index) => {
        if (!isApplicant) return;

        setServiceCall(true);
        try {
            const res = await fetch(`/api/users?id=${profile?._id}&index=${index}&type=experience&deleteType=entry`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                setServiceCall(false);
                mutated();
            } else {
                setServiceCall(false);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to delete experience",
                    },
                }));
            }
        } catch (err) {
            setServiceCall(false);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: "Something went wrong while deleting experience",
                },
            }));
        }
    };

    // Delete only experience document (keep the entry)
    const handleRemoveExperienceDocument = async (index) => {
        if (!isApplicant) return;

        setServiceCall(true);
        try {
            if (editingExperienceIndex === index) {
                setTempExperience(prev => ({
                    ...prev,
                    document: null,
                    documentUrl: ''
                }));
            }

            const res = await fetch(`/api/users?id=${profile?._id}&index=${index}&type=experience&deleteType=document`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                setServiceCall(false);
                mutated();
            } else {
                setServiceCall(false);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to delete experience document",
                    },
                }));
            }
        } catch (err) {
            setServiceCall(false);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: "Something went wrong while deleting experience document",
                },
            }));
        }
    };

    // Delete entire education entry
    const handleRemoveEducation = async (index) => {
        if (!isApplicant) return;

        setServiceCall(true);
        try {
            const res = await fetch(`/api/users?id=${profile?._id}&index=${index}&type=education&deleteType=entry`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                setServiceCall(false);
                mutated();
            } else {
                setServiceCall(false);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to delete education",
                    },
                }));
            }
        } catch (err) {
            setServiceCall(false);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: "Something went wrong while deleting education",
                },
            }));
        }
    };

    // Delete only education document (keep the entry)
    const handleRemoveEducationDocument = async (index) => {
        if (!isApplicant) return;

        setServiceCall(true);
        try {
            if (editingEducationIndex === index) {
                setTempEducation((prev) => ({
                    ...prev,
                    document: null,
                    documentUrl: ''
                }));
            }

            const res = await fetch(`/api/users?id=${profile?._id}&index=${index}&type=education&deleteType=document`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                setServiceCall(false);
                mutated();
            } else {
                setServiceCall(false);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Failed to delete education document",
                    },
                }));
            }
        } catch (err) {
            setServiceCall(false);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Failed",
                    message: "Something went wrong while deleting education document",
                },
            }));
        }
    };

    // Document Preview Modal Component (for new uploads)
    const DocumentPreviewModal = ({
        isOpen,
        onClose,
        onSave,
        file,
        type,
        index,
        uploading,
    }) => {
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }

            // Cleanup function
            return () => {
                document.body.style.overflow = "auto";
            };
        }, [isOpen]);

        if (!isOpen || !file) return null;

        const isPDF = file.type === "application/pdf";
        const fileUrl = URL.createObjectURL(file);

        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl w-full sm:w-[96%] md:w-[86%] lg:w-[76%] xl:w-[66%] h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-gray-50">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                            Preview {type === "experience" ? "Experience" : "Education"} Document
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-3 sm:p-4 bg-white">
                        {isPDF ? (
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border rounded-lg"
                                title="Document Preview"
                            />
                        ) : (
                            <div className="text-center py-10 px-4">
                                <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-700 font-medium text-sm sm:text-base">
                                    {file.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                    Preview not available for this file type. Click Save to upload the document.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-t bg-gray-50">
                        <div className="text-xs sm:text-sm text-gray-600 truncate">
                            <p><strong>File:</strong> {file.name}</p>
                            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <div className="flex justify-end gap-2 sm:gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center gap-2"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    "Save Document"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Update the DocumentViewModal component to handle Cloudinary URLs properly:
    const DocumentViewModal = ({
        isOpen,
        onClose,
        url,
        fileName,
        type,
        index
    }) => {
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }

            return () => {
                document.body.style.overflow = "auto";
            };
        }, [isOpen]);

        if (!isOpen || !url) return null;

        // Check if it's a Cloudinary URL and handle accordingly
        const isCloudinaryUrl = url.includes('cloudinary.com');

        // Determine file type
        const isPDF = url.toLowerCase().endsWith('.pdf') ||
            url.includes('.pdf?') ||
            (isCloudinaryUrl && url.includes('.pdf'));

        const isWord = url.toLowerCase().endsWith('.doc') ||
            url.toLowerCase().endsWith('.docx') ||
            url.includes('.doc?') ||
            url.includes('.docx?');

        // For Cloudinary PDFs, we need to add #view=FitH to the URL for proper iframe display
        const getPreviewUrl = () => {
            if (isPDF && isCloudinaryUrl) {
                // Add PDF viewer parameters for Cloudinary URLs
                if (!url.includes('/upload/')) return url;

                // Insert transformation before upload part
                const parts = url.split('/upload/');
                if (parts.length === 2) {
                    // Add PDF viewer flag and quality optimization
                    return `${parts[0]}/upload/fl_attachment,pg_1/${parts[1]}`;
                }
            }
            return url;
        };

        const previewUrl = getPreviewUrl();

        // Extract filename
        const getFileName = () => {
            if (fileName) return fileName;
            try {
                if (isCloudinaryUrl) {
                    // Extract from Cloudinary public_id
                    const urlObj = new URL(url);
                    const pathParts = urlObj.pathname.split('/');
                    const publicId = pathParts[pathParts.length - 1];
                    return publicId.split('_').slice(2).join('_') || 'document';
                }
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                return pathParts[pathParts.length - 1] || 'document';
            } catch {
                return 'document';
            }
        };

        const displayFileName = getFileName();

        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl w-full sm:w-[96%] md:w-[86%] lg:w-[76%] xl:w-[66%] h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-gray-50">
                        <div className="flex items-center gap-2">
                            <DocumentIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate max-w-[70%]">
                                {displayFileName}
                            </h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {isPDF ? 'PDF' : isWord ? 'Word' : 'Document'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={url}
                                download={displayFileName}
                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                title="Download document"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </a>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-3 sm:p-4 bg-white">
                        {isPDF ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border rounded-lg"
                                title="Document Preview"
                                onError={(e) => {
                                    console.error('PDF load error:', e);
                                    e.target.innerHTML = `
                                    <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                                        <DocumentIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p class="text-gray-700 font-medium text-sm sm:text-base">
                                            Could not load PDF preview
                                        </p>
                                        <p class="text-xs sm:text-sm text-gray-500 mt-2">
                                            The PDF may be protected or too large to preview.
                                        </p>
                                        <div class="flex gap-3 mt-4">
                                            <a href="${url}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Open in New Tab
                                            </a>
                                            <a href="${url}" download="${displayFileName}" 
                                               class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                Download PDF
                                            </a>
                                        </div>
                                    </div>
                                `;
                                }}
                            />
                        ) : isWord ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Word Document</h4>
                                <p className="text-gray-600 mb-4 max-w-md">
                                    Word documents cannot be previewed in the browser. Please download the file to view it.
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href={url}
                                        download={displayFileName}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        Download Word Document
                                    </a>
                                    <p className="text-xs text-gray-500">
                                        File: {displayFileName}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Document</h4>
                                <p className="text-gray-600 mb-4">
                                    This file type cannot be previewed in the browser.
                                </p>
                                <a
                                    href={url}
                                    download={displayFileName}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Download File
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-t bg-gray-50">
                        <div className="text-xs sm:text-sm text-gray-600 truncate">
                            <p><strong>Type:</strong> {type === "experience" ? "Experience Document" : "Education Document"}</p>
                            <p><strong>File:</strong> {displayFileName}</p>
                            <p><strong>Format:</strong> {isPDF ? 'PDF' : isWord ? 'Word Document' : 'Other'}</p>
                        </div>

                        <div className="flex justify-end gap-2 sm:gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Summary Handlers
    const handleSaveSummary = async () => {
        if (!isApplicant) return;

        const success = await updateProfileWithDocuments({ summary: tempSummary });
        if (success) {
            setEditingSummary(false);
            setSummary(tempSummary);
        }
    };

    const handleCancelSummary = () => {
        setEditingSummary(false);
        setTempSummary(summary);
    };

    // Experience Handlers
    const handleAddExperience = () => {
        if (!isApplicant) return;

        const newExperience = {
            company: '',
            location: '',
            role: '',
            logo: dummyLogos[0],
            startDate: '',
            endDate: '',
            description: '',
            showDescription: false,
            documentUrl: '',
            document: null
        };
        const updatedExperiences = [newExperience, ...experience];
        setExperience(updatedExperiences);
        setEditingExperienceIndex(0);
        setTempExperience(newExperience);
    };

    const handleEditExperience = (index) => {
        if (!isApplicant) return;

        setEditingExperienceIndex(index);
        setTempExperience({
            ...experience[index],
            document: null
        });
    };

    const handleSaveExperience = async (index) => {
        if (!isApplicant) return;

        const documents = [];
        if (tempExperience.document && tempExperience.document instanceof File) {
            documents.push({ type: 'experience', file: tempExperience.document, index: index });
        }

        const updatedExperience = {
            company: tempExperience.company,
            location: tempExperience.location,
            role: tempExperience.role,
            logo: tempExperience.logo,
            startDate: tempExperience.startDate,
            endDate: tempExperience.endDate,
            description: tempExperience.description,
            documentUrl: tempExperience.documentUrl,
            showDescription: experience[index]?.showDescription || false
        };

        const updated = [...experience];
        updated[index] = updatedExperience;
        const sortedExperiences = sortExperiences(updated);
        setExperience(sortedExperiences);
        setEditingExperienceIndex(null);

        const success = await updateProfileWithDocuments({ experience: sortedExperiences }, documents);
        if (!success) {
            setExperience(experience);
        } else {
            setTempExperience(prev => ({ ...prev, document: null }));
        }
    };

    const handleCancelExperience = () => {
        if (!isApplicant) return;

        if (editingExperienceIndex !== null && !experience[editingExperienceIndex]?.company) {
            setExperience(experience.filter((_, i) => i !== editingExperienceIndex));
        }
        setEditingExperienceIndex(null);
        setTempExperience({
            company: '',
            location: '',
            role: '',
            logo: dummyLogos[0],
            startDate: '',
            endDate: '',
            description: '',
            document: null,
            documentUrl: ''
        });
    };

    const handleExperienceChange = (e, field) => {
        if (!isApplicant) return;

        setTempExperience({ ...tempExperience, [field]: e.target.value });
    };

    const toggleDescription = (index) => {
        const updated = [...experience];
        updated[index].showDescription = !updated[index].showDescription;
        setExperience(updated);
    };

    // Education Handlers
    const handleAddEducation = () => {
        if (!isApplicant) return;

        const newEducation = {
            degree: '',
            board: '',
            startYear: '',
            endYear: '',
            documentUrl: '',
            document: null
        };
        const updatedEducation = [newEducation, ...education];
        setEducation(updatedEducation);
        setEditingEducationIndex(0);
        setTempEducation(newEducation);
    };

    const handleEditEducation = (index) => {
        if (!isApplicant) return;

        setEditingEducationIndex(index);
        setTempEducation({
            ...education[index],
            document: null
        });
    };

    const handleSaveEducation = async (index) => {
        if (!isApplicant) return;

        const documents = [];
        if (tempEducation.document && tempEducation.document instanceof File) {
            documents.push({ type: 'education', file: tempEducation.document, index: index });
        }

        const updatedEducation = {
            degree: tempEducation.degree,
            board: tempEducation.board,
            startYear: tempEducation.startYear,
            endYear: tempEducation.endYear,
            years: `${tempEducation.startYear} - ${tempEducation.endYear}`,
            documentUrl: tempEducation.documentUrl
        };

        const updated = [...education];
        updated[index] = updatedEducation;
        const sortedEducation = sortEducation(updated);
        setEducation(sortedEducation);
        setEditingEducationIndex(null);

        const success = await updateProfileWithDocuments({ education: sortedEducation }, documents);
        if (!success) {
            setEducation(education);
        } else {
            setTempEducation(prev => ({ ...prev, document: null }));
        }
    };

    const handleCancelEducation = () => {
        if (!isApplicant) return;

        if (editingEducationIndex !== null && !education[editingEducationIndex]?.degree) {
            setEducation(education.filter((_, i) => i !== editingEducationIndex));
        }
        setEditingEducationIndex(null);
        setTempEducation({
            degree: '',
            board: '',
            startYear: '',
            endYear: '',
            document: null,
            documentUrl: ''
        });
    };

    const handleEducationChange = (e, field) => {
        if (!isApplicant) return;

        setTempEducation({ ...tempEducation, [field]: e.target.value });
    };

    // Initialize tempSummary when editing starts
    useEffect(() => {
        if (editingSummary) {
            setTempSummary(summary);
        }
    }, [editingSummary, summary]);

    return (
        <div className="sm:px-4 sm:py-8 space-y-8 md:space-y-10 text-gray-700">
            {serviceCall && <Loader />}

            {/* Document Preview Modals (for new uploads) */}
            <DocumentPreviewModal
                isOpen={expDocumentPreview.show}
                onClose={handleCancelExperienceDocument}
                onSave={handleSaveExperienceDocument}
                file={expDocumentPreview.file}
                type="experience"
                index={expDocumentPreview.index}
                uploading={uploadingExpDoc === expDocumentPreview.index}
            />

            <DocumentPreviewModal
                isOpen={eduDocumentPreview.show}
                onClose={handleCancelEducationDocument}
                onSave={handleSaveEducationDocument}
                file={eduDocumentPreview.file}
                type="education"
                index={eduDocumentPreview.index}
                uploading={uploadingEduDoc === eduDocumentPreview.index}
            />

            {/* Document View Modals (for viewing uploaded documents) */}
            <DocumentViewModal
                isOpen={expDocumentView.show}
                onClose={handleCloseDocumentView}
                url={expDocumentView.url}
                fileName={expDocumentView.fileName}
                type={expDocumentView.type}
                index={expDocumentView.index}
            />

            <DocumentViewModal
                isOpen={eduDocumentView.show}
                onClose={handleCloseDocumentView}
                url={eduDocumentView.url}
                fileName={eduDocumentView.fileName}
                type={eduDocumentView.type}
                index={eduDocumentView.index}
            />

            {/* Summary Section */}
            <section className="bg-white rounded-xl p-2 sm:p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Summary of {profile?.name || 'Your Profile'}</h3>
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
                            <div className="flex space-x-2">
                                {isApplicant && (
                                    <button
                                        onClick={() => { setEditingSummary(true); setTempSummary(summary); }}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        disabled={isAddingOrEditing}
                                    >
                                        <PencilIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-gray-600'}`} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {editingSummary ? (
                    <div className="space-y-4">
                        <textarea
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg text-base text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
                            rows={6}
                            value={tempSummary}
                            onChange={(e) => setTempSummary(e.target.value)}
                            placeholder="Write a comprehensive summary about your professional journey..."
                        />
                    </div>
                ) : (
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {summary}
                    </p>
                )}
            </section>

            {/* Experience Section */}
            <section className="bg-white rounded-xl p-2 sm:p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">EXPERIENCE</h3>
                    <div className="flex space-x-2">
                        {isApplicant && (
                            <button
                                onClick={handleAddExperience}
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                                disabled={isAddingOrEditing}
                            >
                                <PlusIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-white'}`} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    {experience.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No experience added yet. {isApplicant && "Click the '+' button to add one."}</p>
                    ) : (
                        experience.map((exp, index) => {
                            const isPresent = exp.endDate?.toLowerCase() === "present";

                            return (
                                <div key={index} className="flex flex-col border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                                    {editingExperienceIndex === index ? (
                                        <div className="flex flex-col gap-3 w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                                    <input
                                                        id={`company-${index}`}
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={tempExperience.company}
                                                        onChange={(e) => handleExperienceChange(e, 'company')}
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`location-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                    <input
                                                        id={`location-${index}`}
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={tempExperience.location}
                                                        onChange={(e) => handleExperienceChange(e, 'location')}
                                                        placeholder="Location"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                    <input
                                                        id={`role-${index}`}
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={tempExperience.startDate}
                                                        onChange={(e) => handleExperienceChange(e, 'startDate')}
                                                    />
                                                </div>

                                                {!isPresent && (
                                                    <div>
                                                        <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                            End Date
                                                        </label>
                                                        <input
                                                            id={`endDate-${index}`}
                                                            type="month"
                                                            className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            value={tempExperience.endDate || ""}
                                                            onChange={(e) => handleExperienceChange(e, 'endDate')}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center mt-1">
                                                    <input
                                                        id={`current-${index}`}
                                                        type="checkbox"
                                                        checked={tempExperience.endDate?.toLowerCase() === "present"}
                                                        onChange={(e) => {
                                                            handleExperienceChange({
                                                                target: { value: e.target.checked ? "Present" : "" },
                                                            }, 'endDate');
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                                                        Currently working here
                                                    </label>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        id={`description-${index}`}
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                                                        rows={4}
                                                        value={tempExperience.description}
                                                        onChange={(e) => handleExperienceChange(e, 'description')}
                                                        placeholder="Describe your responsibilities and achievements in this role."
                                                    />
                                                </div>

                                                {/* Document Upload for Experience */}
                                                {isApplicant && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Experience Document
                                                        </label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={(e) => handleExperienceDocumentChange(e, index)}
                                                                className="hidden"
                                                                id={`exp-doc-${index}`}
                                                            />
                                                            <label
                                                                htmlFor={`exp-doc-${index}`}
                                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                                                            >
                                                                <DocumentArrowUpIcon className="w-4 h-4" />
                                                                {tempExperience.document ? 'Change Document' : 'Upload Document'}
                                                            </label>

                                                            {tempExperience.documentUrl && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleViewExperienceDocument(tempExperience.documentUrl, index)}
                                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200"
                                                                    >
                                                                        <DocumentIcon className="w-4 h-4" />
                                                                        View Document
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveExperienceDocument(index)}
                                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                                        aria-label="Remove document"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {tempExperience.document
                                                                ? `Selected: ${tempExperience.document.name}`
                                                                : 'Upload experience certificate, offer letter, or relevant document (PDF/DOC, max 5MB)'
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {isApplicant && (
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
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col w-full">
                                            <div className="flex items-start justify-between w-full">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <img
                                                        src={exp.logo || dummyLogos[index % dummyLogos.length] || "https://placehold.co/48x48/F0F0F0/000000?text=Logo"}
                                                        alt={`${exp.company} Logo`}
                                                        className="w-12 h-12 object-contain border border-gray-200 rounded-full p-1 bg-white shadow-sm"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/F0F0F0/000000?text=Logo'; }}
                                                    />
                                                    <div>
                                                        <h4 className="text-base font-semibold text-gray-900">{exp.role}</h4>
                                                        <p className="text-sm text-gray-700">
                                                            {exp.company} • {exp.location}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {exp.startDate} – {isPresent ? (
                                                                <span className="text-green-600 font-medium">Present</span>
                                                            ) : (
                                                                exp.endDate
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {isPresent && (
                                                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-md shadow-sm">
                                                        Currently Working
                                                    </span>
                                                )}

                                                {isApplicant && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditExperience(index)}
                                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                            aria-label="Edit experience"
                                                            disabled={isAddingOrEditing && editingExperienceIndex !== index}
                                                        >
                                                            <PencilIcon className={`w-5 h-5 ${isAddingOrEditing && editingExperienceIndex !== index ? 'text-gray-400' : 'text-blue-600'}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveExperience(index)}
                                                            className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                            aria-label="Delete experience"
                                                            disabled={isAddingOrEditing}
                                                        >
                                                            <TrashIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-red-600'}`} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3'>
                                                {exp.description && (
                                                    <div className="mt-2 flex-1">
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
                                                {/* Document display for non-editing mode */}
                                                {exp.documentUrl && (
                                                    <div className="mt-2 sm:mt-0">
                                                        <button
                                                            onClick={() => handleViewExperienceDocument(exp.documentUrl, index)}
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200"
                                                        >
                                                            <DocumentIcon className="w-4 h-4" />
                                                            View Document
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Document upload for non-editing mode */}
                                            {isApplicant && (!editingExperienceIndex && (exp.documentUrl === "" || !exp.documentUrl)) && (
                                                <div className="mt-3">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => handleExperienceDocumentChange(e, index)}
                                                        className="hidden"
                                                        id={`exp-doc-view-${index}`}
                                                    />
                                                    <label
                                                        htmlFor={`exp-doc-view-${index}`}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <DocumentArrowUpIcon className="w-4 h-4" />
                                                        Upload Document
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Qualification Section */}
            <section className="bg-white rounded-xl p-2 sm:p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">QUALIFICATION</h3>
                    <div className="flex space-x-2">
                        {isApplicant && (
                            <button
                                onClick={handleAddEducation}
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                                disabled={isAddingOrEditing}
                            >
                                <PlusIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-white'}`} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    {education.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No education added yet. {isApplicant && "Click the '+' button to add one."}</p>
                    ) : (
                        education.map((edu, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                                {editingEducationIndex === index ? (
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                                <input
                                                    id={`degree-${index}`}
                                                    className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempEducation.degree}
                                                    onChange={(e) => handleEducationChange(e, 'degree')}
                                                    placeholder="e.g., Bachelor's Degree"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`board-${index}`} className="block text-sm font-medium text-gray-700 mb-1">University/Board</label>
                                                <input
                                                    id={`board-${index}`}
                                                    className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={tempEducation.board}
                                                    onChange={(e) => handleEducationChange(e, 'board')}
                                                    placeholder="University/Board Name"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label htmlFor={`startYear-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                                                    <input
                                                        id={`startYear-${index}`}
                                                        type="month"
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={tempEducation.startYear}
                                                        onChange={(e) => handleEducationChange(e, 'startYear')}
                                                        placeholder="Start Year"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`endYear-${index}`} className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                                                    <input
                                                        id={`endYear-${index}`}
                                                        type="month"
                                                        className="w-full p-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={tempEducation.endYear}
                                                        onChange={(e) => handleEducationChange(e, 'endYear')}
                                                        placeholder="End Year"
                                                    />
                                                </div>
                                            </div>

                                            {/* Document Upload for Education */}
                                            {isApplicant && (
                                                <div className="md:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Education Document
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleEducationDocumentChange(e, index)}
                                                            className="hidden"
                                                            id={`edu-doc-${index}`}
                                                        />
                                                        <label
                                                            htmlFor={`edu-doc-${index}`}
                                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                                                        >
                                                            <DocumentArrowUpIcon className="w-4 h-4" />
                                                            {tempEducation.document ? 'Change Document' : 'Upload Document'}
                                                        </label>

                                                        {tempEducation.documentUrl && (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleViewEducationDocument(tempEducation.documentUrl, index)}
                                                                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200"
                                                                >
                                                                    <DocumentIcon className="w-4 h-4" />
                                                                    View Document
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveEducationDocument(index)}
                                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                                    aria-label="Remove document"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {tempEducation.document
                                                            ? `Selected: ${tempEducation.document.name}`
                                                            : 'Upload degree certificate, marksheet, or relevant document (PDF/DOC, max 5MB)'
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {isApplicant && (
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
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex-1">
                                            <h4 className="text-base font-semibold text-gray-900">{edu.degree}</h4>
                                            <p className="text-sm text-gray-700">{edu.board}</p>
                                            <p className="text-xs text-gray-500">{edu.years || `${edu.startYear} - ${edu.endYear}`}</p>

                                            {/* Document display for non-editing mode */}
                                            {edu.documentUrl && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => handleViewEducationDocument(edu.documentUrl, index)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200"
                                                    >
                                                        <DocumentIcon className="w-4 h-4" />
                                                        View Document
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {isApplicant && (
                                            <div className="flex space-x-2 ml-4">
                                                {/* Document upload for non-editing mode */}
                                                {!editingEducationIndex && (edu.documentUrl === "" || !edu.documentUrl) && (
                                                    <div className="mr-2">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleEducationDocumentChange(e, index)}
                                                            className="hidden"
                                                            id={`edu-doc-view-${index}`}
                                                        />
                                                        <label
                                                            htmlFor={`edu-doc-view-${index}`}
                                                            className="inline-flex items-center gap-1 px-2 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                                                            title="Upload Document"
                                                        >
                                                            <DocumentArrowUpIcon className="w-3 h-3" />
                                                            Upload
                                                        </label>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleEditEducation(index)}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                    aria-label="Edit education"
                                                    disabled={isAddingOrEditing && editingEducationIndex !== index}
                                                >
                                                    <PencilIcon className={`w-5 h-5 ${isAddingOrEditing && editingEducationIndex !== index ? 'text-gray-400' : 'text-blue-600'}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveEducation(index)}
                                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                    aria-label="Delete education"
                                                    disabled={isAddingOrEditing}
                                                >
                                                    <TrashIcon className={`w-5 h-5 ${isAddingOrEditing ? 'text-gray-400' : 'text-red-600'}`} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}