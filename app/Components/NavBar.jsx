"use client";

import React, { useState, useEffect } from 'react';
import Logo from "../favicon.ico";
import Image from 'next/image';
import { FaSearch, FaHome, FaUser, FaNewspaper,  FaTimes } from "react-icons/fa";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from 'firebase/auth';
import Form from './Form';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavBar = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('');
  const [user, setUser] = useState(null);
  const [userstate, setUserState] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [error, setError] = useState('');

  useEffect(() => {
    // Set active page based on current pathname
    if (pathname === "/") {
      setActivePage("home");
    } else if (pathname === "/profile") {
      setActivePage("profile");
    } else if (pathname === "/news") {
      setActivePage("news");
    } else {
      setActivePage("");
    }

    // Listen for authentication state changes
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unSubscribe();
  }, [pathname]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
if(user === null){
  setUserState(true)
}else{
    setUserState(false)
  }


  // Define active and inactive classes
  const inactiveClass = "flex flex-col items-center justify-center text-gray-600 hover:text-red-600";
  const activeClass = "flex flex-col items-center justify-center text-red-600 border-[#0000] border-b-red-600 border-solid border-[5px] rounded-md h-full";

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="flex items-center justify-between w-full px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="logo" className='w-12 h-12' />
            <h1 className='text-2xl font-bold'>Porichoi</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className={activePage === "home" ? activeClass : inactiveClass}>
              <i className='fa-solid fa-home' style={{fontSize:"28px"}}></i>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/profile" className={activePage === "profile" ? activeClass : inactiveClass}>
              <i className="fa-solid fa-user" style={{fontSize:"28px"}} ></i>
              <span className="text-xs">Profile</span>
            </Link>
            <Link href="/news" className={activePage === "news" ? activeClass : inactiveClass}>
              <FaNewspaper size={24} />
              <span className="text-xs">News</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 relative">
            {/* Search Icon */}
            <a href="/search">
            <button  className="text-gray-600 hover:text-gray-800">
              <FaSearch size={20} />
            </button></a>
            {/* Search Input */}
            {isSearchVisible && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute right-10 top-12 w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            {/* Post Form Icon */}
       
            {/* Conditional Rendering based on Auth */}
            {user ? (
              <Link href="/profile">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Image src={user.photoURL || Logo} alt="User Avatar" className='rounded-full w-10 h-10' />
                </div>
              </Link>
            ) : (
              <>
                <button
                  className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
                  onClick={() => { document.location.href = "/log-in" }}
                >
                  Login
                </button>
                <button
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                  onClick={() => { document.location.href = "/sign-up" }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white shadow-t-md z-50">
        <div className="flex items-center justify-around h-full">
          <Link href="/" className={activePage === "home" ? activeClass : inactiveClass}>
            <FaHome size={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/profile" className={activePage === "profile" ? activeClass : inactiveClass}>
            <FaUser size={24} />
            <span className="text-xs">Profile</span>
          </Link>
          <Link href="/news" className={activePage === "news" ? activeClass : inactiveClass}>
            <FaNewspaper size={24} />
            <span className="text-xs">News</span>
          </Link>
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button onClick={toggleSearch} className="text-gray-600 hover:text-gray-800">
              <FaSearch size={20} />
            </button>
            {/* Post Form Icon */}
            <button onClick={togglePostForm} className="text-gray-600 hover:text-gray-800">
              <i className='fa-solid fa-cloud-upload' style={{fontSize:"20"}} ></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Input */}
      {isSearchVisible && (
        <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 bg-white shadow-md z-40">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Mobile Menu Toggle */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-3/4 h-3/4 rounded-lg p-6 relative">
            <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
              <FaTimes size={24} />
            </button>
            {/* Add your mobile menu items here */}
            <Form />
          </div>
        </div>
      )}

      {/* Post Form */}
      <Form Style={`${isPostFormVisible ? 'block' : 'hidden'} fixed top-16 md:top-auto md:bottom-16 left-0 right-0 md:left-auto md:right-auto mx-auto`} />
    </>
  );
};

export default NavBar;
