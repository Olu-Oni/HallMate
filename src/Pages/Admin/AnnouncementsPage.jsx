import React, { useState, useEffect, useContext } from "react";
import ExpandableSearchBar from "../../Components/ExpandableSearchBar";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Upload,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { MyStates } from "../../App";
import { NotificationContext } from "../../Components/Notification";
import { logAction } from "../../services/logs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
} from "../../services/announcements";

// Modal for displaying full announcement details
const AnnouncementModal = ({ announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="primaryBg rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{announcement.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Calendar size={16} />
                <p className="text-sm">{announcement.date}</p>
                {announcement.attachments &&
                  announcement.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Attachments
                      </h3>
                      <div className="space-y-2">
                        {announcement.attachments.map((file, index) => (
                          <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
                          >
                            <FileText size={16} className="text-blue-500" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                {announcement.sender && (
                  <>
                    <span className="mx-1">•</span>
                    <User size={16} />
                    <p className="text-sm">{announcement.sender}</p>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-4 prose max-w-none">
            <p className="whitespace-pre-line">{announcement.content}</p>
          </div>

          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Attachments</h3>
              <div className="space-y-2">
                {announcement.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-3 secondaryBg flex justify-end">
          <button
            onClick={onClose}
            className="primaryBg hover:bg-gray-300 px-4 py-2 rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// New Announcement Form Modal
const NewAnnouncementModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { currentUser } = useAuth();
  const myStates = useContext(MyStates);
  const { userInfo } = myStates?.user || {};

  const categoryOptions = [
    "Pinned",
    // "Latest",
    "General Notice",
    "Maintenance",
    "Events",
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    // Limit total files to 5
    const updatedFiles = [...files, ...newFiles].slice(0, 5);
    setFiles(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const toggleCategory = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Content is required";
    if (categories.length === 0)
      errors.categories = "At least one category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Upload files to Firebase Storage
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `announcements/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      // Create the announcement object
      const newAnnouncement = {
        title,
        content,
        category: categories,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        sender: userInfo?.name || "Admin",
        attachments: fileUrls.map((url, index) => ({
          name: files[index].name,
          size: files[index].size,
          type: files[index].type,
          url,
        })),
      };

      // Call the onSave function to save the announcement
      onSave(newAnnouncement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      showNotification("Failed to create announcement!", "error");
    }
  };

  console.log(files);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="secondaryBg flex flex-col rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 py-4 border-b">
          <h2 className="text-2xl font-bold">New Announcement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium  mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className={`w-full p-3 border primaryBg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${formErrors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium  mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows="6"
                  className={`w-full p-3 border primaryBg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${
                      formErrors.content ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter announcement details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.content}
                  </p>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium  mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors 
                        ${
                          categories.includes(category)
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {formErrors.categories && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.categories}
                  </p>
                )}
              </div>

              {/* Sender - Read only */}
              <div>
                <label className="block text-sm font-medium mb-1">Sender</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-md primaryBg cursor-not-allowed"
                  value={userInfo?.name || "Admin"}
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be automatically filled with your name
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachments (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop files here, or
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-2 inline-block px-4 py-2 primaryBg border border-gray-300 rounded-md text-sm font-medium  hover:bg-gray-50 cursor-pointer"
                  >
                    Browse Files
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum 5 files. PDF, DOCX, XLSX, PNG, JPG accepted.
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm font-medium truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-3 primaryBg flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2  border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Post Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

const EditAnnouncementModal = ({ isOpen, onClose, onSave, announcement }) => {
  const [title, setTitle] = useState(announcement?.title || "");
  const [content, setContent] = useState(announcement?.content || "");
  const [categories, setCategories] = useState(announcement?.category || []);
  const [files, setFiles] = useState(announcement?.attachments || []);
  const [isDragging, setIsDragging] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { currentUser } = useAuth();
  const myStates = useContext(MyStates);
  const { userInfo } = myStates?.user || {};

  // Update form state when announcement changes
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || "");
      setContent(announcement.content || "");
      setCategories(announcement.category || []);
      setFiles(announcement.attachments || []);
    }
  }, [announcement]);

  const categoryOptions = ["Pinned", "General Notice", "Maintenance", "Events"];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    // Limit total files to 5
    const updatedFiles = [...files, ...newFiles].slice(0, 5);
    setFiles(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const toggleCategory = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Content is required";
    if (categories.length === 0)
      errors.categories = "At least one category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Upload new files to Firebase Storage
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          if (file.url) return file; // Skip already uploaded files
          const storageRef = ref(storage, `announcements/${file.name}`);
          await uploadBytes(storageRef, file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: await getDownloadURL(storageRef),
          };
        })
      );

      // Create the updated announcement object
      const updatedAnnouncement = {
        ...announcement,
        title,
        content,
        category: categories,
        attachments: fileUrls,
      };

      // Call the onSave function to update the announcement
      onSave(updatedAnnouncement);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating announcement:", error);
      showNotification("Failed to update announcement!", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="secondaryBg flex flex-col rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Edit Announcement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className={`w-full p-3 border primaryBg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${formErrors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows="6"
                  className={`w-full p-3 border primaryBg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${
                      formErrors.content ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter announcement details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.content}
                  </p>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors 
                        ${
                          categories.includes(category)
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {formErrors.categories && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.categories}
                  </p>
                )}
              </div>

              {/* Sender - Read only */}
              <div>
                <label className="block text-sm font-medium mb-1">Sender</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-md primaryBg cursor-not-allowed"
                  value={userInfo?.name || "Admin"}
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be automatically filled with your name
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachments (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop files here, or
                  </p>
                  <input
                    id="file-upload-edit"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    multiple
                  />
                  <label
                    htmlFor="file-upload-edit"
                    className="mt-2 inline-block px-4 py-2 primaryBg border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    Browse Files
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum 5 files. PDF, DOCX, XLSX, PNG, JPG accepted.
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="text-sm font-medium truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {file.size
                              ? (file.size / 1024).toFixed(1) + " KB"
                              : ""}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-3 primaryBg flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Update Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete confirmation
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  announcement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="secondaryBg rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete the announcement "
          {announcement?.title}"?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern Announcement Card
const AnnouncementCard = ({ announcement, onClick, onEdit, onDelete }) => {
  // Find category with highest priority for badge color
  const getPriorityCategory = () => {
    if (announcement.category.includes("Pinned")) return "Pinned";
    if (announcement.category.includes("Latest")) return "Latest";
    return announcement.category[0];
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Pinned":
        return "bg-red-100 text-red-800";
      case "Latest":
        return "bg-purple-100 text-purple-800";
      case "General Notice":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-orange-100 text-orange-800";
      case "Events":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const shortenContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;

    // Find the last space before maxLength
    const lastSpace = content.lastIndexOf(" ", maxLength);
    return content.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
  };

  const priorityCategory = getPriorityCategory();
  const categoryColor = getCategoryColor(priorityCategory);

  return (
    <div
      onClick={onClick}
      className="flex flex-col p-5 border rounded-lg shadow-sm hover:shadow-md transition-all secondaryBg w-72 md:w-80 shrink-0 h-52 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg font-bold line-clamp-1">{announcement.title}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor}`}
        >
          {priorityCategory}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <Calendar size={12} />
        <span>{announcement.date}</span>
        {announcement.sender && (
          <>
            <span className="mx-1">•</span>
            <User size={12} />
            <span>{announcement.sender}</span>
          </>
        )}
      </div>

      <p className="text- text-sm flex-grow line-clamp-4">
        {shortenContent(announcement.content)}
      </p>

      {announcement.attachments && announcement.attachments.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <FileText size={12} />
          <span>
            {announcement.attachments.length} attachment
            {announcement.attachments.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Add Edit and Delete Buttons */}
      <div className="flex justify-end gap-6 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            onEdit(announcement);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            onDelete(announcement);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

// Category Section with Carousel Navigation
const CategorySection = ({
  category,
  announcements,
  onAnnouncementClick,
  onEdit,
  onDelete,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = React.useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Update scroll position after scrolling
    setTimeout(() => {
      setScrollPosition(container.scrollLeft);
    }, 300);
  };

  // Check if we can scroll in either direction
  const updateScrollPosition = () => {
    if (!carouselRef.current) return;
    setScrollPosition(carouselRef.current.scrollLeft);
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollPosition);
      return () =>
        container.removeEventListener("scroll", updateScrollPosition);
    }
  }, []);

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = carouselRef.current
    ? scrollPosition <
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    : false;

  if (announcements.length === 0) return null;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold ml-8">{category}</h2>

        {/* Navigation buttons */}
        {(canScrollLeft || canScrollRight) && (
          <div className="flex gap-8 mr-[10%]">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft
                  ? "border-gray-300 hover:bg-gray-100 text-gray-700"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight
                  ? "border-gray-300 hover:bg-gray-100 text-gray-700"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

// Main AnnouncementsPage Component
const AnnouncementsPage = () => {
  const { showNotification } = useContext(NotificationContext);
  const myStates = useContext(MyStates);
  const { userInfo } = myStates?.user || {};

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [showEditAnnouncementForm, setShowEditAnnouncementForm] =
    useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewAnnouncementForm, setShowNewAnnouncementForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const categories = [
    "Pinned",
    "Latest",
    "General Notice",
    "Maintenance",
    "Events",
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcements = await getAllAnnouncements();
        setAnnouncements(announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        showNotification("Failed to fetch announcements!", "error");
      }
    };

    fetchAnnouncements();
  }, []);

  console.log("announcements", announcements);

  const handleDeleteAnnouncement = async () => {
    console.log("announcment to delete", announcementToDelete);
    try {
      // Delete the announcement from Firestore
      await deleteAnnouncement(announcementToDelete.id);

      // Update the local state
      setAnnouncements((prev) =>
        prev.filter((ann) => ann.id !== announcementToDelete.id)
      );

      // Show success notification
      showNotification("Announcement deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showNotification("Failed to delete announcement!", "error");
    } finally {
      // Close the delete confirmation dialog
      setShowDeleteConfirmation(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleEditAnnouncement = async (updatedAnnouncement) => {
    try {
      // Update the announcement in Firestore
      await updateAnnouncement(updatedAnnouncement.id, updatedAnnouncement);

      // Update the local state
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann
        )
      );

      // Show success notification
      showNotification("Announcement updated successfully!", "success");

      // Close the edit modal
      setShowEditAnnouncementForm(false);
    } catch (error) {
      console.error("Error updating announcement:", error);
      showNotification("Failed to update announcement!", "error");
    }
  };

  const handleEditClick = (announcement) => {
    setAnnouncementToEdit(announcement);
    setShowEditAnnouncementForm(true);
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteConfirmation(true);
  };

  // Filter announcements based on search query
  const filteredAnnouncements = announcements
    ? announcements
        .filter((announcement) => announcement) // Filter out undefined/null announcements
        .filter(
          (announcement) =>
            announcement.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            announcement.content
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
    : [];

  const handleSaveAnnouncement = async (newAnnouncement) => {
    try {
      // Save the announcement to Firestore
      const response = await createAnnouncement(newAnnouncement);
      // Update the local state with the new announcement (including the Firestore ID)
      setAnnouncements((prev) => [
        { ...newAnnouncement, id: response.id }, // Add Firestore ID to the announcement
        ...prev,
      ]);

      // Close the modal
      setShowNewAnnouncementForm(false);

      // Show success notification
      showNotification("Announcement created successfully!", "success");

      // Log the action
      await logAction(
        "Admin",
        userInfo.id, // Admin ID
        userInfo.name, // Admin name
        "Created Announcement", // Action
        "Announcements", // Section
        null, // Previous state (no previous state for new announcements)
        newAnnouncement // Current state
      );
    } catch (error) {
      console.error("Error saving announcement:", error);
      showNotification("Failed to create announcement!", "error");
    }
  };

  // When an announcement is clicked
  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    showNotification(`Viewing announcement: ${announcement.title}`, "info");
  };

  // When the search query is cleared
  const handleClearSearch = () => {
    setSearchQuery("");
    showNotification("Search cleared", "info");
  };

  return (
    <main className="px-4 md:px-20 py-8 w-full relative">
      <div className="flex max-md:flex-col flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Announcements</h1>

        <div className="flex w-full max-sm:flex-col justify-between p-4 gap-4">
          <ExpandableSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={null}
          />

          <button
            onClick={() => setShowNewAnnouncementForm(true)}
            className="flex gap-2 text-nowrap h-fit px-4 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline text-white ">
              New Announcement
            </span>
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery ? (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  onEdit={(announcement) => {
                    setSelectedAnnouncement(announcement);
                    setShowEditAnnouncementForm(true);
                  }}
                  onDelete={(announcement) => {
                    setAnnouncementToDelete(announcement);
                    setShowDeleteConfirmation(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No announcements found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      ) : (
        // Display by categories when not searching
        categories.map((cat) => {
          const catAnnouncements = announcements.filter((ann) =>
            ann.category.includes(cat)
          );
          return (
            <CategorySection
              key={cat}
              category={cat}
              announcements={catAnnouncements}
              onAnnouncementClick={setSelectedAnnouncement}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          );
        })
      )}

      {/* Modals */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      <NewAnnouncementModal
        isOpen={showNewAnnouncementForm}
        onClose={() => setShowNewAnnouncementForm(false)}
        onSave={handleSaveAnnouncement}
      />
      <EditAnnouncementModal
        isOpen={showEditAnnouncementForm}
        onClose={() => setShowEditAnnouncementForm(false)}
        onSave={handleEditAnnouncement}
        announcement={announcementToEdit}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteAnnouncement}
        announcement={announcementToDelete}
      />
    </main>
  );
};

export default AnnouncementsPage;
