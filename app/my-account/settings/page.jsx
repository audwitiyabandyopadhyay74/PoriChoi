"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
// import SideBar from '../../Components/SideBar';
import { auth, storage, firestore } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../toastify.css';
import MoblieNav from '@/app/Components/Moblie Nav';
import { countryCodes } from "../../Data/CountryCodeISO";

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState("Name is not given");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [updatedPhoto, setUpdatedPhoto] = useState(Avatar);
  const [changedImage, setChangedImage] = useState(null);
  const [changedName, setChangedName] = useState("");
  const [changedEmail, setChangedEmail] = useState("");
  const [changedPhoneNumber, setChangedPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setChangedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = photo;
      if (changedImage) {
        const imgRef = ref(storage, `/uploads/images/${changedImage.name}`);
        await uploadBytes(imgRef, changedImage);
        photoURL = await getDownloadURL(imgRef);
      }

      const fullPhoneNumber = `${countryCode}${changedPhoneNumber || phoneNumber}`;

      const updatedProfileData = {
        photoURL: photoURL,
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
      document.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error('Error updating profile', { theme: "colored" });
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation && user) {
      user.delete()
        .then(() => toast.success("Account deleted successfully.", { theme: "colored" }))
        .catch((error) => toast.error(`Error deleting account: ${error.message}`, { theme: "colored" }));
    }
  };

  const inputClassName = 'w-[8rem] h-[6vh] rounded-md p-1 border-none outline-none';
  const padding = { padding: "30px 200px" };

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
  } else {
    return (
      <div>
        <ToastContainer
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"
          bodyClassName="text-sm font-medium text-white block p-3"
          position="bottom-left"
          autoClose={3000}
        />
        <NavBar />
        <MoblieNav />
        <div className="flex w-screen h-screen items-center justify-center">
          <span className='absolute top-[5rem] left-[4rem]'>My Account/Settings</span>
          <form className="flex flex-col gap-4 h-max w-max justify-center items-center mt-[100px]" onSubmit={handleSubmit}>
            <div className="text-3xl font-semibold">Update Your Profile</div>
            <b className='w-[30vw]'>ℹ️ You can also update one thing by just filling the input and clicking on Update.</b>
            <Image src={updatedPhoto || photo} width={100} height={100} className='rounded-full p-[10px]' alt='Profile Image' />
            <input type="file" onChange={handleImageUpload} className={inputClassName} />
            <input type="text" placeholder="Name" value={changedName || name} onChange={(e) => setChangedName(e.target.value)} className={inputClassName} style={padding} />
            <input type="email" placeholder="Email" value={changedEmail || email} onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} style={padding} />
            <div className="flex gap-2 items-center">
              <select className={inputClassName.replace("w-[8rem]", "w-[30vw]") + " absolute left-[-50px]"} value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={padding}>
                <option value="">Select Country Code</option>
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country} ({country.iso}) ({country.code})
                  </option>
                ))}
              </select>
              <input type="tel" placeholder="Phone Number" value={changedPhoneNumber || phoneNumber} onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} style={padding} />
            </div>
            <input type="submit" value="Update" className='lg:w-[10vw] lg:h-[6vh] w-max h-[6vh] rounded-md bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer' />
            <div className="block mt-8">
              <div className="text-3xl">Delete Account</div>
              <button type="button" className='w-[10vh] h-[5vh] text-white rounded-md bg-red-600 hover:scale-110 cursor-pointer' onClick={handleDeleteAccount}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Page;
