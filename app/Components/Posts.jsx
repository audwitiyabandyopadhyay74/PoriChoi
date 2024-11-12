'use client';

import React, { useEffect, useState } from 'react';
import Post from './Post';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import Link from 'next/link';

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
      <div className="h-max w-[100%] lg:w-[50%] flex flex-col gap-[400px] bg-[#fff]">
        {posts.map((post) => (
        <Link href={`post/${post.id}`} key={post.id}>
        <Post {...post} />
    </Link>
    
        ))}
      </div>
    </div>
  );
};

export default Posts;
