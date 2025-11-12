'use client';
import Link from 'next/link';
import React from 'react';

export default function Projects({ profile }) {
  return (
    <div className="bg-gradient-to-br mt-5 from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-yellow-200">
      <h2 className="text-2xl font-bold text-orange-800 mb-5 border-b pb-3 border-orange-300">My Projects</h2>
      {profile.projects && profile.projects.length > 0 ? (
        <ul className="space-y-4">
          {profile.projects.map((project, idx) => (
            <li key={idx} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
              {project.link && (
                <p className="text-xs mt-2 text-gray-600">
                  <Link href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Project</Link>
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs mt-2 text-gray-500">
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center py-8">No projects available.</p>
      )}
    </div>
  );
}
