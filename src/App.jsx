import { Route, Routes } from "react-router-dom";
import StudentInfoPage from "./Pages/StudentInfoPage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import RequestsPage from "./Pages/RequestsPage";
import Navbar from "./Components/Navbar";
import { createContext, useState } from "react";

export const MyTheme = createContext();

const App = () => {
  const [isChecked, setIsChecked] = useState(false);
  // false = lightmode
  // true = darkmode
  const toggleTheme = () => {
    setIsChecked((curr) => (curr == false ? true : false));
  };
  const myStates = {
    darkMode: { isChecked, setIsChecked },
  };

  return (
    <MyTheme.Provider value={{ isChecked, toggleTheme }}>
      <div className={`flex flex-col grow ${isChecked? "dark":"light"}`}>
        <Navbar />
        <Routes>
          <Route path="/student_info" element={<StudentInfoPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/login" element={<RequestsPage />} />
        </Routes>
      </div>
    </MyTheme.Provider>
  );
};

export default App;
