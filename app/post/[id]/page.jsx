"use client";
import { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import Post from "../../Components/Post"
import NavBar from "../../Components/NavBar"



async function fetchDatafromFirebase() {
  const querySnapshot = await getDocs(collection(firestore, 'posts'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

const Page = () => {
  const [post, setPost] = useState(null);
  const pathname = usePathname();
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDatafromFirebase();
        const id = pathname.replace("/post/", ""); // Use /posts/ prefix
        const filteredPost = data.find(post => post.id === id);
        setPost(filteredPost);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [pathname]);

  return (
    <>
    <NavBar/>
    <div className='w-screen flex flex-col items-center  justify-center'>
      {post ? (
        <div className='bg-[#fff] w-[100%] lg:w-[50%]'>
          
          <Post key={Post.id} {...post} />
        </div>    
      ):  (
<div className='w-screen h-screen flex items-center justify-center font-bold'>Loading...</div>      )}
    </div>
    </>
  );
};

export default Page;
