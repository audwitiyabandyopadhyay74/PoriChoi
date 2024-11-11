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

  useEffect(() => {
    const Password = document.getElementById("password");
    const Icon = document.getElementById("icon");
    if (Password.type === "password") {
      Icon.classList.remove("fa-eye-slash");
      Icon.classList.add("fa-eye");
    } else {
      Icon.classList.remove("fa-eye");
      Icon.classList.add("fa-eye-slash");
    }
  }, []);

  const togglePasswordVisibility = () => {
    const Password = document.getElementById("password");
    const Icon = document.getElementById("icon");
    if (Password.type === "password") {
      Icon.classList.remove("fa-eye");
      Icon.classList.add("fa-eye-slash");
      Password.setAttribute("type", "text");
    } else {
      Icon.classList.remove("fa-eye-slash");
      Icon.classList.add("fa-eye");
      Password.setAttribute("type", "password");
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast("Login successful");
      document.location.href = "/";
    } catch (err) {
      const errorMessage = err.code === "auth/user-not-found" ? "User not found" : "Invalid email or password";
      document.getElementById("error-text").innerHTML = errorMessage;
      toast(errorMessage);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast("Password reset link sent successfully to " + email);
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
    <div className="w-screen h-screen flex justify-center items-center">
      <ToastContainer
        toastClassName={() =>
          "bg-red-600 relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        bodyClassName={() => "text-sm font-white font-med block p-3"}
        position="bottom-left"
        autoClose={3000}
      />
      <div className="h-[90%] w-[35%] bg-[#fff] rounded-md text-center gap-[10px] flex flex-col justify-center items-center">
        <Image src={icon} className="rounded-full w-[40%] mt-[10px] scale-75 bg-white p-1" alt="Icon" />
        <div className="font-semibold text-5xl mt-[-20px]">Login</div>
        <div className="w-[100%] h-[10%] rounded-md flex justify-center items-center">
          <input required type="email" placeholder="Email" className="w-[80%] h-full mt-10 ml-5 border-2 p-1 border-black rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div> 
        <br />
        <div className="w-[100%] h-[10%] rounded-md flex flex-row justify-center items-center">
          <input required type="password" placeholder="Password" id="password" className="w-[80%] h-full mt-10 border-2 p-1 border-black rounded-md z-0" value={password} onChange={(e) => setPassword(e.target.value)} />
          <i className="fa-solid fa-eye z-100 text-2xl ml-[-40px] mt-[7%] relative" onClick={togglePasswordVisibility} id="icon"></i>
        </div>
        <br />
        <button className="w-[30%] mt-10 ml-10 bg-red-600 text-white rounded-md scale-150 hover:scale-110" style={{ fontSize: "12px", padding: "10px 30px" }} onClick={login}>Login</button>
        <button className="w-[30vh] mt-10 ml-10 bg-black text-white rounded-md scale-150 hover:scale-110" style={{ fontSize: "12px", padding: "10px 35px" }} onClick={signInWithGoogle}><i className="fa-brands fa-google"></i> Login With Google</button>
        <div className="mt-5">Forgot password? <span className="text-blue-500" onClick={resetPassword}>Reset</span></div>
        <span id="error-text" className="text-red-600"></span>
        <div className="mt-5">Don"t have an account? <span className="text-blue-500 hover:mt-[-10px] cursor-pointer" onClick={() => { document.location.href = "/sign-up" }}>Sign up</span></div>
      </div>
    </div>
  );
}

export default Page;
