import React, { useState, useEffect } from 'react';
import "./LandingContent.scss";
import Video from "../../Images/Clip2.mp4";
import rotaryImages from '../../Images/rotaryImages.json';
import Marquee from "react-fast-marquee";
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { IoHeartSharp } from 'react-icons/io5';

// const data = [
//   {
//     title: 'Accelerating Progress with Generative AI',
//     description:
//       'Streamline automation, spark creativity, and refine decision-making. We help industries evolve rapidly, increase productivity, and embrace groundbreaking changes.',
//     image:
//       'https://img.freepik.com/free-photo/digital-art-ai-technology-background_23-2151719592.jpg?t=st=1745568731~exp=1745572331~hmac=b92a891ac33c1b046bb54ba212c89a7ee93e993bfc1e00bded6d87aab5981d02&w=1380',
//   },
//   {
//     title: 'Revolutionizing Industries with Automation',
//     description:
//       'Empowering businesses through smart tools and real-time decisions. The future of innovation is here.',
//     image:
//       'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress',
//   },
//   {
//     title: 'AI-Driven Innovation for Tomorrow',
//     description:
//       'Harnessing data and intelligence to reshape how industries operate at every level.',
//     image:
//       'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress',
//   },
// ];
 
 
const LandingContent = () => {
  const [currentVideo, setCurrentVideo] = useState(Video);
  const [uploadedLogos, setUploadedLogos] = useState([]);

  // Check for uploaded video and logos from admin panel
  useEffect(() => {
    const checkForUploadedVideo = () => {
      const storedVideo = localStorage.getItem('landingPageVideo');
      if (storedVideo) {
        try {
          const videoData = JSON.parse(storedVideo);
          if (videoData.url) {
            setCurrentVideo(videoData.url);
          }
        } catch (error) {
          console.error('Error parsing stored video data:', error);
          // Fallback to default video
          setCurrentVideo(Video);
        }
      } else {
        setCurrentVideo(Video);
      }
    };

    const checkForUploadedLogos = () => {
      const storedLogos = localStorage.getItem('landingPageLogos');
      if (storedLogos) {
        try {
          const logoData = JSON.parse(storedLogos);
          setUploadedLogos(logoData || []);
        } catch (error) {
          console.error('Error parsing stored logo data:', error);
          setUploadedLogos([]);
        }
      } else {
        setUploadedLogos([]);
      }
    };

    const checkForUpdates = () => {
      checkForUploadedVideo();
      checkForUploadedLogos();
    };

    checkForUpdates();

    // Listen for storage changes (when content is uploaded from admin panel)
    const handleStorageChange = (e) => {
      if (e.key === 'landingPageVideo') {
        checkForUploadedVideo();
      } else if (e.key === 'landingPageLogos') {
        checkForUploadedLogos();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of same-tab updates
    const interval = setInterval(checkForUpdates, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="landing-container" >

      <div className="landing-content">
        <div className="PozoIntl">   
            <div className='hdName'>  Rotary club of </div>
            <div className='brndName' >  Gulmohar Bangalore </div> 
        </div> 

        <div className="LandingContent">   
            <div className=' '> Together, we drive change. </div>
            <div className='content-para' > Driven by purpose, our network of changemakers works to uplift and support communities worldwide. </div> 
        </div> 

        <div className='donate-buttons-container'>
          <div className='DonateBtn'> Donate Now <IoHeartSharp color='red' size={18} /> </div>
          <div className=' subscribe-btn'> Pay your Subscription Fees <RiMoneyRupeeCircleFill color='white' size={18} /> </div>
          {/* <button
            className='admin-btn'
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            Admin Panel
          </button> */}
        </div>
      </div>  

      <div className='video-container'>
         <video
         className='videodiv'
            src={currentVideo}
            muted
            loop
            autoPlay
            width={500}
            height={380}
            style={{ borderRadius: "12px", objectFit: "cover" }}
          />
      </div>
      </div>

      <div className="marquee-container">
        <Marquee gradient={true} >
          {/* Only show uploaded logos from admin panel */}
          {uploadedLogos.length > 0 ? (
            uploadedLogos.map((logo, index) => (
              <img
                key={`uploaded-${index}`}
                src={logo.url}
                alt={logo.name || `Uploaded Logo ${index + 1}`}
                style={{
                  borderRadius: "12px",
                  objectFit: "contain",
                  marginRight: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "8px"
                }}
                width={100}
                height={100}
              />
            ))
          ) : (
            /* Show default rotary images only if no logos are uploaded */
            rotaryImages.map((image, index) => (
              <img
                key={`rotary-${index}`}
                src={image}
                alt={`Rotary Image ${index + 1}`}
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                  marginRight: "10px"
                }}
                width={100}
                height={100}
              />
            ))
          )}
        </Marquee>
      </div>
 
      {/* <div className="Bgvideo">
           <video
            src={Video}
            width={1440}
            height={850}
            muted
            loop
            autoPlay   
          />
      </div> */}

<div className="Bgvideo">
  <video
    className="bg-video"
    src={currentVideo}
    muted
    loop
    autoPlay
    playsInline
  />
</div>

     </>
  );
};

export default LandingContent;
