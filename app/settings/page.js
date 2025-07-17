export const runtime = "edge";
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Account Settings</h2>
          <div className="space-y-4">
            <input
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
              placeholder="Username"
              defaultValue="john_doe"
            />
            <input
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
              placeholder="Email"
              defaultValue="john@example.com"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update Profile</button>
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Preferences</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-800 dark:text-white">Email Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-white">Enable Dark Mode</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}


