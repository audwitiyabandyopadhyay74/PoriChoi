"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../../Components/NavBar';
import { auth } from '../../../firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import '../toastify.css';
import "../../style.css";
import MoblieNav from '@/app/Components/Moblie Nav';

const Page = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [changedEmail, setChangedEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || "Name is not given");
        setEmail(user.email || "Email is not given");
        setPhoneNumber(user.phoneNumber || "Phone Number is not given");
        console.log(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfileData = {
        email: changedEmail || email,
      };

      await updateProfile(user, updatedProfileData)

      toast.success("Profile updated successfully!", { theme: "colored" });
      setIsVerified(true);
      document.location.reload();
    } catch (error) {
        console.error('Error updating profile:', error.message);
      toast.error('Error updating profile', { theme: "colored" });
    }
  };

  const optionClassName = "h-[5vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer";

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
            <div className="flex items-start h-full w-[25%] border-r border-r-black">
              <ul className="flex flex-col items-center gap-[20px]">
                <li className={optionClassName}><i className="fa-solid fa-user"></i> Profile</li>
                <li className={optionClassName}><i className="fa-solid fa-envelope-circle-check"></i> Verify Email</li>
                <li className={optionClassName}><i className="fa-solid fa-phone"></i> Verify Phone Number</li>
                <li className={optionClassName}><i className="fa-solid fa-trash"></i> Delete Account</li>
              </ul>
            </div>
            <form className="flex gap-4 justify-center items-center mt-[100px] w-[80%] absolute" onSubmit={handleSubmit}>
              <input type="email" value={email} onChange={(e) => setChangedEmail(e.target.value)} />
              <button className={isVerified?'lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-green-600 rounded-md w-max h-[6vh] p-[10px]':'lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'} value={isVerified?"Verified":"Verify Email"} disabled={isVerified?true:false}>Verify Email</button>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default Page;
