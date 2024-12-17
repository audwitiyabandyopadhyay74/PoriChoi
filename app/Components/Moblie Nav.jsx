"use client";
import React,{useState,useEffect} from 'react';
import logo from '../favicon.ico'
import Image from 'next/image';
import {onAuthStateChanged} from "firebase/auth"
import Avatar from '../download.png'
import {FaSearch} from "react-icons/fa";
import Link from "next/link";


const [user, setUser] = useState(null)
const [userpic , setUserpic] = useState("")
useEffect(()=>{
  onAuthStateChanged((user)=>{
setUser(user);
setUserpic(user.photoURL);
// console.log(user);

  })
})
const MoblieNav = () => {
  if(user){
  return (
    <nav className='lg:hidden visible fixed w-screen h-16 flex flex-col items-center justify-center top-[-4rem] right-[1px] bg-white rounded-md hidden'>
      
      <Image src={logo} alt="Logo" className="w-12 h-12" />
PoriChoi
<div className="w-full flex items-center justify-center gap-[40%]">
<div className="userpic">
<Image src={userpic|| Avatar } width={250} height={250} className='rounded-full'/>
</div>
<div className="search">
<Link href="/search"><FaSearch size={25} /></Link>


</div>
</div>

      </nav>
  );} else{
    <nav className='lg:hidden visible fixed w-screen h-16 flex flex-col items-center justify-center'>
      
    <Image src={logo} alt="Logo" className="w-12 h-12" />
PoriChoi
<div className="w-full flex items-center justify-center gap-[40%]">
<div className="userpic">
<Image src={Avatar } width={250} height={250} className='rounded-full'/>
</div>
<div className="search">
<Link href="/search"><FaSearch size={25} /></Link>

</div>
</div>

    </nav>
  }
}

export default MoblieNav;
