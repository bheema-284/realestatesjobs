export default function Services({ profile }) {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Services</h2>
      {profile.services && profile.services.length > 0 ? (
        <ul className="space-y-4">
          {profile.services.map((service, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <h4 className="font-bold text-md">{service.name}</h4>
              <p className="text-sm text-gray-700 mt-1">{service.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No services available.</p>
      )}
    </div>
  );
}