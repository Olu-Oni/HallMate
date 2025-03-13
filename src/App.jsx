import { Navigate, Route, Routes } from "react-router-dom";
import StudentInfoPage from "./Pages/Student/StudentInfoPage";
import AnnouncementsPage from "./Pages/Student/AnnouncementsPage";
import RequestsPage from "./Pages/Student/RequestsPage";
import Navbar from "./Components/Navbar";
import { createContext, useEffect, useState } from "react";
import StudentSelection from "./Pages/Admin/StudentInfoSelection";
import { getUser } from "./services/students";
import Login from "./Pages/Login";
import { AuthProvider, useAuth } from "./contexts/authContext";
import {
  AdminRoutes,
  LogInRoute,
  StudentRoutes,
} from "./Routes/ProtectedRoute";
import RequestsManagementPage from "./Pages/Admin/RequestsPage";
import AnnouncementsManagementPage from "./Pages/Admin/AnnouncementsPage";
import StudentInfoManagementPage from "./Pages/Admin/StudentInfoPage";
import StudentInfoSelection from "./Pages/Admin/StudentInfoSelection";
import NotFound from "./Pages/NotFound";
import StudentNavbar from "./Pages/Student/StudentNavbar";
import AdminNavbar from "./Pages/Admin/AdminNavbar";
import MaintenanceReport from "./Pages/Admin/Reports/RequestReports";
import LogsPage from "./Pages/Admin/AdminLogs";
import { Notification, NotificationProvider } from "./Components/Notification";

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
  const { userLoggedIn, currentUser } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  // const {userLoggedIn} = useAuth()
  // false = lightmode
  // true = darkmode

  // useEffect(()=>{
  //   getUser(id)
  //   .then((response) => setStudent(response.data))
  //   .catch((error) => console.error("Error fetching students:", error));
  // }, [])

  useEffect(() => {
    if (userLoggedIn && currentUser) {
      setUserInfo({});
      console.log("obtaining from app");
      getUser(currentUser.uid).then((response) => setUserInfo(response));
    } else {
      setUserInfo({});
      console.log("logged out plx");
    }
  }, [userLoggedIn, currentUser]);

  // console.log("user", userInfo)

  const toggleTheme = () => {
    setIsChecked((curr) => (curr == false ? true : false));
  };
  const myStates = {
    myTheme: { isChecked, toggleTheme },
    student,
    user: { userInfo, setUserInfo },
  };
  // const myTheme= { isChecked , toggleTheme }

  return (
    <MyStates.Provider value={myStates}>
      <NotificationProvider>
        <div className={`flex flex-col ${isChecked ? "dark" : "light"} min-w-dvw min-h-dvh`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/NotFound" element={<NotFound />} />
            <Route path="/" element={<Login />} />
            {/* Protected Routes */}
            <Route element={<LogInRoute />}>
              {/* Student Routes */}
              <Route element={<StudentRoutes role={userInfo?.role} />}>
                {/* Comment out from here to the protected routes comment if you dont want disturbances */}
                <Route element={<StudentNavbar />}>

                  <Route path="/" element={<StudentSelection />} />
                  <Route
                    path="/student-student_info/"
                    element={<StudentInfoPage />}
                  />

                  <Route
                    path="/student-announcements"
                    element={<AnnouncementsPage />}
                  />
                  <Route path="/student-requests" element={<RequestsPage />} />
                
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoutes role={userInfo?.role} />}>
                <Route element={<AdminNavbar />}>
                  <Route
                    path="/Maintenance-Report"
                    element={<MaintenanceReport />}
                  />

                  <Route
                    path="/admin-student_infoSelect"
                    element={<StudentInfoSelection />}
                  />
                  <Route
                    path="/admin-student_info/:id"
                    element={<StudentInfoManagementPage />}
                  />
                   <Route
                    path="/admin-student_info"
                    element={<StudentInfoManagementPage />}
                  />
                  <Route
                    path="/admin-announcements"
                    element={<AnnouncementsManagementPage />}
                  />
                  <Route
                    path="/admin-requests"
                    element={<RequestsManagementPage />}
                  />
                  <Route path="/admin-logs" element={<LogsPage />} />
                </Route>

                {/* Comment these two route tags under as well */}
              </Route>
            </Route>
            {/* Catch-All Route for Unknown Pages */}
            <Route path="*" element={<Navigate to="/NotFound" replace />} />
          </Routes>
          <Notification/>
        </div>
      </NotificationProvider>
    </MyStates.Provider>
  );
};

export default App;
