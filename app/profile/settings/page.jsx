"use client";

import React, { useState, useEffect } from 'react';
import Logo from "../../favicon.ico";
import Image from 'next/image';
import { FaSearch } from "react-icons/fa";
import { auth } from "../../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import Form from '../../Components/Form';
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

  if (user === null) {
    return (
      <nav className='h-16 w-screen bg-white text-black flex items-center shadow-md relative'>
        <div className="logo flex items-center justify-center gap-2 w-[20%]">
          <Image src={Logo} alt="logo" className='w-14 h-14' />
          <h1 className='text-2xl font-bold'>Porichoi</h1>
        </div>
        <div className="h-max w-[60%] flex items-center gap-4 justify-center"></div>
        <div className="w-[20%] h-[4rem] flex align-middle gap-4 items-center">
          <button className='w-[7vw] h-[6vh] bg-[#ebeaea] hover:scale-110 rounded-md' onClick={() => { document.location.href = "/log-in" }}>Login</button>
          <button className='w-[7vw] h-[6vh] bg-[#fff] hover:scale-110 rounded-md' onClick={() => { document.location.href = "/sign-up" }}>Sign up</button>
        </div>
      </nav>
    );
  }

  const inactiveClass = "h-[4.5rem] ease-in-out duration-150 hover:text-red-600 border-[#0000] border-b-[5px] hover:border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";
  const activeClass = "h-[4.5rem] ease-in-out duration-150 text-red-600 border-[#0000] border-b-[5px] border border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";

  return (
    <>
      <nav className='h-16 w-screen bg-white text-black flex items-center shadow-md fixed z-100'>
        <div className="logo flex items-center justify-center gap-2 w-[20%]">
          <Image src={Logo} alt="logo" className='w-14 h-14' />
          <h1 className='text-2xl font-bold'>Porichoi</h1>
        </div>
        <div className="h-max w-[60%] flex items-center gap-4 justify-center">
          <Link href="/" className={home ? activeClass : inactiveClass}>
            <i className='fa-solid fa-house' style={{ fontSize: "30px" }}></i>
            <span style={{ fontSize: "10px" }}>Home</span>
          </Link>
          <Link href="/profile" className={profile ? activeClass : inactiveClass}>
            <i className='fa-solid fa-user' style={{ fontSize: "30px" }}></i>
            <span style={{ fontSize: "10px" }}>Profile</span>
          </Link>
          <Link href="/news" className={news ? activeClass : inactiveClass}>
            <i className='fa-solid fa-newspaper' style={{ fontSize: "30px" }}></i>
            <span style={{ fontSize: "10px" }}>News</span>
          </Link>
        </div>
        <div className="w-[20%] h-[4rem] flex align-middle justify-center gap-4 items-center">
          <input type="text" placeholder='Search' className='h-[60%] ease-in-out duration-500 right-[-180%] absolute w-[80%] outline-none border border-black rounded-md p-2' />
          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "24px" }} onClick={togglePostFormDisplay}></i>
          <div className="w-[4vh] bg-[#ebe9e9] rounded-[100%] h-[4vh] flex flex-col items-center justify-center align-middle scale-125 absolute right-[20px] hover:cursor-pointer">
            <FaSearch size={"20px"} onClick={toggleSearchInput} onClickCapture={tptosearch} />
          </div>
        </div>
      </nav>
      <Form Style={customStyle + ' mt-[-100px]'} />
    </>
  );
};

export default NavBar;
