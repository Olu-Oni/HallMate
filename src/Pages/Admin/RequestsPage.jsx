import React, { useState } from 'react';

const RequestsManagementPage = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [amenity, setAmenity] = useState('');
  const [issue, setIssue] = useState('');
  const [otherIssue, setOtherIssue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      roomNumber,
      amenity,
      issue: amenity === 'others' ? otherIssue : issue,
    };
    console.log('Request submitted:', requestData);
    // Here you can add the code to send the requestData to the hall admin
  };

  const issues = {
    electrical: ['fans', 'sockets', 'light bulbs'],
    plumbing: ['wash hand basin', 'shower', 'tap', 'wc'],
    carpentry: ['broken beds', 'damaged lockers', 'damaged doors'],
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Maintenance Requests</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="amenity" className="block text-sm font-medium text-gray-700">
            Amenity
          </label>
          <select
            id="amenity"
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select an amenity</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="others">Others</option>
          </select>
        </div>
        {amenity && amenity !== 'others' && (
          <div>
            <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
              Issue
            </label>
            <select
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select an issue</option>
              {issues[amenity].map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>
          </div>
        )}
        {amenity === 'others' && (
          <div>
            <label htmlFor="otherIssue" className="block text-sm font-medium text-gray-700">
              Describe the issue
            </label>
            <textarea
              id="otherIssue"
              value={otherIssue}
              onChange={(e) => setOtherIssue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>
    </main>
  );
};

export default RequestsManagementPage;