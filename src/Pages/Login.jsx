import { useEffect, useState } from "react";
import loginImg from "../assets/userStudent.png";
import { useAuth } from "../contexts/authContext";
import {
  doSignInUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../config/auth";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/students";

const Login = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInUserWithEmailAndPassword(email, password);
      } catch (err) {
        console.error("login error", err);
        setErrorMessage("Invalid email or password. Please try again."); // Display error message
        setIsSigningIn(false);
      }
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      getUser(currentUser.uid).then((response) => setUserInfo(response));
    }
  }, [userLoggedIn]);

  // console.log(userInfo.role)
  currentUser ? console.log(currentUser) : null;

  const googleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
      });
    }
  };
  return (
    <>
      {userLoggedIn &&
        (userInfo.role === "admin" ? (
          <Navigate to="/student_infoSelect" replace={true} />
        ) : userInfo.role === "student" ? (
          <Navigate to="/student_info/" replace={true} />
        ) : null)}

      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full primaryBg">
        <div className="hidden sm:block text-center w-fit m-auto">
          <img className="" src={loginImg} alt="" />
          {/* Student */}
        </div>

        <div className=" flex flex-col justify-center mr-5">
          <form
            className="max-w-[400px] w-full mx-auto rounded-lg border-2 border-gray-200 p-8 px-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl  font-bold text-center mb-5">Sign In</h2>
            <div className="flex flex-col text-gray-400 py-2">
              <label>Email</label>
              <input
                className="rounded-lg border-2 border-gray-200  mt-2 p-2 focus:border-blue-500  focus:outline-none"
                type="text"
                placeholder="Enter Email"
                name="email"
              />
            </div>
            <div className="flex flex-col text-gray-400 py-2">
              <label>Password</label>
              <input
                className="p-2 rounded-lg border-2 border-gray-200 mt-2 focus:border-blue-500  focus:outline-none"
                type="password"
                placeholder="Enter Password"
                name="password"
              />
            </div>
            <div className="flex justify-between text-gray-400 py-2 mt-3">
              {/* <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <p>Forgot Password</p> */}
            </div>
            <button
              className={`w-full my-5 py-2 border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white font-semibold rounded-lg ${
                isSigningIn ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isSigningIn} // Disable only when processing
            >
              {isSigningIn ? "Signing In..." : "SIGN IN"}
            </button>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
