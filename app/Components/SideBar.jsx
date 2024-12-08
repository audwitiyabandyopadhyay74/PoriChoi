'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { usePathname } from 'next/navigation';

const handleSignOut = () => {
  signOut(auth).then(() => {
    document.location.href = '/log-in';
  });
};

const SideBar = () => {
  const [myAccount, setMyAccount] = useState(false);
  const [settings, setSettings] = useState(false);
  const [yourPosts, setYourPosts] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/my-account') {
      setMyAccount(true);
      setSettings(false);
      setYourPosts(false);
    } else if (pathname === '/my-account/yourposts') {
      setMyAccount(false);
      setSettings(false);
      setYourPosts(true);
    } else if (pathname === '/my-account/settings') {
      setMyAccount(false);
      setSettings(true);
      setYourPosts(false);
    } else {
      setMyAccount(false);
      setSettings(false);
      setYourPosts(false);
    }
  }, [pathname]);

  const notActive = "w-full py-4 flex items-center justify-center bg-gray-800 text-white font-semibold";
  const active = "w-full py-4 flex items-center justify-center bg-white text-gray-800 font-semibold border-l-4 border-gray-800";

  return (
    <div className="flex flex-col sm:flex-row h-full sm:h-screen w-full sm:w-1/4 bg-gray-800 sm:rounded-md">
      <ul className="w-full">
        <li className={myAccount ? active : notActive} onClick={() => { document.location.href = '/my-account' }}>
          <i className='fa-solid fa-user' style={{ fontSize: '24px' }}></i> Your Profile
        </li>
        <li className={settings ? active : notActive} onClick={() => { document.location.href = '/my-account/settings' }}>
          <i className='fa-solid fa-gear' style={{ fontSize: '24px' }}></i> Settings
        </li>
        <li className={yourPosts ? active : notActive} onClick={() => { document.location.href = '/my-account/yourposts' }}>
          <i className='fa-solid fa-signs-posts' style={{ fontSize: '24px' }}></i> Your Posts
        </li>
        <li className="w-full py-4 flex items-center justify-center bg-gray-800 pt-20">
          <button onClick={handleSignOut} className='w-2/3 sm:w-1/2 py-2 bg-red-600 rounded-md text-white font-semibold'>Sign out</button>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
