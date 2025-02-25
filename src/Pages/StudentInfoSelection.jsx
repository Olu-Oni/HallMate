import { useContext, useState } from "react";
import { MyStates } from "../App";
import { Link } from "react-router-dom";

const StudentRow = ({ student, position }) => {
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
            to={`/students/${student.uID}`}
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
          {students.map((student, index) => (
            <StudentRow
              key={student.matrNo + index}
              student={student}
              position={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentSelection = () => {
  const { student } = useContext(MyStates);
  const [searchText, setSearchText] = useState("");

  const studentDisp = student.displayInfo;

  // **Ensure unique objects in students array**
  const students = [
    {
      ...studentDisp,
      name: "John Bosco",
      matrNo: "21/1111",
      uID: "211111",
      roomNo: "A1",
      merits: 5,
    },
    {
      ...studentDisp,
      name: "Wowwww Mennington",
      matrNo: "21/2222",
      uID: "212222",
      roomNo: "B2",
      merits: 10,
    },
    {
      ...studentDisp,
      name: "Jonathan Boskoko",
      matrNo: "21/3333",
      uID: "213333",
      roomNo: "C3",
      merits: 7,
    },
    {
      ...studentDisp,
      name: "Wowwww Again Mennington",
      matrNo: "21/4444",
      uID: "214444",
      roomNo: "D4",
      merits: 8,
    },
  ];

  // **Search Filter**
  const searchedStudents = students.filter((st) => {
    const toSearch = `${st.name} ${st.matrNo} ${st.roomNo} ${st.merits}`;
    return toSearch.toLowerCase().includes(searchText.toLowerCase());
  });

  // **Shorten Name Function**
  const nameShorten = (name) => {
    if (!name) return "";
    const post = name.indexOf(" ");
    if (name.length >= 14 && post !== -1) {
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
  const studentsWithShortNames = searchedStudents.map((student) => ({
    ...student,
    name: nameShorten(student.name),
  }));

  return (
    <main className="px-10 max-md:px-2">
      <div className="tertiaryBg my-14 mx-[10%] h-32 rounded-xl">Dashboard</div>
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
    </main>
  );
};

export default StudentSelection;
