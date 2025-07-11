import "./WhoWeAre.scss";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import 'swiper/css';
import 'swiper/css/navigation';
import Star from '../../Images/star.png';
import Roc from '../../Images/roc.png';
import Dim from '../../Images/dim.png';

const missionVisionValues = [
  {
    icon: Star,
    title: "Mission",
    description: "To unite passionate individuals in service, foster impactful community development, and promote ethical leadership through meaningful projects that bring positive change to society."
  },
  {
    icon: Roc,
    title: "Vision",
    description: "To unite passionate individuals in service, foster impactful community development, and promote ethical leadership through meaningful projects that bring positive change to society."
  },
  {
    icon: Dim,
    title: "Core Values",
    description: "To unite passionate individuals in service, foster impactful community development, and promote ethical leadership through meaningful projects that bring positive change to society."
  }
];

const WhoWeAre = () => {
  // Use state to trigger re-render on update
  const [president, setPresident] = useState(() => {
    const stored = localStorage.getItem('presidentDetails');
    return stored ? JSON.parse(stored) : null;
  });
  const [team, setTeam] = useState(() => {
    const stored = localStorage.getItem('aboutPageTeam');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // Listen for storage changes (other tabs/windows)
    const handleStorage = () => {
      const presidentData = localStorage.getItem('presidentDetails');
      const teamData = localStorage.getItem('aboutPageTeam');

      console.log('WhoWeAre: President data from localStorage:', presidentData);

      setPresident(presidentData ? JSON.parse(presidentData) : null);
      setTeam(teamData ? JSON.parse(teamData) : []);
    };
    window.addEventListener('storage', handleStorage);
    // Listen for custom event from admin panel (same tab)
    window.addEventListener('teamDataUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('teamDataUpdated', handleStorage);
    };
  }, []);

  // Optionally, add a manual refresh if you want to update after admin save in same tab
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPresident(JSON.parse(localStorage.getItem('presidentDetails')));
  //     setTeam(JSON.parse(localStorage.getItem('aboutPageTeam')) || []);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // Debug log
  console.log('WhoWeAre: Current president state:', president);

  return (
    <div style={{ padding: "2rem" }}>
      <div className="wwATitle">Who We Are</div>
      <div className="WWAContainer">
        {/* LEFT SECTION */}
        <div className="WWALeftContent">
          <div className="WWALeftContainer">
            {missionVisionValues.map((item, index) => (
              <div className="LeftContentTitle" key={index}>
                <div>
                  <img src={item.icon} width={150} alt="" />
                </div>
                <div>
                  <div className="Head">{item.title}</div>
                  <div className="desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="WWARightContent">
          {/* PRESIDENT CARD */}
          <div>
            <div className="mot">Meet our Team</div>
            <div className="WWARightStaffContainer">
              {president?.photo ? (
                <img
                  src={president.photo}
                  width={233}
                  alt={president.name || president.title}
                />
              ) : (
                <div className="placeholder-image" style={{
                  width: 233,
                  height: 280,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>No Photo</span>
                </div>
              )}
              <div className="WWARightStaffContent">
                <div>
                  <div className="PrsdName">
                    {president?.name ? `${president.title} – ${president.name}` : 'No President Data'}
                  </div>
                  <div className="position">{president?.title || 'Position not set'}</div>
                  <div className="Desc">{president?.description || 'Description not available'}</div>
                </div>
                <div className="readmore">Read More</div>
              </div>
            </div>
          </div>
          {/* TEAM SLIDER */}
          <div className="leadership-swiper-container">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".swiper-button-next-leadership",
                prevEl: ".swiper-button-prev-leadership",
              }}
              spaceBetween={20}
              slidesPerView={1}
            >
              {Array.from({ length: Math.ceil(team.length / 4) }, (_, i) => (
                <SwiperSlide key={i}>
                  <div className="VPGrid">
                    {team.slice(i * 4, i * 4 + 4).map((leader, idx) => (
                      leader.photo ? (
                        <div className="SubContent" key={idx}>
                          <img src={leader.photo} className="sLeaderImg" alt={leader.name} />
                          <div>{leader.name}</div>
                          <div>{leader.title}</div>
                          <div className="subcontDesc">{leader.description}</div>
                        </div>
                      ) : null
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-prev-leadership"><GoChevronLeft /></div>
            <div className="swiper-button-next-leadership"><GoChevronRight /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
