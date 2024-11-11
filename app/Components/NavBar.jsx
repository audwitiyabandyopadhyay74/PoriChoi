"use client";

import React, { useState, useEffect } from 'react';
import Logo from "../favicon.ico";
import Image from 'next/image';
import { FaSearch } from "react-icons/fa";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from 'firebase/auth';
import Form from './Form';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavBar = () => {
  const pathname = usePathname();
  const [home, setHome] = useState(false);
  const [profile, setProfile] = useState(false);
  const [news, setNews] = useState(false);
  const [user, setUser] = useState(null);
  const [isOnclick, setIsOnclick] = useState(false);
  const [customStyle, setCustomStyle] = useState("hidden");

  useEffect(() => {
    if (pathname === "/") {
      setHome(true);
      setProfile(false);
      setNews(false);
    } else if (pathname === "/profile") {
      setHome(false);
      setProfile(true);
      setNews(false);
    } else {
      setHome(false);
      setProfile(false);
      setNews(true);
    }

    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unSubscribe();
  }, [pathname]);

  const toggleSearchInput = () => {
    const search = document.querySelector('input');
    if (isOnclick) {
      search.classList.add('right-10');
      search.classList.remove('right-[-180%]');
    } else {
      search.classList.add('right-[-180%]');
      search.classList.remove('right-10');
    }
    setIsOnclick(!isOnclick);
  };

  const togglePostFormDisplay = () => {
    setCustomStyle((prevStyle) => (prevStyle === "block" ? "hidden" : "block"));
  };

  const inactiveClass = "h-[4.5rem] ease-in-out duration-150 hover:text-red-600 border-[#0000] border-b-[5px] hover:border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";
  const activeClass = "h-[4.5rem] ease-in-out duration-150 text-red-600 border-[#0000] border-b-[5px] border border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";

  if (user === null) {
    return (
      <nav className='h-16 w-full bg-white text-black flex items-center shadow-md relative px-4 sm:px-8 lg:px-12'>
        <div className="logo flex items-center justify-center gap-2 w-[30%] md:w-[20%]">
          <Image src={Logo} alt="logo" className='w-10 h-10 md:w-14 md:h-14' />
          <h1 className='text-lg md:text-2xl font-bold'>Porichoi</h1>
        </div>
        <div className="hidden md:flex w-[60%] items-center gap-4 justify-center"></div>
        <div className="w-[70%] md:w-[20%] flex justify-end gap-2 md:gap-4">
          <button className='w-[7vw] md:w-[6vw] h-[6vh] bg-[#ebeaea] hover:scale-105 rounded-md' onClick={() => { document.location.href = "/log-in" }}>Login</button>
          <button className='w-[7vw] md:w-[6vw] h-[6vh] bg-[#fff] hover:scale-105 rounded-md' onClick={() => { document.location.href = "/sign-up" }}>Sign up</button>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className='h-16 w-full bg-white text-black flex items-center shadow-md fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12'>
        <div className="logo flex items-center justify-center gap-2 w-[30%] md:w-[20%]">
          <Image src={Logo} alt="logo" className='w-10 h-10 md:w-14 md:h-14' />
          <h1 className='text-lg md:text-2xl font-bold'>Porichoi</h1>
        </div>
        <div className="hidden md:flex w-[60%] items-center gap-4 justify-center">
          <Link href="/" className={home ? activeClass : inactiveClass}>
            <i className='fa-solid fa-house' style={{ fontSize: "24px" }}></i>
            <span style={{ fontSize: "10px" }}>Home</span>
          </Link>
          <Link href="/profile" className={profile ? activeClass : inactiveClass}>
            <i className='fa-solid fa-user' style={{ fontSize: "24px" }}></i>
            <span style={{ fontSize: "10px" }}>Profile</span>
          </Link>
          <Link href="/news" className={news ? activeClass : inactiveClass}>
            <i className='fa-solid fa-newspaper' style={{ fontSize: "24px" }}></i>
            <span style={{ fontSize: "10px" }}>News</span>
          </Link>
        </div>
        <div className="w-[70%] md:w-[20%] flex justify-end items-center gap-2 md:gap-4">
          <input type="text" placeholder='Search' className='hidden md:block h-[60%] ease-in-out duration-500 right-[-180%] absolute w-[80%] outline-none border border-black rounded-md p-2' />
          <i className="fa-solid fa-cloud-arrow-up hidden md:block" style={{ fontSize: "24px" }} onClick={togglePostFormDisplay}></i>
          <div className="md:w-[4vh] md:bg-[#ebe9e9] rounded-[100%] h-[4vh] flex items-center justify-center cursor-pointer">
            <FaSearch size={"20px"} onClick={toggleSearchInput} />
          </div>
        </div>
      </nav>
      <Form Style={customStyle + ' mt-[-100px]'} />
    </>
  );
};

export default NavBar;
