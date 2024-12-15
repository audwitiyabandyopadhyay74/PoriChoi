"use client";

import React, { useEffect, useState } from "react";
// import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider, FacebookAuthProvider
} from "firebase/auth";
import icon from "../favicon.ico";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toastify.css";
import dynamic from "next/dynamic";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { redirect } from 'next/navigation';

const useRouter = dynamic(() => import("next/router").then((mod) => mod.useRouter), { ssr: false });

const Page = () => {


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhO91KP6Lu0nTEJBo7UTBr3X79cNJe4zQ",
  authDomain: "porichoi-9112d.firebaseapp.com",
  projectId: "porichoi-9112d",
  storageBucket: "porichoi-9112d.appspot.com",
  messagingSenderId: "702456184757",
  appId: "1:702456184757:web:4881a1e59f939069d4a3fc",
  measurementId: "G-KDX944BM03"
};
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && router?.pathname === "/log-in") {
        router.push("/"); // Replace with your desired post-login page
      }
    });
    return () => unsubscribe();
  }, [router]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful", { theme: "colored" });
      setUser(auth.currentUser);
    } catch (err) {
      const errorMessage =
        err.code === "auth/user-not-found"
          ? "User not found"
          : "Invalid email or password";
      setErrorText(errorMessage);
      toast.error(errorMessage, { theme: "colored" });
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset link sent successfully to ${email}`);
    } catch (error) {
      console.error(error);
      toast.error("Error sending password reset email. Please try again.", {
        theme: "colored",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      toast.success("Signed in with Google successfully!", { theme: "colored" });
      router.push("/"); // Replace with your desired post-login page
    } catch (error) {
      console.error("Error signing in with Google");
      toast.error("Failed to sign in with Google. Please try again."+error, {
        theme: "colored",
      });
    }
  };
  
  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      setUser(user);
      toast.success("Signed in with Google successfully!", { theme: "colored" });
      router.push("/"); // Replace with your desired post-login page
    } catch (error) {
      console.error("Error signing in with Google");
      toast.error("Failed to sign in with Google. Please try again."+error, {
        theme: "colored",
      });
    }
  };
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      setUser(user);
      toast.success("Signed in with Google successfully!", { theme: "colored" });
      router.push("/"); // Replace with your desired post-login page
    } catch (error) {
      console.error("Error signing in with Google");
      toast.error("Failed to sign in with Google. Please try again."+error, {
        theme: "colored",
      });
    }
  };

  if (user) {
    return redirect("/"); // Placeholder for redirection logic
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
        bodyClassName="text-sm font-medium text-white block p-3"
        position="bottom-left"
        autoClose={3000}
      />
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 flex flex-col items-center py-10 px-6 sm:px-8 md:px-10 lg:px-12">
        <Image
          src={icon}
          className="rounded-full w-24 h-24 bg-white p-2 shadow-lg transition-transform duration-300 transform hover:scale-110"
          alt="Icon"
          width={100}
          height={100}
        />
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
              className={`fa-solid ${
                passwordVisible ? "fa-eye-slash" : "fa-eye"
              } absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer hover:text-purple-500 transition duration-150`}
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
                <button
          onClick={signInWithGithub}
          className="w-full mt-5 py-3 bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition duration-300 transform hover:scale-105"
        >
          <i className="fa-brands fa-github mr-2"></i> Sign Up with Github
</button>

<button
          onClick={signInWithFacebook}
          className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          <i className="fa-brands fa-facebook mr-2"></i> Sign Up with Facebook
</button>

        <div className="mt-5 text-sm text-white">
          Forgot password?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={resetPassword}
          >
            Reset it here
          </span>
        </div>

        {errorText && <span className="text-red-400 text-sm mt-2">{errorText}</span>}

        <div className="mt-6 text-sm text-white">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => router.push("/sign-up")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
