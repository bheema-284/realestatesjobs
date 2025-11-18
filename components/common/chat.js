'use client';
import { PaperAirplaneIcon, XMarkIcon, CheckIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';

export default function Chat({ candidate, company, onClose, onSendMessage, userRole = 'company' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isCandidateOnline, setIsCandidateOnline] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const longPressTimerRef = useRef(null);

  // Determine if current user is company or applicant
  const isCompany = userRole === 'company';
  const currentUser = isCompany ? company : candidate;
  const otherUser = isCompany ? candidate : company;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMessageMenu(false);
        setSelectedMessage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

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
        setChatId(result.chat.id); // Store chatId for deletion

        const transformedMessages = result.chat.messages.map(msg => ({
          id: msg._id,
          role: msg.senderType === 'company' ? 'company' : 'candidate',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          senderId: msg.senderId,
          senderName: msg.senderName,
          read: msg.read,
          isSelected: false
        }));

        if (transformedMessages.length === 0) {
          const systemMessage = isCompany
            ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
            : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

          transformedMessages.push({
            id: 'system-1',
            role: 'system',
            content: systemMessage,
            timestamp: new Date(),
            isSelected: false
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
          timestamp: new Date(),
          isSelected: false
        },
      ]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load chat history only on initial mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Delete individual message (no confirmation for single messages)
  const deleteMessage = async (messageId) => {
    try {
      if (!chatId) {
        console.error('Chat ID not available');
        return false;
      }

      const response = await fetch(`/api/chat?chatId=${chatId}&messageId=${messageId}&type=message`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // Remove message from local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        console.log('Message deleted successfully');
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      return false;
    }
  };

  // Delete multiple messages (no confirmation for multiple messages)
  const deleteMultipleMessages = async (messageIds) => {
    try {
      if (!chatId) {
        console.error('Chat ID not available');
        return false;
      }

      // Delete messages one by one
      const deletePromises = messageIds.map(messageId =>
        deleteMessage(messageId)
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        console.log('All selected messages deleted successfully');
        return true;
      } else {
        throw new Error('Some messages failed to delete');
      }
    } catch (error) {
      console.error('Delete multiple messages error:', error);
      return false;
    }
  };

  // Delete entire chat (WITH confirmation)
  const deleteChat = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entire chat? This action cannot be undone.');
    if (!confirmDelete) return false;

    try {
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
        console.error('Missing required data for chat deletion');
        return false;
      }

      const response = await fetch(`/api/chat?applicantId=${applicantId}&companyId=${companyId}&jobId=${jobId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessages([]);
        setChatId(null);
        console.log('Chat deleted successfully');
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      return false;
    }
  };

  // FIXED: Handle message selection with proper state synchronization
  const handleMessageSelect = (messageId) => {
    setSelectedMessages(prev => {
      const newSelectedMessages = new Set(prev);

      if (newSelectedMessages.has(messageId)) {
        newSelectedMessages.delete(messageId);
      } else {
        newSelectedMessages.add(messageId);
      }

      return newSelectedMessages;
    });

    // Update message selection state
    setMessages(prevMessages => prevMessages.map(msg => ({
      ...msg,
      isSelected: msg.id === messageId ? !msg.isSelected : msg.isSelected
    })));
  };

  // FIXED: Update selection mode based on selectedMessages count
  useEffect(() => {
    if (selectedMessages.size > 0) {
      setIsSelectionMode(true);
    } else {
      setIsSelectionMode(false);
    }
  }, [selectedMessages.size]);

  // Handle message long press/right click for selection
  const handleMessageLongPress = (message, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
    handleMessageSelect(message.id);
  };

  // Handle message menu click
  const handleMessageMenuClick = (message, event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedMessage(message);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setShowMessageMenu(true);
  };

  // Handle delete single message (no confirmation)
  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    // For temporary messages (sending), just remove from local state
    if (selectedMessage.id.startsWith('temp-') || selectedMessage.id.startsWith('error-')) {
      setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
      setShowMessageMenu(false);
      setSelectedMessage(null);
      return;
    }

    // Delete without confirmation for single messages
    await deleteMessage(selectedMessage.id);
    setShowMessageMenu(false);
    setSelectedMessage(null);
  };

  // Handle delete selected messages (no confirmation)
  const handleDeleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    const messageIds = Array.from(selectedMessages);

    // Delete without confirmation for multiple messages
    await deleteMultipleMessages(messageIds);

    // Clear selection after deletion
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  // Handle delete entire chat (WITH confirmation)
  const handleDeleteChat = async () => {
    await deleteChat();
    setShowMessageMenu(false);
    setSelectedMessage(null);
  };

  // Clear selection mode
  const clearSelection = () => {
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isSelected: false })));
  };

  // Improved long press handler
  const handleMouseDown = (message, event) => {
    if (event.button !== 0) return; // Left click only

    longPressTimerRef.current = setTimeout(() => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
      handleMessageSelect(message.id);
    }, 500); // 500ms for long press
  };

  const handleMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Add global mouse up listener to prevent stuck timers
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

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
      status: 'sending',
      isSelected: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const success = await onSendMessage(input);

      if (success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, status: 'sent' }
              : msg
          )
        );

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

  const getProfileImage = (user, type) => {
    let profileImage = null;
    let initials = '?';
    let bgColor = 'bg-gray-500';

    if (type === 'candidate') {
      profileImage = user?.profileImage || user?.applicantProfile?.profileImage;
      initials = getInitials(user?.applicantName || user?.name);
      bgColor = 'bg-green-500';
    } else if (type === 'company') {
      profileImage = user?.profileImage || user?.logo;
      initials = getInitials(user?.name);
      bgColor = 'bg-blue-500';
    }

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={type === 'candidate' ? (user?.applicantName || user?.name) : user?.name}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

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

  // Updated function to handle header display based on user role
  const getHeaderInfo = () => {
    if (isCompany) {
      // Company is viewing chat - show applicant's profile and position
      return {
        name: candidate?.applicantName || candidate?.name || 'Candidate',
        title: candidate?.position || candidate?.jobTitle || 'Job Applicant',
        type: 'candidate',
        user: candidate,
        profileImage: candidate?.profileImage,
        position: candidate?.position
      };
    } else {
      // Applicant is viewing chat - show company's profile and job title
      return {
        name: company?.name || 'Company',
        title: candidate?.jobTitle || company?.position || 'Job Opportunity',
        type: 'company',
        user: company,
        profileImage: company?.profileImage,
        position: candidate?.jobTitle
      };
    }
  };

  const getMessageProfile = (messageRole) => {
    if (messageRole === 'company') {
      return {
        user: company,
        type: 'company'
      };
    } else if (messageRole === 'candidate') {
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
      {/* Header - Changes based on selection mode */}
      <div className="p-4 border-b flex justify-between items-center bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          {isSelectionMode ? (
            // Selection mode header
            <>
              <button
                onClick={clearSelection}
                className="text-white hover:text-gray-200 p-1"
                aria-label="Cancel Selection"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedMessages.size} selected
                </h2>
                <p className="text-green-100 text-xs">
                  Select messages to delete
                </p>
              </div>
            </>
          ) : (
            // Normal header - Updated to show correct profile and position
            <>
              <div className="relative">
                {getProfileImage(headerInfo.user, headerInfo.type)}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${onlineStatus.color}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {userRole === "company" ? headerInfo.user.applicantProfile?.name : headerInfo?.name}
                </h2>
                <p className="text-green-100 text-xs flex items-center gap-1 truncate">
                  <span className="truncate">{userRole === "company" ? headerInfo?.user?.applicantProfile?.position : headerInfo?.title}</span>
                  <span>•</span>
                  <span>{onlineStatus.text}</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSelectionMode ? (
            // Selection mode actions
            <>
              <button
                onClick={handleDeleteSelectedMessages}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Delete Selected Messages"
                disabled={selectedMessages.size === 0}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            // Normal mode actions
            <>
              <button
                onClick={handleDeleteChat}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Delete Chat"
                title="Delete Chat"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Close Chat"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {isLoadingMessages ? (
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
            const isSelected = selectedMessages.has(message.id);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                <div className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  {!isOwnMessage && message.role !== 'system' && messageProfile && (
                    <div className="flex-shrink-0">
                      {getProfileImage(messageProfile.user, messageProfile.type)}
                    </div>
                  )}

                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {/* Message Bubble with Selection */}
                    <div className="group relative">
                      <div
                        className={`p-1.5 rounded-3xl items-center text-sm break-words cursor-pointer transition-all duration-200 ${isOwnMessage
                          ? `bg-green-500 text-white rounded-br-lg ${isSelected ? 'ring-2 ring-green-300 ring-offset-2' : ''}`
                          : message.role === 'system'
                            ? 'bg-yellow-100 text-yellow-800 text-center border border-yellow-200 rounded-lg'
                            : `bg-white text-gray-800 rounded-bl-lg shadow-sm ${isSelected ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`
                          }`}
                        onClick={() => {
                          if (isSelectionMode) {
                            handleMessageSelect(message.id);
                          }
                        }}
                        onContextMenu={(e) => handleMessageLongPress(message, e)}
                        onMouseDown={(e) => handleMouseDown(message, e)}
                      >
                        {message.content}

                        {/* Selection checkbox */}
                        {isSelectionMode && (
                          <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full border-2 ${isSelected
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-400'
                            } flex items-center justify-center`}>
                            {isSelected && (
                              <CheckIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Three dots menu for own messages (only show when not in selection mode) */}
                      {isOwnMessage && !isSelectionMode && (
                        <button
                          onClick={(e) => handleMessageMenuClick(message, e)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                        >
                          <EllipsisHorizontalIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>

                    <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? 'text-gray-500' : 'text-gray-400'}`}>
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

        {/* Message Context Menu */}
        {showMessageMenu && selectedMessage && (
          <div
            ref={menuRef}
            className="fixed bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 min-w-[120px]"
            style={{
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
              transform: 'translate(-100%, -100%)'
            }}
          >
            <button
              onClick={() => {
                setIsSelectionMode(true);
                handleMessageSelect(selectedMessage.id);
                setShowMessageMenu(false);
              }}
              className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              Select
            </button>
            <button
              onClick={handleDeleteMessage}
              className="w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Hide when in selection mode */}
      {!isSelectionMode && (
        <form onSubmit={sendMessage} className="p-3 border-t bg-white flex items-center gap-2">
          <div className="flex-1 border border-gray-300 rounded-3xl px-3 py-1 bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
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
      )}
    </div>
  );
}