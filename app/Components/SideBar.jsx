'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const [profile, setProfile] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/my-account/settings") {
      setProfile(true);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/verify-email") {
      setProfile(false);
      setVerifyEmail(true);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/verify-phone-number") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(true);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/rest-password") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(true);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/delete-account") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(true);
    }
  }, [pathname]);

  const optionClassName = "h-[7.5vh] w-[30vh] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer rounded-md";
  const optionClassNameActive = `${optionClassName} bg-gray-200`;

  return (
    <div className="flex items-start h-full w-[25%] border-r border-r-black">
      <ul className="flex flex-col items-center gap-[20px]">
        <a href="/my-account/settings">
          <li className={profile ? optionClassNameActive : optionClassName}>
            <i className="fa-solid fa-user"></i> Profile
          </li>
        </a>
        <a href="/my-account/settings/verify-email">
          <li className={verifyEmail ? optionClassNameActive : optionClassName}>
            <i className="fa-solid fa-envelope-circle-check"></i> Verify Email
          </li>
        </a>
        <a href="/my-account/settings/verify-phone-number">
          <li className={verifyPhoneNumber ? optionClassNameActive : optionClassName}>
            <i className="fa-solid fa-phone"></i> Verify Phone Number
          </li>
        </a>
        <a href="/my-account/settings/rest-password">
          <li className={resetPassword ? optionClassNameActive : optionClassName}>
            <i className="fa-solid fa-lock"></i> Reset Password
          </li>
        </a>
        <a href="/my-account/settings/delete-account">
          <li className={deleteAccount ? optionClassNameActive : optionClassName}>
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