"use client";

import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchTopHeadlines = async () => {
      const url = "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=e7f7d9be7f8941388aee0e10c146a327";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setNewsData(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchTopHeadlines();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <NavBar className="fixed top-0 w-full" />
      <div className="flex flex-wrap justify-center pt-24 sm:pt-32 gap-4 px-4 sm:px-8 lg:px-16">
        {newsData.map((news) => (
          <a key={news.title+Math.random()*100} href={news.url} target='_blank' rel="noopener noreferrer" className='no-underline'>
            <div className="w-full sm:w-80 bg-white shadow-lg m-2 rounded-lg flex flex-col overflow-hidden transition-transform duration-300 transform hover:scale-105">
              <img src={news.urlToImage || '/default_image.jpg'} alt={news.title} className='w-full h-48 object-cover' />
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
