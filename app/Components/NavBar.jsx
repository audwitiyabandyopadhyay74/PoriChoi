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
      toast("Login successful");
      document.location.href = "/";
    } catch (err) {
      const errorMessage = err.code === "auth/user-not-found" ? "User not found" : "Invalid email or password";
      setErrorText(errorMessage);
      toast(errorMessage);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast(`Password reset link sent successfully to ${email}`);
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
      toast("The user is not signed up");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center px-4 sm:px-0">
      <ToastContainer
        toastClassName="bg-red-600 relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        bodyClassName="text-sm font-white font-med block p-3"
        position="bottom-left"
        autoClose={3000}
      />
      <div className="h-[90%] w-full sm:w-[75%] md:w-[50%] lg:w-[35%] bg-white rounded-md text-center gap-4 flex flex-col justify-center items-center p-4">
        <Image src={icon} className="rounded-full w-24 h-24 mb-2 bg-white p-1" alt="Icon" />
        <div className="font-semibold text-3xl sm:text-4xl md:text-5xl">Login</div>
        <div className="w-full flex flex-col items-center gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-[90%] sm:w-[80%] h-10 border-2 p-2 border-black rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-[90%] sm:w-[80%] flex items-center">
            <input
              required
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full h-10 border-2 p-2 border-black rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa-solid ${passwordVisible ? "fa-eye-slash" : "fa-eye"} absolute right-3 text-xl cursor-pointer`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button
          className="w-[60%] sm:w-[40%] lg:w-[30%] mt-6 bg-red-600 text-white rounded-md py-2 hover:scale-105"
          onClick={login}
        >
          Login
        </button>
        <button
          className="w-[60%] sm:w-[40%] lg:w-[30%] mt-4 bg-black text-white rounded-md py-2 hover:scale-105 flex items-center justify-center gap-2"
          onClick={signInWithGoogle}
        >
          <i className="fa-brands fa-google"></i> Login With Google
        </button>
        <div className="mt-5 text-sm sm:text-base">
          Forgot password?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={resetPassword}>
            Reset
          </span>
        </div>
        {errorText && <span className="text-red-600 mt-2 text-sm">{errorText}</span>}
        <div className="mt-5 text-sm sm:text-base">
          Don&#39;t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
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
