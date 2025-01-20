"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../../Components/NavBar';
import { auth, firestore } from '../../../firebase';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../style.css';
import MoblieNav from '../../../Components/Mobile Nav';
import SideBar from '../../../Components/SideBar';

const Page = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await deleteDoc(doc(firestore, 'users', user.uid));
        await deleteUser(user);
        toast.success("Account deleted successfully!", { theme: "colored" });
      }
    } catch (error) {
      toast.error("Error deleting account", { theme: "colored" });
    }
  };

  // if (user === null) {
  //   return (
  //     <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>
  //       <NavBar />
  //       <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
  //       <a href='/log-in'>
  //         <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
  //       </a>
  //     </div>
  //   );
  // } else {
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
          <span className='absolute top-[5rem] left-[4rem] hidden lg:block' onClick={() => { document.location.href = "/my-account" }}>My Account/Settings/Verify-Email</span>
          <div className="w-[70%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">
            <SideBar />
            <form className="flex gap-4 justify-center items-center top-[200px] left-[23.0px] w-[80%] absolute flex-col" onSubmit={handleDeleteAccount}>
              <span className='w-full text-center font-bold'>Delete Account</span>
              <button type="submit" className={'lg:w-[15vw] text-white font-bold lg:h-[3vw] bg-red-600 rounded-md w-max h-[6vh] p-[10px]'}>
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </>
    );
  // }
};

export default Page;