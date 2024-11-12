"use client";

import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import SearchData from '../Components/SearchData';
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
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleFollow = async (userId) => {
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userDocRef = doc(firestore, 'userFollowingdata', userId);

    try {
      const userDoc = await getDoc(userDocRef);
      const userFollowers = userDoc.data()?.followers || [];

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
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const filteredData = userData.filter((user) =>
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">User Search</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded w-full mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4">
          {filteredData.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition-all">
              <Link href={`user/${user.id}`} className="flex-grow">
                <SearchData {...user} className="text-lg font-medium text-blue-600" />
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleFollow(user.id)}
                  disabled={Array.isArray(user.followers) && user.followers.includes(currentUser)}
                  className={`p-2 w-24 rounded text-white ${
                    Array.isArray(user.followers) && user.followers.includes(currentUser)
                      ? 'bg-gray-400'
                      : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                  }`}
                >
                  {Array.isArray(user.followers) && user.followers.includes(currentUser) ? 'Following' : 'Follow'}
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

export default Page;
