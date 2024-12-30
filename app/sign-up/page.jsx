"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';  
import icon from '../favicon.ico';
import Image from 'next/image';
import { usePathname , redirect } from 'next/navigation';
// import { redirect } from 'next/navigation';


const SignUpPage = () => {
  const pathname = usePathname();
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
        setUser(user);
      }
    });
    return () => unsubscribe();
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
      setUser(user); // Set user to trigger redirect
    } catch (err) {
      setError(err.message.includes('auth/email-already-in-use') ? 'The email is already in use' : 'An error occurred. Please try again.');
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
      setUser(user); // Set user to trigger redirect
    } catch (error) {
      setError(error.message.includes('auth/email-already-in-use') ? 'The email is already in use' : 'Google sign-in error. Please try again.');
    }
  };

  
  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
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
      setUser(user); // Set user to trigger redirect
    } catch (error) {
      setError(error.message.includes('auth/email-already-in-use') ? 'The email is already in use' : 'Google sign-in error. Please try again.');
    }
  };
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
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
      setUser(user); // Set user to trigger redirect
    } catch (error) {
      setError(error.message.includes('auth/email-already-in-use') ? 'The email is already in use' : 'Google sign-in error. Please try again.');
    }
  };
  if (user && pathname === "/sign-up") {
    return redirect("/"); // Replace with actual redirection logic if needed
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative transform transition hover:scale-105">
        <Image src={icon} alt="Icon" className="mx-auto w-16 mb-6" width={100}/>
        
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">Sign Up</h2>

        {error && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="relative mb-3">
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className="fa-solid fa-eye absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <button
          onClick={signUpWithEmail}
          className="w-full py-3 mt-5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Sign Up
        </button>

        <button
          onClick={signInWithGoogle}
          className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          <i className="fa-brands fa-google mr-2"></i> Sign Up with Google
         
        </button>
        <button
          onClick={signInWithGithub}
          className="w-full mt-5 py-3 bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg  transition duration-300 transform hover:scale-105"
        >
          <i className="fa-brands fa-github mr-2"></i> Sign Up with Github
</button>

<button
          onClick={signInWithFacebook}
          className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg  transition duration-300 transform hover:scale-105"
        >
          <i className="fa-brands fa-facebook mr-2"></i> Sign Up with Facebook
</button> 

        <div className="mt-5 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setUser(null)} // Replace with actual redirection logic if needed
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
