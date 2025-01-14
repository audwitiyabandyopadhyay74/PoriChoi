"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
// import SideBar from '../../Components/SideBar';
import Post from '../Components/Post';
import { collection, getDocs } from 'firebase/firestore';
import MoblieNav from '../Components/Mobile Nav';
import { toast } from 'react-toastify';
  // import { gsap } from 'gsap';
const Page = () => {
  const [user, setUser] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [name, setName] = useState("");
  const [userFollowingdata, setUserFollowingdata] = useState([]);
  const [FilteredUserFollowingdata, setFilteredUserFollowingdata] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setName(user.displayName || user.email);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromFirebase();
        setFilteredPosts(data.filter(post => post.uid === name) || data.filter(post => post.username === name)); // Adjust filter based on your field
      } catch (error) {
        toast.error('Error fetching data:', error.message);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  if (user === null) {
    return (
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold content'>
        <MoblieNav />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
        <a href='/log-in'>
          <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <MoblieNav />
      <NavBar />
      <ToastContainer />
      <div className="content">
        <h1 className='text-2xl font-semibold'>{name}</h1>
        <br />
        <div className="flex w-screen h-full justify-between">
          <div className="flex w-screen h-max lg:flex-row flex-col gap-[200px] justify-center items-center">
            <div className="h-max w-[30%] flex flex-col items-center justify-between gap-[400px]">
              <span className="font-semibold text-3xl">My Posts</span>
              {filteredPosts.map((post) => (
                <div className='mt-[-200px]' key={post.id}>
                  <Post {...post} />
                </div>
              ))}
              {userFollowingdata || 0}
              {console.log(FilteredUserFollowingdata[0]?.followers.length + FilteredUserFollowingdata[0]?.followers + "holders")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;