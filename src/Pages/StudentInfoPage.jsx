import UserCircle from "../Components/svg/UserCircle";

const StudentInfoPage = () => {
  const studentInfo = {
    id: "21/3188",
    name: "John Doe",
    merits: 30,
    Full_Name: "John Micheal Doe",
    Course_of_Study: "Information Technology",
    Department: "information Technology",
    Faculty: "Computing and Engineering Sciences",
    Hall: "Bethel Splendor",
    Room_No: "B27",
    Phone_No: "07080718065",
    Date_of_Birth: "27/Sept/2004",
    Home_Address: "Omole, Lagos",
  };

  const meritColor = (point) => {
    if (point <= -30) return "text-red-600";
    else if (point <= -10) return "text-orange-500";
    else return "text-green-600";
  };
  return (
    <main>
      <div className="sm:my-8 sm:mx-14 md:mx-[20%] py-12 flex flex-col max-sm:items-center sm:px-[6%] studentInfo-bg">
        <header className="flex flex-wrap max-sm:flex-col items-center text-center sm:gap-x-14 gap-7">
          <UserCircle />
          <div className="self-center ga">
            <h1>Name: {studentInfo.name}</h1>
            <h1>Student ID: {studentInfo.id}</h1>
          </div>
          <div className="flex-grow flex justify-center text-[1.2rem]">
            <h1 className=" text-[1.2rem] mr-2">Merits Points:</h1>
            <h1 className={`${meritColor(studentInfo.merits)}`}>
              {studentInfo.merits}pts
            </h1>
          </div>
        </header>
        <div className="my-8 mx-4">
          <h2 className="underline mt-4" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            <i>Additional Information</i>
          </h2>
          {/* object gets turned into array containing keys and values as the sub-array values */}
          {Object.entries(studentInfo)
            // removing the first two entries
            .filter((row, idx) => idx > 2)
            .map((row) => (
              <InfoRow key={row[0]} heading={row[0]} value={row[1]} />
            ))}
        </div>
      </div>
    </main>
  );
};

const InfoRow = ({ heading, value }) => {
  return (
    <div className="flex gap-4 my-6 text-[0.85rem]">
      <div className="w-28 sm:w-1/4 font-semibold">
        <label htmlFor={heading}>{heading.replaceAll("_", " ")}:</label>{" "}
        {/* Label for accessibility */}
      </div>
      <div className="">
        <span id={heading}>{value}</span> {/* Or an input if needed */}
      </div>
    </div>
  );
};

export default StudentInfoPage;
