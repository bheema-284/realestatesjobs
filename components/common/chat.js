'use client';
import { PaperAirplaneIcon, XMarkIcon, CheckIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';

// Debounce hook with improved stability
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (valueRef.current !== debouncedValue) {
        setDebouncedValue(valueRef.current);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue]);

  return debouncedValue;
};

// Custom hook for responsive dimensions
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    windowSize
  };
};

// Memoized message component with responsive design
const MessageItem = memo(({
  message,
  isOwnMessage,
  isSelectionMode,
  isSelected,
  onMessageSelect,
  onMessageMenuClick,
  onMouseDown,
  getStatusIcon,
  formatTime,
  getProfileImage,
  getMessageProfile,
  isMobile
}) => {
  const messageProfile = getMessageProfile(message.role);
  
  const handleMessageClick = useCallback(() => {
    if (isSelectionMode) {
      onMessageSelect(message.id);
    } else if (message.status === 'failed') {
      // Retry logic can be handled here
    }
  }, [isSelectionMode, onMessageSelect, message.id, message.status]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSelectionMode) {
      onMessageMenuClick(message, e);
    }
  }, [isSelectionMode, onMessageMenuClick, message]);

  const handleMouseDown = useCallback((e) => {
    onMouseDown(message, e);
  }, [onMouseDown, message]);

  return (
    <div className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isMobile ? 'px-2' : 'px-1'}`}>
      {!isOwnMessage && message.role !== 'system' && messageProfile && (
        <div className="flex-shrink-0">
          {getProfileImage(messageProfile.user, messageProfile.type)}
        </div>
      )}

      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} ${isMobile ? 'max-w-[85%]' : 'max-w-[70%]'}`}>
        <div className="group relative">
          <div
            className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'} rounded-2xl break-words cursor-pointer transition-all duration-200 ${
              isOwnMessage
                ? `bg-green-500 text-white rounded-br-md ${isSelected ? 'ring-2 ring-green-300 ring-offset-1' : ''}`
                : message.role === 'system'
                  ? 'bg-yellow-100 text-yellow-800 text-center border border-yellow-200 rounded-lg'
                  : `bg-white text-gray-800 rounded-bl-md shadow-sm ${isSelected ? 'ring-2 ring-blue-300 ring-offset-1' : ''}`
            }`}
            onClick={handleMessageClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
          >
            {message.content}

            {isSelectionMode && (
              <div
                className={`absolute -top-1 -left-1 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full border-2 ${
                  isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-400'
                } flex items-center justify-center`}
              >
                {isSelected && <CheckIcon className={isMobile ? "w-2 h-2 text-white" : "w-3 h-3 text-white"} />}
              </div>
            )}
          </div>

          {isOwnMessage && message.role !== 'system' && !isSelectionMode && (
            <button
              onClick={handleContextMenu}
              className={`absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 rounded-full ${isMobile ? 'p-0.5' : 'p-1'} hover:bg-gray-300`}
            >
              <EllipsisHorizontalIcon className={isMobile ? "w-3 h-3 text-gray-600" : "w-4 h-4 text-gray-600"} />
            </button>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1 ${isMobile ? 'text-[10px]' : 'text-xs'} ${isOwnMessage ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwnMessage && message.role !== 'system' && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">{getStatusIcon(message.status, message)}</div>
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
  );
});

MessageItem.displayName = 'MessageItem';

// Memoized date separator
const DateSeparator = memo(({ date, isMobile }) => (
  <div className="flex justify-center my-4">
    <span className={`bg-gray-200 text-gray-600 ${isMobile ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'} rounded-full`}>
      {date}
    </span>
  </div>
));

DateSeparator.displayName = 'DateSeparator';

