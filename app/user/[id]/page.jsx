"use client";

import { useEffect, useState } from 'react';
import { firestore, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {  getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

import { usePathname } from 'next/navigation';
import NavBar from "../../Components/NavBar";
import Image from 'next/image';
import Post from '@/app/Components/Post';
import { onAuthStateChanged } from 'firebase/auth';

import { matchesMiddleware } from 'next/dist/shared/lib/router/router';

const Page = () => {
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);
  const pathname = usePathname();

  const fetchUserData = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'userFollowingdata'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
    
  
  const fetchUserPosts = async (userName) => {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, where('username', '==', userName));  // Fixed query
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  

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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData();

        // Extract userName from pathname

        // Extract user ID based on expected pathname structure
        const userId = pathname.replace("/user/", ""); 
        const matchedUser = data.find(user => user.id === userId);
          
        if (matchedUser) {
          setUser(matchedUser);
          const id =matchedUser.id;
          // Fetch followers of the user
          const userFollowers = data.filter(follower => follower.followingId === id);
          setFollowers(userFollowers.length);

          // Fetch posts of the user based on userName
        const userName = matchedUser.userName;

          const userPosts = await fetchUserPosts(userName);
          setPosts(userPosts);
          alert
        } else {
          setUser(null);
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [pathname]);
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavBar />
      <div className="w-screen flex flex-col items-center justify-center">
        <div className="bg-white w-full lg:w-1/2 p-1">
          <div className="flex flex-col w-full h-full">
            <div className="flex items-center mt-10">
              <Image 
                src={user?.pic || "https://via.placeholder.com/150"} 
                alt="User" 
                width={100}
                height={100}
                className="rounded-full w-24 h-24"  
              />
              <span className="ml-4 text-xl font-semibold">
                {user ? user.userName : 'User Not Found'}
              </span>
            </div>
          </div>

          {/* Display Followers */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Followers</h2>
            {followers.length > 0 ? (
              followers
            ) : (
              <div>0 followers found</div>
            )}
          </div>
          <button
                onClick={() => handleFollow(user.id)}
                disabled={Array.isArray(user.followers) && user.followers.includes(currentUser)}
                className={`p-2 text-white rounded ${Array.isArray(user.followers) && user.followers.includes(currentUser) ? 'bg-gray-400' : 'bg-blue-500 pulse'}`}
              >
                {Array.isArray(user.followers) && user.followers.includes(currentUser) ? 'Following' : 'Follow'} </button>
{/* {alert(followers)} */}
          {/* Display User Posts */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post.id} {...post} />
              ))
            ) : (
              <div>No posts found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
