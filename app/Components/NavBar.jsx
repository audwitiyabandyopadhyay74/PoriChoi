"use client";

import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../favicon.ico";

const Navbar = () => {
  const router = useRouter();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full shadow-md hover:scale-105 transition duration-200" />
          <span className="text-2xl font-semibold text-white cursor-pointer hover:text-gray-300 transition duration-200" onClick={() => router.push("/")}>
            BrandName
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-white text-lg font-medium hover:text-gray-300 transition duration-200 ${
                router.pathname === item.href ? "text-gray-300" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="md:hidden p-2 text-white focus:outline-none"
          onClick={() => alert("Open Mobile Menu")}
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
