"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import icon from '../favicon.ico';
import Image from 'next/image';

const SignUpPage = () => {
  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUser(user);
      }
    });
  }, []);

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const signUpWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName, phoneNumber });
      await addDoc(collection(firestore, 'userFollowingdata'), {
        userName: displayName,
        pic: user.photoURL || null,
      });
      document.location.href = '/';
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('The email is already in use');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = collection(firestore, 'userFollowingdata');
      const q = query(userRef, where("userName", "==", user.displayName));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        await addDoc(userRef, {
          userName: user.displayName,
          pic: user.photoURL,
          follower: 0,
        });
      }
      document.location.href = '/';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email is already in use');
      } else {
        setError('Google sign-in error. Please try again.');
      }
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className="h-[90%] lg:w-[35%] w-[90vw] bg-[#fff] rounded-md text-center flex flex-col justify-center items-center p-5 gap-4">
        <Image src={icon} className='rounded-full w-[40%] scale-75 bg-white p-1' alt="Icon" />
        <div className="font-semibold text-3xl">Sign Up</div>

        <input
          type="text"
          placeholder='Full Name'
          className='w-[80%] border p-2 rounded-md'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="email"
          placeholder='Email'
          className='w-[80%] border p-2 rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-[80%] relative">
          <input
            type="password"
            placeholder='Password'
            id='password'
            className='w-full border p-2 rounded-md'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className="fa-solid fa-eye cursor-pointer absolute right-3 top-3"
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        <input
          type="text"
          placeholder='Phone Number'
          className='w-[80%] border p-2 rounded-md'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <button
          className='w-[60%] mt-5 bg-red-600 text-white py-2 rounded-md hover:scale-105'
          onClick={signUpWithEmail}
        >
          Sign Up
        </button>
        <button
          className='w-[60%] mt-3 bg-black text-white py-2 rounded-md flex items-center justify-center hover:scale-105'
          onClick={signInWithGoogle}
        >
          <i className="fa-brands fa-google mr-2"></i> Login With Google
        </button>

        {error && <p className="text-red-600">{error}</p>}

        <div className="mt-5">
          Have an account? <span className='text-blue-500 cursor-pointer' onClick={() => { document.location.href = "/log-in" }}>Log in</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
