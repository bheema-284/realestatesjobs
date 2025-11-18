'use client';
import React, { useState, useCallback, useMemo, useContext } from 'react';
import {
  TrashIcon,
  PlusIcon,
  DocumentPlusIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/loading';
import RootContext from '../config/rootcontext';
import Chat from '../common/chat';

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

// Extract application item component - READ ONLY with withdraw button
const ApplicationItem = React.memo(({
  application,
  index,
  onWithdraw,
  onOpenChat,
  serviceCall,
  canEdit
}) => {
  console.log('ApplicationItem rendering:', index); // Debug log

  // Format the applied date for display
  const formatAppliedDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <li className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-gray-900">{application.jobTitle}</h4>
          <p className="text-sm text-gray-700 mt-1">{application.company}</p>

          {/* Display category if available */}
          {application.category && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Category:</span> {application.category}
            </p>
          )}

          {/* Display job description if available */}
          {application.jobDescription && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Job Description:</span> {application.jobDescription}
            </p>
          )}

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
                <span className="font-medium">Applied:</span> {formatAppliedDate(application.appliedDate)}
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

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          {/* Chat Button - Always visible for applicants */}
          {canEdit && (
            <button
              onClick={() => onOpenChat(application)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Chat with Company"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </button>
          )}

          {/* Withdraw Button - Only for applicants */}
          {canEdit && (
            <button
              onClick={() => onWithdraw(application.jobId)}
              disabled={serviceCall}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
              title="Withdraw Application"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
});

ApplicationItem.displayName = 'ApplicationItem';

export default function Applications({ profile, setRootContext, mutated }) {
  const [applications, setApplications] = useState(profile.applications || []);
  const [serviceCall, setServiceCall] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { rootContext } = useContext(RootContext);
  const canEdit = rootContext?.user?.role === "applicant";

  // Handle opening chat with company
  const handleOpenChat = useCallback((application) => {
    // Prepare company data for chat - ensure all required fields
    const companyData = {
      ...application.companyDetails, // Spread existing company details first
      _id: application.companyId || application._id,
      name: application.companyDetails.name || application.companyName,
      profileImage: application.companyDetails.profileImage || application.companyLogo,
      jobTitle: application.jobTitle,
      jobId: application.jobId
    };

    // Prepare applicant data for chat - ensure all required fields
    const applicantData = {
      applicantId: profile._id,
      _id: profile._id, // Add _id as fallback
      applicantName: profile.name || profile.email || 'Applicant',
      profileImage: profile.profileImage,
      jobTitle: application.jobTitle,
      jobId: application.jobId
    };

    // Validate required fields
    if (!companyData._id || !applicantData.applicantId || !application.jobId) {
      console.error('Missing required chat data:', {
        companyId: companyData._id,
        applicantId: applicantData.applicantId,
        jobId: application.jobId
      });

      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Cannot open chat: Missing required data"
        }
      }));
      return;
    }

    setSelectedCompany({
      company: companyData,
      applicant: applicantData,
      jobId: application.jobId
    });
    setIsChatOpen(true);
  }, [profile, setRootContext]);

  // Handle closing chat
  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setSelectedCompany(null);
  }, []);

  // Handle sending message as applicant
  const handleSendMessage = async (message) => {
    if (!selectedCompany) {
      console.error('No selected company for chat');
      return false;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId: profile._id,
          companyId: selectedCompany.company._id,
          jobId: selectedCompany.jobId,
          jobTitle: selectedCompany.company.jobTitle || selectedCompany.applicant.jobTitle,
          message: message,
          senderType: 'applicant',
          senderId: profile._id,
          senderName: profile.name || profile.email
        })
      });

      const result = await response.json();

      if (result.success) {
        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Message sent successfully"
          }
        }));
        return true;
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Chat message error:', error);
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Failed to send message"
        }
      }));
      return false;
    }
  };

  // API call to delete a single application using URL parameters
  const deleteApplication = async (jobId) => {
    if (!canEdit) return false;

    setServiceCall(true);
    try {
      const res = await fetch(`/api/jobs?userId=${profile._id}&jobId=${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      setServiceCall(false);

      if (res.ok && data.success) {
        const updatedApplications = applications.filter(app => app.jobId !== jobId);
        setApplications(updatedApplications);
        mutated();

        setRootContext(prevContext => ({
          ...prevContext,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: data.message || "Application withdrawn successfully"
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
            message: data.error || "Failed to withdraw application"
          }
        }));
        return false;
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setServiceCall(false);
      setRootContext(prevContext => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Something went wrong while withdrawing application"
        }
      }));
      return false;
    }
  };

  const handleWithdraw = useCallback(async (jobId) => {
    if (!canEdit) return;

    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    await deleteApplication(jobId);
  }, [applications, canEdit]);

  // Memoize the applications list
  const applicationsList = useMemo(() => {
    return applications.map((application, idx) => (
      <ApplicationItem
        key={application.jobId || application.id || idx}
        application={application}
        index={idx}
        onWithdraw={handleWithdraw}
        onOpenChat={handleOpenChat}
        serviceCall={serviceCall}
        canEdit={canEdit}
      />
    ));
  }, [applications, serviceCall, handleWithdraw, handleOpenChat, canEdit]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {serviceCall && <Loading />}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 mt-5 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-blue-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-blue-800 border-b pb-3 border-blue-300">
            {canEdit ? "My Real Estate Job Applications" : "Job Applications"}
          </h2>

          {canEdit && applications.length > 0 && (
            <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              {applications.length} application{applications.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <ul className="space-y-4">
            {applicationsList}
          </ul>
        ) : (
          <div className="text-center py-8">
            <DocumentPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {canEdit ? "No job applications available." : "No applications found."}
            </p>

            {canEdit && (
              <p className="text-sm text-gray-500">
                Start applying to real estate jobs to see your applications here.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chat Component */}
      {isChatOpen && selectedCompany && (
        <Chat
          candidate={selectedCompany.applicant}
          company={selectedCompany.company}
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
          userRole="applicant" // Add this prop
        />
      )}
    </div>
  );
}