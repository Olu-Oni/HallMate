import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getStudent } from "../../services/students";
import { createRequest, getAllRequests, getRequestsByRoom } from "../../services/requests";
import { NotificationContext } from "../../Components/Notification";
import { logAction } from "../../services/logs";

const RequestsPage = () => {
  // Notifications context
  const { showNotification } = useContext(NotificationContext);
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

  console.log("info", student);
  // State for new maintenance request
  const [newRequest, setNewRequest] = useState({
    roomNo: "",
    type: "",
    issue: "",
    desc: "",
    otherIssue: "",
    status: "Pending",
  });

  // Update newRequest when student is fetched
  useEffect(() => {
    if (student) {
      setNewRequest((prev) => ({
        ...prev,
        roomNo: student.displayInfo?.roomNo || "",
        student: student?.displayInfo?.name || "",
      }));
    }
  }, [student]);

  const resetNewRequest = () => {
    setNewRequest({
      roomNo: student?.displayInfo?.roomNo || "",
      student: student?.displayInfo?.name || "",
      type: "",
      issue: "",
      desc: "",
      otherIssue: "",
      status: "Pending",
    });
  };

  // Existing requests (temporary example data)
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    student &&
    getRequestsByRoom(student.displayInfo.roomNo)
      .then((response) => {
        setRequests(response);
        console.log(requests);
      })
      .catch((error) => {
        showNotification(
          "Error fetching requests, Please check your internet Connection",
          "error"
        );
        console.error("Error fetching requests:", error);
      });
  }, [student]);

  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Show the modal
  };

  // Handle confirmation of the modal
  const handleConfirm = async () => {
    const newEntry = {
      roomNo: newRequest.roomNo,
      student: newRequest.student,
      type: newRequest.type,
      issue:
        newRequest.type === "others" ? newRequest.otherIssue : newRequest.issue,
      status: "Pending",
    };

    await createRequest(newEntry)
      .then(async (res) =>
        await logAction(
          "Student",
          student.id, // Replace with actual admin ID
          student.displayInfo.name, // Replace with actual admin name
          "Made Request", // Action
          "Student Request Management",
          null, // Previous changes
          res // cuurent change
        )
      )
      .then((res) => {
        showNotification("Request Submitted", "success");

        setRequests((prevRequests) => [...prevRequests, res]);
      })
      .catch((error) =>
        showNotification(
          "Error Creating request, Please check your internet Connection",
          "error"
        )
      );
    setRequests([...requests, newEntry]); // Update request list
    resetNewRequest(); // Reset form
    console.log("Request submitted:", newEntry);

    setIsModalOpen(false); // Close the modal
  };

  // Handle cancellation of the modal
  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
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
            <label htmlFor="roomNumber" className="block text-sm font-medium ">
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
            <label htmlFor="amenity" className="block text-sm font-medium ">
              Amenity
            </label>
            <select
              id="amenity"
              value={newRequest.type}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  type: e.target.value,
                  issue: "",
                })
              }
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
          {newRequest.type && newRequest.type !== "others" && (
            <div>
              <label htmlFor="issue" className="block text-sm font-medium ">
                Issue
              </label>
              <select
                id="issue"
                value={newRequest.issue}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, issue: e.target.value })
                }
                className="mt-1 block w-full border secondaryBg border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select an issue</option>
                {issues[newRequest.type].map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Other Issue (if 'others' is selected) */}
          {newRequest.type === "others" && (
            <div>
              <label
                htmlFor="otherIssue"
                className="block text-sm font-medium "
              >
                Describe the issue
              </label>
              <textarea
                id="otherIssue"
                value={newRequest.otherIssue}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, otherIssue: e.target.value })
                }
                className="mt-1 block w-full primaryBg border border-gray-300 rounded-md shadow-sm p-2"
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

        <hr className="my-10" />

        {/* Existing Requests */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Existing Requests</h2>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border rounded shadow-sm">
                <p>
                  <strong>Amenity:</strong> {request.type}
                </p>
                <p>
                  <strong>Issue:</strong> {request.issue}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <div className="w-full bg-slate-300 rounded-full h-4 mt-2">
                  <div
                    className={`h-4 rounded-full ${
                      request.status === "Completed"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${getStatusProgress(request.status)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="secondaryBg p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Request</h2>
            <p>Are you sure you want to submit this request?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RequestsPage;
