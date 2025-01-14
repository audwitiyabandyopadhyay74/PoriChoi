"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import NavBar from "../Components/NavBar";
import MoblieNav from "../Components/MobileNav";
import Post from "../Components/Post";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [FilteredUserFollowingdata, setFilteredUserFollowingdata] = useState([]);

  // Check user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || currentUser.email);
      } else {
        setUser(null);
        setName("");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "posts"));
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userPosts = posts.filter(
          (post) => post.uid === name || post.username === name
        );
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error(`Error fetching posts: ${error.message}`);
      }
    };

    if (name) {
      fetchPosts();
    }
  }, [name]);

  // Fetch followers data
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "followers"));
        const followersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredUserFollowingdata(followersData);
      } catch (error) {
        console.error("Error fetching followers:", error);
        toast.error(`Error fetching followers: ${error.message}`);
      }
    };

    fetchFollowers();
  }, []);

  if (!user) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <MoblieNav />
        <NavBar />
        <h2 className="text-3xl font-bold">Please Login to Access This Page</h2>
        <a href="/log-in">
          <button className="bg-black text-white px-4 py-2 mt-4 rounded">
            Login
          </button>
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
        <h1 className="text-2xl font-bold">{name}'s Posts</h1>
        <div>
          <h2 className="text-xl font-semibold">My Posts</h2>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <p>No posts available.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-8">Followers</h2>
          {FilteredUserFollowingdata.length > 0 ? (
            <p>
              Total Followers:{" "}
              {FilteredUserFollowingdata[0]?.followers?.length || 0}
            </p>
          ) : (
            <p>No follower data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
