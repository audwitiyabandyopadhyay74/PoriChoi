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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
        bodyClassName="text-sm font-medium text-white block p-3"
        position="bottom-left"
        autoClose={3000}
      />
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 flex flex-col items-center py-10 px-6 sm:px-8 md:px-10 lg:px-12">
        <Image src={icon} className="rounded-full w-24 h-24 bg-white p-2 shadow-lg transition-transform duration-300 transform hover:scale-110" alt="Icon" />
        <h2 className="text-4xl font-bold text-white mt-6 mb-4">Welcome Back</h2>
        <p className="text-gray-200 text-center mb-6">Sign in to your account to continue</p>
        <div className="w-full flex flex-col items-center gap-4">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/90 text-gray-700 rounded-lg shadow-md border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full">
            <input
              required
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/90 text-gray-700 rounded-lg shadow-md border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${passwordVisible ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer hover:text-purple-500 transition duration-150`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button
          className="w-full mt-8 py-3 bg-purple-500 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105"
          onClick={login}
        >
          Login
        </button>
        <button
          className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          onClick={signInWithGoogle}
        >
          <i className="fa-brands fa-google"></i> Sign in with Google
        </button>
        <div className="mt-5 text-sm text-gray-300">
          Forgot password?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline" onClick={resetPassword}>
            Reset it here
          </span>
        </div>
        {errorText && <span className="text-red-400 text-sm mt-2">{errorText}</span>}
        <div className="mt-6 text-sm text-gray-300">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
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
