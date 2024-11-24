'use client';
import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { usePathname } from 'next/navigation';

const handleSignOut = () => {
    signOut(auth).then(() => {
        document.location.href = '/log-in';
    });
};

const SideBar = () => {
    const [profile, setProfile] = useState(false);
    const [settings, setSettings] = useState(false);
    const [yourPosts, setYourPosts] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/profile") {
            setProfile(true);
        } else if (pathname === "/profile/yourposts") {
            setYourPosts(true);
        } else {
            setProfile(false);
            setSettings(true);
        }
    }, [pathname]);

    const notActive = "flex items-center justify-center bg-black rounded-md gap-4 font-semibold text-white p-4";
    const active = "flex items-center justify-center bg-white text-black border-r-[6px] p-4 border-r-white gap-4 font-semibold";

    return (
        <div className="flex flex-col bg-black h-full w-[20%] sm:w-[25%] lg:w-[15%] fixed left-0 rounded-md shadow-lg">
            <ul className="flex flex-col gap-6 py-6 px-4">
                <li
                    className={profile ? active : notActive}
                    onClick={() => { document.location.href = "/profile"; }}
                >
                    <i className='fa-solid fa-user' style={{ fontSize: "24px" }}></i> Your Profile
                </li>
                <li
                    className={settings ? active : notActive}
                    onClick={() => { document.location.href = "/profile/settings"; }}
                >
                    <i className='fa-solid fa-gear' style={{ fontSize: "24px" }}></i> Settings
                </li>
                <li
                    className={yourPosts ? active : notActive}
                    onClick={() => { document.location.href = "/profile/yourposts"; }}
                >
                    <i className='fa-solid fa-signs-posts' style={{ fontSize: "24px" }}></i> Your Posts
                </li>
                <li className="flex justify-center mt-auto">
                    <button
                        onClick={handleSignOut}
                        className="w-[70%] h-10 bg-red-600 rounded-md text-white font-semibold"
                    >
                        Sign out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
