"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../../Components/NavBar';
import { sendEmailVerification, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../style.css";
import MoblieNav from '@/app/Components/Moblie Nav';
import SideBar from '../../../Components/SideBar';

const Page = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [changedEmail, setChangedEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,  (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "Email is not given");
        setIsVerified(user.emailVerified);
        // console.log(user.emailVerified);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


const handleSendVerificationLink = async (e) => {
    // try {
      await sendEmailVerification(user);
      toast.success(`Verification link sent to ${email}`, { theme: "colored" });
       e.preventDefault();
    try {
      const updatedProfileData = {
        email: changedEmail || email,
      };
      await updateProfile(user, updatedProfileData);
      toast.success("Email Verified Successfully!", { theme: "colored" });
    } catch (error) {
      console.error('Got A Error During Verifying Email:', error.message);
      toast.error('Error Verifying Email:', { theme: "colored" });
    }
    // } catch (error) {
    //   toast.error("Error while sending verification link", { theme: "colored" });
    //   // console.log(error.message);
    // }
  };
// console.log("Email changed to: ", changedEmail);
// const handleSubmit = () => {

  const inputClassName = 'w-[35vh] max-w-max h-[6vh] rounded-md p-4 border-none outline-none shadow-md border text-black';

  if (user === null) {
    return (
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>
        <ToastContainer
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
          bodyClassName="text-sm font-medium text-white block p-3"
          position="bottom-left"
          autoClose={3000}
        />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
        <a href='/log-in'>
          <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
        </a>
      </div>
    );
  } else {
    return (
      <>
        <ToastContainer
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
          bodyClassName="text-sm font-medium text-white block p-3"
          position="bottom-left"
          autoClose={3000}
        />
        <NavBar />
        <MoblieNav />
        <div className="flex w-screen h-screen items-center justify-center relative">
          <span className='absolute top-[5rem] left-[4rem]' onClick={() => { document.location.href = "/my-account" }}>My Account/Settings</span>
          <div className="w-[65%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">
            <SideBar />
            <form className="flex gap-4 justify-center items-center mt-[100px] w-[80%] absolute"  onSubmit={handleSendVerificationLink}>
              <input type="email" className={inputClassName} value={email} onChange={(e) => setChangedEmail(e.target.value)} />
              <button type="submit"  className={isVerified ? 'lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-green-600 rounded-md w-max h-[6vh] p-[10px]' : 'lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'} disabled={isVerified}>
                {isVerified ? "Verified" : "Verify Email"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default Page;
