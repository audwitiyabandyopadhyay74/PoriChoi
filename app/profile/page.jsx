"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
import SideBar from '../Components/SideBar';

const Page = () => {
  // const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || "Name is not given");
        setEmail(user.email || "Email is not given");
        setPhoneNumber(user.phoneNumber || "Phone Number is not given");
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    document.location.href = "/profile/update-profile";
  };

  return (
    <div>
      <NavBar />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4 ">
        <Image src={photo} width={100} height={100} className="rounded-full" alt="Profile Image" />
        <h1 className="text-2xl font-semibold">{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between">
        <div className="flex w-screen h-max flex-row gap-[200px] justify-center items-center">
          <SideBar />
          <form className="h-[70vh] w-max flex items-center justify-center flex-col gap-4" onSubmit={handleSubmit}>
            <div className="text-3xl font-semibold">Check Your Profile</div>
            <input
              type="text"
              value={name || ''}
              placeholder={name}
              readOnly
              className="w-[30vw] border rounded-md p-2"
            />
            <input
              type="text"
              value={email || ''}
              placeholder={email}
              readOnly
              className="w-[30vw] border rounded-md p-2"
            />
            <input
              type="text"
              value={phoneNumber || ''}
              placeholder={phoneNumber}
              readOnly
              className="w-[30vw] border rounded-md p-2"
            />
            <input
              type="submit"
              value="Update Your Profile"
              className="w-[10vw] h-[6vh] rounded-md p-1 bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
