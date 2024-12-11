import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import videoFile from '../assets/car.mp4'; 

function Home() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    try {
     
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.fullName || '');  
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);  // ทำงานเพียงครั้งเดียวเมื่อ component ถูก mount

  const handleGetStarted = () => {
    navigate('/products'); 
  };

  return (
    <div className="text-white h-screen flex items-center justify-center">
      <Helmet>
        <title>Home - My Website</title>
      </Helmet>
      
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 text-white text-center py-16">
        <h1 className="text-5xl font-extrabold">
          Welcome {userName ? `, ${userName}` : ''} To RazeCars
        </h1>
        <p className="text-lg mt-4">develop by Phirakan Khongpet</p>
        <button
          onClick={handleGetStarted}
          className="bg-black text-white border-2 border-white px-6 py-2 rounded-full mt-8 inline-block hover:bg-green-800"
        >
          Get started
        </button>
      </div>
    </div>
  );
}

export default Home;
