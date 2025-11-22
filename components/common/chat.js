'use client';
import { PaperAirplaneIcon, XMarkIcon, CheckIcon, TrashIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Chat({ candidate, company, onClose, onSendMessage, userRole = 'company' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [lastSeenTime, setLastSeenTime] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isChatActive, setIsChatActive] = useState(true);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);

  // Track if chat was deleted to prevent mark-read calls
  const chatDeletedRef = useRef(false);
  const hasUnreadMessagesRef = useRef(false);
  const lastLoadTimeRef = useRef(0);
  const pollIntervalRef = useRef(null);
  const lastActionTimeRef = useRef(0);
  const visibilityTimeoutRef = useRef(null);
  const messageRetryCountRef = useRef(new Map());
  const isInitialLoadRef = useRef(true);
  const isPollingActiveRef = useRef(false);

  // Determine if current user is company or applicant
  const isCompany = userRole === 'company';
  const currentUser = isCompany ? company : candidate;
  const otherUser = isCompany ? candidate : company;

  // Debounced chatId for polling
  const debouncedChatId = useDebounce(chatId, 1000);

  // FIXED: Enhanced message status detection with proper role mapping
  const getMessageStatus = useCallback((message) => {
    if (message.role === 'system') return 'read';

    const isOwnMessage = isCompany ?
      (message.role === 'company' || message.senderType === 'company') :
      (message.role === 'candidate' || message.senderType === 'applicant');

    if (!isOwnMessage) {
      return 'read';
    }

    if (message.status && message.status !== 'sent') {
      return message.status;
    }

    return message.status || 'sent';
  }, [isCompany]);

  // NEW: Calculate online status based on recent activity
  const calculateOnlineStatus = useCallback((messages) => {
    if (!messages || messages.length === 0) {
      setIsOtherUserOnline(false);
      setLastSeenTime(null);
      return;
    }

    const otherUserMessages = messages.filter(msg =>
      isCompany ?
        (msg.role === 'candidate' || msg.senderType === 'applicant') :
        (msg.role === 'company' || msg.senderType === 'company')
    );

    if (otherUserMessages.length === 0) {
      setIsOtherUserOnline(false);
      setLastSeenTime(null);
      return;
    }

    const latestMessage = otherUserMessages.reduce((latest, msg) => {
      const msgTime = new Date(msg.timestamp).getTime();
      const latestTime = latest ? new Date(latest.timestamp).getTime() : 0;
      return msgTime > latestTime ? msg : latest;
    }, null);

    if (!latestMessage) return;

    const messageTime = new Date(latestMessage.timestamp);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - messageTime.getTime();

    const isOnline = timeDiff < 2 * 60 * 1000;
    setIsOtherUserOnline(isOnline);
    setLastSeenTime(messageTime);
  }, [isCompany]);

  // FIXED: Enhanced check for unread messages with proper role mapping
  const checkUnreadMessages = useCallback((messages) => {
    const hasUnread = messages.some(msg => {
      if (isCompany) {
        return (msg.role === 'candidate' || msg.senderType === 'applicant') && !msg.read;
      } else {
        return (msg.role === 'company' || msg.senderType === 'company') && !msg.read;
      }
    });

    hasUnreadMessagesRef.current = hasUnread;
    return hasUnread;
  }, [isCompany]);

  // FIXED: Enhanced mark messages as read with better logging and role handling
  const markMessagesAsRead = useCallback(async (currentChatId = null) => {
    if (chatDeletedRef.current || !isChatActive) {
      return;
    }

    const targetChatId = currentChatId || chatId;
    if (!targetChatId) {
      return;
    }

    const currentHasUnread = checkUnreadMessages(messages);
    if (!currentHasUnread) {
      return;
    }

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
            (msg.role === 'candidate' || msg.senderType === 'applicant') :
            (msg.role === 'company' || msg.senderType === 'company');

          if (shouldBeRead && !msg.read) {
            return {
              ...msg,
              read: true,
              status: 'read'
            };
          }
          return msg;
        }));

        hasUnreadMessagesRef.current = false;
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [isCompany, candidate, company, chatId, isChatActive, messages, checkUnreadMessages]);

  // FIXED: Enhanced load chat history with proper abort control and caching
  const loadChatHistory = useCallback(async (forceReload = false) => {
    const now = Date.now();
    const timeSinceLastLoad = now - lastLoadTimeRef.current;

    // Prevent too frequent requests
    if (!forceReload && timeSinceLastLoad < 3000) {
      return;
    }

    // Create abort controller to cancel request if component unmounts
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout

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
        setIsLoadingMessages(false);
        return;
      }

      const params = new URLSearchParams({
        applicantId: applicantId,
        companyId: companyId,
        jobId: jobId,
        includeStatus: 'true',
        t: forceReload ? Date.now().toString() : 'cache' // Cache busting for force reload
      });

      const response = await fetch(`/api/chat?${params}`, {
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const loadedChatId = result.chat.id;
        setChatId(loadedChatId);
        lastLoadTimeRef.current = now;

        const transformedMessages = result.chat.messages.map(msg => {
          const isFromOtherUser = isCompany ?
            (msg.senderType === 'applicant') :
            (msg.senderType === 'company');

          const isOwnMessage = isCompany ?
            (msg.senderType === 'company') :
            (msg.senderType === 'applicant');

          let messageStatus = msg.status || 'sent';

          if (msg.read && isFromOtherUser) {
            messageStatus = 'read';
          }

          return {
            id: msg._id,
            role: msg.senderType === 'company' ? 'company' : 'candidate',
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            senderId: msg.senderId,
            senderName: msg.senderName,
            read: msg.read || false,
            isSelected: false,
            status: messageStatus,
            isOwnMessage: isOwnMessage,
            senderType: msg.senderType
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

        setMessages(transformedMessages);
        calculateOnlineStatus(transformedMessages);

        const hasUnread = checkUnreadMessages(transformedMessages);
        if (hasUnread && loadedChatId && isChatActive) {
          markMessagesAsRead(loadedChatId);
        }
      } else {
        throw new Error(result.error || 'Failed to load chat history');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Chat history request was aborted');
        return;
      }

      console.error('Failed to load chat history:', error);

      // Only set system message if this is the initial load and we have no messages
      if (messages.length === 0 && isInitialLoadRef.current) {
        const systemMessage = isCompany
          ? `You are chatting with ${candidate?.applicantName || 'Candidate'} about the ${candidate?.jobTitle || 'job'} position.`
          : `You are chatting with ${company?.name || 'Company'} about the ${candidate?.jobTitle || 'job'} position.`;

        setMessages([{
          id: 'system-1',
          role: 'system',
          content: systemMessage,
          timestamp: new Date(),
          isSelected: false,
          read: true,
          status: 'read',
          isOwnMessage: false
        }]);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoadingMessages(false);
      isInitialLoadRef.current = false;
    }
  }, [isCompany, candidate, company, markMessagesAsRead, checkUnreadMessages, isChatActive, calculateOnlineStatus, messages.length]);

  // FIXED: Initial load only once on mount
  useEffect(() => {
    console.log('🚀 Initial chat load');
    lastActionTimeRef.current = Date.now();
    isInitialLoadRef.current = true;
    loadChatHistory(true);

    return () => {
      // Cleanup function for component unmount
      isInitialLoadRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount

  // FIXED: Smart polling with proper cleanup and conditions
  useEffect(() => {
    let isMounted = true;

    const startPolling = () => {
      if (!isMounted || !debouncedChatId || !isConnected || chatDeletedRef.current || !isChatActive) {
        return;
      }

      // Clear existing interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      // Start new polling interval
      pollIntervalRef.current = setInterval(async () => {
        if (!isMounted || !isPollingActiveRef.current) return;

        const now = Date.now();
        const timeSinceLastAction = now - lastActionTimeRef.current;

        // Only poll if there's been recent activity (last 5 minutes)
        if (timeSinceLastAction > 300000) {
          return;
        }

        // Prevent multiple simultaneous requests
        if (isPollingActiveRef.current) {
          isPollingActiveRef.current = false;
          try {
            await loadChatHistory(false);
          } catch (error) {
            console.error('Polling error:', error);
          } finally {
            // Re-enable polling after a delay
            setTimeout(() => {
              if (isMounted) {
                isPollingActiveRef.current = true;
              }
            }, 2000);
          }
        }
      }, 5000); // Poll every 5 seconds
    };

    // Initialize polling state
    isPollingActiveRef.current = true;
    startPolling();

    return () => {
      isMounted = false;
      isPollingActiveRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [debouncedChatId, isConnected, isChatActive, loadChatHistory]);

  // FIXED: Reload chat only when specifically becoming active with chatId
  useEffect(() => {
    if (isChatActive && chatId && !isInitialLoadRef.current) {
      const now = Date.now();
      const timeSinceLastLoad = now - lastLoadTimeRef.current;

      // Only reload if it's been more than 2 seconds since last load
      if (timeSinceLastLoad > 2000) {
        loadChatHistory(true);
      }
    }
  }, [isChatActive, chatId, loadChatHistory]);

  // Recalculate online status when messages change
  useEffect(() => {
    if (messages.length > 0) {
      calculateOnlineStatus(messages);
    }
  }, [messages, calculateOnlineStatus]);

  // Enhanced auto-scroll with better detection
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

  // FIXED: Enhanced visibility and focus handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setIsChatActive(true);
        lastActionTimeRef.current = Date.now();
      } else {
        setIsChatActive(false);
      }
    };

    const handleFocus = () => {
      setIsChatActive(true);
      lastActionTimeRef.current = Date.now();
    };

    const handleBlur = () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsChatActive(false);
      }, 30000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, []);

  // Track user activity to keep polling active
  useEffect(() => {
    const handleActivity = () => {
      lastActionTimeRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Enhanced connection monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsConnected(true);
    };

    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  // Delete individual message
  const deleteMessage = async (messageId) => {
    try {
      if (!chatId || chatDeletedRef.current) {
        console.error('Chat ID not available or chat was deleted');
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';
      const userId = currentUser?._id;

      if (!userId) {
        console.error('User ID not available');
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
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      return false;
    }
  };

  // Delete multiple messages
  const deleteMultipleMessages = async (messageIds) => {
    try {
      if (!chatId || messageIds.size === 0 || chatDeletedRef.current) {
        console.error('Chat ID not available, no messages selected, or chat was deleted');
        return false;
      }

      const deletedBy = isCompany ? 'company' : 'applicant';
      const userId = currentUser?._id;
      const messageIdsString = Array.from(messageIds).join(',');

      if (!userId) {
        console.error('User ID not available');
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
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete messages');
      }
    } catch (error) {
      console.error('Delete multiple messages error:', error);
      return false;
    }
  };

  // Delete entire chat
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
  };

  // Alternative delete chat using chatId
  const deleteChatById = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entire chat? This action cannot be undone.');
    if (!confirmDelete) return false;

    try {
      if (!chatId) {
        console.error('Chat ID not available');
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
  };

  // Handle message selection
  const handleMessageSelect = (messageId) => {
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
  };

  // Update selection mode based on selectedMessages count
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

  // Handle delete single message
  const handleDeleteMessage = async () => {
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
  };

  // Handle delete selected messages
  const handleDeleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    const success = await deleteMultipleMessages(selectedMessages);
    if (success) {
      setSelectedMessages(new Set());
      setIsSelectionMode(false);
    } else {
      alert('Failed to delete some messages');
    }
  };

  // Handle delete entire chat
  const handleDeleteChat = async () => {
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
  };

  // Clear selection mode
  const clearSelection = () => {
    isScrollingProgrammatically.current = true;
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isSelected: false })));
  };

  // Improved long press handler
  const handleMouseDown = (message, event) => {
    if (event.button !== 0) return;

    longPressTimerRef.current = setTimeout(() => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
      handleMessageSelect(message.id);
    }, 500);
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

  // FIXED: Enhanced send message with better error handling and retry logic
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || chatDeletedRef.current || loading) return;

    const tempMessageId = `temp-${Date.now()}`;
    const userMessage = {
      id: tempMessageId,
      role: isCompany ? 'company' : 'candidate',
      content: input,
      timestamp: new Date(),
      senderId: currentUser?._id,
      senderName: isCompany ? company?.name : candidate?.applicantName,
      status: 'sending',
      isSelected: false,
      read: false,
      isOwnMessage: true,
      senderType: isCompany ? 'company' : 'applicant'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    lastActionTimeRef.current = Date.now();
    setIsChatActive(true);

    messageRetryCountRef.current.set(tempMessageId, 0);

    try {
      const success = await onSendMessage(input);

      if (success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessageId
              ? { ...msg, status: 'sent' }
              : msg
          )
        );

        // Reload chat history after sending
        setTimeout(() => {
          loadChatHistory(true);
        }, 1000);

      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Send message error:', err);

      const retryCount = messageRetryCountRef.current.get(tempMessageId) || 0;

      if (retryCount < 2) {
        messageRetryCountRef.current.set(tempMessageId, retryCount + 1);
        setTimeout(() => {
          sendMessage(e);
        }, 1000);
        return;
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessageId
            ? {
              ...msg,
              status: 'failed',
              error: err.message
            }
            : msg
        )
      );

      messageRetryCountRef.current.delete(tempMessageId);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Improved message status icon
  const getStatusIcon = useCallback((message) => {
    if (!message.isOwnMessage) {
      return null;
    }

    const status = getMessageStatus(message);

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
        return (
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 text-gray-500" />
          </div>
        );
    }
  }, [getMessageStatus]);

  // Format last seen time
  const formatLastSeen = useCallback((timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const lastSeen = new Date(timestamp);

    if (lastSeen.toDateString() === now.toDateString()) {
      return `last seen at ${lastSeen.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastSeen.toDateString() === yesterday.toDateString()) {
      return `last seen yesterday at ${lastSeen.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    return `last seen ${lastSeen.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} at ${lastSeen.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`;
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
  }, [messages]);

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

  // Enhanced online status display
  const getOnlineStatus = () => {
    if (isOtherUserOnline) {
      return {
        text: 'Online',
        color: 'bg-green-400',
        dotColor: 'text-green-400'
      };
    } else if (lastSeenTime) {
      return {
        text: formatLastSeen(lastSeenTime),
        color: 'bg-gray-400',
        dotColor: 'text-gray-400'
      };
    } else {
      return {
        text: 'Offline',
        color: 'bg-gray-400',
        dotColor: 'text-gray-400'
      };
    }
  };

  // Updated function to handle header display based on user role
  const getHeaderInfo = () => {
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

  const headerInfo = useMemo(() => getHeaderInfo(), [isCompany, candidate, company]);
  const onlineStatus = getOnlineStatus();

  return (
    <div className="fixed bottom-0 right-0 z-50 h-[80vh] w-full max-w-md m-4 rounded-lg shadow-xl flex flex-col bg-white border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          {isSelectionMode ? (
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
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${onlineStatus.dotColor}`}></span>
                  <span className="truncate">
                    {onlineStatus.text}
                  </span>
                  {!isConnected && (
                    <span className="text-yellow-300 text-xs">• Offline</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
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
          groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${index}`} className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {item.date}
                  </span>
                </div>
              );
            }

            const message = item.message;
            const isOwnMessage = isCompany ? message.role === 'company' : message.role === 'candidate';
            const messageProfile = getMessageProfile(message.role);
            const isSelected = selectedMessages.has(message.id);

            return (
              <div key={message.id} className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {!isOwnMessage && message.role !== 'system' && messageProfile && (
                  <div className="flex-shrink-0">
                    {getProfileImage(messageProfile.user, messageProfile.type)}
                  </div>
                )}

                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="group relative">
                    <div
                      className={`p-3 rounded-2xl text-sm break-words cursor-pointer transition-all duration-200 ${isOwnMessage
                        ? `bg-green-500 text-white rounded-br-md ${isSelected ? 'ring-2 ring-green-300 ring-offset-2' : ''}`
                        : message.role === 'system'
                          ? 'bg-yellow-100 text-yellow-800 text-center border border-yellow-200 rounded-lg'
                          : `bg-white text-gray-800 rounded-bl-md shadow-sm ${isSelected ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`
                        }`}
                      onClick={() => {
                        if (isSelectionMode) {
                          handleMessageSelect(message.id);
                        } else if (message.status === 'failed') {
                          setInput(message.content);
                          setMessages(prev => prev.filter(msg => msg.id !== message.id));
                        }
                      }}
                      onContextMenu={(e) => handleMessageLongPress(message, e)}
                      onMouseDown={(e) => handleMouseDown(message, e)}
                    >
                      {message.content}

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

                    {isOwnMessage && message.role !== 'system' && !isSelectionMode && (
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
                    {isOwnMessage && message.role !== 'system' && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(message)}
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