'use client';
import { PaperAirplaneIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';

export default function Chat({ candidate, company, onClose, onSendMessage, userRole = 'company' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isCandidateOnline, setIsCandidateOnline] = useState(true);
  const messagesEndRef = useRef(null);

  // Determine if current user is company or applicant
  const isCompany = userRole === 'company';
  const currentUser = isCompany ? company : candidate;
  const otherUser = isCompany ? candidate : company;

  // Load chat history from API
  const loadChatHistory = async () => {
    try {
      // Get the required IDs based on user role
      let applicantId, companyId, jobId;

      if (isCompany) {
        applicantId = candidate?.applicantId || candidate?._id;
        companyId = company?._id;
        jobId = candidate?.jobId;
      } else {
        applicantId = candidate?.applicantId || candidate?._id;
        companyId = company?._id || company?.companyId;
        jobId = candidate?.jobId || company?.jobId;
      }

      if (!applicantId || !companyId || !jobId) {
        console.error('Missing required data for chat');
        setIsLoadingMessages(false);
        return;
      }

      const params = new URLSearchParams({
        applicantId: applicantId,
        companyId: companyId,
        jobId: jobId
      });

      const response = await fetch(`/api/chat?${params}`);
      const result = await response.json();

      if (result.success) {
        const transformedMessages = result.chat.messages.map(msg => ({
          id: msg._id,
          role: msg.senderType === 'company' ? 'company' : 'candidate',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          senderId: msg.senderId,
          senderName: msg.senderName,
          read: msg.read
        }));

        if (transformedMessages.length === 0) {
          const systemMessage = isCompany
            ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
            : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

          transformedMessages.push({
            id: 'system-1',
            role: 'system',
            content: systemMessage,
            timestamp: new Date()
          });
        }

        setMessages(transformedMessages);
      } else {
        throw new Error(result.error || 'Failed to load chat history');
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      const systemMessage = isCompany
        ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
        : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

      setMessages([
        {
          id: 'system-1',
          role: 'system',
          content: systemMessage,
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load chat history only on initial mount
  useEffect(() => {
    loadChatHistory();
  }, []); // Empty dependency array - load only once

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: `temp-${Date.now()}`,
      role: isCompany ? 'company' : 'candidate',
      content: input,
      timestamp: new Date(),
      senderId: currentUser?._id,
      senderName: isCompany ? company?.name : candidate?.applicantName,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const success = await onSendMessage(input);

      if (success) {
        // Update message status to sent
        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, status: 'sent' }
              : msg
          )
        );

        // Reload messages after a short delay to get any responses
        setTimeout(() => {
          loadChatHistory();
        }, 1000);
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, status: 'failed' }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    }

    setLoading(false);
  };

  // Poll for new messages without showing loader
  useEffect(() => {
    const pollInterval = setInterval(() => {
      loadChatHistory();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    if (today.toDateString() === messageDate.toDateString()) {
      return 'Today';
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === messageDate.toDateString()) {
      return 'Yesterday';
    }

    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const shouldShowDate = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();
    return currentDate !== previousDate;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <CheckIcon className="w-3 h-3 text-gray-500" />;
      case 'delivered':
        return <><CheckIcon className="w-3 h-3 text-gray-500" /><CheckIcon className="w-3 h-3 -ml-2 text-gray-500" /></>;
      case 'read':
        return <><CheckIcon className="w-3 h-3 text-blue-500" /><CheckIcon className="w-3 h-3 -ml-2 text-blue-500" /></>;
      case 'failed':
        return <span className="text-xs text-red-500">!</span>;
      default:
        return null;
    }
  };

  // Get profile image based on user role and type
  const getProfileImage = (user, type, showOwnProfile = false) => {
    // For company user in chat header: show candidate profile
    // For applicant user in chat header: show company profile
    // For messages: show profile based on message sender

    let profileImage = null;
    let initials = '?';
    let bgColor = 'bg-gray-500';

    if (type === 'candidate') {
      // Candidate profile - green background
      profileImage = user?.profileImage;
      initials = getInitials(user?.applicantName || user?.name);
      bgColor = 'bg-green-500';
    } else if (type === 'company') {
      // Company profile - blue background
      profileImage = user?.profileImage || user?.logo;
      initials = getInitials(user?.name);
      bgColor = 'bg-blue-500';
    }

    // Show profile image if available
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={type === 'candidate' ? user?.applicantName : user?.name}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    // Fallback to initials
    return (
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white text-xs font-semibold`}>
        {initials}
      </div>
    );
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const getOnlineStatus = () => {
    if (isCandidateOnline) {
      return { text: 'Online', color: 'bg-green-400' };
    } else {
      const lastSeen = new Date(Date.now() - 600000);
      return {
        text: `Last seen ${formatTime(lastSeen)}`,
        color: 'bg-gray-400'
      };
    }
  };

  const getHeaderInfo = () => {
    if (isCompany) {
      // Company chat: Show candidate info in header
      return {
        name: candidate?.applicantName || 'Candidate',
        title: candidate?.jobTitle || 'Job Application',
        type: 'candidate', // Show candidate profile
        user: candidate
      };
    } else {
      // Applicant chat: Show company info in header
      return {
        name: company?.name || 'Company',
        title: candidate?.jobTitle || 'Job Application',
        type: 'company', // Show company profile
        user: company
      };
    }
  };

  // Get profile for message display
  const getMessageProfile = (messageRole) => {
    if (messageRole === 'company') {
      // Company message: show company profile
      return {
        user: company,
        type: 'company'
      };
    } else if (messageRole === 'candidate') {
      // Candidate message: show candidate profile
      return {
        user: candidate,
        type: 'candidate'
      };
    }
    return null;
  };

  const headerInfo = getHeaderInfo();
  const onlineStatus = getOnlineStatus();

  return (
    <div className="fixed bottom-0 right-0 z-50 h-[80vh] w-full max-w-md m-4 rounded-lg shadow-xl flex flex-col bg-white border border-gray-200">
      {/* Header - WhatsApp-like */}
      <div className="p-4 border-b flex justify-between items-center bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          {/* Profile Image with Online Status - Show other user's profile */}
          <div className="relative">
            {getProfileImage(headerInfo.user, headerInfo.type)}
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${onlineStatus.color}`}></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {headerInfo.name}
            </h2>
            <p className="text-green-100 text-xs flex items-center gap-1">
              <span>{onlineStatus.text}</span>
              <span>•</span>
              <span>{headerInfo.title}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-green-700 transition-colors"
          aria-label="Close Chat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area - WhatsApp-like */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {isLoadingMessages ? (
          // Show loader only on initial load
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Start a conversation with {headerInfo.name}</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const showDate = shouldShowDate(message, previousMessage);
            const isOwnMessage = isCompany ? message.role === 'company' : message.role === 'candidate';
            const messageProfile = getMessageProfile(message.role);

            return (
              <div key={message.id}>
                {/* Date Separator */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  {/* Other User Profile Image - Only show for received messages */}
                  {!isOwnMessage && message.role !== 'system' && messageProfile && (
                    <div className="flex-shrink-0">
                      {getProfileImage(messageProfile.user, messageProfile.type)}
                    </div>
                  )}

                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {/* Sender Name - Only show for received messages */}
                    {!isOwnMessage && message.role !== 'system' && (
                      <span className="text-xs text-gray-600 mb-1 ml-1">
                        {message.senderName || (message.role === 'company' ? company?.name : candidate?.applicantName)}
                      </span>
                    )}

                    {/* Message Content */}
                    <div
                      className={`p-1.5 rounded-2xl text-sm break-words ${isOwnMessage
                        ? 'bg-green-500 text-white rounded-br-md'
                        : message.role === 'system'
                          ? 'bg-yellow-100 text-yellow-800 text-center border border-yellow-200 rounded-lg'
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}
                    >
                      {message.content}
                    </div>

                    {/* Message Time and Status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {isOwnMessage && message.status && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(message.status)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Own Profile Image - Only show for sent messages */}
                  {isOwnMessage && message.role !== 'system' && messageProfile && (
                    <div className="flex-shrink-0">
                      {getProfileImage(messageProfile.user, messageProfile.type, true)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* No loading indicator for sending - message shows "Sending..." status instead */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - WhatsApp-like */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex items-center gap-2">
        <div className="flex-1 border border-gray-300 rounded-3xl px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
          <input
            className="w-full text-sm focus:outline-none bg-transparent"
            value={input}
            placeholder={`Message ${headerInfo.name}...`}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          disabled={loading || !input.trim()}
          aria-label="Send Message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}