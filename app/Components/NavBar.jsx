"use client";

import React, { useState, useEffect } from 'react';
import Logo from "../favicon.ico";
import Image from 'next/image';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setUser(user || null);
    });
    return () => unSubscribe();
  }, [pathname]);

  const toggleSearchInput = () => {
    setIsOnclick(!isOnclick);
  };

  const togglePostFormDisplay = () => {
    setCustomStyle((prevStyle) => (prevStyle === "block" ? "hidden" : "block"));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const inactiveClass = "flex flex-col items-center justify-center h-14 w-16 text-center text-gray-700 hover:text-red-600 transition-colors duration-200";
  const activeClass = "flex flex-col items-center justify-center h-14 w-16 text-red-600 border-b-2 border-red-600";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/90 text-black shadow-md z-50 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
          <h1 className="text-lg md:text-2xl font-bold">Porichoi</h1>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={home ? activeClass : inactiveClass}>
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </Link>
          <Link href="/profile" className={profile ? activeClass : inactiveClass}>
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </Link>
          <Link href="/news" className={news ? activeClass : inactiveClass}>
            <i className="fa-solid fa-newspaper"></i>
            <span>News</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className={`absolute right-0 md:relative md:block ${isOnclick ? 'block' : 'hidden'} w-64 md:w-32 lg:w-64 p-2 bg-gray-100 border border-gray-300 rounded-md transition-transform duration-300 ease-in-out`}
          />
          <FaSearch size={20} onClick={toggleSearchInput} className="cursor-pointer text-gray-700 hover:text-red-600 transition duration-200" />
          <i className="fa-solid fa-cloud-arrow-up hidden md:block cursor-pointer text-gray-700 hover:text-red-600 transition duration-200" onClick={togglePostFormDisplay}></i>
          {user ? (
            <button onClick={() => auth.signOut()} className="hidden md:block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200">
              Logout
            </button>
          ) : (
            <>
              <Link href="/log-in" className="hidden md:block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">Login</Link>
              <Link href="/sign-up" className="hidden md:block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">Sign up</Link>
            </>
          )}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-red-600 transition duration-200">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-40`}>
        <Link href="/" className={`block px-4 py-2 ${home ? "text-red-600" : "text-gray-700"} hover:bg-gray-100`}>Home</Link>
        <Link href="/profile" className={`block px-4 py-2 ${profile ? "text-red-600" : "text-gray-700"} hover:bg-gray-100`}>Profile</Link>
        <Link href="/news" className={`block px-4 py-2 ${news ? "text-red-600" : "text-gray-700"} hover:bg-gray-100`}>News</Link>
        {user ? (
          <button onClick={() => auth.signOut()} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
            Logout
          </button>
        ) : (
          <>
            <Link href="/log-in" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
            <Link href="/sign-up" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign up</Link>
          </>
        )}
      </div>

      <Form Style={customStyle + ' mt-[-100px]'} />
    </>
  );
};

export default NavBar;
