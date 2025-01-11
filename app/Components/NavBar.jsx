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
import Avatar from "../download.png";
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
      "/profile": "profile",
      "/news": "news",
      "/login": "login",
    };
    setActivePage(pageMap[pathname] || "");

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  const handlePostFormToggle = () => {
    setIsPostFormVisible(!isPostFormVisible);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/">
          <a className="navbar-logo">
            <Image src={Logo} alt="Logo" width={50} height={50} />
          </a>
        </Link>
        <div className={`navbar-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <Link href="/">
            <a className={`navbar-item ${activePage === "home" ? "active" : ""}`}>
              <FaHome /> Home
            </a>
          </Link>
          <Link href="/profile">
            <a className={`navbar-item ${activePage === "profile" ? "active" : ""}`}>
              <FaUser /> Profile
            </a>
          </Link>
          <Link href="/news">
            <a className={`navbar-item ${activePage === "news" ? "active" : ""}`}>
              <FaNewspaper /> News
            </a>
          </Link>
          {user ? (
            <div className="navbar-item" onClick={handlePostFormToggle}>
              <FaSearch /> Post
            </div>
          ) : (
            <Link href="/login">
              <a className={`navbar-item ${activePage === "login" ? "active" : ""}`}>
                <CiLogin /> Login
              </a>
            </Link>
          )}
        </div>
        <div className="navbar-avatar">
          {user ? (
            <Image src={user.photoURL || Avatar} alt="User Avatar" width={50} height={50} />
          ) : (
            <Image src={Avatar} alt="Default Avatar" width={50} height={50} />
          )}
        </div>
        <div className="navbar-toggle" onClick={handleMobileMenuToggle}>
          {isMobileMenuOpen ? <FaTimes /> : <FaSearch />}
        </div>
      </div>
      {isPostFormVisible && <Form />}
    </nav>
  );
};

export default NavBar;