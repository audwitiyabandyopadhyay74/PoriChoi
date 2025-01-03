"use client";
import React,{useEffect,useState} from 'react';
import { ToastContainer,toast } from 'react-toastify';
import NavBar from '../../../Components/NavBar';
import MoblieNav from '../../../Components/Moblie Nav';
import SideBar from '../../../Components/SideBar';
import {sendPasswordResetEmail,onAuthStateChanged} from "firebase/auth"
import {auth} from '../../../firebase'



const Page = () => {
  const [user,setUser] = useState()
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
setUser(user)
      } else {
      }
    });
    return () => unsubscribe();
  }, []);
  const handleSendPasswordResetLink = () =>{
    try{
    sendPasswordResetEmail(user)
    }catch(error){
      toast.error("Error while sending password reset link", { theme: "colored" });
      toast.error('Error:', error.message);
    }}
const inputClassName = 'w-[35vh] max-w-max h-[6vh] rounded-md p-4 border-none outline-none shadow-md border text-black';
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
          <span className='absolute top-[5rem] left-[4rem]' onClick={() => { document.location.href = "/my-account" }}>My Account/Settings/Verify-Email</span>
          <div className="w-[70 %] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">
            <SideBar />
            <form className="flex gap-4 justify-center items-center mt-[100px] w-[80%] absolute"  onSubmit={handleSendPasswordResetLink}>
              <input type="email" className={inputClassName} value={email} onChange={(e) => setChangedEmail(e.target.value)} />
              <button type="submit"  className={'lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'} >
                Send A Rest Password Link
              </button>
            </form>
          </div>
        </div>
      </>
  );
}

export default Page;
