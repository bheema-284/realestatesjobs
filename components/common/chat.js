'use client';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function Chat({ candidateName, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
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
        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-100 text-blue-800 ml-auto' : 'bg-gray-100 text-gray-800 mr-auto'
              } max-w-[85%] break-words`} // Added break-words for long content
            style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }} // Ensure alignment
          >
            <strong>{m.role === 'user' ? 'You:' : 'AI:'}</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t flex items-center gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Ask a question..."
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
          aria-label="Send Message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
