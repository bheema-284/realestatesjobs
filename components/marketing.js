export default function Marketing({ profile }) {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Marketing Campaigns</h2>
      {profile.marketing && profile.marketing.length > 0 ? (
        <ul className="space-y-4">
          {profile.marketing.map((item, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <h4 className="font-bold text-md">{item.platform}</h4>
              <p className="text-sm text-gray-600 mt-1"><strong>Campaign:</strong> {item.campaign}</p>
              <p className="text-sm text-gray-700 mt-1"><strong>Performance:</strong> {item.performance}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No marketing data available.</p>
      )}
    </div>
  );
}