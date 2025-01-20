'use client';

import React, { useEffect, useState } from 'react';
// import { gsap } from 'gsap';
import Post from './Post';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import Clock from "./Clock";
import Temperature from "./Temperature";

// gsap.to("#post", {duration: 2, x: 300});

async function fetchDatafromFirebase() {
  const querySnapshot = await getDocs(collection(firestore, 'posts'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

const Posts = () => {
// useEffect(() => {
//   gsap.to("#post", {duration: 2, y: 300,rotate:10,opacity:1, scrollTrigger:true, repeat:-1});
// }, []);


// const boxes = gsap.utils.toArray('#post');
// boxes.forEach(box => {
//   const anim = gsap.to(box, { x: 300, paused: true });
  
//   ScrollTrigger.create({
//     trigger: box,
//     start: "center 70%",
//     onEnter: () => anim.play()
//   });
  
//   ScrollTrigger.create({
//     trigger: box,
//     start: "top bottom",
//     onLeaveBack: () => anim.pause(0)
//   });
// });

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
      <Temperature/>
    </div>
  );
};

export default Posts;
