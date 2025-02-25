import { Route, Routes } from "react-router-dom";
import StudentInfoPage from "./Pages/StudentInfoPage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import RequestsPage from "./Pages/RequestsPage";
import Navbar from "./Components/Navbar";
import { createContext, useEffect, useState } from "react";
import StudentSelection from "./Pages/StudentInfoSelection";
import { getUser } from "./services/students";
import Login from "./Pages/Login";
import { AuthProvider, useAuth } from "./contexts/authContext";
import ProtectedRoute from "./Components/ProtectedRoute";

export const MyStates = createContext();

// Change role to "student" if you want access to student info
const user = {
  role: "admin",
};
const student = {
  displayInfo: {
    name: "Jhon Doe",
    matrNo: "21/3188",
    roomNo: "B27",
    merits: 30,
  },
  Personal_Info: {
    Full_Name: "Jhon Micheal Doe",
    Hall: "Bethel Splendor",
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
  // const { userLoggedIn } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  // false = lightmode
  // true = darkmode

  // useEffect(()=>{
  //   getUser(id)
  //   .then((response) => setStudent(response.data))
  //   .catch((error) => console.error("Error fetching students:", error));
  // }, [])

  const toggleTheme = () => {
    setIsChecked((curr) => (curr == false ? true : false));
  };
  const myStates = {
    myTheme: { isChecked, toggleTheme },
    student,
  };
  // const myTheme= { isChecked , toggleTheme }

  return (
    <AuthProvider>

    <MyStates.Provider value={myStates}>
      <div className={`flex flex-col grow ${isChecked ? "dark" : "light"}`}>
        <Routes>
            <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
          <Route element={<Navbar />}>
            {/* <Route path="/student_info" element={user.role==="student"?<StudentInfoPage/>:<StudentSelection/>} /> */}
            <Route path="/" element={<StudentSelection />} />
            <Route path="/student_infoSelect" element={<StudentSelection />} />
            <Route path="/student_info/:id" element={<StudentInfoPage />} />
            <Route path="/student_info/" element={<StudentInfoPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/requests" element={<RequestsPage />} />
          </Route>
          </Route>
        </Routes>
      </div>
    </MyStates.Provider>
    </AuthProvider>
  );
};

export default App;
