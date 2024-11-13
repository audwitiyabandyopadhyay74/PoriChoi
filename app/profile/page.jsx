"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { auth } from '../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
import SideBar from '../Components/SideBar';

const Page = () => {
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhoto(currentUser.photoURL || Avatar);
        setName(currentUser.displayName || "Name is not given");
        setEmail(currentUser.email || "Email is not given");
        setPhoneNumber(currentUser.phoneNumber || "Phone Number is not given");
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        await updateProfile(user, {
          displayName: name,
          photoURL: photo,
        });
        alert("Profile updated successfully!");
        document.location.href = "/profile/update-profile";
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4">
        <Image src={photo} width={100} height={100} className="rounded-full" alt="Profile Image" />
        <h1 className="text-2xl font-semibold">{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between">
        <div className="flex w-screen h-max flex-row gap-[200px] justify-center items-center">
          <SideBar />
          <form className="h-[70vh] w-max flex items-center justify-center flex-col gap-4" onSubmit={handleSubmit}>
            <div className="text-3xl font-semibold">Edit Your Profile</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-[30vw] border rounded-md p-2"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-[30vw] border rounded-md p-2"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
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
