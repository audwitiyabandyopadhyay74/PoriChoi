"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import { auth, storage, firestore } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../toastify.css';
import "../style.css";
import MoblieNav from '../../Components/Moblie Nav';
import SideBar from '../../Components/SideBar'
import { CountryCodeISO } from "../../Data/CountryCodeISO";

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
    // try {
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
  
      await updateDoc(doc(firestore, 'userFollowingdata', user.uid), {
        userName: changedName || name,
        pic: photoURL,
      });
  
      await updateDoc(doc(firestore, 'userProfileData', user.uid), {
        userName: changedName || name,
        pic: photoURL,
      });
  
      toast.success("Profile updated successfully!", { theme: "colored" });
  
  }; 
  
    const inputClassName = "w-[82.5vh] min-w-[45vh] h-[6vh] rounded-md p-4 border-none outline-none shadow-md border";

  if (user === null) {
    return (
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>
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
      <div className="flex w-screen h-screen items-center justify-center relative">
       <a href='/my-account'><span className='absolute top-[5rem] left-[4rem]'>My Account/Settings</span></a>
        <div className="w-[65%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">
          <SideBar />
          <form className="flex flex-col gap-4 justify-center items-center mt-[30px] w-[80%] absolute" onSubmit={handleSubmit}>
            <Image src={photo} width={200} height={200} className='rounded-full p-[10px]' alt='Profile Image' />
            <input type="file" onChange={handleImageUpload} className={`${inputClassName} rounded-full`} />
            <input type="text" placeholder="Name" value={changedName || name} onChange={(e) => setChangedName(e.target.value)} className={inputClassName} />
            <input type="email" placeholder="Email" value={changedEmail || email} onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} />
            <div className="flex gap-2 items-center">
              <select className={`${inputClassName.replace("w-[82.5vh]", "w-[7.8vw]")} `} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                <option value=""></option>
                <option value="">Select Country Code</option>
                {CountryCodeISO.map((country) => (
                  <option key={country.code} value={country.code}>
                  {console.clear(country.country)}  {country.iso} ({country.code})
                  </option>
                ))} 
                {/* I back ! */}
              </select>
              <input type="tel" placeholder="Phone Number" value={changedPhoneNumber || phoneNumber} onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} />
            </div>
            <input type="submit" value="Save Changes" 
            className='lg:w-[7vw] lg:h-[7vh] w-max h-[6vh] p-0 rounded-md bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer' />
          </form>
        </div>
      </div>
    </>
  );
};
export default Page;