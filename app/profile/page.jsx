"use client";
import React from 'react';
import NavBar from '../Components/NavBar';
import SideBar from '../Components/SideBar';
// import Profile from '../Components/Profile';

const Page = () => {
  // const [photo, setPhoto] = useState(Avatar);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  // const [changedName, setChangedName] = useState('');
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // setPhoto(user.photoURL );
        setName(user.displayName || "Name is not given");
        setEmail(user.email || "Email is not given");
        setPhoneNumber(user.phoneNumber || "Phone Number is not given");
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <div>
      <NavBar />
      {/* <Profile /> */}
      <br />
      <div className="flex w-screen h-full justify-between">
        <div className="flex w-screen h-max flex-row gap-[200px] justify-center items-center">
          <SideBar />
          <form className="h-[70vh] w-max flex items-center justify-center flex-col gap-4">
            <div className="text-3xl font-semibold">Check Your Profile</div>
            <input 
              type="text" 
              value={name} 
              readOnly 
              className="w-[30vw] h-[6vh] rounded-md p-1 border-none outline-none" 
            />
            <input 
              type="text"     
              value={email} 
              readOnly 
              className="w-[30vw] h-[6vh] rounded-md p-1 border-none outline-none" 
            />
            <input 
              type="text" 
              value={phoneNumber} 
              readOnly 
              className="w-[30vw] h-[6vh] rounded-md p-1 border-none outline-none" 
            />
            <button 
              onClick={() => { document.location.href = "/profile/update-profile"; }}
              className="w-[10vw] h-[6vh] rounded-md p-1 bg-[#0f0f0f] text-white hover:scale-110 cursor-pointer"
            >
              Update Your Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
