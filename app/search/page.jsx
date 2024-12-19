"use client";

import React, { useEffect, useState } from "react";
import { firestore, auth } from "../firebase";
import SearchData from "../Components/Search Data";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const fetchDataFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "userFollowingdata"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return [];
  }
};

const Page = () => {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchDataFromFirebase();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleFollowToggle = async (userId) => {
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
        // Follow logic
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser),
        });

        await updateDoc(currentUserDocRef, {
          followings: arrayUnion(userId),
        });

        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId
              ? { ...user, followers: [...(user.followers || []), currentUser] }
              : user.id === currentUser
              ? {
                  ...user,
                  followings: [...(user.followings || []), userId],
                }
              : user
          )
        );
      } else {
        // Unfollow logic
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser),
        });

        await updateDoc(currentUserDocRef, {
          followings: arrayRemove(userId),
        });

        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  followers: user.followers?.filter((id) => id !== currentUser),
                }
              : user.id === currentUser
              ? {
                  ...user,
                  followings: user.followings?.filter((id) => id !== userId),
                }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const filteredData = userData.filter((user) =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-max bg-white rounded-lg shadow-md p-6 relative">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span className="font-semibold">Back to Homepage</span>
        </Link>
        <h2 className="text-2xl font-semibold text-center mb-6 mt-10">User Search</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded w-full mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4 bg-white">
          {filteredData.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition-all"
            >
              <Link
                href={`user/${user.id}`}
                className="flex-grow text-lg font-medium text-blue-600"
              >
                <SearchData {...user} />
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleFollowToggle(user.id)}
                  className={`p-2 w-24 rounded text-white ${
                    Array.isArray(user.followers) && user.followers.includes(currentUser)
                      ? "bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600 transition-colors"
                  }`}
                >
                  {Array.isArray(user.followers) && user.followers.includes(currentUser)
                    ? "Unfollow"
                    : "Follow"}
                </button>
                <span className="text-gray-500 text-sm mt-1">
                  {Array.isArray(user.followers) ? user.followers.length : 0} Followers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// a
export default Page;
