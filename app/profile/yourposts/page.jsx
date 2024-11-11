"use client";
import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';
import SideBar from '../../Components/SideBar';
import Post from '../../Components/Post';
import { collection, getDocs } from 'firebase/firestore';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
console.log(user, posts)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromFirebase();
        setPosts(data);
        setFilteredPosts(data.filter(post => post.author === name)); // Adjust filter based on your field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  return (
    <div>
      <NavBar />
      <div className="top h-[30vh] w-screen bg-[#fff] flex items-center justify-center gap-4">
        <Image src={photo} width={100} height={100} className="rounded-full" alt="Profile Image" />
        <h1 className="text-2xl font-semibold">{name}</h1>
      </div>
      <br />
      <div className="flex w-screen h-full justify-between">
        <div className="flex w-screen h-max flex gap-[200px] justify-center items-start">
          <SideBar />
          <div className="h-max w-[30%] flex flex-col items-center justify-between gap-[400px]">
            {filteredPosts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
