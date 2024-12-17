"use client"; // Mark this file to run on the client side

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import logo from '../favicon.ico';
import Avatar from '../download.png';

const MobileNav = () => {
  const [user, setUser] = useState(null);
  const [userpic, setUserpic] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserpic(user?.photoURL || '');
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <nav className={`lg:hidden fixed w-screen h-16 flex flex-col items-center justify-center`}>
      {/* Logo and branding */}
      <Image src={logo} alt="Logo" className="w-12 h-12" />
      <span>PoriChoi</span>
      {/* User profile picture and search icon */}
      <div className="w-full flex items-center justify-center gap-[40%]">
        <div className="userpic">
          <Image
            src={userpic || Avatar}
            width={250}
            height={250}
            className="rounded-full"
            alt="User profile"
          />
        </div>
        <div className="search">
          <Link href="/search">
            <FaSearch size={25} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
