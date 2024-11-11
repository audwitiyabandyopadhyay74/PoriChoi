"use client";

import React, { useEffect, useState } from 'react';
// import NavBar from '../Components/NavBar';
// import { usePathname } from 'next/navigation';
import { firestore, auth } from '../firebase';
import SearchData from '../Components/Search Data';
import { getDocs, getDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';


const fetchDataFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'userFollowingdata'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    return [];
  }
};

const Page = () => {
  // const pathname = usePathname();  
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Track the current authenticated user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        console.log("Current user ID:", user.uid);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchDataFromFirebase();
      setUserData(data);
      console.log("Fetched user data:", data);
    };
    fetchUserData();
  }, []);

  // Follow user function with debug logs
  const handleFollow = async (userId) => {
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userDocRef = doc(firestore, 'userFollowingdata', userId);

    try {
      const userDoc = await getDoc(userDocRef);
      const userFollowers = userDoc.data()?.followers || [];

      console.log("Current followers:", userFollowers);

      if (!userFollowers.includes(currentUser)) {
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser),
        });

        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId
              ? { ...user, followers: [...(user.followers || []), currentUser] }
              : user
          )
        );
        console.log("User followed successfully:", userId);
      } else {
        console.log("User is already followed.");
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const filteredData = userData.filter((user) =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* <NavBar />   */}
      <div className="w-screen h-screen flex-col gap-10 p-20 justify-center items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/2 mb-6"
        />
        {filteredData.map((user) => (
          <div key={user.id} className="flex items-center gap-4">
           <Link href={`user/${user.id}`}> <SearchData {...user} className="p-10" /></Link>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleFollow(user.id)}
                disabled={Array.isArray(user.followers) && user.followers.includes(currentUser)}
                className={`p-2 text-white rounded ${Array.isArray(user.followers) && user.followers.includes(currentUser) ? 'bg-gray-400' : 'bg-blue-500 pulse'}`}
              >
                {Array.isArray(user.followers) && user.followers.includes(currentUser) ? 'Following' : 'Follow'}
              </button>
              <span className="text-gray-600">{Array.isArray(user.followers) ? user.followers.length : 0} Followers</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;