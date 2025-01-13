"use client"
import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
// import SideBar from '../../Components/SideBar';
import Post from '../Components/Post';
import { collection, getDocs } from 'firebase/firestore';
import MoblieNav from '../Components/Moblie Nav';
import { toast } from 'react-toastify';
// import { gsap } from 'gsap';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [userFollowingdata, setUserFollowingdata] = useState([]);
const[FilteredUserFollowingdata, setFilrrerUserFollowingdata] = useState([]);


// Fetch user data on authentication state change
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || 'Name is not given');
      } else {
        setUser(null);
      }
    });
  }, []);

  // Fetch posts from Firestore
  const fetchDataFromFirebase = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'posts'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  };

    // Fetch posts from Firestore
    const fetchDataFromFirebase1 = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'userFollowingdata'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromFirebase();
        const data1 = await fetchDataFromFirebase1();

        setFilteredPosts(data.filter(post => post.uid === name) || data.filter(post => post.username === name)); // Adjust filter based on your field
        setFilrrerUserFollowingdata(data1.filter(userFollowingdata => userFollowingdata.userName === name))
      } catch (error) {
        toast.error('Error fetching data:', error.message);
      }
    };

    if (name) {
      fetchData();
    
    }
  }, [name]);



  console.log(FilteredUserFollowingdata || ["not found",])




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchDataFromFirebase();
  //       setFilteredPosts(data.filter(post => post.uid === name) || data.filter(post => post.username === name)); // Adjust filter based on your field
  //     } catch (error) {
  //       toast.error('Error fetching data:', error.message);
  //     }
  //   };
  // // Apply GSAP animation
  // (() => {
  //   console.l
  // }, []);

  if(user === null){ 
    return (
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold content'>
        <MoblieNav />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
        <a href='/log-in'>
          <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>
        </a>
      </div>
    )
  } else {
    return (
      <>
        <NavBar />
        <MoblieNav />
        <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4 content">
          <Image src={photo} width={100} height={100} className='rounded-full' alt='Profile Image' />
          <h1 className='text-2xl font-semibold'>{name}</h1>
        </div>
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
              {FilteredUserFollowingdata?.follows || 0 }
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Page;
