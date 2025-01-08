"use client";

import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { ToastContainer, toast } from "react-toastify";
import MoblieNav from '../Components/Moblie Nav';


const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchTopHeadlines = async () => {
      const url = "https://gnews.io/api/v4/top-headlines?country=in&category=general&apikey=6b4eab130e4cc5515335ebeda84b2b24";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new toast ('Network response was not ok');
        }
        const data = await response.json();
        setNewsData(data.articles);
        console.log(newsData)
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchTopHeadlines();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <ToastContainer/>
      <MoblieNav className="fixed top-0 w-full" />
      <NavBar className="fixed top-0 w-full" />

      <div className="flex flex-wrap items-center justify-center pt-24 sm:pt-32 gap-4 px-4 sm:px-8 lg:px-16">
        {newsData.map((news) => (
          <a key={news.title+Math.random()*100} href={news.url} target='_blank' rel="noopener noreferrer" className='no-underline'>
            <div className="w-full sm:w-80 bg-white shadow-lg m-2 rounded-lg flex flex-col overflow-hidden transition-transform duration-300 transform hover:scale-105">
              <img src={news.image || '/default_image.jpg'} alt={news.title} className='w-full h-48 object-cover' />
              <div className="p-4">
                <h5 className="text-lg font-semibold mb-2">{news.title}</h5>
                <p className="text-sm text-gray-700">{news.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
