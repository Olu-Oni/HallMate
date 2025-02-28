import React, { useState } from 'react';

const RequestsPage = () => {
  // variables to manage the student requests
  const [roomNumber, setRoomNumber] = useState('');
  const [amenity, setAmenity] = useState('');
  const [issue, setIssue] = useState('');
  const [otherIssue, setOtherIssue] = useState('');
  const [requests, setRequests] = useState([
    {
      id: 1,
      roomNumber: '101',
      amenity: 'electrical',
      issue: 'light bulbs',
      status: 'In Progress'
    },
    {
      id: 2,
      roomNumber: '202',
      amenity: 'plumbing',
      issue: 'tap',
      status: 'Completed'
    }
  ]);

  // for submission of the request
  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: requests.length + 1,
      roomNumber,
      amenity,
      issue: amenity === 'others' ? otherIssue : issue,
      status: 'Pending'
    };
    // to add new request to the list of requests
    setRequests([...requests, newRequest]);
    // Reset form inputs
    setRoomNumber('');
    setAmenity('');
    setIssue('');
    setOtherIssue('');
    console.log('Request submitted:', newRequest);
    // Here we add the code to send the request to the hall admin
  };

  const issues = {
    electrical: ['fans', 'sockets', 'light bulbs'],
    plumbing: ['Wash hand basin', 'Shower', 'Tap', 'Wc'],
    carpentry: ['Broken beds', 'Damaged lockers', 'Damaged doors'],
  };

  // progress bar
  const getStatusProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Maintenance Requests</h1>
      
      {/* Existing Requests */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="p-4 border rounded shadow-sm">
              <p><strong>Room Number:</strong> {request.roomNumber}</p>
              <p><strong>Amenity:</strong> {request.amenity}</p>
              <p><strong>Issue:</strong> {request.issue}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className={`h-4 rounded-full ${request.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${getStatusProgress(request.status)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Request Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">New Request</h2>
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
      </section>
    </main>
  );
};

export default RequestsPage;