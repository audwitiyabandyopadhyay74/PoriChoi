"use client"
// src/components/Form.js

import React, { useState, useEffect } from 'react';
import Nopreview from '../No Preview.png';
import { firestore, storage, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const Form = ({Style}) => {
  const [selectedFile, setSelectedFile] = useState(Nopreview);
  const [File, setFile] = useState();

  const [filename , setFilename] = useState();
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [userUid, setUserUid] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
console.log(user)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserUid(user.uid);
        setUserDisplayName(user.displayName);
        setUserEmail(user.email);
        setUserPhoto(user.photoURL);
      } else {
        setUser(null);  
      }
    });
  }, []);

  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFile(file);
      setFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () =>{
          setSelectedFile(reader.result);
      }
      reader.readAsDataURL(file);
  }
  };

  const hide = ()=>{
   const postform = document.getElementById("form")
    if(postform.classList.contains("block")){
    postform.classList.remove("block");
    postform.classList.add("hidden");

   }
   

  }

   console.log(Style)

  const handlePosting = async () => {
    const date =  new Date()
    const year = date.getFullYear()
    const month = date.getMonth()+1 
    const day = date.getDate()
    try {
      const imgRef = ref(storage, `uploads/posts/${filename}`);
      const uploadResult = await uploadBytes(imgRef, File);
      await addDoc(collection(firestore, 'posts'), {
        title,
        date: `${day}-${month}-${year}`,
        imageUrl: uploadResult.ref.fullPath,
        uid: userUid,
        username: userDisplayName,
        email: userEmail,
        photoUrl: userPhoto,
        like:0,
        Comments:{},
        Shares: Shares+1 || 0,
      }).then(()=> document.location.reload());
      alert('Posted successfully');
      
    } catch (error) {
      alert('Error posting: ' + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePosting();
    // alert(filename)
  };

  return (
    <div className={"sm:w-screen w-[100%] h-[100%] flex items-center justify-center  "+Style } id='form' style={{position:"fixed"}}>
      <div className="w-full h-full bg-white rounded-lg flex flex-col items-center z-[1000] justify-center relative border border-[2px] border-black">
      <i className="fa-solid fa-mark fa-2xl absolute top-10 right-4" onClick={hide}></i>

        <div className="flex flex-col gap-[10px] h-max w-max">
          <img src={selectedFile || Nopreview} className="max-w-[500px] max-h-[400px] rounded-md shadow-2xl" alt="Selected" />
          <input
            type="file"
            accept='image/png'
            placeholder="Select an image"
            className="lg:w-[60vh] w-[80%] h-[6vh] rounded-md p-1 bg-[#e9e8e8e0] text-center flex items-center"
            onChange={handleImageUpload}
          />
<span className='text-semibold text-2xl'>Details</span>
          <textarea
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Your Post's Title"
            className="lg:w-[60vh] w-[80%] h-[6vh] rounded-md p-4 bg-[#e9e8e8e0]"
          ></textarea>

          <button className="bg-[#ff0000] border-none outline-none rounded-md h-[30px] w-[50px] text-white" onClick={handleSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
