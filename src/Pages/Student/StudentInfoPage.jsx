import { useContext, useEffect, useState } from "react";
import UserCircle from "../../Components/svg/UserCircle";
import { MyStates } from "../../App";
import { useParams } from "react-router-dom";
import { getStudent } from "../../services/students";
import { useAuth } from "../../contexts/authContext";

// Main component for displaying student information
const StudentInfoPage = () => {
  const [student, setStudent] = useState(); // State to store student information
  const { currentUser } = useAuth(); // Get the current user from the authentication context

  // Fetch student information when the component mounts
  useEffect(() => {
    getStudent(currentUser.uid)
      .then((response) => setStudent(response))
      .catch((error) => console.error("Error fetching students:", error));
  }, [currentUser.uid]);

  // Function to determine the color of the merit points based on the value
  const meritColor = (point) => {
    if (point <= -30) return "text-red-600";
    else if (point <= -10) return "text-orange-500";
    else return "text-green-600";
  };

  return (
    <main className="flex align-middle justify-center">
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
            {/* Display personal information */}
            <div className="flex justify-between flex-wrap">
              {Object.entries(student.personalInfo).map((row) => (
                <InfoRow key={row[0]} heading={row[0]} value={row[1]} />
              ))}
            </div>

            {/* Academic Info Section */}
            <h2 className="underline mt-8 mb-4 text-2xl font-bold">
              <i>Academic Information</i>
            </h2>
            {/* Display academic information */}
            <div className="flex justify-between flex-wrap">
              {Object.entries(student.academicInfo).map((row) => (
                <InfoRow key={row[0]} heading={row[0]} value={row[1]} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1 className=" my-20 mx-auto">Obtaining Student Information...</h1>
      )}
    </main>
  );
};

// Component to display individual information rows
const InfoRow = ({ heading, value }) => {
  return (
    <div className="flex gap-4 my-5 text-[0.85rem] max-sm:w-full sm:min-w-[480px] md:min-w-[50%] max-sm:justify-around text-nowrap max-sm:text-left">
      <div className="w-fit sm:w-1/4 font-semibold">
        <label htmlFor={heading}>{heading.replaceAll("_", " ")}:</label> {/* Label for accessibility */}
      </div>
      <div className="max-sm:text-wrap">
        <span id={heading}>{value}</span> {/* Or an input if needed */}
      </div>
    </div>
  );
};

export default StudentInfoPage;
