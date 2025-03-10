import React, { useState, useEffect } from "react";
import { X, Pencil, Trash, Plus, Check } from "lucide-react"; // Using Lucide icons for modern UI
import {
  createRequest,
  deleteRequest,
  getAllRequests,
  updateRequest,
} from "../../services/requests";

const Request = ({ request, selected, onSelect, onEdit, onDelete }) => {
  // If no request data is provided, use placeholder data
  const requestData = request || {
    id: Math.random().toString(36).substr(2, 9),
    type: "electrical",
    issue: "light bulbs",
    date: "21-02-2025",
    roomNo: "202",
  };

  return (
    <tr className={`transition-colors ${selected ? "" : ""}`}>
      <td className="w-fit px-2 ">
        <input
          type="checkbox"
          className="scale-150 cursor-pointer"
          checked={selected}
          onChange={(e) => onSelect(requestData.id, e.target.checked)}
        />
      </td>
      <td className="border-r-2 border-t-2 border-solid p-2">
        {requestData.type}
      </td>
      <td className="border-x-2 border-t-2 border-solid text-nowrap p-2">
        {requestData.issue}
      </td>
      <td className="border-x-2 border-t-2 border-solid p-2">
        {requestData.createdAt}
      </td>
      <td className="border-l-2 border-t-2 border-solid p-2">
        {requestData.roomNo}
      </td>
    </tr>
  );
};

