// /app/profile/tabs/Applications.js
'use client';
import React from 'react';

export default function Applications({ profile }) {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Applications</h2>
      {profile.applications && profile.applications.length > 0 ? (
        <ul className="space-y-4">
          {profile.applications.map((app, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <h4 className="font-bold text-md">{app.jobTitle}</h4>
              <p className="text-sm text-gray-700 mt-1">{app.company}</p>
              {app.status && (
                <p className="text-xs mt-2 text-gray-500 italic">Status: {app.status}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No applications available.</p>
      )}
    </div>
  );
}
