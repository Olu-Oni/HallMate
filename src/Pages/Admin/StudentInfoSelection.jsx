import { useContext, useEffect, useState } from "react";
import { MyStates } from "../../App";
import { Link } from "react-router-dom";
import { getAllStudents } from "../../services/students";

const StudentRow = ({ student, position, id }) => {

  const isEven = position % 2 === 0;
  return (
    <tr>
      {/* 
      <tr>
        <td className={`p-2 ${isEven ? "secondaryBg" : "primaryBg"}`}>
          <Link to={`/students/${student.matrNo}`} className="block w-full h-full">
            {student.name}
          </Link>
        </td>
        <td className="p-2">{student.matrNo}</td>
        <td className="p-2">{student.roomNo || "N/A"}</td>
        <td className="p-2">{student.merits || 0}</td>
      </tr> 
      */}
      {Object.entries(student).map(([key, value]) => (
        <td key={key} className="p-0">
          <Link
            to={`/admin-student_info/${id}`}
            className={`block w-full h-full primaryTxt py-[6px] text-[.85rem] ${
              isEven ? "secondaryBg " : "primaryBg "
            }`}
          >
            {value}
          </Link>
        </td>
      ))}
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

const StudentInfoSelection = () => {
  // const { student } = useContext(MyStates);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getAllStudents()
      .then((response) => setStudents(response))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  console.log(students)
  

  // **Search Filter**
  const searchedStudents = students
    ? students.filter((st) => {
        const stDisp = st.displayInfo;
        const toSearch = `${stDisp.name} ${stDisp.matrNo} ${stDisp.roomNo} ${stDisp.merits}`;
        return toSearch.toLowerCase().includes(searchText.toLowerCase());
      })
    : [];

  // **Shorten Name Function**
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

  // **Apply Shortened Names**
  const studentsWithShortNames = searchedStudents.map((student) => {
    const shortenedName = nameShorten(student.displayInfo.name);
    const newDisplay = { ...student.displayInfo, name: shortenedName };
    return {
      ...student,
      displayInfo: newDisplay,
    };
  });

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
          </div>
          <StudentList students={studentsWithShortNames} />
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </main>
  );
};

export default StudentInfoSelection;
