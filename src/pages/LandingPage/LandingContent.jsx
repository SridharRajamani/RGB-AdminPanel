import React, { useState, useEffect, useRef } from 'react';
import "./LandingContent.scss";
import Video from "../../Images/Clip2.mp4";
import { FaCreditCard } from "react-icons/fa";
import rotaryImages from '../../Images/rotaryImages.json';
import PrimaryButton from '../../components/Buttons/PrimaryButton.jsx';
import Marquee from "react-fast-marquee";
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { IoHeartSharp } from 'react-icons/io5';
import Login from './Login.jsx';

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
  const [showLogin, setShowLogin] = useState(false);
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
            // Ensure the video URL is valid and accessible
            console.log('Loading uploaded video:', videoData.url);
            setCurrentVideo(videoData.url);
          } else {
            console.log('No video URL found, using default video');
            setCurrentVideo(Video);
          }
        } catch (error) {
          console.error('Error parsing stored video data:', error);
          // Fallback to default local video
          setCurrentVideo(Video);
        }
      } else {
        // Use local video file stored in src/Images/Clip2.mp4 as default
        console.log('No stored video found, using default video');
        setCurrentVideo(Video);
      }
    };

    const checkForUploadedLogos = () => {
      const storedLogos = localStorage.getItem('landingPageLogos');
      if (storedLogos) {
        try {
          const logoData = JSON.parse(storedLogos);
          console.log('Loaded logo data:', logoData);
          setUploadedLogos(logoData || []);
        } catch (error) {
          console.error('Error parsing stored logo data:', error);
          setUploadedLogos([]);
        }
      } else {
        console.log('No logos found in localStorage');
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

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowLogin(true), 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Ensure video plays when source changes
  useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video) {
        video.load(); // Reload the video element
        video.play().catch(error => {
          console.log('Video autoplay prevented:', error);
        });
      }
    });
  }, [currentVideo]);



  return (
    <>
      {showLogin && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setShowLogin(false);
          }}
        >
          <button
            style={{
              position: 'fixed',
              top: 20,
              right: 30,
              zIndex: 2100,
              background: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.3rem 0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onClick={() => setShowLogin(false)}
          >
            Skip
          </button>
          <div style={{position: 'relative', width: '70vw', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Login />
            </div>
          </div>
        </div>
      )}
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
            key={currentVideo} // Force re-render when video changes
            src={currentVideo}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            width={500}
            height={380}
            style={{ borderRadius: "12px", objectFit: "cover" }}
            onError={(e) => {
              console.error('Video error:', e);
              // Fallback to default video if uploaded video fails
              if (currentVideo !== Video) {
                setCurrentVideo(Video);
              }
            }}
            onLoadedData={() => {
              console.log('Video loaded successfully:', currentVideo);
            }}
            onEnded={() => {
              // Ensure video loops (backup for loop attribute)
              e.target.currentTime = 0;
              e.target.play();
            }}
          />
      </div>
      </div>

      <div className="marquee-container">
        <Marquee gradient={true} >
          {/* Only show uploaded logos from admin panel */}
          {uploadedLogos.length > 0 ? (
            uploadedLogos.map((logo, index) => {
              console.log(`Rendering logo ${index}:`, logo.name, 'URL type:', logo.url?.substring(0, 20) + '...');
              return (
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
                  onError={(e) => {
                    console.error('Failed to load logo:', logo.name, 'URL:', logo.url?.substring(0, 50) + '...');
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Successfully loaded logo:', logo.name);
                  }}
                />
              );
            })
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
    key={`bg-${currentVideo}`} // Force re-render when video changes
    src={currentVideo}
    muted
    loop
    autoPlay
    playsInline
    preload="auto"
    onError={(e) => {
      console.error('Background video error:', e);
      // Fallback to default video if uploaded video fails
      if (currentVideo !== Video) {
        setCurrentVideo(Video);
      }
    }}
    onLoadedData={() => {
      console.log('Background video loaded successfully:', currentVideo);
    }}
    onEnded={(e) => {
      // Ensure video loops (backup for loop attribute)
      e.target.currentTime = 0;
      e.target.play();
    }}
  />
</div>



     </>
  );
};
export default LandingContent;
