import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

const Post = ({ id, photoUrl, username, title, date, imageUrl, comments: initialComments = [], like = 0, likedBy: initialLikedBy = [] }) => {
  const [url, setUrl] = useState('');
  const [user, setUser] = useState(null);
  const [userPic, setUserPic] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [likedBy, setLikedBy] = useState(initialLikedBy);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserPic(currentUser.photoURL);
      }
    });

    fetchPostData();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (imageUrl) {
      getDownloadURL(ref(storage, imageUrl))
        .then(setUrl)
        .catch((error) => console.error('Error fetching image URL:', error));
    }
  }, [imageUrl]);

  const fetchPostData = async () => {
    try {
      const postRef = doc(firestore, 'posts', id);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const data = postSnap.data();
        setComments(data.comments || []);
        setLikedBy(data.likedBy || []);
        setLikeCount(data.like || 0);
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    if (likedBy.includes(user.uid)) {
      console.log('User has already liked this post');
      return;
    }

    try {
      const postRef = doc(firestore, 'posts', id);
      const updatedLikedBy = [...likedBy, user.uid];
      const newLikeCount = likeCount + 1;

      await updateDoc(postRef, { like: newLikeCount, likedBy: updatedLikedBy });
      setLikeCount(newLikeCount);
      setLikedBy(updatedLikedBy);
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const handleComment = async () => {
    if (!user) return;

    try {
      const postRef = doc(firestore, 'posts', id);
      const newComment = {
        id: comments.length + 1,
        name: user.displayName,
        pic: userPic,
        text: commentText,
      };
      const updatedComments = [...comments, newComment];

      await setDoc(postRef, { comments: updatedComments }, { merge: true });
      setComments(updatedComments);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = () => {
    navigator
      .share({
        title,
        text: 'Check out this post!',
        url: window.location.href,
      })
      .then(() => console.log('Post shared successfully!'))
      .catch((error) => console.error('Error sharing post:', error));
  };

  return (
    <div className="flex flex-col items-center mt-56">
      <div className="flex items-center">
        <Image
          src={photoUrl || '/default-avatar.png'}
          alt="User"
          width={100}
          height={100}
          className="rounded-full w-20 h-20 scale-50"
        />
        <span className="font-bold text-2xl ml-4">{username}</span>
      </div>
      <div className="flex flex-col w-full p-4 gap-4">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-lg pl-1 font-medium">{date}</p>
      </div>
      <Link href={`post/${id}`}>
        <img className="rounded-md" src={url || '/default-image.png'} alt={title} />
      </Link>
      <div className="w-full flex flex-col mt-4">
        <div className="flex items-center justify-evenly bg-gray-300 rounded-md p-4">
          <div onClick={handleLike} className="flex flex-col items-center cursor-pointer">
            <i className={`fa-solid fa-heart text-4xl ${user && likedBy.includes(user.uid) ? 'text-red-600' : 'text-white'}`} />
            <span>{likeCount}</span>
          </div>
          <div onClick={() => setShowCommentInput(!showCommentInput)} className="flex flex-col items-center cursor-pointer">
            <i className="fa-solid fa-comment text-4xl" />
            <span>Comment</span>
          </div>
          <div onClick={handleShare} className="flex flex-col items-center cursor-pointer">
            <i className="fa-solid fa-share text-4xl" />
            <span>Share</span>
          </div>
        </div>
        {showCommentInput && (
          <div className="flex items-center w-full mt-4">
            <input
              type="text"
              className="flex-grow rounded-md p-2 bg-gray-200"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleComment} className="ml-2 text-blue-500">
              Post
            </button>
          </div>
        )}
      </div>
      <div className="w-full mt-4">
        <h2 className="text-xl font-semibold">Comments</h2>
        <ul className="mt-2">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start gap-4 my-2">
              <Image
                src={comment.pic || '/default-avatar.png'}
                alt="User"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <p className="font-bold">{comment.name}</p>
                <p className="bg-gray-200 rounded-md p-2">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;
