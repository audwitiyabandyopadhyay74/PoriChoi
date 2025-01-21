"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import { auth, storage, firestore } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../toastify.css';
import "../style.css";
import MoblieNav from '../../Components/Mobile Nav';
import SideBar from '../../Components/SideBar';
import { CountryCodeISO } from "../../Data/CountryCodeISO";
import { usePathname } from 'next/navigation';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState("Name is not given");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [changedImage, setChangedImage] = useState(null);
  const [changedName, setChangedName] = useState("");
  const [changedEmail, setChangedEmail] = useState("");
  const [changedPhoneNumber, setChangedPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || "Name is not given");
        setEmail(user.email || "Email is not given");
        setPhoneNumber(user.phoneNumber || "Phone Number is not given");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChangedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = photo;
      if (changedImage) {
        const imgRef = ref(storage, `uploads/images/${changedImage.name}`);
        await uploadBytes(imgRef, changedImage);
        photoURL = await getDownloadURL(imgRef);
      }

      const fullPhoneNumber = `${countryCode}${changedPhoneNumber || phoneNumber}`;
      const updatedProfileData = {
        photoURL,
        displayName: changedName || name,
        email: changedEmail || email,
        phoneNumber: fullPhoneNumber,
      };

      await updateProfile(user, updatedProfileData);

      const userName = name;

      await updateDoc(doc(firestore, 'userFollowingdata', userName), {
        userName: changedName || name,
        pic: photoURL,
      });

      await updateDoc(doc(firestore, 'userProfileData', user.uid), {
        userName: changedName || name,
        pic: photoURL,
      });

      toast.success("Profile updated successfully!", { theme: "colored" });

    } catch (error) {
      toast.error("Failed to update profile. Please try again.", { theme: "colored" });
      console.error("Error updating profile:", error);
    }
  };

  const [profile, setProfile] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/my-account/settings") {
      setProfile(true);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/verify-email") {
      setProfile(false);
      setVerifyEmail(true);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/verify-phone-number") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(true);
      setResetPassword(false);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/rest-password") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(true);
      setDeleteAccount(false);
    } else if (pathname === "/my-account/settings/delete-account") {
      setProfile(false);
      setVerifyEmail(false);
      setVerifyPhoneNumber(false);
      setResetPassword(false);
      setDeleteAccount(true);
    }
  }, [pathname]);

  const optionClassName = "h-[10vh] w-[95%] bg-white mt-[20px] ml-[2.5%] mr-[2.5%] flex items-center justify-center gap-4 p-[30px] shadow-md cursor-pointer rounded-md";
  const optionClassNameActive = `${optionClassName} bg-gray-200`;
  const inputClassName = "w-[82.5vh] min-w-[45vh] h-[6vh] rounded-md p-4 border-none outline-none shadow-md border";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOptions = [
    { path: "/my-account/settings/mobile", label: "Profile", active: profile },
    { path: "/my-account/settings/verify-email", label: "Verify Email", active: verifyEmail },
    { path: "/my-account/settings/verify-phone-number", label: "Verify Phone Number", active: verifyPhoneNumber },
    { path: "/my-account/settings/rest-password", label: "Reset Password", active: resetPassword },
    { path: "/my-account/settings/delete-account", label: "Delete Account", active: deleteAccount },
  ].filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));

  if (user === null) {
    return (
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>
        <ToastContainer
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
          bodyClassName="text-sm font-medium text-white block p-3"
          position="bottom-left"
          autoClose={3000}
        />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
        <a href='/log-in'>
          <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
        </a>
      </div>
    );
  } 
  return (
    <>
      <NavBar />
      <MoblieNav />
      <ToastContainer />
      <div className="lg:flex w-screen h-screen items-center justify-center relative hidden ">
        <a href='/my-account'><span className='absolute top-[5rem] left-[4rem]'>My Account/Settings</span></a>
        <div className="w-[70%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">
          <SideBar />
          <form className="flex flex-col gap-4 justify-center items-center mt-[30px] w-[80%] absolute" onSubmit={handleSubmit}>
            <Image src={photo} width={200} height={200} className='rounded-full p-[10px]' alt='Profile Image' />
            <input type="file" onChange={handleImageUpload} className={`${inputClassName} rounded-full`} />
            <input type="text" placeholder="Name" value={changedName || name} onChange={(e) => setChangedName(e.target.value)} className={inputClassName} />
            <input type="email" placeholder="Email" value={changedEmail || email} onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} />
            <div className="flex gap-2 items-center">
              <select className={`${inputClassName.replace("w-[82.5vh] min-w-[45vh]", "w-[10vh]")} `} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                <option value=""></option>
                <option value="">Select Country Code</option>
                {CountryCodeISO.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country} {country.iso} ({country.code})
                  </option>
                ))}
              </select>
              <input type="tel" placeholder="Phone Number" value={changedPhoneNumber || phoneNumber} onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} />
            </div>
            <div className="flex gap-1 items-center justify-center">
              <input type="submit" value="Save Changes"
                className='lg:w-[7vw] lg:h-[7vh] w-max h-[6vh] p-0 rounded-md bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer' />
              <p className='text-1xl' onClick={() => { window.open("https://porichoiop.vercel.app/my-account/settings/") }}>Undo</p>
            </div>
          </form>
        </div>
      </div>
      <div className='visible lg:hidden w-screen h-screen flex flex-col items-center justify-center'>
        <ul className="w-screen h-screen flex flex-col ">
          <li className='flex items-center justify-end'>
            <input
              type="text"
              className="w-[95%] mr-[2.5%] rounded-md mt-[10px] h-[7vh] outline-none p-4"
              placeholder="What Are You Searching Today"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <i className='w-[26px] h-[21px] top-[25px] flex justify-center items-center bg-white fa-solid fa-search absolute scale-150 right-[30px]'></i>
          </li>
          {filteredOptions.map(option => (
            <a key={option.path} href={option.path}>
              <li className={option.active ? optionClassNameActive : optionClassName}>
                <i className={`fa-solid ${option.label === "Profile" ? "fa-user" : option.label === "Verify Email" ? "fa-envelope-circle-check" : option.label === "Verify Phone Number" ? "fa-phone" : option.label === "Reset Password" ? "fa-lock" : "fa-trash"}`}></i> {option.label}
              </li>
            </a>
          ))}
          <li className={`${optionClassName} bg-red-600`} onClick={() => signOut(auth)}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default Page;