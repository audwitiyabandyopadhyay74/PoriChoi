"use client"
import React from 'react';
import Avatar from '../download.png';
import Image from 'next/image';

const SearchData = (props) => {
  return (
    <div className='w-[80%] h-max bg-[#fff] p-4 flex items-center justify-between p-[10rem] rounded-md'>
    <Image src={props.pic || Avatar} alt="" width={100} height={100} className='rounded-full' />
    <h1 className='text-2xl'><strong>{props.userName || "Not Given"}</strong></h1>
    </div>

  );
}

export default SearchData;