// Loading spinner component
const LoadingSpinner = memo(({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-6 w-6 border-b-2',
    large: 'h-8 w-8 border-b-2'
  };

  return (
    <div className={`animate-spin rounded-full border-gray-300 ${sizeClasses[size]}`}></div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

function Chat({ candidate, company, onClose, onSendMessage, userRole = 'company' }) {
  // State declarations
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isCandidateOnline, setIsCandidateOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isChatActive, setIsChatActive] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Responsive hook
  const { isMobile, isTablet, isDesktop, windowSize } = useResponsive();

  // Refs for stable references
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);
  const chatDeletedRef = useRef(false);
  const hasUnreadMessagesRef = useRef(false);
  const lastLoadTimeRef = useRef(0);
  const pollIntervalRef = useRef(null);
  const lastActionTimeRef = useRef(0);
  const visibilityTimeoutRef = useRef(null);
  
  // Stable callback refs to prevent recreation
  const candidateRef = useRef(candidate);
  const companyRef = useRef(company);
  const userRoleRef = useRef(userRole);
  const onSendMessageRef = useRef(onSendMessage);

  // Update refs when props change
  useEffect(() => {
    candidateRef.current = candidate;
    companyRef.current = company;
    userRoleRef.current = userRole;
    onSendMessageRef.current = onSendMessage;
  }, [candidate, company, userRole, onSendMessage]);

  const isCompany = userRoleRef.current === 'company';
  const currentUser = isCompany ? companyRef.current : candidateRef.current;

  // Debounced chatId for polling
  const debouncedChatId = useDebounce(chatId, 3000);

  // Responsive dimensions
  const chatDimensions = useMemo(() => {
    if (isMobile) {
      return {
        height: isExpanded ? '100vh' : '70vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        borderRadius: isExpanded ? '0' : '0.5rem 0.5rem 0 0'
      };
    } else if (isTablet) {
      return {
        height: '80vh',
        width: '400px',
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        margin: 0
      };
    } else {
      return {
        height: '80vh',
        width: '420px',
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        margin: 0
      };
    }
  }, [isMobile, isTablet, isExpanded]);

  // Memoized header info with stable dependencies
  const headerInfo = useMemo(() => {
    const candidate = candidateRef.current;
    const company = companyRef.current;
    
    if (isCompany) {
      return {
        name: candidate?.applicantName || candidate?.name || 'Candidate',
        title: candidate?.position || candidate?.jobTitle || 'Job Applicant',
        type: 'candidate',
        user: candidate,
        profileImage: candidate?.profileImage,
        position: candidate?.position
      };
    } else {
      return {
        name: company?.name || 'Company',
        title: candidate?.jobTitle || company?.position || 'Job Opportunity',
        type: 'company',
        user: company,
        profileImage: company?.profileImage,
        position: candidate?.jobTitle
      };
    }
  }, [isCompany]);

  const onlineStatus = useMemo(() => {
    if (isCandidateOnline) {
      return { text: 'Online', color: 'bg-green-400' };
    } else {
      const lastSeen = new Date(Date.now() - 600000);
      return {
        text: `Last seen ${lastSeen.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        color: 'bg-gray-400'
      };
    }
  }, [isCandidateOnline]);

  // Stable utility functions
  const getStatusIcon = useCallback((status, message) => {
    if (!message.isOwnMessage) {
      return null;
    }

    if (!status && message) {
      if (message.read) {
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-blue-500" />
            <CheckIcon className="w-3 h-3 text-blue-500 -ml-2" />
          </div>
        );
      } else {
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-gray-500" />
            <CheckIcon className="w-3 h-3 text-gray-500 -ml-2" />
          </div>
        );
      }
    }

    switch (status) {
      case 'sending':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      case 'sent':
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-gray-500" />
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-gray-500" />
            <CheckIcon className="w-3 h-3 text-gray-500 -ml-2" />
          </div>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-blue-500" />
            <CheckIcon className="w-3 h-3 text-blue-500 -ml-2" />
          </div>
        );
      case 'failed':
        return (
          <div className="relative group flex items-center">
            <span className="text-xs text-red-500 font-bold">❗</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Failed to send. Tap to retry.
            </div>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatDate = useCallback((timestamp) => {
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
  }, []);

  const shouldShowDate = useCallback((currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();
    return currentDate !== previousDate;
  }, []);

  const getProfileImage = useCallback((user, type) => {
    let profileImage = null;
    let initials = '?';
    let bgColor = 'bg-gray-500';

    if (type === 'candidate') {
      profileImage = user?.profileImage || user?.applicantProfile?.profileImage;
      initials = (user?.applicantName || user?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      bgColor = 'bg-green-500';
    } else if (type === 'company') {
      profileImage = user?.profileImage || user?.logo;
      initials = (user?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
  }, []);

  const getMessageProfile = useCallback((messageRole) => {
    const company = companyRef.current;
    const candidate = candidateRef.current;
    
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
  }, []);

  // Enhanced message status update function
  const updateMessageStatus = useCallback((messageId, updates) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  // Optimized check for unread messages
  const checkUnreadMessages = useCallback((messages) => {
    const hasUnread = messages.some(msg => {
      if (isCompany) {
        return msg.role === 'candidate' && !msg.read;
      } else {
        return msg.role === 'company' && !msg.read;
      }
    });
    hasUnreadMessagesRef.current = hasUnread;
    return hasUnread;
  }, [isCompany]);

  // Enhanced mark messages as read with better status handling
  const markMessagesAsRead = useCallback(async (currentChatId = null) => {
    if (chatDeletedRef.current || !isChatActive) {
      return;
    }

    if (!currentChatId && !chatId) {
      return;
    }

    if (!hasUnreadMessagesRef.current) {
      return;
    }

    try {
      const candidate = candidateRef.current;
      const company = companyRef.current;
      
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

      const targetChatId = currentChatId || chatId;

      if (!applicantId || !companyId || !jobId || !targetChatId) {
        return;
      }

      const readerType = isCompany ? 'company' : 'applicant';

      const markReadResponse = await fetch('/api/chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: targetChatId,
          readerType: readerType,
          applicantId: applicantId,
          companyId: companyId,
          jobId: jobId
        })
      });

      const markReadResult = await markReadResponse.json();

      if (markReadResult.success && markReadResult.modifiedCount > 0) {
        setMessages(prev => prev.map(msg => {
          const shouldBeRead = isCompany ?
            (msg.role === 'candidate') :
            (msg.role === 'company');

          if (shouldBeRead && !msg.read) {
            return {
              ...msg,
              read: true,
              status: msg.status === 'sent' ? 'delivered' : 
                     msg.status === 'delivered' ? 'read' : msg.status
            };
          }
          
          if (msg.isOwnMessage && msg.status === 'sent') {
            return {
              ...msg,
              status: 'delivered'
            };
          }
          
          return msg;
        }));

        hasUnreadMessagesRef.current = false;
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [isCompany, chatId, isChatActive]);

  // Optimized load chat history with message status preservation
  const loadChatHistory = useCallback(async (forceReload = false) => {
    const now = Date.now();
    const timeSinceLastLoad = now - lastLoadTimeRef.current;

    if (!forceReload && timeSinceLastLoad < 5000) {
      return;
    }

    try {
      const candidate = candidateRef.current;
      const company = companyRef.current;
      
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
        setIsLoadingMessages(false);
        return;
      }

      const params = new URLSearchParams({
        applicantId: applicantId,
        companyId: companyId,
        jobId: jobId,
        includeStatus: 'true'
      });

      const response = await fetch(`/api/chat?${params}`);
      const result = await response.json();

      if (result.success) {
        const loadedChatId = result.chat.id;
        setChatId(loadedChatId);
        lastLoadTimeRef.current = now;

        setMessages(prevMessages => {
          const tempMessagesMap = new Map();
          prevMessages.forEach(msg => {
            if (msg.id.startsWith('temp-') || msg.status === 'sending') {
              tempMessagesMap.set(msg.content + msg.timestamp, msg);
            }
          });

          const transformedMessages = result.chat.messages.map(msg => {
            const isFromOtherUser = isCompany ?
              (msg.senderType === 'applicant') :
              (msg.senderType === 'company');

            const isOwnMessage = isCompany ?
              (msg.senderType === 'company') :
              (msg.senderType === 'applicant');

            const tempKey = msg.content + new Date(msg.timestamp).getTime();
            const tempMessage = tempMessagesMap.get(tempKey);

            return {
              id: msg._id,
              role: msg.senderType === 'company' ? 'company' : 'candidate',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              senderId: msg.senderId,
              senderName: msg.senderName,
              read: msg.read || false,
              isSelected: false,
              status: tempMessage ? tempMessage.status : (msg.status || 'sent'),
              isOwnMessage: isOwnMessage
            };
          });

          if (transformedMessages.length === 0) {
            const systemMessage = isCompany
              ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
              : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

            transformedMessages.push({
              id: 'system-1',
              role: 'system',
              content: systemMessage,
              timestamp: new Date(),
              isSelected: false,
              read: true,
              status: 'read',
              isOwnMessage: false
            });
          }

          return transformedMessages;
        });

        const hasUnread = checkUnreadMessages(result.chat.messages);
        if (hasUnread && loadedChatId && isChatActive) {
          markMessagesAsRead(loadedChatId);
        }
      } else {
        throw new Error(result.error || 'Failed to load chat history');
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      const candidate = candidateRef.current;
      const company = companyRef.current;
      
      const systemMessage = isCompany
        ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
        : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

      setMessages([
        {
          id: 'system-1',
          role: 'system',
          content: systemMessage,
          timestamp: new Date(),
          isSelected: false,
          read: true,
          status: 'read',
          isOwnMessage: false
        },
      ]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [isCompany, checkUnreadMessages, markMessagesAsRead, isChatActive]);

  // Enhanced connection monitoring
  const handleOnline = useCallback(() => {
    setIsConnected(true);
    if (isChatActive) {
      loadChatHistory(true);
    }
  }, [isChatActive, loadChatHistory]);

  const handleOffline = useCallback(() => setIsConnected(false), []);

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
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, []);

  // Connection monitoring
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Chat activity monitoring
  const handleActivity = useCallback(() => {
    setIsChatActive(true);
    lastActionTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  // Load chat history when component mounts
  useEffect(() => {
    lastActionTimeRef.current = Date.now();
    loadChatHistory(true);
  }, [loadChatHistory]);

  // Enhanced auto-scroll
  useEffect(() => {
    if (isScrollingProgrammatically.current) {
      isScrollingProgrammatically.current = false;
      return;
    }

    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      const isNearBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight - messagesContainer.scrollTop < 150;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Optimized polling
  useEffect(() => {
    let isMounted = true;

    const pollForUpdates = async () => {
      if (!isMounted || !debouncedChatId || !isConnected || chatDeletedRef.current || !isChatActive) {
        return;
      }

      const now = Date.now();
      const timeSinceLastAction = now - lastActionTimeRef.current;

      if (timeSinceLastAction > 300000) {
        return;
      }

      try {
        await loadChatHistory(false);
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    if (debouncedChatId && isChatActive) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      
      pollIntervalRef.current = setInterval(pollForUpdates, 15000);
      pollForUpdates();
    }

    return () => {
      isMounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [debouncedChatId, isConnected, isChatActive, loadChatHistory]);

  // Memoized message handlers
  const handleMessageSelect = useCallback((messageId) => {
    isScrollingProgrammatically.current = true;

    setSelectedMessages(prev => {
      const newSelectedMessages = new Set(prev);
      if (newSelectedMessages.has(messageId)) {
        newSelectedMessages.delete(messageId);
      } else {
        newSelectedMessages.add(messageId);
      }
      return newSelectedMessages;
    });

    setMessages(prevMessages => prevMessages.map(msg => ({
      ...msg,
      isSelected: msg.id === messageId ? !msg.isSelected : msg.isSelected
    })));
  }, []);

  const handleMessageMenuClick = useCallback((message, event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedMessage(message);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setShowMessageMenu(true);
  }, []);

  const handleMouseDown = useCallback((message, event) => {
    if (event.button !== 0) return;

    longPressTimerRef.current = setTimeout(() => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
      handleMessageSelect(message.id);
    }, 500);
  }, [isSelectionMode, handleMessageSelect]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Add global mouse up listener
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  // Delete individual message
  const deleteMessage = useCallback(async (messageId) => {
    try {
      if (!chatId || chatDeletedRef.current) {
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';
      const userId = currentUser?._id;

      if (!userId) {
        return false;
      }

      const queryParams = new URLSearchParams({
        chatId: chatId,
        messageId: messageId,
        type: 'message',
        deletedBy: deletedBy
      });

      const response = await fetch(`/api/chat?${queryParams}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        lastActionTimeRef.current = Date.now();
        checkUnreadMessages(messages.filter(msg => msg.id !== messageId));

        setTimeout(() => {
          loadChatHistory(true);
        }, 500);

        return true;
      } else {
        throw new Error(result.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      return false;
    }
  }, [chatId, isCompany, currentUser, messages, checkUnreadMessages, loadChatHistory]);

  // Delete multiple messages
  const deleteMultipleMessages = useCallback(async (messageIds) => {
    try {
      if (!chatId || messageIds.size === 0 || chatDeletedRef.current) {
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';
      const userId = currentUser?._id;
      const messageIdsString = Array.from(messageIds).join(',');

      if (!userId) {
        return false;
      }

      const queryParams = new URLSearchParams({
        chatId: chatId,
        messageIds: messageIdsString,
        type: 'message',
        deletedBy: deletedBy
      });

      const response = await fetch(`/api/chat?${queryParams}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prev => prev.filter(msg => !messageIds.has(msg.id)));
        lastActionTimeRef.current = Date.now();
        checkUnreadMessages(messages.filter(msg => !messageIds.has(msg.id)));

        setTimeout(() => {
          loadChatHistory(true);
        }, 500);

        return true;
      } else {
        throw new Error(result.error || 'Failed to delete messages');
      }
    } catch (error) {
      console.error('Delete multiple messages error:', error);
      return false;
    }
  }, [chatId, isCompany, currentUser, messages, checkUnreadMessages, loadChatHistory]);

  // Delete entire chat
  const deleteChat = useCallback(async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entire chat? This action cannot be undone.');
    if (!confirmDelete) return false;

    try {
      const candidate = candidateRef.current;
      const company = companyRef.current;
      
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
        alert('Error: Missing required data to delete chat');
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';

      const response = await fetch(`/api/chat?applicantId=${applicantId}&companyId=${companyId}&jobId=${jobId}&deletedBy=${deletedBy}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        chatDeletedRef.current = true;
        setMessages([]);
        setChatId(null);
        alert('Chat deleted successfully');

        if (onClose) {
          onClose();
        }

        return true;
      } else {
        throw new Error(result.error || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      alert(`Error deleting chat: ${error.message}`);
      return false;
    }
  }, [isCompany, onClose]);

  // Alternative delete chat using chatId
  const deleteChatById = useCallback(async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entire chat? This action cannot be undone.');
    if (!confirmDelete) return false;

    try {
      if (!chatId) {
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';

      const queryParams = new URLSearchParams({
        chatId: chatId,
        type: 'chat',
        deletedBy: deletedBy
      });

      const response = await fetch(`/api/chat?${queryParams}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        chatDeletedRef.current = true;
        setMessages([]);
        setChatId(null);
        alert('Chat deleted successfully');

        if (onClose) {
          onClose();
        }

        return true;
      } else {
        throw new Error(result.error || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      alert(`Error deleting chat: ${error.message}`);
      return false;
    }
  }, [chatId, isCompany, onClose]);

  // Handle delete single message
  const handleDeleteMessage = useCallback(async () => {
    if (!selectedMessage) return;

    if (selectedMessage.id.startsWith('temp-') || selectedMessage.id.startsWith('error-')) {
      setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
      setShowMessageMenu(false);
      setSelectedMessage(null);
      return;
    }

    const success = await deleteMessage(selectedMessage.id);
    if (success) {
      setShowMessageMenu(false);
      setSelectedMessage(null);
    } else {
      alert('Failed to delete message');
    }
  }, [selectedMessage, deleteMessage]);

  // Handle delete selected messages
  const handleDeleteSelectedMessages = useCallback(async () => {
    if (selectedMessages.size === 0) return;

    const success = await deleteMultipleMessages(selectedMessages);
    if (success) {
      setSelectedMessages(new Set());
      setIsSelectionMode(false);
    } else {
      alert('Failed to delete some messages');
    }
  }, [selectedMessages, deleteMultipleMessages]);

  // Handle delete entire chat
  const handleDeleteChat = useCallback(async () => {
    if (chatId) {
      const success = await deleteChatById();
      if (!success) {
        await deleteChat();
      }
    } else {
      await deleteChat();
    }
    setShowMessageMenu(false);
    setSelectedMessage(null);
  }, [chatId, deleteChatById, deleteChat]);

  // Clear selection mode
  const clearSelection = useCallback(() => {
    isScrollingProgrammatically.current = true;
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isSelected: false })));
  }, []);

  // Update selection mode based on selectedMessages count
  useEffect(() => {
    if (selectedMessages.size > 0) {
      setIsSelectionMode(true);
    } else {
      setIsSelectionMode(false);
    }
  }, [selectedMessages.size]);

  // Enhanced send message with better status tracking
  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || chatDeletedRef.current) return;

    const tempMessageId = `temp-${Date.now()}`;
    const userMessage = {
      id: tempMessageId,
      role: isCompany ? 'company' : 'candidate',
      content: input,
      timestamp: new Date(),
      senderId: currentUser?._id,
      senderName: isCompany ? companyRef.current?.name : candidateRef.current?.applicantName,
      status: 'sending',
      isSelected: false,
      read: false,
      isOwnMessage: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    lastActionTimeRef.current = Date.now();
    setIsChatActive(true);

    try {
      const success = await onSendMessageRef.current(input);

      if (success) {
        updateMessageStatus(tempMessageId, { status: 'sent' });

        setTimeout(() => {
          loadChatHistory(true).catch(err =>
            console.error('Failed to reload chat:', err)
          );
        }, 2000);

      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Send message error:', err);
      updateMessageStatus(tempMessageId, { status: 'failed' });
    } finally {
      setLoading(false);
    }
  }, [input, isCompany, currentUser, updateMessageStatus, loadChatHistory]);

  // Toggle expand on mobile
  const toggleExpand = useCallback(() => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  }, [isMobile, isExpanded]);

  // Handle escape key to close expanded chat on mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isExpanded && isMobile) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded, isMobile]);

  // Memoized message grouping
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message, index) => {
      const previousMessage = messages[index - 1];
      const showDate = shouldShowDate(message, previousMessage);

      if (showDate) {
        groups.push({ type: 'date', date: formatDate(message.timestamp) });
      }

      groups.push({ type: 'message', message });
      return groups;
    }, []);
  }, [messages, shouldShowDate, formatDate]);

  return (
    <div 
      className="fixed z-50 flex flex-col bg-white border border-gray-200 shadow-xl"
      style={chatDimensions}
    >
      {/* Header */}
      <div className={`p-4 border-b flex justify-between items-center bg-green-600 text-white ${isMobile ? 'rounded-t-lg' : 'rounded-t-lg'}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isSelectionMode ? (
            <>
              <button
                onClick={clearSelection}
                className="text-white hover:text-gray-200 p-1 flex-shrink-0"
                aria-label="Cancel Selection"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className={`font-semibold truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {selectedMessages.size} selected
                </h2>
                <p className="text-green-100 truncate text-xs">
                  Select messages to delete
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative flex-shrink-0">
                {getProfileImage(headerInfo.user, headerInfo.type)}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${onlineStatus.color}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className={`font-semibold truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
                    {userRole === "company" ? headerInfo.user.applicantProfile?.name : headerInfo?.name}
                  </h2>
                  {isMobile && (
                    <button
                      onClick={toggleExpand}
                      className="text-white hover:text-gray-200"
                    >
                      {isExpanded ? '⬇️' : '⬆️'}
                    </button>
                  )}
                </div>
                <p className="text-green-100 text-xs flex items-center gap-1 truncate">
                  <span className="truncate">{userRole === "company" ? headerInfo?.user?.applicantProfile?.position : headerInfo?.title}</span>
                  {!isConnected && (
                    <span className="text-yellow-300 text-xs">• Offline</span>
                  )}
                  {!isChatActive && (
                    <span className="text-gray-300 text-xs">• Inactive</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isSelectionMode ? (
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
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-green-700 transition-colors"
              aria-label="Close Chat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto bg-gray-100 ${isMobile ? 'p-2 space-y-1' : 'p-4 space-y-2'}`}>
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-20">
            <LoadingSpinner size="medium" />
            <span className="ml-2 text-gray-600 text-sm">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Start a conversation with {headerInfo.name}</p>
          </div>
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return <DateSeparator key={`date-${index}`} date={item.date} isMobile={isMobile} />;
            }

            const message = item.message;
            const isOwnMessage = isCompany ? message.role === 'company' : message.role === 'candidate';
            const isSelected = selectedMessages.has(message.id);

            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                isSelectionMode={isSelectionMode}
                isSelected={isSelected}
                onMessageSelect={handleMessageSelect}
                onMessageMenuClick={handleMessageMenuClick}
                onMouseDown={handleMouseDown}
                getStatusIcon={getStatusIcon}
                formatTime={formatTime}
                getProfileImage={getProfileImage}
                getMessageProfile={getMessageProfile}
                isMobile={isMobile}
              />
            );
          })
        )}

        {/* Message Context Menu */}
        {showMessageMenu && selectedMessage && (
          <div
            ref={menuRef}
            className="fixed bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 min-w-[120px]"
            style={{
              left: `${Math.min(menuPosition.x, windowSize.width - 150)}px`,
              top: `${Math.min(menuPosition.y, windowSize.height - 100)}px`,
            }}
          >
            <button
              onClick={() => {
                setIsSelectionMode(true);
                handleMessageSelect(selectedMessage.id);
                setShowMessageMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              Select
            </button>
            <button
              onClick={handleDeleteMessage}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
            <hr className="my-1" />
            <button
              onClick={handleDeleteChat}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete Chat
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Hide when in selection mode */}
      {!isSelectionMode && (
        <form onSubmit={sendMessage} className={`border-t bg-white flex items-center gap-2 ${isMobile ? 'p-2' : 'p-3'}`}>
          <div className={`flex-1 border border-gray-300 rounded-3xl bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent ${isMobile ? 'px-3 py-2' : 'px-3 py-1'}`}>
            <input
              className="w-full focus:outline-none bg-transparent text-sm"
              value={input}
              placeholder={`Message ${headerInfo.name}...`}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0"
            disabled={loading || !input.trim()}
            aria-label="Send Message"
            style={{
              padding: isMobile ? '0.5rem' : '0.5rem'
            }}
          >
            <PaperAirplaneIcon className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          </button>
        </form>
      )}
    </div>
  );
}

// Export with proper memoization
export default memo(Chat, (prevProps, nextProps) => {
  return (
    prevProps.candidate === nextProps.candidate &&
    prevProps.company === nextProps.company &&
    prevProps.userRole === nextProps.userRole &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onSendMessage === nextProps.onSendMessage
  );
});
