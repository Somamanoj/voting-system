import React, { useState } from 'react';

const CandidateForm = ({ onAddCandidate }) => {
  const [candidate, setCandidate] = useState({
    name: '',
    partyName: '',
    logo: null,
    manifesto: '',
    foundedYear: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!candidate.name || !candidate.partyName) {
      alert('Please fill in required fields');
      return;
    }

    onAddCandidate(candidate);
    // Reset form
    setCandidate({
      name: '',
      partyName: '',
      logo: '',
      manifesto: '',
      foundedYear: ''
    });
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Candidate Name *</label>
        <input
          type="text"
          name="name"
          value={candidate.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  border border-gray-500 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Party Name *</label>
        <input
          type="text"
          name="partyName"
          value={candidate.partyName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  border border-gray-500 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Candidate Logo</label>
        <input
          type="url"
          name="logo"
          value={candidate.logo}
          onChange={handleChange}
          placeholder="https://example.com/logo.jpg"
          className="mt-1 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  border border-gray-500 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Manifesto (Optional)</label>
        <textarea
          name="manifesto"
          value={candidate.manifesto}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  border border-gray-500 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Founded Year (Optional)</label>
        <input
          type="number"
          name="foundedYear"
          value={candidate.foundedYear}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50  border border-gray-500 p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Candidate
      </button>
    </form>
  );
};

export default CandidateForm;