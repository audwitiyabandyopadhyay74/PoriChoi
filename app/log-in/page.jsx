"use client"
import React,{useState,useEffect} from 'react'
import {auth} from "../firebase"
import {signInWithEmailAndPassword, sendPasswordResetEmail , signInWithPopup , GoogleAuthProvider} from "firebase/auth"
import icon from "../favicon.ico"
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../toastify.css'
// const [passwordtype, setPasswordtype] = useState('')


const page = () => {
const googleprovider = new GoogleAuthProvider();
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
useEffect(()=>{
  const Password = document.getElementById('password')
  const Icon =  document.getElementById('icon')
if (Password.type === 'password') {
  Icon.classList.remove('fa-eye-slash')
  Icon.classList.add('fa-eye')
}else{
  Icon.classList.remove('fa-eye')
  Icon.classList.add('fa-eye-slash')
}

},[])

const PasswordVisible = () =>{
      const Password = document.getElementById('password')
      const Icon =  document.getElementById('icon')
if(Password.type === 'password'){
  // setPasswordtype('text')
  Icon.classList.remove('fa-eye')
  Icon.classList.add('fa-eye-slash')
  Password.setAttribute('type','text')
}else{
  // setPasswordtype('password')
  Icon.classList.remove('fa-eye-slash')
  Icon.classList.add('fa-eye')
  Password.setAttribute('type','password')
}
    
}

const Login = async() =>{
  await signInWithEmailAndPassword(auth, email, password).then(()=>{
    toast('Login successful')
    document.location.href="/"
  }).catch((err)=>{
err.code === 'auth/user-not-found' ? document.getElementById('error-text').innerHTML = 'User not found' : document.getElementById('error-text').innerHTML = 'Invalid email or password'

err.code === 'auth/user-not-found' ? toast('User not found') : toast('Invalid email or password')
  })
}

const resetpasssword = () =>{
  sendPasswordResetEmail(auth, email).then(()=>{
    toast("Password reset Link sent successfully " + email);
  })
}

const SigninwithGoogle = () =>{
  signInWithPopup(auth , googleprovider).then(()=>{
    document.location.href = "/";
  }).catch((error)=>{ 
    console.log(error)
    toast("The user is not signed up");
  });
}

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <ToastContainer
        toastClassName={(context) =>
"bg-red-600" +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        bodyClassName={() => "text-sm font-white font-med block p-3"}
        position="bottom-left"
        autoClose={3000}
      />
        <div className="h-[90%] w-[35%] bg-[#fff] rounded-md text-center gap-[10px] flex flex-col justify-center items-center">
        <Image src={icon} className='rounded-full w-[40%] mt-[10px] scale-75 bg-white p-1' alt="hi"></Image>
        <div className="font-semibold text-5xl mt-[-20px]">Login</div>
{/* <div className="flex flex-col w-full h-[ ]"></div> */}
{/* <div className="flex flex-col w-full align-middle justify-center items-center h-[20%]"> */}
<div className=" w-[100%] h-[10%] rounded-md flex justify-center items-center">
<input required type="Email" placeholder='Email' className='w-[80%] h-full mt-10 ml-5 border-2 p-1 border-black rounded-md'  value={email} onChange={(e)=>setEmail(e.target.value)} />

</div> <br />
<div className=" w-[100%] h-[10%] rounded-md flex flex-row justify-center items-center">
<input required type="Password" placeholder='Password' id='password' className='w-[80%] h-full mt-10  border-2 p-1 border-black rounded-md  z-0' value={password} onChange={(e)=>setPassword(e.target.value )} />
<i className="fa-solid fa-eye z-100 text-2xl ml-[-40px] mt-[7%] relative " onClick={PasswordVisible} id='icon'></i>
</div>
{/* </div> */}
 <br />
<button className='w-[30%]  mt-10 ml-10 bg-red-600 text-white rounded-md scale-150 hover:scale-110'  style={{fontSize:"12px",padding:"10px 30px"}} onClick={Login}>Login</button>
<button className='w-[30vh]  mt-10 ml-10 bg-black text-white rounded-md scale-150 hover:scale-110'  style={{fontSize:"12px",padding:"10px 35px"}} onClick={SigninwithGoogle}><i className="fa-brands fa-google"></i>  Login With Google</button>

<div className="mt-5">Forgot password? <span className='text-blue-500' onClick={resetpasssword}>Reset</span></div>
<span id="error-text" className='text-red-600'></span>
<div className="mt-5">Don't have an account? <span className='text-blue-500 hover:mt-[-10px] cursor-pointer' onClick={()=>{document.location.href = "/sign-up"}} >Sign up</span></div>


    </div>
    </div>  
  )
}

export default page