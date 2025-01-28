"use client";

import React, { useEffect, useState, useRef } from 'react';
import { firestore, auth } from '../firebase';
import SearchData from '../Components/Search Data'; // Ensure the path and naming are correct
import Post from '../Components/Post';
import { getDocs, getDoc, collection, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const fetchDataFromFirebase = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}:`, error);
    return [];
  }
};

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const tab1contentref = useRef(null);
  const tab2contentref = useRef(null);
  const tab1button = useRef(null);
  const tab2button = useRef(null);



  const handleTab1 = () => {
    tab1contentref.current.classList.remove('hidden')
    tab1button.current.classList.add('bg-gray-200')
    tab1contentref.current.classList.add('block')
    tab2button.current.classList.remove('bg-gray-200')
    tab2contentref.current.classList.add('hidden')
  }
  const handleTab2 = () => {
    tab2contentref.current.classList.remove('hidden')
    tab2contentref.current.classList.add('block')
    tab2button.current.classList.add('bg-gray-200')
    tab1button.current.classList.remove('bg-gray-200')
    tab1contentref.current.classList.add('hidden')
  }

  // Auth state change
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.displayName : null);
    });
  }, []);

  // Fetch user data and post data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchDataFromFirebase("userFollowingdata");
      setUserData(data);
    };
    const fetchPostData = async () => {
      const data = await fetchDataFromFirebase("posts");
      setPostData(data);
    };
    fetchUserData();
    fetchPostData();
  }, []);

  // Follow/Unfollow handler
  const handleFollow = async (userId) => {
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userDocRef = doc(firestore, "userFollowingdata", userId);
    const currentUserDocRef = doc(firestore, "userFollowingdata", currentUser);

    try {
      const userDoc = await getDoc(userDocRef);
      const currentUserDoc = await getDoc(currentUserDocRef);
      const userFollowers = userDoc.data()?.followers || [];
      const currentUserFollowings = currentUserDoc.data()?.followings || [];

      if (!userFollowers.includes(currentUser)) {
        // Follow user
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser),
        });
        await updateDoc(currentUserDocRef, {
          followings: arrayUnion(userId),
        });
        await updateDoc(currentUserDocRef, {
          followingsCount: increment(1), // Ensure increment is used correctly
        });

        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId
              ? { ...user, followers: [...userFollowers, currentUser] }
              : user.id === currentUser
              ? { ...user, followings: [...currentUserFollowings, userId], followingsCount: (user.followingsCount || 0) + 1 }
              : user
          )
        );
      } else {
        // Unfollow user
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser),
        });
        await updateDoc(currentUserDocRef, {
          followings: arrayRemove(userId),
        });
        await updateDoc(currentUserDocRef, {
          followingsCount: increment(-1), // Ensure increment is used correctly
        });

        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId
              ? { ...user, followers: userFollowers.filter((follower) => follower !== currentUser) }
              : user.id === currentUser
              ? { ...user, followings: currentUserFollowings.filter((following) => following !== userId), followingsCount: (user.followingsCount || 1) - 1 }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  // Filtered user data and post data based on search query
  const filteredUserData = userData.filter((user) =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPostData = postData.filter((post) =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 relative">
        <Link href="/" className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <FaArrowLeft className="mr-2" /> 
          <span className="font-semibold">Back to Homepage</span>
        </Link>
        <h2 className="text-2xl font-semibold text-center mb-6 mt-10">Search</h2>
        <input
          type="text"
          placeholder="Search by Names and Posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded w-full mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4 bg-white ">

        <div className="w-full h-[10vh] flex justify-start items-center gap-[2vh]">
    <button className="text-xl font-semibold h-auto rounded-lg bg-gray-200 w-[20vh] hover:scale-110 hover:bg-white " ref={tab1button} onClick={handleTab1}>Users</button> 
    <button className="text-xl font-semibold h-auto rounded-lg w-[20vh] hover:scale-110 hover:bg-white" ref={tab2button} onClick={handleTab2}>Posts</button>
</div>
<div className="tab1" ref={tab1contentref}>
          {filteredUserData.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-center lg:justify-between bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition-all">
              <Link href={`user/${user.id}`} className=" text-lg font-medium text-blue-600">
                <SearchData {...user} /> 
              </Link>
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`p-2 w-24 rounded text-white ${
                    Array.isArray(user.followers) && user.followers.includes(currentUser)
                      ? "bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600 transition-colors"
                  }`}
                >
                  {Array.isArray(user.followers) && user.followers.includes(currentUser) ? "Unfollow" : "Follow"}
                </button>
                <span className="text-gray-500 text-sm mt-1">
                  {Array.isArray(user.followers) ? user.followers.length : 0} Followers
                </span>
              </div>
            </div>
          ))}            </div>
<div className="tab2 hidden" ref={tab2contentref}>
          {filteredPostData.map((post) => (
            <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition-all">
              <Post {...post} />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;