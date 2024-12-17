"use client"; // Mark this file to run on the client side

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
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
  const toggleMenuVisibility = () =>{
    const item = document.getElementById("hideshow");
    const icon = document.getElementById("icon1");
  
    if (item.classList.contains("hidden")){
      item.classList.add("visible");
      //Har Har Mahadev
      item.classList.remove("hidden");
      icon.style.rotate = "180deg";
    }else{
      item.classList.add("hidden");
      item.classList.remove("visible");
      icon.style.rotate = "360deg";
  
    }
  }
if(user){
  return (
    <nav className={`lg:hidden fixed w-screen h-16 flex flex-col items-center justify-center`}>
      {/* Logo and branding */}
      <Image src={logo} alt="Logo" className="w-12 h-12" />
      <span>PoriChoi</span>
      {/* User profile picture and search icon */}
      <div className="w-screen flex items-center justify-between p-4 gap-[40%]">
        <div className="userpic">
          <div className="w-max h-full flex justify-center items-center">
                <div className="h-max w-max bg-[#afafaf] flex gap-1 rounded-full  items-center px-4">
                  
                <Image
                      src={userpic || Avatar}
                      alt="User Avatar"
                      className="rounded-full w-10 h-10"
                      onClick={toggleMenuVisibility}
                    />
             <i class="fa-solid fa-caret-up rotate-180" onClick={toggleMenuVisibility} id="icon1" style={{fontSize:"20px"}}></i>
                </div>              </div>
              </div>

                <div className="search">
          <Link href="/search">
            <FaSearch size={25} />
          </Link>
        </div>
              </div>

  
      
    </nav>
  );}else{
    <nav className={`lg:hidden fixed w-screen h-16 flex flex-col items-center justify-center`}>
    {/* Logo and branding */}
    <Image src={logo} alt="Logo" className="w-12 h-12" />
    <span>PoriChoi</span>
    {/* User profile picture and search icon */}
    <div className="w-full flex items-center justify-center gap-[40%]">
      <div className="userpic">
        <Image
          src={Avatar}
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

  }
};

export default MobileNav;
