import React, { useState, useEffect } from 'react';
import './WhatWeAreDoing.scss';

const WhatWeDo = () => {
  const [memberInquisitiveVideos, setMemberInquisitiveVideos] = useState([]);

  // Default fallback videos (same as admin panel defaults)
  const defaultVideos = [
    { id: 1, title: 'INSPIRE', videoUrl: 'https://www.youtube.com/embed/IUN664s7N-c', status: 'active' },
    { id: 2, title: 'PROMOTE PEACE', videoUrl: 'https://www.youtube.com/embed/dJtbRTEq2OY', status: 'active' },
    { id: 3, title: 'EDUCATION SUPPORT', videoUrl: 'https://www.youtube.com/embed/sWHkM0a3dB8', status: 'active' },
    { id: 4, title: 'ENVIRONMENTAL ACTION', videoUrl: 'https://www.youtube.com/embed/L2zqTYgcpfg', status: 'active' },
    { id: 5, title: 'COMMUNITY HEALTH', videoUrl: 'https://www.youtube.com/embed/e3W6yf6c-FA', status: 'active' },
    { id: 6, title: 'YOUTH EMPOWERMENT', videoUrl: 'https://www.youtube.com/embed/n_MkC9P3aMo', status: 'active' },
    { id: 7, title: 'CLEAN WATER', videoUrl: 'https://www.youtube.com/embed/Be9UH-_t3Eo', status: 'active' },
    { id: 8, title: 'TREE PLANTATION', videoUrl: 'https://www.youtube.com/embed/8pTyJcVJ1S0', status: 'active' },
    { id: 9, title: 'FLOOD RELIEF', videoUrl: 'https://www.youtube.com/embed/0DmYpRr2rsk', status: 'active' },
    { id: 10, title: 'WOMEN LEADERSHIP', videoUrl: 'https://www.youtube.com/embed/43lQKXgOexg', status: 'active' },
    { id: 11, title: 'SKILL DEVELOPMENT', videoUrl: 'https://www.youtube.com/embed/TkBwk7XGFYM', status: 'active' },
    { id: 12, title: 'DISASTER RESPONSE', videoUrl: 'https://www.youtube.com/embed/NzgNSjKnwbI', status: 'active' }
  ];

  useEffect(() => {
    // Load member inquisitive videos from localStorage
    const loadMemberInquisitiveVideos = () => {
      try {
        const savedVideos = localStorage.getItem('rotary_member_inquisitive');
        if (savedVideos) {
          const parsed = JSON.parse(savedVideos);
          // Only show active videos on landing page
          const activeVideos = parsed.filter(video => video.status === 'active');
          if (activeVideos.length > 0) {
            setMemberInquisitiveVideos(activeVideos);
          } else {
            setMemberInquisitiveVideos(defaultVideos);
          }
        } else {
          setMemberInquisitiveVideos(defaultVideos);
        }
      } catch (error) {
        console.error('Error loading member inquisitive videos from localStorage:', error);
        setMemberInquisitiveVideos(defaultVideos);
      }
    };

    // Initial load
    loadMemberInquisitiveVideos();

    // Listen for storage changes (other tabs/windows)
    const handleStorage = () => {
      loadMemberInquisitiveVideos();
    };

    // Listen for custom event from admin panel
    const handleMemberInquisitiveUpdate = () => {
      loadMemberInquisitiveVideos();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('memberInquisitiveDataUpdated', handleMemberInquisitiveUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('memberInquisitiveDataUpdated', handleMemberInquisitiveUpdate);
    };
  }, []);

  return (
    <div className="what-we-do-container">
      <h1>Member inquisitive</h1>
      <p className="description">
        At Rotary Gulmohar Bangalore, we drive impactful community projects focused on education,
        healthcare, and sustainability. Through service and leadership, we create lasting change
        for a better tomorrow.
      </p>

      <div className="divider"></div>

      <div className="video-grid">
        {memberInquisitiveVideos.map((video) => (
          <div className="video-item" key={video.id}>
            <iframe
              src={video.videoUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatWeDo;
