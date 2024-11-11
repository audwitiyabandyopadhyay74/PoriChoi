"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import icon from "../favicon.ico";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toastify.css";

const Page = () => {
  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setErrorText("");
  }, [email, password]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful", { theme: "colored" });
      document.location.href = "/";
    } catch (err) {
      const errorMessage = err.code === "auth/user-not-found" ? "User not found" : "Invalid email or password";
      setErrorText(errorMessage);
      toast.error(errorMessage, { theme: "colored" });
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset link sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      document.location.href = "/";
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("The user is not signed up", { theme: "colored" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 px-4 sm:px-0">
      <ToastContainer
        toastClassName="relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer shadow-lg"
        bodyClassName="text-sm font-white font-medium block p-3"
        position="bottom-left"
        autoClose={3000}
      />
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-xl flex flex-col items-center py-8 px-6 md:px-12 animate-fadeInUp">
        <Image src={icon} className="rounded-full w-24 h-24 bg-white p-2 shadow-lg" alt="Icon" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">Welcome Back</h2>
        <div className="w-full flex flex-col items-center gap-4">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full sm:w-4/5 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full sm:w-4/5">
            <input
              required
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${passwordVisible ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400 cursor-pointer hover:text-blue-500 transition duration-150`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button
          className="w-4/5 sm:w-2/3 mt-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 duration-300 shadow-md"
          onClick={login}
        >
          Login
        </button>
        <button
          className="w-4/5 sm:w-2/3 mt-4 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition transform hover:scale-105 duration-300 shadow-md"
          onClick={signInWithGoogle}
        >
          <i className="fa-brands fa-google"></i> Login with Google
        </button>
        <div className="mt-5 text-sm sm:text-base text-gray-600">
          Forgot password?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={resetPassword}>
            Reset
          </span>
        </div>
        {errorText && <span className="text-red-500 text-sm mt-2">{errorText}</span>}
        <div className="mt-5 text-sm sm:text-base text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => {
              document.location.href = "/sign-up";
            }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
