export const runtime = "edge";
export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white">
          <h2 className="text-xl font-semibold">Total Listings</h2>
          <p className="text-3xl font-bold">128</p>
        </div>
        <div className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
          <h2 className="text-xl font-semibold">Monthly Views</h2>
          <p className="text-3xl font-bold">9,542</p>
        </div>
        <div className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h2 className="text-xl font-semibold">Avg. Response Time</h2>
          <p className="text-3xl font-bold">2.4 hrs</p>
        </div>
        <div className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-gray-800 to-gray-600 text-white">
          <h2 className="text-xl font-semibold">New Signups</h2>
          <p className="text-3xl font-bold">324</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="rounded-2xl shadow-md p-6 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Views Over Time</h3>
          <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">[Line Chart Placeholder]</span>
          </div>
        </div>

        <div className="rounded-2xl shadow-md p-6 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Top Listings</h3>
          <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">[Bar Chart Placeholder]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
