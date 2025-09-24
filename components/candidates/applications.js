'use client';
import React from 'react';

export default function Applications({ profile }) {
  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 mt-5 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-5 border-b pb-3 border-blue-300">My Applications</h2>
        {profile.applications && profile.applications.length > 0 ? (
          <ul className="space-y-4">
            {profile.applications.map((app, idx) => (
              <li key={idx} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <h4 className="font-semibold text-lg text-gray-900">{app.jobTitle}</h4>
                <p className="text-sm text-gray-700 mt-1">{app.company}</p>
                {app.status && (
                  <p className="text-xs mt-2 text-gray-600 italic">Status: <span className="font-medium text-blue-700">{app.status}</span></p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center py-8">No applications available.</p>
        )}
      </div>
    </div>
  );
}
