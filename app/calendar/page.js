export const runtime = "edge";
import React from 'react';
import {
  CalendarDaysIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const jobData = [
  {
    id: 1,
    title: 'Real Estate Agent',
    location: 'Hyderabad, Telangana',
    date: '2025-07-20',
    type: 'Full-Time',
    salary: '₹50,000/mo',
  },
  {
    id: 2,
    title: 'Leasing Consultant',
    location: 'Bangalore, Karnataka',
    date: '2025-07-22',
    type: 'Part-Time',
    salary: '₹25,000/mo',
  },
  {
    id: 3,
    title: 'Property Manager',
    location: 'Mumbai, Maharashtra',
    date: '2025-07-25',
    type: 'Contract',
    salary: '₹60,000/mo',
  },
];

export default function RealEstateJobsCalendar() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-blue-800">
        🏘️ Real Estate Jobs Calendar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">📅 Upcoming</h2>
          <ul className="space-y-4">
            {jobData.map((job) => (
              <li key={job.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.date}</p>
                </div>
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </li>
            ))}
          </ul>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          {jobData.map((job) => (
            <div key={job.id} className="bg-white p-4 sm:p-5 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{job.title}</h3>
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-max">
                  {job.type}
                </span>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  {job.date}
                </span>
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  {job.salary}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
