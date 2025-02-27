import { useContext, useEffect, useState } from "react";
import UserCircle from "../../Components/svg/UserCircle";
import { MyStates } from "../../App";
import { useParams } from "react-router-dom";
import { getStudent } from "../../services/students";
import { useAuth } from "../../contexts/authContext";

const StudentInfoManagementPage = () => {
  const [student, setStudent] = useState();
  const {currentUser} = useAuth()
  console.log(currentUser.uid)

  // const { id } = useParams();

  useEffect(() => {
    getStudent(currentUser.uid)
      .then((response) => setStudent(response))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  console.log(student)
  // console.log(student.Personal_Info);
  // console.log(id);

  const meritColor = (point) => {
    if (point <= -30) return "text-red-600";
    else if (point <= -10) return "text-orange-500";
    else return "text-green-600";
  };
  return (
    <main>
      {student ? (
        <div className="sm:my-8 sm:mx-14 md:mx-[15%] py-12 flex flex-col max-sm:items-center max-sm:text-center sm:px-[6%] studentInfo-bg">
          <header className="flex flex-wrap max-sm:flex-col items-center text-center sm:gap-x-14 gap-7">
            <UserCircle />
            <div className="self-center">
              <h1>Name: {student.displayInfo.name}</h1>
              <h1>Student ID: {student.displayInfo.matrNo}</h1>
            </div>
            <div className="flex-grow flex justify-center text-[1.2rem]">
              <h1 className=" text-[1.2rem] mr-2">Merits Points:</h1>
              <h1 className={`${meritColor(student.displayInfo.merits)}`}>
                {student.displayInfo.merits}pts
              </h1>
            </div>
          </header>
          <div className="my-8 mx-4">
            <h2 className="underline mt-8 mb-4 text-2xl font-bold">
              <i>Personal Information</i>
            </h2>
            {/* object gets turned into array containing keys and values as the sub-array values */}
            <div className="flex justify-between flex-wrap">
              {Object.entries(student.personalInfo)
                // removing the first two entries
                // .filter((row, idx) => idx > 2)
                .map((row) => (
                  <InfoRow key={row[0]} heading={row[0]} value={row[1]} />
                ))}
            </div>

            {/* Academic Info Section */}

            <h2 className="underline mt-8 mb-4 text-2xl font-bold">
              <i>Academic Information</i>
            </h2>
            {/* object gets turned into array containing keys and values as the sub-array values */}
            <div className="flex justify-between flex-wrap">
              {Object.entries(student.academicInfo)
                // removing the first two entries
                // .filter((row, idx) => idx > 2)
                .map((row) => (
                  <InfoRow key={row[0]} heading={row[0]} value={row[1]} />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <>Loading</>
      )}
    </main>
  );
};

const InfoRow = ({ heading, value }) => {
  return (
    <div className="flex  gap-4 my-5 text-[0.85rem] max-sm:w-full sm:min-w-[480px] md:min-w-[50%] max-sm:justify-around text-nowrap max-sm:text-left">
      <div className="w-fit sm:w-1/4  font-semibold ">
        <label htmlFor={heading}>{heading.replaceAll("_", " ")}:</label>{" "}
        {/* Label for accessibility */}
      </div>
      <div className=" max-sm:text-wrap">
        <span id={heading}>{value}</span> {/* Or an input if needed */}
      </div>
    </div>
  );
};

export default StudentInfoManagementPage;
