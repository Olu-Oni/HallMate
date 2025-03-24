import React, { useState, useEffect, useContext } from "react";
import { Pencil, Trash, Plus } from "lucide-react";
import { createRequest, deleteRequest, getAllRequests, updateRequest } from "../../services/requests";
import { Link } from "react-router-dom";
import { NotificationContext } from "../../Components/Notification";
import { logAction } from "../../services/logs";
import { MyStates } from "../../App";
import RequestCategory from "./Requests/RequestCategory";
import RequestForm from "./Requests/RequestForm";
import Modal from "./Requests/Modal";

const RequestsManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newRequest, setNewRequest] = useState({
    roomNo: "",
    amenity: "",
    issue: "",
    desc: "",
    otherIssue: "",
    status: "Pending",
  });
  const { showNotification } = useContext(NotificationContext);
  const { user } = useContext(MyStates);
  
  useEffect(() => {
    getAllRequests()
      .then((response) => setRequests(response))
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  const resetNewRequest = () => {
    setNewRequest({
      roomNo: "",
      amenity: "",
      desc: "",
      issue: "",
      otherIssue: "",
      status: "Pending",
    });
  };

  const openNewRequestModal = () => {
    resetNewRequest();
    setModalType("new");
    setIsModalOpen(true);
  };

  const openEditModal = (requestId) => {
    const requestToEdit = requests.find((req) => req.id === requestId);
    if (requestToEdit) {
      setNewRequest({
        id: requestToEdit.id,
        roomNo: requestToEdit.roomNo,
        amenity: requestToEdit.type,
        desc: requestToEdit.desc,
        issue: requestToEdit.issue,
        otherIssue: requestToEdit.issue,
        status: requestToEdit.status,
      });
      setModalType("edit");
      setIsModalOpen(true);
    }
  };

  const openDeleteModal = () => {
    if (selectedRequests.length > 0) {
      setModalType("delete");
      setIsModalOpen(true);
    }
  };

  const handleChangeStatus = (requestIds, newStatus) => {
    requestIds.forEach((id) => {
      const request = requests.find((req) => req.id === id);
      if (request) {
        const updatedRequest = { ...request, status: newStatus };
        updateRequest(id, updatedRequest)
          .then((res) => {
            logAction(
              "Admin",
              user.userInfo.id,
              user.userInfo.name,
              "status changed",
              "Request Management",
              request,
              res
            );
            showNotification("Request status updated successfully", "success");
            setRequests((prevRequests) =>
              prevRequests.map((req) =>
                requestIds.includes(req.id) ? { ...req, status: newStatus } : req
              )
            );
          })
          .catch((error) => {
            showNotification("Error updating request status", "error");
            console.error(`Error updating request ${id}:`, error);
          });
      }
    });
    setSelectedRequests([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      roomNo: newRequest.roomNo,
      desc: newRequest.desc,
      type: newRequest.amenity,
      issue: newRequest.amenity === "others" ? newRequest.otherIssue : newRequest.issue,
      status: "Pending",
    };

    if (modalType === "edit") {
      const oldRequest = requests.find((req) => req.id === newRequest.id);
      updateRequest(newRequest.id, requestData)
        .then((res) => {
          logAction(
            "Admin",
            user.userInfo.id,
            user.userInfo.name,
            "Updated",
            "Request Management",
            requestData,
            
          );
          showNotification("Request information updated successfully", "success");
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === newRequest.id ? { ...req, ...requestData } : req
            )
          );
        })
        .catch((error) => {
          showNotification("Error editing request", "error");
          console.error("Error updating request:", error);
        });
    } else {
      createRequest(requestData)
        .then((res) => {
          logAction(
            "Admin",
            user.userInfo.id,
            user.userInfo.name,
            "Created",
            "Request Management",
            null,
            res
          );
          showNotification("Request created successfully", "success");
          setRequests((prevRequests) => [...prevRequests, res]);
        })
        .catch((error) => {
          showNotification("Error creating request", "error");
          console.error("Error creating request:", error);
        });
    }

    setIsModalOpen(false);
    resetNewRequest();
    setSelectedRequests([]);
  };

  const handleDelete = () => {
    selectedRequests.forEach((reqId) => {
      const requestToDelete = requests.find((req) => req.id === reqId);
      deleteRequest(reqId)
        .then(() => {
          logAction(
            "Admin",
            user.userInfo.id,
            user.userInfo.name,
            "Deleted",
            "Request Management",
            requestToDelete,
            null
          );
          showNotification("Request deleted successfully", "warning");
          setRequests((prevRequests) =>
            prevRequests.filter((req) => !selectedRequests.includes(req.id))
          );
        })
        .catch((error) => {
          showNotification("Error deleting request", "error");
          console.error(`Error deleting request ${reqId}:`, error);
        });
    });
    
    setIsModalOpen(false);
    setSelectedRequests([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <main className="px-4 py-6 md:px-[5%]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
        <h1 className="text-2xl mx-auto font-bold">Maintenance Requests</h1>
        <div className="flex gap-3">
          {selectedRequests.length > 0 && (
            <div className="flex gap-2">
              {selectedRequests.length === 1 && (
                <button
                  onClick={() => openEditModal(selectedRequests[0])}
                  className="flex items-center gap-1 py-2 px-3 bg-blue-300 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={openDeleteModal}
                className="flex items-center gap-1 py-2 px-3 bg-red-400 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash size={16} />
                <span>
                  Delete{" "}
                  {selectedRequests.length > 1 ? `(${selectedRequests.length})` : ""}
                </span>
              </button>
            </div>
          )}
          <button
            onClick={openNewRequestModal}
            className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>
      </div>
      <Link to={"/Maintenance-Report"} className="underline underline-offset-2">
      View Maintenance Reports
      </Link>
      <section className="space-y-4 mt-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Existing Requests</h2>
        <RequestCategory
          categoryName="Pending"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />
        <RequestCategory
          categoryName="Reviewed"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />
        <RequestCategory
          categoryName="Completed"
          requests={requests}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangeStatus={handleChangeStatus}
        />
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
      <Modal isOpen={isModalOpen && modalType === "delete"} onClose={closeModal}>
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