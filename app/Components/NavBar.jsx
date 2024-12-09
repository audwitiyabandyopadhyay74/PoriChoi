"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaHome, FaUser, FaNewspaper, FaTimes } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Form from "./Form";
import Avatar from "../download.png"
import Logo from "../favicon.ico";

const NavBar = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState("");
  const [user, setUser] = useState(null);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Update active page based on pathname
    const pageMap = {
      "/": "home",
      "/my-account": "my-account",
      "/news": "news",
      "/log-in": "login",
      "/sign-up": "signup",
    };
    setActivePage(pageMap[pathname] || "");

    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [pathname]);

  const toggleVisibility = (setter) => setter((prev) => !prev);

  // Classes for active and inactive links
  const baseClass =
    "flex flex-col items-center justify-center text-gray-600 hover:text-red-600 transition-colors duration-300";
  const activeClass = "text-red-600 border-b-4 border-red-600";

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="flex items-center justify-between w-full px-8">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" className="w-12 h-12" />
            <h1 className="text-2xl font-bold">Porichoi</h1>
          </div>

          <div className="flex items-center gap-6">
            {user && ["home", "my-account", "news"].map((page) => (
              <Link
                key={page}
                href={`/${page === "home" ? "" : page}`}
                className={`${baseClass} ${
                  activePage === page ? activeClass : ""
                }`}
              >
                {page === "home" && <FaHome size={28} />}
                {page === "my-account" && <FaUser size={28} />}
                {page === "news" && <FaNewspaper size={24} />}
                <span className="text-xs capitalize">{page}</span>
              </Link>
            ))}
          </div>
          {user && (
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
              onClick={() => toggleVisibility(setIsPostFormVisible)}
            >
              <i className="fa-solid fa-cloud-upload" style={{ fontSize: "20px" }} />
            </button>
          )}
          <div className="flex items-center gap-4 relative">
            {user ? (
              <div className="w-max h-full rounded-full flex items-center justify-center p-4 mt-4">
                <details className="bg-white w-max h-full p-4 rounded-md marker:mt-[-50px]">
                  <summary>
                    <Image
                      src={user.photoURL || Avatar}
                      alt="User Avatar"
                      className="rounded-full w-10 h-10"
                    />
                  </summary>
                  <p>
                    <ul style={{ listStyleType: "none" }}  className="flex flex-col gap-1">
                      <Link href={"/my-account"}><li><i className="fa-solid fa-user" style={{ fontSize: "20px" }}></i> My Account</li></Link>
                      <Link href={"/my-account/settings"}><li><i className="fa-solid fa-gear" style={{ fontSize: "20px" }}></i>Settings</li></Link>
                    </ul>
                  </p>
                </details>
              </div>
            ) : (
              <div className="flex gap-1 items-center h-full w-max">
                <Link href="/search"><FaSearch size={25} /></Link>
                <div className="flex w-max h-max items-center gap-2">
                  <Link href="/log-in">
                    <button className="bg-black text-white h-[6vh] border rounded-md hover:bg-white border-black border-[2px] hover:text-black transition-all duration-300" style={{ width: "20vh" }}>
                      Login
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="bg-white border-none text-black w-[10vh] h-[6vh] border rounded-md  transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white shadow-t-md z-50">
        <div className="flex items-center justify-around h-full">
          {user && ["home", "my-account", "news"].map((page) => (
            <Link
              key={page}
              href={`/${page === "home" ? "" : page}`}
              className={`${baseClass} ${
                activePage === page ? activeClass : ""
              }`}
            >
              {page === "home" && <FaHome size={24} />}
              {page === "my-account" && <FaUser size={24} />}
              {page === "news" && <FaNewspaper size={24} />}
              <span className="text-xs capitalize">{page}</span>
            </Link>
          ))}

          {!user && (
            <>
              <Link href="/log-in" className={`${baseClass} flex flex-col items-center justify-center w-max h-full`}>
                <CiLogin size={24} />
                <span className="text-xs">Log in</span>
              </Link>
              <Link href="/sign-up" className={`${baseClass} flex flex-col items-center justify-center w-max h-full`}>
                <CiLogin size={24} />
                <span className="text-xs">Sign up</span>
              </Link>
            </>
          )}

          {user && (
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
              onClick={() => toggleVisibility(setIsPostFormVisible)}
            >
              <i className="fa-solid fa-cloud-upload" style={{ fontSize: "20px" }} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-3/4 h-3/4 rounded-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              onClick={() => toggleVisibility(setIsMobileMenuOpen)}
            >
              <FaTimes size={24} />
            </button>
            <Form />
          </div>
        </div>
      )}

      {/* Post Form */}
      {isPostFormVisible && (
        <Form className="fixed top-16 left-0 right-0 mx-auto z-40" />
      )}
    </>
  );
};

export default NavBar;
