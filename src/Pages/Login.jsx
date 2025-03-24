import { useContext, useEffect, useState } from "react";
import loginImg from "../assets/userStudent.png";
import { useAuth } from "../contexts/authContext";
import {
  doSignInUserWithEmailAndPassword,
  doSignInWithGoogle,
  doPasswordReset,
} from "../config/auth";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/students";
import { MyStates } from "../App";

const Login = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const myStates = useContext(MyStates);
  const {userInfo, setUserInfo} = myStates.user

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        setErrorMessage("");
        await doSignInUserWithEmailAndPassword(email, password);
        setIsSigningIn(false);
        console.log('somm going on here too')
      } catch (err) {
        console.error("login error", err);
        setErrorMessage("Invalid email or password. Please try again.");
        setIsSigningIn(false);
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrorMessage("Please enter your email address");
      return;
    }
    
    try {
      setIsResetting(true);
      setErrorMessage("");
      setSuccessMessage("");
      await doPasswordReset(resetEmail);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setIsResetting(false);
    } catch (err) {
      console.error("Password reset error", err);
      setErrorMessage("Failed to send reset email. Please check if the email is correct.");
      setIsResetting(false);
    }
  };

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (userLoggedIn && currentUser && userInfo) {
      console.log('obtaining from login')
      getUser(currentUser.uid).then((response) => setUserInfo(response));
      console.log('somm going on here')
    }
    else{
      setUserInfo({})
      console.log('logged out *2')
    }
  }, [userLoggedIn, currentUser]);

  const googleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
      });
    }
  };
  
  console.log(userInfo.role)
  console.log(userLoggedIn)
  
  return (
    <main className="h-dvh m-0">
      {userLoggedIn &&
        (userInfo.role === "admin" ? (
          <Navigate to="/admin-student_infoSelect" replace={true} />
        ) : userInfo.role === "student" ? (
          <Navigate to="/student-student_info/" replace={true} />
        ) : null)}

      <div className="flex items-center justify-center gap-14 h-full w-full primaryBg">
        <div className="hidden sm:block text-center w-fit ">
          <img className="" src={loginImg} alt="" />
          {/* Student */}
        </div>

        <div className="flex flex-col justify-center md:mr-5 basis-[40%]">
          {!showResetForm ? (
            <form
              className="max-w-[400px] w-full mx-auto rounded-lg border-2 border-gray-200 p-8 px-8"
              onSubmit={handleSubmit}
            >
              <h2 className="text-3xl font-bold text-center mb-5">Sign In</h2>
              <div className="flex flex-col text-gray-400 py-2">
                <label>Email</label>
                <input
                  className="rounded-lg border-2 border-gray-200 mt-2 p-2 focus:border-blue-500 focus:outline-none"
                  type="text"
                  placeholder="Enter Email"
                  name="email"
                />
              </div>
              <div className="flex flex-col text-gray-400 py-2">
                <label>Password</label>
                <input
                  className="p-2 rounded-lg border-2 border-gray-200 mt-2 focus:border-blue-500 focus:outline-none"
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                />
              </div>
              <button
                className={`w-full my-5 py-2 border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white font-semibold rounded-lg ${
                  isSigningIn ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing In..." : "SIGN IN"}
              </button>
              {errorMessage && (
                <p className="text-red-500 text-center mt-2">{errorMessage}</p>
              )}
              <div className="flex justify-center text-gray-400 py-2">
                <button
                  onClick={toggleResetForm}
                  type="button"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form
              className="max-w-[400px] w-full mx-auto rounded-lg border-2 border-gray-200 p-8 px-8"
              onSubmit={handlePasswordReset}
            >
              <h2 className="text-3xl font-bold text-center mb-5">Reset Password</h2>
              <div className="flex flex-col text-gray-400 py-2">
                <label>Email</label>
                <input
                  className="rounded-lg border-2 border-gray-200 mt-2 p-2 focus:border-blue-500 focus:outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <button
                  className={`w-full py-2 border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white font-semibold rounded-lg ${
                    isResetting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isResetting}
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  onClick={toggleResetForm}
                  type="button"
                  className="w-full py-2 text-gray-500 hover:text-black font-medium rounded-lg"
                >
                  Back to Login
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-center mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-center mt-2">{successMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;