import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { getStudent } from '../../services/students';

const RequestsPage = () => {
  // Manage the student state
  const [student, setStudent] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      getStudent(currentUser.uid)
        .then((response) => setStudent(response))
        .catch((error) => console.error("Error fetching student:", error));
    }
  }, [currentUser?.uid]); // Ensure it runs when currentUser changes

  // State for new maintenance request
  const [newRequest, setNewRequest] = useState({
    roomNo: "",
    amenity: "",
    issue: "",
    otherIssue: "",
    status: "Pending",
  });

  // Update newRequest when student is fetched
  useEffect(() => {
    if (student) {
      setNewRequest((prev) => ({
        ...prev,
        roomNo: student.displayInfo?.roomNo || "",
      }));
    }
  }, [student]);

  const resetNewRequest = () => {
    setNewRequest({
      roomNo: student?.displayInfo?.roomNo || "",
      amenity: "",
      issue: "",
      otherIssue: "",
      status: "Pending",
    });
  };

  // Existing requests (temporary example data)
  const [requests, setRequests] = useState([
    {
      id: 1,
      // roomNumber: "101",
      amenity: "electrical",
      issue: "light bulbs",
      status: "In Progress",
    },
    {
      id: 2,
      // roomNumber: "202",
      amenity: "plumbing",
      issue: "tap",
      status: "Completed",
    },
  ]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      id: requests.length + 1,
      roomNumber: newRequest.roomNo,
      amenity: newRequest.amenity,
      issue: newRequest.amenity === "others" ? newRequest.otherIssue : newRequest.issue,
      status: "Pending",
    };

    setRequests([...requests, newEntry]); // Update request list
    resetNewRequest(); // Reset form
    console.log("Request submitted:", newEntry);

    // TODO: Send request to the hall admin (API call)
  };

  const issues = {
    electrical: ["Fans", "Sockets", "Light bulbs"],
    plumbing: ["Wash hand basin", "Shower", "Tap", "WC"],
    carpentry: ["Broken beds", "Damaged lockers", "Damaged doors"],
  };

  // Progress bar function
  const getStatusProgress = (status) => {
    switch (status) {
      case "Pending":
        return 25;
      case "In Progress":
        return 50;
      case "Completed":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Maintenance Requests</h1>

      {/* New Request Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">New Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Number */}
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              value={newRequest.roomNo}
              disabled
              className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Amenity Selection */}
          <div>
            <label htmlFor="amenity" className="block text-sm font-medium text-gray-700">
              Amenity
            </label>
            <select
              id="amenity"
              value={newRequest.amenity}
              onChange={(e) => setNewRequest({ ...newRequest, amenity: e.target.value, issue: "" })}
              className="mt-1 block pr-20 border secondaryBg border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select an amenity</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="carpentry">Carpentry</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Issue Selection (if not 'others') */}
          {newRequest.amenity && newRequest.amenity !== "others" && (
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
                Issue
              </label>
              <select
                id="issue"
                value={newRequest.issue}
                onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select an issue</option>
                {issues[newRequest.amenity].map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Other Issue (if 'others' is selected) */}
          {newRequest.amenity === "others" && (
            <div>
              <label htmlFor="otherIssue" className="block text-sm font-medium text-gray-700">
                Describe the issue
              </label>
              <textarea
                id="otherIssue"
                value={newRequest.otherIssue}
                onChange={(e) => setNewRequest({ ...newRequest, otherIssue: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          )}

          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600">
            Submit Request
          </button>
        </form>

        <hr className="my-10" />

        {/* Existing Requests */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Existing Requests</h2>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border rounded shadow-sm">
                <p><strong>Amenity:</strong> {request.amenity}</p>
                <p><strong>Issue:</strong> {request.issue}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className={`h-4 rounded-full ${request.status === "Completed" ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ width: `${getStatusProgress(request.status)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default RequestsPage;
