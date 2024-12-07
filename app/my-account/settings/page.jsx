"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import SideBar from '../../Components/SideBar';
import { auth, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, collection } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState("Name is not given");
  const [changedImage, setChangedImage] = useState(null);
  const [changedName, setChangedName] = useState("");
  const [changedEmail, setChangedEmail] = useState("");
  const [changedPhoneNumber, setChangedPhoneNumber] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhoto(currentUser.photoURL || Avatar);
        setName(currentUser.displayName || "Name is not given");
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
      await updateProfile(user, { displayName: changedName || name, photoURL });
      await updateDoc(collection(firestore, 'userFollowingdata'), {
        userName: changedName || name,
        pic: photoURL,
      });
      alert("Profile updated successfully!");
      document.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Error updating profile');
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation && user) {
      user.delete()
        .then(() => alert("Account deleted successfully."))
        .catch((error) => alert(`Error deleting account: ${error.message}`));
    }
  };

  const inputClassName = 'w-[30vw] h-[6vh] rounded-md p-1 border-none outline-none';

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
  } else {
    return (
      <div>
        <NavBar />
        <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4">
          <Image src={photo} width={100} height={100} className='rounded-full p-[10px]' alt='Profile Image' />
          <h1 className='text-2xl font-semibold'>{name}</h1>
        </div>
        <div className="flex w-screen h-full justify-between gap-[200px]">
          <SideBar />
          <div className="block">
            <form className="h-[70vh] w-max flex items-center justify-center flex-col gap-4" onSubmit={handleSubmit}>
              <div className="text-3xl font-semibold">Update Your Profile</div>
              <b className='w-[30vw]'>ℹ️ You can also update one thing by just filling the input and clicking on Update.</b>
              <input type="text" value={changedName} placeholder='Name' onChange={(e) => setChangedName(e.target.value)} className={inputClassName} />
              <input type="text" value={changedEmail} placeholder='Email' onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} />
              <input type="text" value={changedPhoneNumber} placeholder='Phone Number' onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} />
              <input type="file" onChange={handleImageUpload} className={inputClassName} />
              <input type="submit" value="Update" className='lg:w-[10vw] lg:h-[6vh] w-max h-[6vh] rounded-md p-1 bg-[#0f0f0f] p-[10px] text-white hover:scale-110 cursor-pointer' />
            </form>
            <div className="block mt-8">
              <div className="text-3xl">Delete Account</div>
              <button className='w-[10vh] h-[5vh] text-white rounded-md bg-red-600 hover:scale-110 cursor-pointer' onClick={handleDeleteAccount}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
