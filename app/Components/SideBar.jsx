'use client';

import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

const SideBar = () => {
  const [profile, setProfile] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const pathname = usePathname();

  // if (pathname === "/my-account/settings") {
  //   setProfile(true);
  // } if (pathname === "/my-account/settings/verify-email") {
  //   setVerifyEmail(true);
  // } if (pathname === "/my-account/settings/verify-phone-number") {
  //   setVerifyPhoneNumber(true);
  // } if (pathname === "/my-account/settings/rest-password") {
  //   setResetPassword(true);
  // } else {
  //   setDeleteAccount(true);
  // }

  const optionClassName = "h-[15vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer";
  // const optionClassNameActive = "h-[15vh] w-[95%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer bg-gray-200";

  return (
    <div className="flex items-start h-full w-[25%] border-r border-r-black">
      <ul className="flex flex-col items-center gap-[20px]">
        <a href="/my-account/settings">
          <li className={optionClassName}>
            <i className="fa-solid fa-user"></i> Profile
          </li>
        </a>
        <a href="/my-account/settings/verify-email">
          <li className={optionClassName}>
            <i className="fa-solid fa-envelope-circle-check"></i> Verify Email
          </li>
        </a>
        <a href="/my-account/settings/verify-phone-number">
          <li className={optionClassName}>
            <i className="fa-solid fa-phone"></i> Verify Phone Number
          </li>
        </a>
        <a href="/my-account/settings/rest-password">
          <li className={optionClassName}>
            <i className="fa-solid fa-phone"></i> Reset Password
          </li>
        </a>
        <a href="/my-account/settings/delete-account">
          <li className={optionClassName}>
            <i className="fa-solid fa-trash"></i> Delete Account
          </li>
        </a>
        <li className={`${optionClassName} bg-red-600`} onClick={() => signOut(auth)}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </li>
      </ul>
    </div>
  );
};

export default SideBar;