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
    <div className="flex bg-[#000] h-screen w-full absolute left-[0] rounded-md">
    <ul className='w-full'>
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