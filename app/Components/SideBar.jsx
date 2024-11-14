// "use client";

// import React, { useState, useEffect } from 'react';
// import Logo from "../favicon.ico";
// import Image from 'next/image';
// import { FaSearch, FaBars } from "react-icons/fa";
// import { auth } from "../firebase.js";
// import { onAuthStateChanged } from 'firebase/auth';
// import Form from './Form';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';

// const NavBar = () => {
//   const pathname = usePathname();
//   const [home, setHome] = useState(false);
//   const [profile, setProfile] = useState(false);
//   const [news, setNews] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isOnclick, setIsOnclick] = useState(false);
//   const [customStyle, setCustomStyle] = useState("hidden");
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     // Highlight active page link
//     setHome(pathname === "/");
//     setProfile(pathname === "/profile");
//     setNews(pathname === "/news");

//     // Check user authentication
//     const unSubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user || null);
//     });
//     return () => unSubscribe();
//   }, [pathname]);

//   const toggleSearchInput = () => {
//     const search = document.querySelector('input');
//     if (isOnclick) {
//       search.classList.add('right-10');
//       search.classList.remove('right-[-180%]');
//     } else {
//       search.classList.add('right-[-180%]');
//       search.classList.remove('right-10');
//     }
//     setIsOnclick(!isOnclick);
//   };

//   const togglePostFormDisplay = () => {
//     setCustomStyle((prevStyle) => (prevStyle === "block" ? "hidden" : "block"));
//   };

//   const inactiveClass = "h-[4.5rem] ease-in-out duration-150 hover:text-red-600 border-[#0000] border-b-[5px] hover:border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";
//   const activeClass = "h-[4.5rem] ease-in-out duration-150 text-red-600 border-[#0000] border-b-[5px] border border-b-red-600 rounded-md flex justify-center items-center w-[4rem] flex-col";

//   return (
//     <>
//       <nav className={`fixed z-100 w-full bg-white shadow-md text-black ${menuOpen ? 'h-auto' : 'h-16'} flex sm:flex-row flex-col items-center justify-between sm:justify-center`}>
        
//         {/* Logo Section */}
//         <div className="logo flex items-center justify-center gap-2 sm:w-[20%] w-full p-2">
//           <Image src={Logo} alt="logo" className='w-14 h-14' />
//           <h1 className='text-2xl font-bold'>Porichoi</h1>
//         </div>

//         {/* Nav Items - Desktop & Tablet */}
//         <div className={`w-full sm:w-[60%] sm:flex ${menuOpen ? 'block' : 'hidden'} sm:flex-row flex-col items-center gap-4 justify-center`}>
//           <Link href="/" className={home ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-house' style={{ fontSize: "30px" }}></i>
//             <span style={{ fontSize: "10px" }}>Home</span>
//           </Link>
//           <Link href="/profile" className={profile ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-user' style={{ fontSize: "30px" }}></i>
//             <span style={{ fontSize: "10px" }}>Profile</span>
//           </Link>
//           <Link href="/news" className={news ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-newspaper' style={{ fontSize: "30px" }}></i>
//             <span style={{ fontSize: "10px" }}>News</span>
//           </Link>
//         </div>

//         {/* Search and Post Icons */}
//         <div className="w-[20%] flex justify-end items-center gap-4 p-2 sm:mr-4">
//           <input type="text" placeholder='Search' className='hidden sm:block h-[60%] ease-in-out duration-500 right-[-180%] absolute w-[80%] outline-none border border-black rounded-md p-2' />
//           <FaSearch className="sm:hidden cursor-pointer" onClick={toggleSearchInput} />
//           <i className="fa-solid fa-cloud-arrow-up text-xl cursor-pointer" onClick={togglePostFormDisplay}></i>
//         </div>

//         {/* Mobile Menu Icon */}
//         <button
//           className="sm:hidden absolute top-4 right-4 text-2xl focus:outline-none"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           <FaBars />
//         </button>
//       </nav>

//       {/* Bottom Navigation on Mobile */}
//       {user && (
//         <div className="fixed bottom-0 w-full bg-white shadow-lg flex justify-around sm:hidden">
//           <Link href="/" className={home ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-house' style={{ fontSize: "24px" }}></i>
//             <span className="text-xs">Home</span>
//           </Link>
//           <Link href="/profile" className={profile ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-user' style={{ fontSize: "24px" }}></i>
//             <span className="text-xs">Profile</span>
//           </Link>
//           <Link href="/news" className={news ? activeClass : inactiveClass}>
//             <i className='fa-solid fa-newspaper' style={{ fontSize: "24px" }}></i>
//             <span className="text-xs">News</span>
//           </Link>
//           <FaSearch size="24px" className="text-gray-600 cursor-pointer" onClick={toggleSearchInput} />
//         </div>
//       )}

//       <Form Style={customStyle + ' mt-[-100px]'} />
//     </>
//   );
// };

// export default NavBar;
// import Link from 'next/link';
'use client';
import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import {signOut} from "firebase/auth";
import { usePathname } from 'next/navigation';
const handleSignOut = () => {
    signOut(auth).then(() => {
      document.location.href = '/log-in';
    });
  };
const SideBar = () =>{
const [profile ,setProfile] = useState(false);
const [settings ,setSettings] = useState(false);
const [YourPosts ,setYourPosts] = useState(false);
const pathname = usePathname()
  useEffect(()=>{
    if(pathname === "/profile"){
setProfile(true);
    }else if(pathname === "profile/yourposts"){
      setYourPosts(true);
    }
    else{
      setProfile(false);
      setSettings(true)
    }
  },[])
const notactive = "w-[53.5vh] h-[8vh] flex items-center justify-center bg-[#000] rounded-md gap-4 font-semibold text-white";
const active = "w-[53.5vh] h-[8vh] flex items-center justify-center bg-[#fff] border-r border-r-[6px] text-[#000] p-[10px] border-r-[#fff]   flex gap-4  font-semibold";
return(
    <div className="flex bg-[#000] h-screen w-[25%] absolute left-[0] rounded-md">
    <ul>
      <li className={profile? active :notactive} onClick={() => { document.location.href = "/profile" }}><i className='fa-solid fa-user' style={{fontSize:"24px"}}></i> Your Profile</li>
      <li className={settings?active :notactive} onClick={()=>{document.location.href = "profile/settings"}}><i className='fa-solid fa-gear' style={{fontSize:"24px"}}></i> Settings</li>
      <li className={YourPosts?active :notactive} onClick={()=>{document.location.href = "profile/yourposts"}}><i className='fa-solid fa-signs-posts' style={{fontSize:"24px"}}></i> Your Posts</li>
    
      {/* <li className='w-[53.5vh] h-[8vh] flex items-center justify-center bg-[#0000] border-r border-r-[10px] rounded-full border-r-[#fff] rounded-md text-white'></li> */}
      <li className='w-[53.5vh] h-[8vh] flex items-center justify-center bg-[#0000] rounded-md pt-[350px]'>
        <button onClick={handleSignOut} className='w-[10vw] h-[3.5vw] bg-red-600 rounded-md text-white font-semibold'>Sign out</button>
      </li>
    </ul>
  </div>
)
}
export default SideBar;
