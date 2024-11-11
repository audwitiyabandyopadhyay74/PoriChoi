"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import icon from '../favicon.ico';
import Image from 'next/image';

const SignUpPage = () => {
  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [userPic, setUserPic] = useState('');
console.log(user)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUsername(user.displayName);
        setUserPic(user.photoURL);
      }
    });
  }, []);

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById('password');
    const icon = document.getElementById('icon');
    if (passwordInput.type === 'password') {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      passwordInput.setAttribute('type', 'text');
    } else {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      passwordInput.setAttribute('type', 'password');
    }
  };

  const signUpWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Update the displayName
      await updateProfile(user, {
        displayName: displayName,
        phoneNumber: phoneNumber,
      }).then(async () => {
        await addDoc(collection(firestore, 'userFollowingdata'), {
          userName: displayName || username,
          pic: userPic || null,
        });
      }).catch((err) => {
        alert(err.message);
      });
      // Redirect to home page
      document.location.href = '/';
    } catch (err) {
      if (err.message.includes('auth/email-already-in-use')) {
        document.getElementById('alert').innerHTML = 'The email is already in use';
      } else {
        alert(err);
      }
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      const user = result.user;
      const userName = user.displayName || displayName || username;
      const userPic = user.photoURL || userPic || null;

      // Check if user data is already in Firestore to avoid duplicate entries
      const userCollection = collection(firestore, 'userFollowingdata');
      const userDoc = {
        userName: userName,
        pic: userPic,
        follower:0,
      };

      // Add the user's data to Firestore
      try {
        await addDoc(userCollection, userDoc);
        document.location.href = '/';
      } catch (err) {
        console.error("Error adding user to Firestore:", err);
      }
    })
    .catch((error) => {
      console.log("Google sign-in error:", error);
      if (error.message.includes('auth/email-already-in-use')) {
        document.getElementById('alert').innerHTML = 'The email is already in use';
      }
    });
  };

  console.log(user)
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className="h-[90%] w-[35%] bg-[#fff] rounded-md text-center gap-[10px] flex flex-col justify-center items-center">
        <br /> <br />
        <Image src={icon} className='rounded-full w-[40%] mt-[10px] scale-75 bg-white p-1' alt="Icon" />
        <div className="font-semibold text-5xl mt-[-20px]">Sign Up</div>
        <div className="w-[100%] h-[10%] rounded-md flex justify-center items-center">
          <input
            required
            type="text"
            placeholder='Full Name'
            className='w-[80%] h-[100%] mt-10 ml-5 border-2 p-1 border-black rounded-md'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="w-[100%] h-[10%] rounded-md flex justify-center items-center">
          <input
            required
            type="email"
            placeholder='Email'
            className='w-[80%] h-full mt-10 ml-5 border-2 p-1 border-black rounded-md'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-[100%] h-[10%] rounded-md flex flex-row justify-center items-center">
          <input
            required
            type="password"
            placeholder='Password'
            id='password'
            className='w-[80%] h-full mt-10 border-2 p-1 border-black rounded-md z-0'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fa-solid fa-eye z-100 text-2xl ml-[-40px] mt-[7%] relative"
            onClick={togglePasswordVisibility}
            id='icon'></i>
        </div>
        <div className="w-[100%] h-[10%] rounded-md flex justify-center items-center">
          <input
            required
            type="text"
            placeholder='Phone Number'
            className='w-[80%] h-[100%] mt-10 ml-5 border-2 p-1 border-black rounded-md'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <br />
        <button
          className='w-[30%] mt-10 ml-10 bg-red-600 text-white rounded-md scale-150 hover:scale-110'
          style={{ fontSize: "12px", padding: "10px 30px" }}
          onClick={signUpWithEmail}>
          Sign up
        </button>
        <button
          className='w-[30vh] mt-10 ml-10 bg-black text-white rounded-md scale-150 hover:scale-110'
          style={{ fontSize: "12px", padding: "10px 35px" }}
          onClick={signInWithGoogle}>
          <i className="fa-brands fa-google"></i> Login With Google
        </button>
        <p className="text-red-800" id='alert'></p>
        <span id="error-text" className='text-red-600'></span>
        <div className="mt-5">Have an account? <span className='text-blue-500' onClick={() => { document.location.href = "/log-in" }}>Log in</span></div>
      </div>
    </div>
  );
};

export default SignUpPage;
