// /app/profile/tabs/Projects.js
'use client';
import React from 'react';

export default function Projects({ profile }) {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Projects</h2>
      {profile.projects && profile.projects.length > 0 ? (
        <ul className="space-y-4">
          {profile.projects.map((project, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <h4 className="font-bold text-md">{project.name}</h4>
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No projects available.</p>
      )}
    </div>
  );
}
