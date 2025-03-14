import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, X, ArrowBigLeft } from "lucide-react";
import UserCircle from "../../Components/svg/UserCircle";
import {
  createStudent,
  getStudentWithoutUser,
  updateStudent,
} from "../../services/students";
import { MyStates } from "../../App";
import { deepCompareObjects } from "../../services/functions.js";
import { logAction } from "../../services/logs";
import { NotificationContext } from "../../Components/Notification";

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="secondaryBg rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              !isOpen === "save" ? "bg-red-500" : "bg-orange-500"
            } text-white rounded-md hover:bg-white hover:outline hover:text-orange-700 -outline-offset-2 transition`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Field Modal Component
const FieldModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  heading,
  value,
  isEditing,
}) => {
  const [newHeading, setNewHeading] = useState(heading || "");
  const [newValue, setNewValue] = useState(value || "");

  useEffect(() => {
    setNewHeading(heading || "");
    setNewValue(value || "");
  }, [heading, value]);

  const handleSave = () => {
    if (newHeading.trim()) {
      onSave(newHeading, newValue);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="primaryBg rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Field" : "Add New Field"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Field Heading"
            value={newHeading}
            onChange={(e) => setNewHeading(e.target.value)}
            className="w-full p-2  rounded-md focus:ring-2 secondaryBg outline-none focus:outline"
          />
          <input
            type="text"
            placeholder="Field Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full p-2  rounded-md focus:ring-2 secondaryBg outline-none focus:outline"
          />
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                onClick={() => onDelete(heading)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center"
              >
                <Trash2 className="mr-2" size={16} /> Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              {isEditing ? "Done" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Student Info Management Page
const StudentInfoManagementPage = () => {
  const myStates = useContext(MyStates);
  const { showNotification } = useContext(NotificationContext);

  const { user } = myStates;
  // console.log(user.userInfo)
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    displayInfo: { name: "", matrNo: "", roomNo: "", merits: 60 },
    personalInfo: {},
    academicInfo: {},
  });
  const [editingField, setEditingField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmSave, setConfirmSave] = useState(null);
  const { id } = useParams();
  const [prevStudent, setprevStudent] = useState({});

  useEffect(() => {
    id
      ? getStudentWithoutUser(id)
          .then((response) => {
            setStudent((prev) => ({
              displayInfo: { ...prev.displayInfo, ...response.displayInfo },
              personalInfo: { ...prev.personalInfo, ...response.personalInfo },
              academicInfo: { ...prev.academicInfo, ...response.academicInfo },
            }));
            setprevStudent(response);
          })
          .catch((error) => console.error("Error fetching students:", error))
      : null;
  }, [id]);

  // console.log("info", prevStudent);
  const saveStudent = async () => {
    const action = id
      ? "Updated Info"
      : "Created New Student";

    try {
      let response;

      if (id) {
        // Update existing student
        await updateStudent(id, student);
        response = { ...student, id };
        showNotification(action, "success");
        console.log(`${action}  Successfully!`, response);
      } else {
        // Create new student
        response = await createStudent(student);
        showNotification(`${action} Successfully!`, "success");
        console.log(action, response);
      }

      // Log all changes
      if (!deepCompareObjects(prevStudent, student)) {
        console.log("making log.......");
        await logAction(
          user.userInfo.id, // Replace with actual admin ID
          user.userInfo.name, // Replace with actual admin name
          action, // Action
          "Student Management",
          prevStudent, // Previous changes
          student // cuurent change
        );
      }

      // Clear the temporary changes state
      setprevStudent({});

      return response;
    } catch (error) {
      showNotification("Error saving student !", "error");
      console.error("Error saving student:", error);
      throw error; // Re-throw to allow caller to handle the error
    }
  };

  const saveAndExit = () => {
    saveStudent().then(r=>
      r?
      navigate("/admin-student_infoSelect", { replace: true }):null
    );
  };

  const changeStudentEntry = (section, heading, value) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      [section]: {
        ...prevStudent[section],
        [heading]: value,
      },
    }));
  };

  const addNewField = (heading, value, section) => {
    // Update the student state
    setStudent((prevStudent) => ({
      ...prevStudent,
      [section]: {
        ...prevStudent[section],
        [heading.replaceAll(" ", "_")]: value || "NA",
      },
    }));

    showNotification("New Field Added", "success");
  };

  const editField = (section, oldHeading, newHeading, newValue) => {
    setStudent((prevStudent) => {
      const updatedSection = { ...prevStudent[section] };
      delete updatedSection[oldHeading];
      updatedSection[newHeading.replaceAll(" ", "_")] = newValue;
      return {
        ...prevStudent,
        [section]: updatedSection,
      };
    });
  };

  const deleteField = (section, heading) => {
    setStudent((prevStudent) => {
      const updatedSection = { ...prevStudent[section] };
      delete updatedSection[heading];
      return {
        ...prevStudent,
        [section]: updatedSection,
      };
    });

    showNotification("field deleted", "warning");
  };

  const meritColor = (point) => {
    if (point <= -30) return "text-red-600";
    else if (point <= -10) return "text-orange-500";
    else return "text-green-600";
  };

  return (
    <main className="min-h-screen primaryBg flex items-center justify-center p-4">
      {student ? (
        <div className="secondaryBg shadow-2xl rounded-2xl w-full max-w-4xl p-8 pt-2 ">
          <Link
            to={"/admin-student_infoSelect"}
            className="m-3 font-semibold flex underline"
          >
            <ArrowBigLeft />
            back
          </Link>
          <header className="flex flex-wrap items-center gap-8 mb-8">
            <UserCircle className="w-24 h-24" />
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Name:</label>
                <input
                  value={student.displayInfo.name || ""}
                  onChange={(e) =>
                    changeStudentEntry("displayInfo", "name", e.target.value)
                  }
                  className="min-w-32 sm:w-[45%] px-3 py-2 border rounded-md focus:ring-2 primaryBg focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Student ID:</label>
                <input
                  value={student.displayInfo.matrNo || ""}
                  onChange={(e) =>
                    changeStudentEntry("displayInfo", "matrNo", e.target.value)
                  }
                  className="min-w-32 sm:w-[40%] px-3 py-2 border rounded-md focus:ring-2 primaryBg focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center flex-wrap gap-4">
                <div>
                  <label className="font-semibold mr-4">Room:</label>
                  <input
                    value={student.displayInfo.roomNo || ""}
                    onChange={(e) =>
                      changeStudentEntry(
                        "displayInfo",
                        "roomNo",
                        e.target.value
                      )
                    }
                    className={`w-20 px-3 py-2 border rounded-md focus:ring-2 primaryBg text-lg focus:ring-blue-500 focus:outline-none `}
                  />
                </div>
                <div className="flex items-center">
                  <label className="font-semibold mr-4">Merit Points:</label>
                  <input
                    type="number"
                    value={student.displayInfo.merits || 0}
                    onChange={(e) =>
                      changeStudentEntry(
                        "displayInfo",
                        "merits",
                        e.target.value
                      )
                    }
                    className={`w-20 px-3 py-2 mr-2 border rounded-md focus:ring-2 primaryBg text-lg focus:ring-blue-500 focus:outline-none ${meritColor(
                      student.displayInfo.merits
                    )}`}
                  />
                  <span>pts</span>
                </div>
              </div>
            </div>
          </header>

          {/* Personal Information Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(student.personalInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="primaryBg p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {key.replaceAll("_", " ")}
                    </div>
                    <input
                      value={value || ""}
                      disabled
                      onChange={(e) =>
                        changeStudentEntry("personalInfo", key, e.target.value)
                      }
                      className="w-full px-2 py-1 border secondaryBg rounded"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setEditingField({
                          section: "personalInfo",
                          heading: key,
                          value,
                        })
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          section: "personalInfo",
                          heading: key,
                        })
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setEditingField({ section: "personalInfo" })}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Add New Field
              </button>
            </div>
          </section>

          {/* Academic Information Section */}
          <section>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">
              Academic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(student.academicInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="primaryBg p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {key.replaceAll("_", " ")}
                    </div>
                    <input
                      value={value || ""}
                      disabled
                      onChange={(e) =>
                        changeStudentEntry("academicInfo", key, e.target.value)
                      }
                      className="w-full px-2 py-1 border secondaryBg rounded"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setEditingField({
                          section: "academicInfo",
                          heading: key,
                          value,
                        })
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          section: "academicInfo",
                          heading: key,
                        })
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setEditingField({ section: "academicInfo" })}
                className="bg-blue-500 self-center h-fit md:w-fit text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Add New Field
              </button>
            </div>
          </section>

          <div className="border-t border-solid border-gray-200 w-full mt-5 p-4 relative">
            {" "}
            <button
              onClick={() => setConfirmSave("save")}
              className="bg-orange-400 w-full self-center text-white px-4 py-2 rounded-md hover:bg-white hover:text-orange-400 hover:outline transition sticky"
            >
              Save & Exit
            </button>
          </div>
          {/* Field Modal for Adding/Editing */}
          <FieldModal
            isOpen={!!editingField}
            onClose={() => setEditingField(null)}
            onSave={(newHeading, newValue) =>
              editingField.heading
                ? editField(
                    editingField.section,
                    editingField.heading,
                    newHeading,
                    newValue
                  )
                : addNewField(newHeading, newValue, editingField.section)
            }
            onDelete={(heading) => deleteField(editingField.section, heading)}
            heading={editingField?.heading}
            value={editingField?.value}
            isEditing={!!editingField?.heading}
          />

          {/* Confirmation Dialog for Deletion */}
          <ConfirmationDialog
            isOpen={!!confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => {
              deleteField(confirmDelete.section, confirmDelete.heading);
              setConfirmDelete(null);
            }}
            title="Confirm Deletion"
            message="Are you sure you want to delete this field?"
          />
          {/* Confirmation Dialog for Save */}
          <ConfirmationDialog
            isOpen={!!confirmSave}
            onClose={() => setConfirmSave(null)}
            onConfirm={() => {
              setConfirmSave(null);
              saveAndExit();
            }}
            title="Confirm Student Save"
            message="Are you sure you want to save the changes? They will be logged"
          />
        </div>
      ) : (
        <div className="text-center text-xl">
          Loading Student Information...
        </div>
      )}
    </main>
  );
};

export default StudentInfoManagementPage;
