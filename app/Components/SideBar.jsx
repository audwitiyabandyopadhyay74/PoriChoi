'use client';

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Link from 'next/link';

const SideBar = () => {
  const optionClassName = "h-[5vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer";

  return (
    <div className="flex items-start h-full w-[25%] border-r border-r-black">
      <ul className="flex flex-col items-center gap-[20px]">
       <Link href={"https://porichoiop.vercel.app/my-account/settings"}> <li className={optionClassName}><i className="fa-solid fa-user"></i> Profile</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/verify-email"}> <li className={optionClassName}><i className="fa-solid fa-envelope-circle-check"></i> Verify Email</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/verify-phone-number"}> <li className={optionClassName}><i className="fa-solid fa-phone"></i> Verify Phone Number</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/rest-password"}> <li className={optionClassName}><i className="fa-solid fa-phone"></i> Reset Password</li></Link>
       <Link href={"https://porichoiop.vercel.app/my-account/settings/delete-account"}> <li className={optionClassName}><i className="fa-solid fa-trash"></i> Delete Account</li></Link>
        
        <li className={optionClassName + "bg-red-600"} onClick={() => signOut(auth)}><i className="fa-solid fa-right-from-bracket"></i> Logout</li>
      </ul>
    </div>
  );
};

export default SideBar;
