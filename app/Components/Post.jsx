import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

import Link from 'next/link';


const Post = (props) => {
  const [url, setUrl] = useState('');
  const [user, setUser] = useState(null);
  const [userPic, setUserPic] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(props.comments || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [likeCount, setLikeCount] = useState(props.like || 0); 
  const [likedBy, setLikedBy] = useState(props.likedBy || []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserPic(user.photoURL);
      }
    });
    fetchComments();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (props.imageUrl) {
      getDownloadURL(ref(storage, props.imageUrl))
        .then((downloadUrl) => setUrl(downloadUrl))
        .catch((error) => console.error('Error fetching image URL:', error));
    }
  }, [props.imageUrl]);

  const fetchComments = async () => {
    try {
      const docRef = doc(firestore, 'posts', props.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setComments(data.comments || []);
        setLikedBy(data.likedBy || []);
        setLikeCount(data.like || 0);
      } else {
        console.log('No comments found!');
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    if (!user) return; // Ensure user is logged in
    if (likedBy.includes(user.uid)) {
      console.log('User has already liked this post');
      return;
    }

    try {
      const docRef = doc(firestore, 'posts', props.id);
      const newLikeCount = likeCount + 1;
      const updatedLikedBy = [...likedBy, user.uid]; // Add user ID to likedBy array

      await updateDoc(docRef, {
        like: newLikeCount,
        likedBy: updatedLikedBy,
      });

      setLikeCount(newLikeCount);
      setLikedBy(updatedLikedBy);
      console.log('Document updated successfully!');
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  const updateDocumentWithComment = async () => {
    if (!user) return;
    try {
      const docRef = doc(firestore, 'posts', props.id);
      const docSnap = await getDoc(docRef);
      const newComment = {
        id: comments.length + 1,
        name: user.displayName,
        pic: userPic,
        text: commentText,
      };
      const updatedComments = [...(docSnap.data()?.comments || []), newComment];

      await setDoc(docRef, { comments: updatedComments }, { merge: true });
      setComments(updatedComments);
      setCommentText('');
      console.log('Comment added successfully!');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleCommentInput = () => setShowCommentInput(!showCommentInput);
        const handleShare = async() => {
            navigator.share({
              title: props.title,
              text: 'Check out this post!',
              url: window.location.href, // or a specific URL you want to share
            }).then(() => console.log('Post shared successfully!'))
            .catch((error) => console.error('Error sharing post:', error));
   await updateDoc(docRef,{
    Shares:Shares+1
   })

        };
  return (
    <div className=''>
      <div className='w-full h-max flex flex-col items-center mt-[220px]'>
        
        <div className="flex items-center">

          <Image src={props.photoUrl || "https://yt3.ggpht.com/PEMn6YMvrLc8yX9nWB8VqurEVZzi3iRHHxYvBen3yNEbiRgSbk1Gmxycu5x2tfcScYisz4x3Ig=s176-c-k-c0x00ffffff-no-rj"} alt="" width={100} height={100} className='rounded-full w-[10vh] h-[10vh] scale-50' objectFit='cover' />
          <span className='font-bold text-2xl'>{props.username}</span>
        </div>
        <div className="flex flex-col gap-4 w-full items-start p-4 ">
        <div className="text-3xl font-semibold w-full">{props.title}</div>
        <div className="text-1xl pl-[5px] font-medium">{props.date}</div>
        </div>
        <Link href={`post/${props.id}`}>

        <img className="w-max h-max rounded-md" src={url || null} alt="" />
        </Link>
        <div className="w-full">
          <div className="flex items-center justify-evenly w-full h-[10vh] bg-[#dad9d9] rounded-md">
            <div className="flex flex-col justify-center items-center cursor-pointer" onClick={handleLike}>
              {/* Use conditional class assignment for color */}
              <i
                className={`fa-solid fa-heart ${user && likedBy.includes(user.uid) ? 'text-red-600' : 'text-white'}`}
                style={{ fontSize: "40px" }}
                id='Like'
              ></i>
              <div className="text-1xl like">{likeCount}</div>
            </div>
            <div className="flex flex-col justify-center items-center cursor-pointer" onClick={toggleCommentInput}>
              <i className="fa-solid fa-comment text-2xl" style={{ fontSize: "40px" }}></i>
              <div className="text-1xl hover:scale-105">Comment</div>
            </div>
            <div className="flex flex-col justify-center items-center cursor-pointer"  onClick={handleShare}>
              <i className="fa-solid fa-share text-2xl" style={{ fontSize: "40px" }}></i>
              <div className="text-1xl hover:scale-105" onClick={handleShare}>Share</div>
            </div>
          </div>
          {showCommentInput && (
            <div className="w-full flex items-center justify-center h-max pt-[10px]">
              <input
                type="text"
                className="w-[80%] h-[8vh] rounded-md bg-[#ebeaea] z-0 p-1"
                placeholder='Comment Here!'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <i className="fa-regular fa-paper-plane z-[1000] ml-[-25px] text-blue-600 bg-[#ebeaea] h-full cursor-pointer" style={{ fontSize: "20px" }} onClick={updateDocumentWithComment}></i>
            </div>
          )}
        </div>
        <div className='mt-4'>
          <h2 className='text-xl font-semibold'>Comments:</h2>
          <ul>
            {comments.map(comment => (
              <li key={comment.id} className='w-[40%] h-max flex flex-col gap-[0px] justify-start'>
                <div className='flex items-center gap-5 font-bold w-full h-max'>
                  <Image src={comment.pic || "https://yt3.ggpht.com/PEMn6YMvrLc8yX9nWB8VqurEVZzi3iRHHxYvBen3yNEbiRgSbk1Gmxycu5x2tfcScYisz4x3Ig=s176-c-k-c0x00ffffff-no-rj"} alt="User profile" width={100} height={100} className='rounded-full w-[10vh] h-[10vh] scale-50' />
                  {comment.name}
                </div>
                <div className='bg-[#ebeaea] p-4 ml-[30px] w-max h-max'>{comment.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
