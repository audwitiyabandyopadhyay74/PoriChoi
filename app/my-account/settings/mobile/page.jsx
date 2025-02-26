"use client";

import React, { useState, useEffect } from 'react';
import { auth, storage, firestore } from '../../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { updateProfile, onAuthStateChanged ,signOut} from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../../Components/download.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import '../../toastify.css';
// import "../style.css";
import MoblieNav from '../../../Components/Mobile Nav';
import NavBar from '../../../Components/NavBar'
import SideBar from '../../../Components/SideBar'
import { CountryCodeISO } from "../../../Data/CountryCodeISO";
// import { usePathname } from 'next/navigation';/

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
  // const[FilteredUserFollowingdata, setFilrrerUserFollowingdata] = useState([]);
  
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
      
      
        //   // Fetch posts from Firestore
        //   const fetchDataFromFirebase1 = async () => {
        //     const querySnapshot = await getDocs(collection(firestore, 'userFollowingdata'));
        //     const data = querySnapshot.docs.map((doc) => ({
        //       id: doc.id,
        //       ...doc.data(),
        //     }));
        //     return data;
        //   };
        
      
        // useEffect(() => {
        //   const fetchData = async () => {
        //     try {
        //       const data1 = await fetchDataFromFirebase1();
      
        //       setFilrrerUserFollowingdata(data1.filter(userFollowingdata => userFollowingdata.userName === name))
        //     } catch (error) {
        //       toast.error('Error fetching data:', error.message);
        //     }
        //   };
      
        //   if (name) {
        //     fetchData();
          
        //   }
        // }, [name]);
      
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
    // const [profile, setProfile] = useState(false);
    // const [verifyEmail, setVerifyEmail] = useState(false);
    // const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false);
    // const [resetPassword, setResetPassword] = useState(false);
    // const [deleteAccount, setDeleteAccount] = useState(false);
    // const pathname = usePathname();
  
    // useEffect(() => {
    //   if (pathname === "/my-account/settings") {
    //     setProfile(true);
    //     setVerifyEmail(false);
    //     setVerifyPhoneNumber(false);
    //     setResetPassword(false);
    //     setDeleteAccount(false);
    //   } else if (pathname === "/my-account/settings/verify-email") {
    //     setProfile(false);
    //     setVerifyEmail(true);
    //     setVerifyPhoneNumber(false);
    //     setResetPassword(false);
    //     setDeleteAccount(false);
    //   } else if (pathname === "/my-account/settings/verify-phone-number") {
    //     setProfile(false);
    //     setVerifyEmail(false);
    //     setVerifyPhoneNumber(true);
    //     setResetPassword(false);
    //     setDeleteAccount(false);
    //   } else if (pathname === "/my-account/settings/rest-password") {
    //     setProfile(false);
    //     setVerifyEmail(false);
    //     setVerifyPhoneNumber(false);
    //     setResetPassword(true);
    //     setDeleteAccount(false);
    //   } else if (pathname === "/my-account/settings/delete-account") {
    //     setProfile(false);
    //     setVerifyEmail(false);
    //     setVerifyPhoneNumber(false);
    //     setResetPassword(false);
    //     setDeleteAccount(true);
    //   }
    // }, [pathname]);
  
    const inputClassName = "lg:w-[82.5vh]  w-[60vh] lg:min-w-[45vh] h-[6vh] rounded-md p-4 border-none outline-none shadow-md border";

  // if (user === null) {
  //   return (
  //     <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>
  //       <NavBar />
  //       <span className="text-3xl h-[10vh] ws-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
  //       <a href='/log-in'>
  //         <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
  //       </a>
  //     </div>
  //   );
  // }

  return (
    <>
      <NavBar />
      <MoblieNav />
      <ToastContainer />
      <div className="lg:flex w-screen h-screen items-center justify-center relative hidden ">
       <a href='/my-account'><span className='absolute top-[5rem] left-[4rem]'>My Account/Settings</span></a>
        <div className="w-[100%] h-[80vh] flex gap-4 bg-white rounded-md shadow-md p-2">
          <SideBar />
          <form className="flex flex-col gap-4 justify-center items-center mt-[30px] w-[100%] absolute" onSubmit={handleSubmit}>
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
      <div className='visible lg:hidden  w-screen h-screen flex flex-col items-center justify-center'>
      <SideBar />

      <div className="w-[100%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2 items-center justify-center">
          <form className="flex flex-col gap-4 justify-center items-center mt-[30px] w-[80%] absolute" onSubmit={handleSubmit}>
            <Image src={photo} width={200} height={200} className='rounded-full p-[10px]' alt='Profile Image' />
            <input type="file" onChange={handleImageUpload} className={`${inputClassName} rounded-full`} />
            <input type="text" placeholder="Name" value={changedName || name} onChange={(e) => setChangedName(e.target.value)} className={inputClassName} />
            <input type="email" placeholder="Email" value={changedEmail || email} onChange={(e) => setChangedEmail(e.target.value)} className={inputClassName} />
            <div className="flex gap-2 items-center">
              <select className={`${inputClassName.replace("w-[82.5vh] min-w-[45vh]", "lg:w-[10vh] w-[4vh]")} `} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
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
            <div className="flex gap-1 items-center justify-center">
            <input type="submit" value="Save Changes" 
            className='lg:w-[7vw] lg:h-[7vh] w-[20vh] h-[6vh] p-0 rounded-md bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer' />
          <p className='text-1xl' onClick={()=>{window.open("https://porichoiop.vercel.app/my-account/settings/mobile")}}>Undo</p>
          </div></form>
        </div>      </div>
    </>
  );
};
export default Page;