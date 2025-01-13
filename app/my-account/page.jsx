"use client";
import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../Components/NavBar';
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../download.png';
import Post from '../Components/Post';
import { collection, getDocs } from 'firebase/firestore';
import MobileNav from '../Components/Moblie Nav';
import { toast } from 'react-toastify';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);
  const [userFollowingData, setUserFollowingData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhoto(currentUser.photoURL || Avatar);
        setName(currentUser.displayName || 'Name is not given');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsSnapshot, followingDataSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'posts')),
          getDocs(collection(firestore, 'userFollowingData')),
        ]);

        setPosts(postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setUserFollowingData(followingDataSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
        console.error(error);
      }
    };

    if (user) fetchData();
  }, [user]);

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.uid === user?.uid || post.username === name),
    [posts, user, name]
  );

  const filteredUserFollowingData = useMemo(
    () => userFollowingData.filter((data) => data.userName === name),
    [userFollowingData, name]
  );

  if (!user) {
    return (
      <div className="w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold content">
        <MobileNav />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>
        <a href="/log-in">
          <button className="lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]">
            Login
          </button>
        </a>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <MobileNav />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4 content">
        <Image src={photo} width={100} height={100} className="rounded-full" alt="Profile Image" />
        <h1 className="text-2xl font-semibold">{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between">
        <div className="flex w-screen h-max lg:flex-row flex-col gap-[200px] justify-center items-center">
          <div className="h-max w-[30%] flex flex-col items-center justify-between gap-[400px]">
            <span className="font-semibold text-3xl">My Posts</span>
            {filteredPosts.map((post) => (
              <div className="mt-[-200px]" key={post.id}>
                <Post {...post} />
              </div>
            ))}
            <span>{filteredUserFollowingData[0]?.followers?.length || 0} followers</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
