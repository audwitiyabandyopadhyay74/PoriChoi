"use client";
import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar';
import { auth, firestore } from '../../firebase';
// import { ref, uploadBytes } from 'firebase/storage';
import {onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Avatar from '../../download.png';
import SideBar from '../../Components/SideBar';
import Post from '../../Components/Post';
import { collection, getDocs } from 'firebase/firestore';

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [changedName, setChangedName] = useState('');
  // const [changedEmail, setChangedEmail] = useState('');
  // const [changedPhoneNumber, setChangedPhoneNumber] = useState('');
  // const [changedImage, setChangedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  // const [poststitle, setPoststitle] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || 'Name is not given');
        setEmail(user.email || 'Email is not given');
        setPhoneNumber(user.phoneNumber || 'Phone Number is not given');
      } else {
        setUser(null);
      }
    });
  }, []);

  async function fetchDatafromFirebase() {
    const querySnapshot = await getDocs(collection(firestore, 'posts'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  }
console.log(posts)
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDatafromFirebase();
        setPosts(data);
        setFilteredPosts(data.filter(post => user.displayName === name));
        // setPoststitle(data[0]?.title || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if (name) {
      fetchData();
    }
  }, [name]);






  return (
    <div className="">
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
