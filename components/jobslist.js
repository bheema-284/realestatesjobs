'use client';

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function JobList(props) {
    const { tabName, jobList, getIconForTitle, deleteItem, editForm, formatEmploymentTypes, formatWorkingSchedule, handleCategoryClick, setIsOpen } = props;
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 font-sans antialiased">
            <div className="max-w-7xl mx-auto bg-white rounded-b-md overflow-hidden border border-gray-200">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between items-center p-3">
                    <div className="">
                        <div className="flex gap-3 items-center">
                            <div className="text-sm font-medium text-gray-900"> {getIconForTitle(tabName)}</div>
                            <h2 className="text-2xl font-bold text-indigo-800">{tabName}</h2>
                        </div>
                        <p className="text-gray-600 mt-1">A comprehensive list of all your active and past job advertisements.</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={() => handleCategoryClick(tabName)} className="bg-lime-100 border-1.5 border-gray-900 text-black px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
                            AUTO CREATE JOB
                        </button>
                        <button onClick={() => setIsOpen(true)} className="bg-orange-100 border-1.5 border-gray-900 text-black px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
                            POST NEW JOB
                        </button>
                    </div>
                </div>

                {jobList.length === 0 ? (
                    <div className="p-6 text-center text-gray-600">
                        <p>No job postings available. Click a category above to add one!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Job Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Employment Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Working Schedule
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Salary
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Hiring Multiple
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobList.map((job, index) => (
                                    <tr key={job.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors duration-150`}>
                                        <td className="px-6 py-4 w-48 whitespace-nowrap">
                                            <div className="text-sm w-48 text-wrap font-medium text-gray-900">{job.jobDescription}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatEmploymentTypes(job.employmentTypes)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatWorkingSchedule(job.workingSchedule)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">
                                                {(() => {
                                                    const numericMatch = job.salaryAmount.match(/\d[\d,]*/); // match first number like "80,000"
                                                    const numericValue = numericMatch ? Number(numericMatch[0].replace(/,/g, '')) : null;

                                                    return numericValue !== null
                                                        ? `${numericValue.toLocaleString()} ${job.salaryFrequency} (${job.salaryType})`
                                                        : job.salaryAmount; // fallback to raw if parsing fails
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {job.hiringMultiple ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {job.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center gap-2">
                                                <PencilIcon className="h-5 ml-5 fill-yellow-400 hover:fill-yellow-500 hover:cursor-pointer" onClick={() => editForm(index, "update")} />
                                                <TrashIcon className="h-5 ml-5 fill-red-400 hover:fill-red-500 hover:cursor-pointer" onClick={() => deleteItem(index)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
