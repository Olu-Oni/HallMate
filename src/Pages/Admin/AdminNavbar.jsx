import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate, Outlet } from "react-router-dom";
import LightDarkSwitch from "../../Components/LightDarkSwitch";
import DoorIcon from "../../Components/svg/DoorIconSVG";
import HMLogo from "../../assets/HallMateLogoFull.png";
import { MyStates } from "../../App";
import { getUser } from "../../services/students";
import { doSignOut } from "../../config/auth";
import { useAuth } from "../../contexts/authContext";
// import { ReactComponent as iconDoor} from "../assets/icon_door.svg";

const SlideMenu = ({ navNames, status }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isChecked, toggleTheme } = status;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="slide-menu-container md:hidden fixed top-7 right-7 z-[1000]">
      <label
        className={
          isOpen ? "open-button close-button z-[1001] " : "open-button z-[1001] "
        }
      >
        <input type="checkbox" checked={isOpen} onChange={toggleDropdown} />
      </label>
      <div
        className={
          isOpen
            ? "slide-menu min-h-[380px] translate-x-[-150px] z-[1000] max-sm:translate-x-[-110px]"
            : "slide-menu min-h-[380px] translate-x-24 z-[1000]"
        }
      >
        <div className="px-4 flex justify-center h-[30px] overflow-hidden slow-transition absolute top-16 left-1">
          <LightDarkSwitch status={{ isChecked, toggleTheme }}>
            <div
              className={`relative  text-nowrap   ${
                isChecked ? "translate-y-5" : "translate-y-[-17px]"
              }`}
            >
              <h2 className={`py-2 ${isChecked ? "" : "blur-[2px]"}`}>
                Dark Mode
              </h2>
              <h2 className={`py-2 ${isChecked ? "blur-sm" : ""}`}>
                Light Mode
              </h2>
            </div>
          </LightDarkSwitch>
        </div>
        {/* <a className="hover:cursor-pointer ">
          <img src={profileImg} alt="profile Image" className="w-13 h-8" />
        </a> */}
        <ul className="flex flex-col gap-3 pt-8">
          {navNames.map((nav) => (
            <NavItem key={nav.name} nav={nav} />
          ))}

          <Link
            to={"/login"}
            className="hover:backdrop-brightness-75 rounded-bl-3xl px-7 w-full py-2 flex gap-2 justify-center border-t-2 absolute bottom-0 font-semibold"
            onClick={async () => {
              await doSignOut() // Ensure logout completes
                .then(navigate("/login", { replace: true })); // Replace prevents back navigation
            }}
          >
            {/* Door Icon */}
            <DoorIcon />
            <h2>Log out</h2>
          </Link>
        </ul>
      </div>
    </aside>
  );
};

const NavItem = ({ nav }) => {
  const location = useLocation();
  return (
    <li
      className={
        location.pathname === `/admin-${nav.loc}` ? "active nav_item " : "nav_item "
      }
    >
      <Link to={`/admin-${nav.loc}`}>
        <h2>{nav.name}</h2>
      </Link>
    </li>
  );
};

// Main Nav Setion
const AdminNavbar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {userLoggedIn} = useAuth();
  const myStates = useContext(MyStates);
  const {userInfo, setUserInfo} = myStates.user

  const handleLogOut = async () => {
    try {
      await doSignOut() // Ensure logout completes
      .then(setUserInfo({}))
      .then(navigate("/login", { replace: true })); // Replace prevents back navigation
    } catch (err) {
      console.error(err);
    }
  };

  console.log('logged in?', userLoggedIn)

  //changed the way the useContext was used for other comps. to work smoother
  const { isChecked, toggleTheme } = myStates.myTheme;
  const navNames = [
    { loc: `student_infoSelect`, name: "Students" },
    { loc: "requests", name: "Requests" },
    { loc: "announcements", name: "Announcements" },
    { loc: "logs", name: "Logs" },
  ];

  return (
    <>

    <nav className="flex justify-between  pt-6 pl-4 z-[30] primaryBg fixed w-full border-b-2">
      <div className="flex relative logo h-fit">
        {/* <h1 className="logo1 text-2xl font-medium">Hall</h1>
        <h1 className="logo2 text-2xl font-medium">Mate</h1> */}
         <Link to={`/`}>
         
        <img src={HMLogo} alt="HallMate Logo" className="relative bottom-3 h-14 sm:h-16 w-auto" />
         </Link>
      </div>
      <ul className="flex w-fit gap-[2%] grow text-center mx-14 md:mx-[7%] lg:mx-[12%] justify-around  max-md:hidden">
        {navNames.map((nav) => (
          <NavItem key={nav.name} nav={nav} />
        ))}
      </ul>
      <div className="flex relative justify-center max-md:hidden">
        <div className="scale-110 relative bottom-1">
          <LightDarkSwitch status={{ isChecked, toggleTheme }} />
        </div>

        <div className="h-fit max-lg:scale-[85%]  relative rounded-lg bottom-1">
          <Link
            to={"/login"}
            className="px-3 py-2  relative top-3 hover:bg-black hover:text-white border-2 border-black h-fit rounded-lg"
            onClick={handleLogOut}
          >
            Log out
          </Link>
        </div>
      </div>

      <SlideMenu navNames={navNames} status={{ isChecked, toggleTheme }} />
    </nav>

    {/* to allow the other components show */}
    <Outlet />
    </>
  );
};

export default AdminNavbar;
