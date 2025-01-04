'use client';

import React, { useEffect, useState } from 'react';
import Post from './Post';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import Clock from "./Clock";

async function fetchDatafromFirebase() {
  const querySnapshot = await getDocs(collection(firestore, 'posts'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

const Posts = () => {
  const [posts, setPosts] = useState([]);
  // const [poststitle, setPoststitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDatafromFirebase();
        setPosts(data);
        // setPoststitle(data[0]?.title || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex items-start justify-center w-screen h-screen">
      <Clock/>
      <div className="h-max w-[100%] lg:w-[50%] flex flex-col gap-[400px] p-4 bg-[#fff]">
        {posts.map((post) => (
        <Post {...post}  key={post.id}/>
    
        ))}
      </div>
    </div>
  );
};

export default Posts;
