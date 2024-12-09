"use client"
import React, { useState, useEffect} from 'react';
import NavBar from '../Components/NavBar';
import { auth} from '../firebase';
// import { ref, uploadBytes } from 'firebase/storage';
// import { updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
import SideBar from '../Components/SideBar';
import {onAuthStateChanged} from 'firebase/auth'
const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  // const [changedName, setChangedName] = useState('');
  // const [changedEmail, setChangedEmail] = useState('');
  // const [changedPhoneNumber, setChangedPhoneNumber] = useState('');
  // const [changedImage, setChangedImage] = useState(null);
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
  const handleSubmit = (e) => {
document.location.href = "/profile/update-profile"
    e.preventDefault();
  };
  const inputClassName = 'w-max h-[6vh] rounded-md p-[10px] border-none outline-none scroll-y';
  
  
// const spanClassName = '';
if(user === null){ 
  return(
    <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center  font-bold'>
            <NavBar />
<span className="text-3xl  h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span><a href='/log-in'>
<button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button></a>
</div>
  )
} else{ 
  return (
    <>      <NavBar />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4 ">
        <Image src={photo} width={100} height={100} className='rounded-full' alt='Profile Image' />
        <h1 className='text-2xl font-semibold'>{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between">
      <div className="flex w-screen h-max lg:flex-row flex-col  gap-[200px] justify-center items-center">
        <SideBar/>
        <form className="h-[70vh] lg:w-max w-screen flex items-center justify-center flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-3xl font-semibold">Check Your Profile</div>
          {/* <b className='w-[30vw] hidden'>ℹ️ You can also update one thing by just filling the input and clicking on the Update Your Profile</b>  */}
          <div className='w-screen lg:w-max flex flex-col flex-wrap justify-center items-center gap-[10px] '>
          <input type="text" value={name || ''} placeholder={name}   onChange={(e) => setChangedName(e.target.value)} readOnly  className={inputClassName} />
          <input type="text" value={email || ''} placeholder={email} onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} readOnly/>
          <input type="text" value={phoneNumber || ''} placeholder={phoneNumber} readOnly onChange={(e) => setChangedPhoneNumber(e.target.value)} className={inputClassName} />
        </div>
          <input type="submit" value="Update My Profile" className='lg:w-[10vw] lg:h-[6vh] w-max h-[6vh] rounded-md p-1 bg-[#0f0f0f] p-[10px] text-white hover:scale-110 cursor-pointer' />
        
        </form>
      </div>
      </div>
    </>
  );
}
};
export default Page;