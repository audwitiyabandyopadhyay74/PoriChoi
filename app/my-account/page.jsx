"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import NavBar from "../Components/NavBar";
import MoblieNav from "../Components/Mobile Nav";
import Post from "../Components/Post";
import { toast, ToastContainer } from "react-toastify";
// import { log } from "console";



const Page = () => {
  const [user, setUser] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [name, setName] = useState("");
  const [FilteredUserFollowingdata, setFilteredUserFollowingdata] = useState([]);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "posts"));
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userPosts = posts.filter(
          (post) => post.uid === user.uid || post.username === name
        );
        setFilteredPosts(userPosts);
      } catch (error) {
        toast.error('Error fetching posts:', error.message);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user, name]);
  const followers = FilteredUserFollowingdata[0]?.followers || [];
console.log(followers + FilteredUserFollowingdata[0] + ' followers');

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "userFollowingdata"));
        const followersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userFollowers = followersData.filter(
          (data) => data.uid === user.uid || data.username === name
        );
        setFilteredUserFollowingdata(userFollowers);
        console.log(userFollowers);
        
      } catch (error) {
        toast.error('Error fetching followers data:', error.message);
      }
    };
//  s hhh
    if (user) {
      fetchFollowers();
    }
  }, [user, name]);

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
              {FilteredUserFollowingdata[0]?.followers.length || 0}
              {console.log(followers.length)}
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