const RequestsList = ({
  categoryRequests,
  selectedRequests,
  setSelectedRequests,
  onEdit,
  onDelete,
}) => {
  // Filter requests based on category
  const filteredRequests = categoryRequests || [];

  // Handle checkbox selection
  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedRequests((prev) => [...prev, id]);
    } else {
      setSelectedRequests((prev) =>
        prev.filter((requestId) => requestId !== id)
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1 text-sm border-b min-w-[550px]">
        <thead>
          <tr className="secondaryBg">
            <td className="w-fit px-2 primaryBg">
              <input
                type="checkbox"
                className="scale-[150%] cursor-pointer"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRequests(filteredRequests.map((req) => req.id));
                  } else {
                    setSelectedRequests([]);
                  }
                }}
                checked={
                  filteredRequests.length > 0 &&
                  filteredRequests.every((req) =>
                    selectedRequests.includes(req.id)
                  )
                }
              />
            </td>
            <td className="border-2 p-2 font-semibold text-nowrap">
              Request Type
            </td>
            <td className="border-2 p-2 font-semibold">Issue</td>
            <td className="border-2 p-2 font-semibold text-nowrap">
              Date Requested
            </td>
            <td className="border-2 p-2 font-semibold">Room</td>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.map((req) => (
            <Request
              key={req.id}
              request={req}
              selected={selectedRequests.includes(req.id)}
              onSelect={handleSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {filteredRequests.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const RequestCategory = ({
  categoryName,
  requests,
  selectedRequests,
  setSelectedRequests,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  // State for expanding request section
  const [expand, setExpand] = useState(true);
  // State for status change dropdown visibility
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Filter requests for this category
  const categoryRequests = requests?.filter(
    (req) => req.status === categoryName
  );

  // Get selected requests for this category
  const selectedCategoryRequests =
    categoryRequests
      ?.filter((req) => selectedRequests.includes(req.id))
      ?.map((req) => req.id) || [];

  return (
    <div
      className={`${
        !expand ? "overflow-hidden" : ""
      } mb-6 border border-gray-200 rounded-lg shadow-sm`}
    >
      <div className="secondaryBg rounded-t-lg flex justify-between items-center">
        <button
          onClick={() => setExpand(!expand)}
          className="  flex-grow flex items-center gap-3 p-4 text-left hover:brightness-[85%] transition-colors"
        >
          <div
            className={`transition-transform duration-300 ${
              expand ? "rotate-180" : ""
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-bold text-lg">{categoryName}</h2>
        </button>

        {/* Status change button */}
        {selectedCategoryRequests.length > 0 && (
          <div className="relative px-4">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-1 py-2 px-2 text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
            >
              <span>
                Change Status{" "}
                {selectedCategoryRequests.length > 1
                  ? `(${selectedCategoryRequests.length})`
                  : ""}
              </span>
            </button>

            {/* Status change dropdown */}
            {showStatusDropdown && (
              <div className="absolute right-4 top-full mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 p-2 min-w-[200px]">
                <div className="flex flex-col gap-2">
                  {["Pending", "Reviewed", "Completed", "Cancelled"]
                    .filter((status) => status !== categoryName)
                    .map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          onChangeStatus(selectedCategoryRequests, status);
                          setShowStatusDropdown(false);
                        }}
                        className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded text-left"
                      >
                        <Check size={16} className="text-blue-500" />
                        <span>{status}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {expand && (
        <div className="p-4">
          <RequestsList
            categoryRequests={categoryRequests}
            selectedRequests={selectedRequests}
            setSelectedRequests={setSelectedRequests}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

// Request form component that can be used in modal or as a standalone form
const RequestForm = ({
  newRequest,
  setNewRequest,
  handleSubmit,
  resetNewRequest,
  isEdit,
  onCancel,
}) => {
  const issues = {
    electrical: ["fans", "sockets", "light bulbs"],
    plumbing: ["wash hand basin", "shower", "tap", "wc"],
    carpentry: ["broken beds", "damaged lockers", "damaged doors"],
  };

  return (
    <form onSubmit={handleSubmit} className="flex primaryBg flex-col gap-4">
      {/* Form title */}
      <h2 className="text-xl font-semibold mb-2">
        {isEdit ? "Edit Request" : "New Request"}
      </h2>

      {/* Room Number */}
      <div>
        <label htmlFor="roomNumber" className="block text-sm font-medium  mb-1">
          Room Number
        </label>
        <input
          type="text"
          id="roomNumber"
          value={newRequest.roomNo}
          onChange={(e) =>
            setNewRequest({
              ...newRequest,
              roomNo: e.target.value,
            })
          }
          required
          className="block w-24 border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* status Selection */}
      {/* <div>
        <label htmlFor="status" className="block text-sm font-medium  mb-1">
          Status
        </label>
        <select
          id="status"
          value={newRequest.status}
          onChange={(e) =>
            setNewRequest({
              ...newRequest,
              status: e.target.value,
            })
          }
          className="block w-[70%] max-w-md border secondaryBg border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={!isEdit}
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div> */}
      {/* Amenity Selection */}
      <div>
        <label htmlFor="amenity" className="block text-sm font-medium  mb-1">
          Select an amenity
        </label>
        <select
          id="amenity"
          value={newRequest.amenity}
          onChange={(e) =>
            setNewRequest({
              ...newRequest,
              amenity: e.target.value,
              issue: "",
            })
          }
          className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {/* <option value="">Select an amenity</option> */}
          <option value="">none</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="carpentry">Carpentry</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Issue Selection (if not 'others') */}
      {newRequest.amenity && newRequest.amenity !== "others" && (
        <div>
          <label htmlFor="issue" className="block text-sm font-medium mb-1">
            Issue
          </label>
          <select
            id="issue"
            value={newRequest.issue}
            onChange={(e) =>
              setNewRequest({ ...newRequest, issue: e.target.value })
            }
            className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select an issue</option>
            {issues[newRequest.amenity]?.map((issue) => (
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
          <label
            htmlFor="otherIssue"
            className="block text-sm font-medium text-gray-500 mb-1"
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

      {/* Form buttons */}
      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEdit ? "Update Request" : "Submit Request"}
        </button>
      </div>
    </form>
  );
};

// Modal component for forms and confirmations
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="primaryBg rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const RequestsManagementPage = () => {
  // State for maintenance requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getAllRequests()
      .then((response) => {
        setRequests(response);
        // console.log(response);
      })
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  // State for selected requests
  const [selectedRequests, setSelectedRequests] = useState([]);

  // state for changes made
  // const [updated, setUpdated] = useState(false);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'new', 'edit', 'delete', or 'changeStatus'

  // State for new/edited maintenance request
  const [newRequest, setNewRequest] = useState({
    roomNo: "",
    amenity: "",
    issue: "",
    otherIssue: "",
    status: "Pending",
  });

  // State for status change
  const [statusChangeInfo, setStatusChangeInfo] = useState({
    requestIds: [],
    newStatus: "",
  });

  // Get student info from context or props (assuming it exists in your app)
  // const student = { displayInfo: { roomNo: "202" } };

  // Reset form
  const resetNewRequest = () => {
    setNewRequest({
      roomNo: "",
      amenity: "",
      issue: "",
      otherIssue: "",
      status: "Pending",
    });
  };

  
  // Open modal for creating a new request
  const openNewRequestModal = () => {
    resetNewRequest();
    setModalType("new");
    setIsModalOpen(true);
  };

  // Open modal for editing a request
  const openEditModal = (requestId) => {
    // Find the request to edit
    const requestToEdit = requests.find((req) => req.id === requestId);
    if (requestToEdit) {
      setNewRequest({
        id: requestToEdit.id,
        roomNo: requestToEdit.roomNo,
        amenity: requestToEdit.type,
        issue: requestToEdit.issue,
        otherIssue: requestToEdit.issue,
        status: requestToEdit.status,
      });
      setModalType("edit");
      setIsModalOpen(true);
    }
  };

  // Open modal for deleting request(s)
  const openDeleteModal = () => {
    if (selectedRequests.length > 0) {
      setModalType("delete");
      setIsModalOpen(true);
    }
  };

  // Handle changing status of selected requests
  const handleChangeStatus = (requestIds, newStatus) => {
    // Update requests in the backend
    requestIds.forEach((id) => {
      const request = requests.find((req) => req.id === id);
      if (request) {
        const updatedRequest = { ...request, status: newStatus };
        updateRequest(id, updatedRequest)
          .then(() => {
            console.log(`Request ${id} status updated to ${newStatus}`);
            // Update request status in the UI
            setRequests((prevRequests) =>
              prevRequests.map((req) =>
                requestIds.includes(req.id)
                  ? { ...req, status: newStatus }
                  : req
              )
            );
          })
          .catch((error) =>
            console.error(`Error updating request ${id}:`, error)
          );
      }
    });

    // Clear selected requests
    setSelectedRequests([]);
  };

  // Handle form submission for new or edited request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the request object
    const requestData = {
      roomNo: newRequest.roomNo,
      type: newRequest.amenity,
      issue:
        newRequest.amenity === "others"
          ? newRequest.otherIssue
          : newRequest.issue,
      status: "Pending",
    };

    if (modalType === "edit") {
      // Update existing request
      await updateRequest(newRequest.id, requestData)
        .then((response) => {
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === newRequest.id ? { ...req, ...requestData } : req
            )
          );
          console.log("Request updated:", response);
        })
        .catch((error) => console.error("Error updating request:", error));
    } else {
      // Add new request
      await createRequest(requestData)
        .then((res) => {
          console.log("Request submitted:", res);
          setRequests((prevRequests) => [...prevRequests, res]);
        })
        .catch((error) => console.error("Error creating request:", error));
    }

    // Close modal and reset form
    setIsModalOpen(false);
    resetNewRequest();
    setSelectedRequests([]);
  };

  // Handle delete requests
  const handleDelete = () => {
    // Remove selected requests
    selectedRequests.forEach(
      reqId=>{
        console.log('request to be deleted:>', reqId)
        deleteRequest(reqId).then(
          setRequests((prevRequests) =>
            prevRequests.filter((req) => !selectedRequests.includes(req.id))
          )
        ).catch((error) =>
          console.error(`Error deleting request ${id}:`, error)
        );
      }
    )

    // TODO: Send delete request to the backend API
    // selectedRequests.forEach(id => API.delete(`/maintenance-requests/${id}`));
    console.log("Deleted requests:", selectedRequests);

    // Close modal and clear selections
    setIsModalOpen(false);
    setSelectedRequests([]);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <main className="px-4 py-6 md:px-[5%]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
        <h1 className="text-2xl mx-auto font-bold">Maintenance Requests</h1>

        {/* Action buttons based on selection */}
        <div className="flex gap-3">
          {selectedRequests.length > 0 && (
            <div className="flex gap-2">
              {/* edit */}
              {selectedRequests.length === 1 && (
                <button
                  onClick={() => openEditModal(selectedRequests[0])}
                  className="flex items-center gap-1 py-2 px-3 bg-blue-300 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>
              )}
              {/* delete */}
              <button
                onClick={openDeleteModal}
                className="flex items-center gap-1 py-2 px-3 bg-red-400 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash size={16} />
                <span>
                  Delete{" "}
                  {selectedRequests.length > 1
                    ? `(${selectedRequests.length})`
                    : ""}
                </span>
              </button>
            </div>
          )}

          {/* New request button */}
          <button
            onClick={openNewRequestModal}
            className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Existing Requests */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Existing Requests
        </h2>

        {/* Pending Requests */}
        <RequestCategory
          categoryName="Pending"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />

        {/* Reviewed Requests */}
        <RequestCategory
          categoryName="Reviewed"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />

        {/* Completed Requests */}
        <RequestCategory
          categoryName="Completed"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />

        {/* Cancelled Requests */}
        <RequestCategory
          categoryName="Cancelled"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />
      </section>

      {/* Modals */}
      {/* New/Edit Request Modal */}
      <Modal
        isOpen={isModalOpen && (modalType === "new" || modalType === "edit")}
        onClose={closeModal}
      >
        <RequestForm
          newRequest={newRequest}
          setNewRequest={setNewRequest}
          handleSubmit={handleSubmit}
          resetNewRequest={resetNewRequest}
          isEdit={modalType === "edit"}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen && modalType === "delete"}
        onClose={closeModal}
      >
        <div className="text-center">
          <Trash size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            {selectedRequests.length === 1
              ? "this request"
              : `these ${selectedRequests.length} requests`}
            ? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={closeModal}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default RequestsManagementPage;
