import React from "react";
import { useContext, useEffect, useState } from "react";
import { MyStates } from "../../App";
import { Link } from "react-router-dom";
import { getAllStudents } from "../../services/students";
import ExpandableSearchBar from "../../Components/ExpandableSearchBar";

// Icons
import { Users, Home, Award, Info, Search, UserPlus } from "lucide-react";

const StudentRow = ({ student, position, id }) => {
  const isEven = position % 2 === 0;
  const studentLocation = `/admin-student_info/${id}`;
  return (
    <tr className={`${isEven ? "secondaryBg" : "primaryBg"} `}>
      <td className="p-3 border-b">
        <Link
          to={studentLocation}
          className="flex items-center "
        >
          {student.name || "-"}
        </Link>
      </td>
      <td className="p-3 border-b">
        <Link
          to={studentLocation}
          className=""
        >
          {student.matrNo || "-"}
        </Link>
      </td>
      <td className="p-3 border-b">
        <Link
          to={studentLocation}
          className=""
        >
          {student.roomNo || "-"}
        </Link>
      </td>
      <td className="p-3 border-b">
        <Link
          to={studentLocation}
          className="text-gray-700"
        >
          <span className="flex items-center">
            {student.merits || "-"}
            {student.merits > 80 && (
              <Award size={16} className="ml-1 text-yellow-500" />
            )}
          </span>
        </Link>
      </td>
    </tr>
  );
};

const StudentList = ({ students }) => {
  return (
    <div className="my-6 overflow-hidden tertiaryBg rounded-lg shadow">
      <table className="border-collapse w-full">
        <thead>
          <tr className="primaryBg text-left">
            <th className="p-3 font-semibold text-gray-700 border-b">
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                Name
              </div>
            </th>
            <th className="p-3 font-semibold text-gray-700 border-b">
              <div className="flex items-center">
                <Info size={16} className="mr-2" />
                Student ID
              </div>
            </th>
            <th className="p-3 font-semibold text-gray-700 border-b">
              <div className="flex items-center">
                <Home size={16} className="mr-2" />
                Room No.
              </div>
            </th>
            <th className="p-3 font-semibold text-gray-700 border-b">
              <div className="flex items-center">
                <Award size={16} className="mr-2" />
                Merits
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => {
              const studentDisp = student.displayInfo;
              return (
                <StudentRow
                  id={student.id}
                  key={studentDisp.matrNo + index}
                  student={studentDisp}
                  position={index + 1}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Sample Hall data
const hallData = {
  name: "Nelson Mandela",
  capacity: 500,
  gender:"Male",
  occupiedRooms: 427,
  vacantRooms: 73,
  maintenanceRequests: 12,
  averageMeritScore: 46.4,
  upcomingEvents: 3
};

const HallDashboard = ({ hallData }) => {
  const occupancyRate = (hallData.occupiedRooms / hallData.capacity) * 100;
  
  return (
    <div className="secondaryBg rounded-lg shadow p-6 pb-2 my-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Home className="mr-2" /> {hallData.name} 
      </h2>
      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
        {/* Occupancy Card */}
       {/* <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-800">Occupancy</h3>
            <span className="text-blue-600 font-bold">{occupancyRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{hallData.occupiedRooms} occupied</span>
            <span>{hallData.vacantRooms} vacant</span>
          </div>
        </div>
        
        {/* Demographics Card */}
        {/* <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Student Demographics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Male Students</span>
              <span className="font-medium">{hallData.maleStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Female Students</span>
              <span className="font-medium">{hallData.femaleStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">International</span>
              <span className="font-medium">{hallData.internationalStudents}</span>
            </div>
          </div>
        </div> */}
        
        {/* Merits Card */}
        {/* <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Hall Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Merit Score</span>
              <span className="font-medium text-gray-600">{hallData.averageMeritScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance Requests</span>
              <span className="font-medium text-gray-600">{hallData.maintenanceRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upcoming Events</span>
              <span className="font-medium text-gray-600">{hallData.upcomingEvents}</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const StudentInfoSelection = () => {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getAllStudents()
      .then((response) =>
        setStudents(response.filter((s) => (s.displayInfo ? s : null)))
      )
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

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

  return (
    <main className="px-4 md:px-10 md:mx[5%] pb-8">
      {students ? (
        <>
          <HallDashboard hallData={hallData} />
          
          <div className="flex flex-wrap gap-y-4 justify-between items-center mb-4">
            <div className="w-full md:w-auto">
              <ExpandableSearchBar
                searchQuery={searchText}
                setSearchQuery={setSearchText}
                onSearch={null}
              />
            </div>

            <Link
              to={"/admin-student_info"}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow flex items-center justify-center transition-colors"
            >
              <UserPlus size={18} className="mr-2" />
              Add New Student
            </Link>
          </div>
          
          <div className="secondaryBg rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4 ">
              Student Directory
            </h2>
            <StudentList students={studentsWithShortNames} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student data...</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default StudentInfoSelection;