import { useContext } from "react";
import { MyStates } from "../App";
import { Link } from "react-router-dom";
const StudentRow = ({ student, position }) => {
  const isEven = position % 2
  return (
    <tr >
      {Object.entries(student).map((StudentVal) => (
        <td key={StudentVal[0]} className="p-0">
          <Link
            to={`/students/${StudentVal[1].id}`}
            className={` block w-full h-full primaryTxt py-[6px] text-[.85rem] ${ isEven? "secondaryBg " : "primaryBg "}`}
          >
            {StudentVal[1]}
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
        <thead className="tertiaryBg ">
          <tr className="secondaryBgBlue">
            <th className="text-black border-solid border-r border-black ">
              Name
            </th>
            <th className="text-black border-solid border-r border-black">
              Student ID
            </th>
            <th className="text-black border-solid border-r border-black">
              Room No.
            </th>
            <th className="text-black ">Merits</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              position={students.indexOf(student) + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentSelection = () => {
  const { student } = useContext(MyStates);
  const studentDisp = student.displayInfo;
  // console.log({...student, displayInfo:"yeah"})
  const students = [
    studentDisp,
    { ...studentDisp, name: "Jhon bosko" },
    { ...studentDisp, id: "19/3333" },
    { ...studentDisp, name: "Wowwww Mennington" },
    { ...studentDisp, name: "Jhonathan boskoko" },
    { ...studentDisp, id: "19/3333" },
    { ...studentDisp, name: "Wowwww again Mennington" },
  ];

  const nameShorten = (name) => {
    const post = name.indexOf(" ");
    if (name.length >= 14) {
      const shortName =
        name.slice(0, post) +
        " " +
        name.slice(post + 1, post + 2).toUpperCase() +
        ".";
      console.log(shortName, name);
      return shortName;
    } else return name;
  };
  const shortName = students.map((student) => ({
    ...student,
    name: nameShorten(student.name),
  }));

  return (
    <main className="px-10  max-md:px-2">
      <div className="tertiaryBg my-14 mx-[10%] h-32 rounded-xl">Dashboard</div>
      <div className="flex justify-between">
        <label htmlFor="view">
          <input id="view" type="checkbox" />
          Change View
        </label>
        <input className="rounded-md" placeholder="Search" />
      </div>
      <StudentList students={shortName} />
    </main>
  );
};

export default StudentSelection;
