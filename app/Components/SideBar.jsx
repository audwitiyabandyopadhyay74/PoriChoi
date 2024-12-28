'use client'; 

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
    
  const SideBar = () => {
  const [profile, setProfile] = React.useState()
  const[verifyemail, setVerifyEmail] = React.useState()
  const[verifyphonenumber, setVerifyPhoneNumber] = React.useState()
  const[resetpassword, setResetPassword] = React.useState()
  const [deleteaccount, setDeleteAccount] = React.useState()
  const pathname = usePathname();
  if(pathname === "/my-account/settings"){
    setProfile(true)
  }else if(pathname === "/my-account/settings/verify-email"){
    setVerifyEmail(true)
  }else if(pathname === "/my-account/settings/verify-phone-number"){
    setVerifyPhoneNumber(true)
  }else if(pathname === "/my-account/settings/rest-password"){
    setResetPassword(true)
  }else{
    setDeleteAccount(true)
  }
  const optionClassName = "h-[15vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer";
  const optionClassNameactive = "h-[15vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer bg-gray-200";

  return (
    <div className="flex items-start h-full w-[25%] border-r border-r-black">
      <ul className="flex flex-col items-center gap-[20px]">
       <Link href={"https://porichoiop.vercel.app/my-account/settings"}>                     <li className={profile ? optionClassNameactive : optionClassName} onClick={()=>{document.location.href="https://porichoiop.vercel.app/my-account/settings"}}><i className="fa-solid fa-user"></i> Profile</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/verify-email"}>        <li className={verifyemail ? optionClassNameactive : optionClassName} onClick={()=>{document.location.href="https://porichoiop.vercel.app/my-account/settings/verify-phone-number"}}><i className="fa-solid fa-envelope-circle-check"></i> Verify Email</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/verify-phone-number"}> <li className={verifyphonenumber ? optionClassNameactive : optionClassName} onClick={()=>{document.location.href="https://porichoiop.vercel.app/my-account/settings/verify-phone-number"}}><i className="fa-solid fa-phone"></i> Verify Phone Number</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/rest-password"}>       <li className={resetpassword? optionClassNameactive : optionClassName} onClick={()=>{document.location.href="https://porichoiop.vercel.app/my-account/settings/rest-password"}}><i className="fa-solid fa-phone"></i> Reset Password</li></Link>
        <Link href={"https://porichoiop.vercel.app/my-account/settings/delete-account"}>      <li className={deleteaccount? optionClassNameactive : optionClassName} onClick={()=>{document.location.href="https://porichoiop.vercel.app/my-account/settings/delete-account"}}><i className="fa-solid fa-trash"></i> Delete Account</li></Link>
        
        <li className={optionClassName + "bg-red-600"} onClick={() => signOut(auth)}><i className="fa-solid fa-right-from-bracket"></i> Logout</li>
      </ul>
    </div>
  );
};

export default SideBar;
