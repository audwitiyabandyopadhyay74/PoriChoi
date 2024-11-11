"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import { auth, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';

import SideBar from '../../Components/SideBar';
import Image from 'next/image';
import Avatar from '../../download.png';
// import Link from 'next/link';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [changedName, setChangedName] = useState('');
  const [changedEmail, setChangedEmail] = useState('');
  const [changedPhoneNumber, setChangedPhoneNumber] = useState('');
  const [changedImage, setChangedImage] = useState(null);
  const [changedFilenameImage, setChangedFileNameImage] = useState("");
  const [changedImageLink, setChangedImageLink] = useState("");
console.log(email,phoneNumber,changedImageLink)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setChangedImage(file);
      setChangedFileNameImage(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imgRef = ref(storage, `/uploads/images/${changedFilenameImage}`);
      await uploadBytes(imgRef, changedImage);
      const link = await getDownloadURL(imgRef);
      setChangedImageLink(link);

      await updateProfile(user, {
        displayName: changedName || name,
        photoURL: link || photo,
      }).then(()=> document.location.reload());

      // Optional: Reload the page to reflect changes
      // document.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };
  const userd = auth.currentUser;

  const inputClassName = 'w-[30vw] h-[6vh] rounded-md p-1 border-none outline-none';
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      document.location.href = '/log-in';
    });
  };

  return (
    <div className=''>
      <NavBar />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4">
        <Image src={photo} width={100} height={100} className='rounded-full p-[10px]' alt='Profile Image' />
        <h1 className='text-2xl font-semibold'>{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between gap-[200px]">
        <div className="flex w-screen h-max flex-row gap-[200px] justify-center items-center">
<SideBar/>
&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<div className="block">
<form className="h-[70vh] w-max flex items-center justify-center flex-col gap-4" onSubmit={handleSubmit}>
            <div className="text-3xl font-semibold">Update Your Profile</div>
            <b className='w-[30vw]'>ℹ️ You can also update one thing by just filling the input and clicking on the Update Your Profile</b>
            <input type="text" value={changedName} placeholder='Name' onChange={(e) => setChangedName(e.target.value)} className={inputClassName} />
            <input type="text" value={changedEmail} placeholder='Email' onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} />
            <input type="text" value={changedPhoneNumber} placeholder='Phone Number' onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} />
            <input type="file" onChange={handleImageUpload} className={inputClassName} />
            <input type="submit" value="Update" className='shadow-lg w-[10vw] h-[6vh] rounded-md p-1 bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer' />
      
          </form>
          <div className="block">
          <div className="text-3xl ">Delete Account</div>
      <button className='w-[10vh] h-[5vh] text-white rounded-md bg-red-600 hover:scale-110 cursor-pointer' onClick={()=>{
        const confom = confirm("Are You Sure");
        if(confom === true){userd.delete().then((result) => {
  alert("Sucessfully deleted"+result.message)      
      }).catch((err) => {
        alert(err.message)
      });}}}>Delete</button>

          </div>

</div>
  
        </div>
      </div>
    </div>
  );
};

export default Page;
