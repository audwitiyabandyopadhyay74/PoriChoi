"use client";
// pages/news.js

import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // Replace 'YOUR_API_KEY' with your actual API key
    // const apiKey = 'e7f7d9be7f8941388aee0e10c146a327';

    // Function to fetch top headlines
    const fetchTopHeadlines = async () => {
      try {
        const url = `https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=e7f7d9be7f8941388aee0e10c146a327`;
        const response = await fetch(url);
        const data = await response.json();
        setNewsData(data.articles);
        console.log(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    // Call the function
    fetchTopHeadlines();
  }, []);

  return (<div className='flex flex-col gap-4'>
      <NavBar className="absolute top-0"/>

    <div>
      <div className="flex flex-wrap justify-center pt-[200px]">
        {newsData.map((news) => (
          <a key={news.title} href={`${news.url}`} target='_blank' className='no-underline'>
          <div  className="w-[20rem] pl-4 pr-4 h-max bg-white  m-1 rounded-md flex flex-col">
            <img src={news.urlToImage || 'http://localhost:3000/_next/static/media/favicon.bd25261d.ico'} alt={news.title} className='rounded-md' />
            <h5>{news.title}</h5>
            <p>{news.description}</p>
          </div></a>
        ))}
      </div>
    </div>
    </div>
  );
};

export default NewsPage;
