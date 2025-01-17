"use client";

import React, { useState, useEffect } from "react";
import Avatar from "../download.png";
import Post from "../Components/Post";
import { firestore, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import MobileNav from "../Components/Mobile Nav";
import NavBar from "../Components/NavBar";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

import { toast } from "react-toastify";

const Page = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredUserFollowingData, setFilteredUserFollowingData] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoto(user.photoURL || Avatar);
        setName(user.displayName || "Name is not given");
      } else {
        setUser(null);
      }
    });
  }, []);

  const fetchDataFromFirebase = async () => {
    const postsCollection = collection(firestore, "posts");
    const q = query(postsCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const fetchUserFollowingDataFromFirebase = async () => {
    const userFollowingDataCollection = collection(firestore, "userFollowingData");
    const q = query(userFollowingDataCollection, where("userName", "==", name));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && name) {
          // Fetch posts by the current user
          const postsData = await fetchDataFromFirebase();

          // Fetch user following data by name
          const userFollowingData = await fetchUserFollowingDataFromFirebase();

          setFilteredPosts(postsData.filter(post => post.uid === user.uid || post.username === name));
          setFilteredUserFollowingData(userFollowingData);

          console.log("Posts:", postsData);
          console.log("User Following Data:", userFollowingData);
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchData();
  }, [name, user]);

  const followers = filteredUserFollowingData[0]?.followers || [];

  if (user === null) {
    return (
      <div className="w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold content">
        <MobileNav />
        <NavBar />
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">
          Please Login To Access This Page
        </span>
        <a href="/log-in">
          <button className="lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]">
            Login
          </button>
        </a>
      </div>
    );
  } else {
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
              <span>
                {followers.length > 0
                  ? `${followers.length} follower${followers.length > 1 ? "s" : ""}`
                  : "No followers yet"}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Page;
