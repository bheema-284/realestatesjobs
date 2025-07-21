// components/common/chat.js (Previously ChatWindow.js)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Import XMarkIcon for close button

const Chat = ({ candidateName, onClose }) => { // Assuming this is your ChatWindow renamed
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat', // Your API route
    initialMessages: [
      {
        id: 'initial',
        role: 'system',
        content: `You are a helpful assistant for a recruiter. You are chatting with a recruiter about a candidate named ${candidateName || 'the current candidate'}. Provide concise and relevant information.`,
      },
      // You might want to add an initial greeting here for the user
      {
        id: 'greeting',
        role: 'assistant',
        content: `Hello! I'm your AI assistant. How can I help you with ${candidateName || 'the current candidate'} today?`,
      }
    ],
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Optionally reset messages when candidateName changes, if you want a fresh chat for each candidate
  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        role: 'system',
        content: `You are a helpful assistant for a recruiter. You are chatting with a recruiter about a candidate named ${candidateName || 'the current candidate'}. Provide concise and relevant information.`,
      },
      {
        id: 'greeting',
        role: 'assistant',
        content: `Hello! I'm your AI assistant. How can I help you with ${candidateName || 'the current candidate'} today?`,
      }
    ]);
  }, [candidateName, setMessages]);


  return (
    // Updated styling for fixed bottom-right position
    <div className="fixed bottom-0 right-0 z-50 h-[80vh] w-full max-w-sm m-4 rounded-lg shadow-xl flex flex-col bg-white border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center bg-lime-600 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Chat with AI about {candidateName || 'Candidate'}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-lime-700"
          aria-label="Close Chat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm ${
              m.role === 'user' ? 'bg-blue-100 text-blue-800 ml-auto' : 'bg-gray-100 text-gray-800 mr-auto'
            } max-w-[85%] break-words`} // Added break-words for long content
            style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }} // Ensure alignment
          >
            <strong>{m.role === 'user' ? 'You:' : 'AI:'}</strong> {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Ask a question..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 disabled:opacity-50"
          disabled={isLoading}
          aria-label="Send Message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;