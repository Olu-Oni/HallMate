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
    amenity: "",
      desc: "",
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
        student: student?.displayInfo?.name || "",
      }));
    }
  }, [student]);

  const resetNewRequest = () => {
    setNewRequest({
      roomNo: student?.displayInfo?.roomNo || "",
      student: student?.displayInfo?.name || "",
      amenity: "",
      desc: "",
      issue: "",
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
      desc: newRequest.desc,
      type: newRequest.amenity,
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
        console.log('request made', res);
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

  // Appliance and specific issue options

  const appliances = {
    electrical: [
      "fans",
      "sockets",
      "light bulbs",
      "wiring",
      "circuit breakers",
    ],
    plumbing: ["wash hand basin", "shower", "tap", "wc", "leakage"],
    carpentry: [
      "beds",
      "lockers",
      "doors",
      "chairs",
    ],
  };

  const specificIssues = {
    electrical: ["not working", "sparking", "loose connection", "flickering"],
    plumbing: ["leaking", "clogged", "broken", "low pressure"],
    carpentry: ["broken", "damaged", "loose", "squeaky"],
  };

  const mergeIssue = (appliance, specificIssue) => {
    return `${appliance} - ${specificIssue}`;
  };


  // Progress bar function
  const getStatusProgress = (status) => {
    switch (status) {
      case "Pending":
        return {length:0, color:"bg-grey-500"};
      case "Reviewed":
        return {length:50, color:"bg-blue-500"};
      case "Completed":
        return {length: 100, color:"bg-green-500"};
      case "Cancelled":
        return {length:100, color:"bg-red-500"};
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
              value={newRequest.amenity}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  amenity: e.target.value,
                appliance: "",
                specificIssue: "",
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

          
        {/* Appliance Selection (if not 'others') */}
        {newRequest.amenity && newRequest.amenity !== "others" && (
          <div>
            <label htmlFor="appliance" className="block text-sm font-medium mb-1">
              Appliance
            </label>
            <select
              id="appliance"
              value={newRequest.appliance}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  appliance: e.target.value,
                  issue: mergeIssue(e.target.value, newRequest.specificIssue),
                })
              }
              className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an appliance</option>
              {appliances[newRequest.amenity]?.map((appliance) => (
                <option key={appliance} value={appliance}>
                  {appliance}
                </option>
              ))}
            </select>
          </div>
        )}
  
        {/* Specific Issue Selection (if not 'others') */}
        {newRequest.amenity && newRequest.amenity !== "others" && (
          <div>
            <label
              htmlFor="specificIssue"
              className="block text-sm font-medium mb-1"
            >
              Specific Issue
            </label>
            <select
              id="specificIssue"
              value={newRequest.specificIssue}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  specificIssue: e.target.value,
                  issue: mergeIssue(newRequest.appliance, e.target.value),
                })
              }
              className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a specific issue</option>
              {specificIssues[newRequest.amenity]?.map((specificIssue) => (
                <option key={specificIssue} value={specificIssue}>
                  {specificIssue}
                </option>
              ))}
            </select>
          </div>
        )}
  
        {/* Other Issue (if 'others' is selected) */}
        {newRequest.amenity === "others" && (
          <div>
            <label
              htmlFor="otherIssue"
              className="block text-sm font-medium  mb-1"
            >
              Describe the issue
            </label>
            <textarea
              id="otherIssue"
              value={newRequest.otherIssue}
              onChange={(e) =>
                setNewRequest({ ...newRequest, otherIssue: e.target.value })
              }
              className="block w-full border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>
        )}
        {/* Additional description */}
        {newRequest.amenity != "others" && (
          <div>
            <label
              htmlFor="additionalDesc"
              className="block text-sm font-medium mb-1"
            >
              Additional descriptions on the issue{" "}
              <strong>
                {" "}
                <i className="text-nowrap">( if any )</i>
              </strong>
            </label>
            <textarea
              id="additionalDesc"
              value={newRequest.desc}
              onChange={(e) =>
                setNewRequest({ ...newRequest, desc: e.target.value })
              }
              className="block w-full border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="fill here..."
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
                      getStatusProgress(request.status).color
                    }`}
                    style={{ width: `${getStatusProgress(request.status).length}%` }}
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
