import React, { useContext, useEffect, useState } from "react";
import { MyStates } from "../../App";
import { Link } from "react-router-dom";
import { getAllStudents, addStudentToDatabase } from "../../services/students";

const StudentRow = ({ student, position, id }) => {
  const isEven = position % 2 === 0;
  const studentLocation = `/admin-student_info/${id}`;
  return (
    <tr className={`${isEven ? "secondaryBg " : "primaryBg "}`}>
      <td className={`p-2 ${isEven ? "secondaryBg" : "primaryBg"}`}>
        <Link
          to={studentLocation}
          className={` w-full h-full primaryTxt py-[6px] text-[.85rem] `}
        >
          {" "}
          {student.name || "-"}
        </Link>
      </td>
      <td className="p-2">
        <Link
          to={studentLocation}
          className={` w-full h-full primaryTxt py-[6px] text-[.85rem] `}
        >
          {student.matrNo || "-"}{" "}
        </Link>
      </td>
      <td className="p-2">
        <Link
          to={studentLocation}
          className={` w-full h-full primaryTxt py-[6px] text-[.85rem] `}
        >
          {student.roomNo || "-"}{" "}
        </Link>
      </td>
      <td className="p-2">
        <Link
          to={studentLocation}
          className={` w-full h-full primaryTxt py-[6px] text-[.85rem] `}
        >
          {student.merits || "-"}{" "}
        </Link>
      </td>
    </tr>
  );
};

const StudentList = ({ students }) => {
  return (
    <div className="my-6 max-md:text-sm">
      <table className="border-collapse w-full rounded-t-xl overflow-hidden">
        <thead className="tertiaryBg">
          <tr className="secondaryBgBlue">
            <th className="text-black border-solid border-r border-black">
              Name
            </th>
            <th className="text-black border-solid border-r border-black">
              Student ID
            </th>
            <th className="text-black border-solid border-r border-black">
              Room No.
            </th>
            <th className="text-black">Merits</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const studentDisp = student.displayInfo;
            return (
              <StudentRow
                id={student.id}
                key={studentDisp.matrNo + index}
                student={studentDisp}
                position={index + 1}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AddStudentModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [matrNo, setMatrNo] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [merits, setMerits] = useState("");

  const handleSave = () => {
    onSave({ name, matrNo, roomNo, merits });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-semibold">Add New Student</h2>
        <div className="mt-4">
          <label className="block">Name</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Student ID</label>
          <input
            className="border p-2 w-full"
            value={matrNo}
            onChange={(e) => setMatrNo(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Room No.</label>
          <input
            className="border p-2 w-full"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Merits</label>
          <input
            className="border p-2 w-full"
            value={merits}
            onChange={(e) => setMerits(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentInfoSelection = () => {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    
    getAllStudents()
      .then((response) => setStudents(response.filter(s => s.displayInfo ? s : null)))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // console.log(students);

  const searchedStudents = students
    ? students.filter((st) => {
        const stDisp = st.displayInfo;
        const toSearch = `${stDisp.name} ${stDisp.matrNo} ${stDisp.roomNo} ${stDisp.merits}`;
        return toSearch.toLowerCase().includes(searchText.toLowerCase());
      })
    : [];

  const nameShorten = (name) => {
    if (!name) return "";
    const post = name.indexOf(" ");
    if (name.length >= 10 && post !== -1) {
      return (
        name.slice(0, post) +
        " " +
        name.slice(post + 1, post + 2).toUpperCase() +
        "."
      );
    }
    return name;
  };

  const studentsWithShortNames = searchedStudents.map((student) => {
    const shortenedName = nameShorten(student.displayInfo.name);
    const newDisplay = { ...student.displayInfo, name: shortenedName };
    return {
      ...student,
      displayInfo: newDisplay,
    };
  });

  const handleSaveStudent = (newStudent) => {
    const student = {
      id: students.length + 1,
      displayInfo: newStudent,
    };
    addStudentToDatabase(student).then(() => {
      setStudents([...students, student]);
    });
  };

  return (
    <main className="px-10 max-md:px-2">
      {students ? (
        <>
          <div className="tertiaryBg my-14 mx-[10%] h-32 rounded-xl">
            Dashboard
          </div>
          <div className="flex justify-between">
            <label htmlFor="view">
              <input id="view" type="checkbox" />
              Change View
            </label>
            <input
              className="rounded-md"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add New Student
            </button>
          </div>
          <StudentList students={studentsWithShortNames} />
          <AddStudentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveStudent}
          />
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </main>
  );
};

export default StudentInfoSelection;
