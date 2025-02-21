import { Route, Routes } from "react-router-dom";
import StudentInfoPage from "./Pages/StudentInfoPage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import RequestsPage from "./Pages/RequestsPage";
import Navbar from "./Components/Navbar";
import { createContext, useState } from "react";

export const MyStates = createContext();

const student = {
  id: "21/3188",
  name: "Jhon Doe",
  admin: false,
  merits: 30,
  Personal_Info: {
    Full_Name: "Jhon Micheal Doe",
    Hall: "Bethel Splendor",
    Room_No: "B27",
    Phone_No: "07080718065",
    Date_of_Birth: "27/Sept/2004",
    Home_Address: "Omole, Lagos",
    State: "Ekiti",
    Religion: "Christrian",
    Nationality: "Nigerian",
  },
  Academic_Info: {
    Course_of_Study: "Information Technology",
    Department: "information Technology",
    Faculty: "Computing and Engineering Sciences",
  },
  
};

const App = () => {
  const [isChecked, setIsChecked] = useState(false);
  // false = lightmode
  // true = darkmode
  const toggleTheme = () => {
    setIsChecked((curr) => (curr == false ? true : false));
  };
  const myStates = {
    myTheme: { isChecked, toggleTheme },
    student,
  };
  // const myTheme= { isChecked , toggleTheme }

  return (
    <MyStates.Provider value={myStates}>
      <div className={`flex flex-col grow ${isChecked ? "dark" : "light"}`}>
        <Navbar />
        <Routes>
          <Route path="/student_info" element={<StudentInfoPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/login" element={<RequestsPage />} />
        </Routes>
      </div>
    </MyStates.Provider>
  );
};

export default App;
