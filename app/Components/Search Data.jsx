 "use client"
import React from 'react';
import Avatar from '../download.png';
import Image from 'next/image';

const SearchData = (props) => {
  return (
    <div className='max-w-[80%] w-[100%] h-max bg-[#fff] lg:p-4 flex flex-wrap items-center  justify-center lg:justify-between lg:p-[10rem] rounded-md'>
    <Image src={props.pic || Avatar} alt="" width={100} height={100} className='rounded-full' />
    <h1 className='text-2xl text-center'><strong>{props.userName || "Not Found"}</strong></h1>
    </div>

  );
}

export default SearchData;
