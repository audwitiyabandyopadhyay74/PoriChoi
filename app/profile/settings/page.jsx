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
      setUser(user ? user : null);
    });
    return () => unSubscribe();
  }, [pathname]);

  const toggleSearchInput = () => {
    const search = document.querySelector('input');
    if (isOnclick) {
      search.classList.add('right-4');
      search.classList.remove('right-[-180%]');
    } else {
      search.classList.add('right-[-180%]');
      search.classList.remove('right-4');
    }
    setIsOnclick(!isOnclick);
  };

  const togglePostFormDisplay = () => {
    setCustomStyle((prevStyle) => (prevStyle === "block" ? "hidden" : "block"));
  };

  const inactiveClass = "ease-in-out duration-150 text-gray-500 hover:text-red-600 border-b-4 border-transparent hover:border-b-red-600 flex justify-center items-center flex-col";
  const activeClass = "ease-in-out duration-150 text-red-600 border-b-4 border-b-red-600 flex justify-center items-center flex-col";

  return (
    <>
      <nav className="h-16 w-full bg-white text-black flex items-center shadow-md fixed top-0 z-50 px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="logo" width={40} height={40} className="md:w-12 md:h-12" />
            <h1 className="text-xl font-bold hidden md:block">Porichoi</h1>
          </Link>

          <div className="flex items-center gap-4 md:ml-8">
            <Link href="/" className={home ? activeClass : inactiveClass}>
              <i className="fa-solid fa-house text-lg md:text-xl"></i>
              <span className="text-xs md:text-sm">Home</span>
            </Link>
            <Link href="/profile" className={profile ? activeClass : inactiveClass}>
              <i className="fa-solid fa-user text-lg md:text-xl"></i>
              <span className="text-xs md:text-sm">Profile</span>
            </Link>
            <Link href="/news" className={news ? activeClass : inactiveClass}>
              <i className="fa-solid fa-newspaper text-lg md:text-xl"></i>
              <span className="text-xs md:text-sm">News</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="absolute w-48 md:w-64 right-[-180%] transition-all duration-500 outline-none border border-black rounded-md p-2"
              />
              <FaSearch
                className="text-gray-700 text-lg cursor-pointer"
                onClick={toggleSearchInput}
              />
            </div>
            <i
              className="fa-solid fa-cloud-arrow-up text-xl md:text-2xl cursor-pointer"
              onClick={togglePostFormDisplay}
            ></i>
          </div>
        </div>

        <div className="hidden md:flex ml-auto">
          {user ? (
            <>
              <Link href="/" className="px-4 py-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => (window.location.href = "/log-in")}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => (window.location.href = "/sign-up")}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Conditional Post Form */}
      <Form Style={`${customStyle} mt-[-100px]`} />

      {/* Mobile Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md md:hidden flex justify-around py-3 border-t">
        <Link href="/" className={home ? activeClass : inactiveClass}>
          <i className="fa-solid fa-house text-lg"></i>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/profile" className={profile ? activeClass : inactiveClass}>
          <i className="fa-solid fa-user text-lg"></i>
          <span className="text-xs">Profile</span>
        </Link>
        <Link href="/news" className={news ? activeClass : inactiveClass}>
          <i className="fa-solid fa-newspaper text-lg"></i>
          <span className="text-xs">News</span>
        </Link>
      </div>
    </>
  );
};

export default NavBar;
