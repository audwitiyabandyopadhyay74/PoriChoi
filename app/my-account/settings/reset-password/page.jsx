"use client"; 
import React, { useEffect, useState } from 'react'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import NavBar from '../../../Components/NavBar'; 
import MoblieNav from '../../../Components/Moblie Nav'; 
import SideBar from '../../../Components/SideBar'; 
import { sendPasswordResetEmail, onAuthStateChanged, updateEmail } from "firebase/auth"; 
import { auth } from '../../../firebase';

const Page = () => {   
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [changedEmail,setChangedEmail] = useState(email)

  useEffect(() => {     
    const unsubscribe = onAuthStateChanged(auth, (user) => {       
      if (user) {         
        setUser(user);    
        setEmail(user.email);
      } else {         
        setUser(null);       
      }     
    });     
    return () => unsubscribe();   
  }, []);   

  const handleSendPasswordResetLink = async (e) => {     
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address", { theme: "colored" });
      return;
    }
    try {       
      await sendPasswordResetEmail(auth, email);  
      updateEmail(user, changedEmail)     
      toast.success("Password reset link sent!", { theme: "colored" });     
    } catch (error) {       
      toast.error("Error while sending password reset link", { theme: "colored" });       
      toast.error(error.message);     
    }   
  };

  const inputClassName = 'w-[35vh] max-w-max h-[6vh] rounded-md p-4 border-none outline-none shadow-md text-black';  

  if (user === null) {     
    return (       
      <div className='w-screen h-screen flex flex-col gap-1 justify-center items-center font-bold'>         
        <NavBar />         
        <span className="text-3xl h-[10vh] w-[80%] flex flex-wrap text-center">Please Login To Access This Page</span>         
        <a href='/log-in'>           
          <button className='lg:w-[10vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'>Login</button>         
        </a>       
      </div>     
    );   
  } else {     
    return (       
      <>         
        <ToastContainer 
          toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-xl"           
          bodyClassName="text-sm font-medium text-white block p-3"           
          position="bottom-left"           
          autoClose={3000}         
        />         
        <NavBar />         
        <MoblieNav />         
        <div className="flex flex-col w-screen h-screen items-center justify-center relative">           
          <span className='absolute top-[5rem] left-[4rem]' onClick={() => { document.location.href = "/my-account" }}>My Account/Settings/Verify-Email</span>           
          <div className="w-[70%] h-[70vh] flex gap-4 bg-white rounded-md shadow-md p-2">             
            <SideBar />             
            <form className="flex gap-4 justify-center items-center mt-[100px] w-[80%] absolute" onSubmit={handleSendPasswordResetLink}>               
              <input 
                type="email" 
                className={inputClassName} 
                value={email} 
                onChange={(e) => setChangedEmail(e.target.value)} 
                placeholder="Enter your email"
              />               
              <button 
                type="submit"  
                className={'lg:w-[15vw] text-white font-bold lg:h-[3vw] bg-[#000] rounded-md w-max h-[6vh] p-[10px]'} 
              >                 
                Send Reset Password Link               
              </button>             
            </form>           
          </div>         
        </div>       
      </>     
    );   
  } 
};

export default Page;
