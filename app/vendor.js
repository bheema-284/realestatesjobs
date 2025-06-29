
"use client"
import React, { useState } from 'react';

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVendors([...vendors, form]);
    setForm({ name: '', email: '', company: '' });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Vendor Management</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Vendor Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Vendor
        </button>
      </form>

      <h3 className="mt-8 text-xl font-semibold">Vendor List</h3>
      <ul className="mt-2">
        {vendors.map((v, index) => (
          <li key={index} className="border p-2 mt-2 rounded">
            <strong>{v.name}</strong> - {v.email} - {v.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorPage;