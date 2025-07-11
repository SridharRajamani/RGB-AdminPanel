import React, { useState, useEffect } from "react";

const serviceCategories = [
  "Club Service",
  "Community Service",
  "Vocational Service",
  "International Service",
  "Youth Service",
];
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; 
import "./Events.scss";
import { HiArrowLongLeft, HiArrowLongRight, HiMiniArrowLongRight } from "react-icons/hi2";
import { RxArrowTopRight } from "react-icons/rx";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuMoveRight, LuMoveUpRight } from "react-icons/lu";

const NewsCarousel = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeService, setActiveService] = useState(serviceCategories[0]);
  const [dynamicEvents, setDynamicEvents] = useState([]);

  // Dynamic counts based on actual events
  const getEventCounts = () => {
    if (dynamicEvents.length > 0) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const upcoming = dynamicEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= currentDate && event.status !== 'cancelled';
      }).length;

      const past = dynamicEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < currentDate || event.status === 'completed';
      }).length;

      return { upcoming, past };
    }
    return { upcoming: 0, past: 0 }; // Show 0 if no events
  };

  const { upcoming: upcomingCount, past: pastCount } = getEventCounts();

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem('rotary_events');
        if (savedEvents) {
          setDynamicEvents(JSON.parse(savedEvents));
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    };

    // Load events on component mount
    loadEvents();

    // Listen for storage changes (other tabs/windows)
    const handleStorage = () => {
      loadEvents();
    };
    window.addEventListener('storage', handleStorage);

    // Listen for custom event from admin panel (same tab)
    window.addEventListener('eventsDataUpdated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('eventsDataUpdated', handleStorage);
    };
  }, []);

  const upcomingSlides = [
    {
      img: "https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966125.jpg",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Project Bleed Green",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Club Service"
    },
    {
      img: "https://pbs.twimg.com/media/GhAkMZ5W0AAexdM?format=jpg&name=large",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Election Awareness Walkathon",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Community Service"
    },
    {
      img: "https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966125.jpg",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Project Bleed Green",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Vocational Service"
    },
    {
      img: "https://pbs.twimg.com/media/GhAkMZ5W0AAexdM?format=jpg&name=large",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Election Awareness Walkathon",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "International Service"
    },
    {
      img: "https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966125.jpg",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Project Bleed Green",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Youth Service"
    },
    {
      img: "https://pbs.twimg.com/media/GhAkMZ5W0AAexdM?format=jpg&name=large",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Election Awareness Walkathon",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Club Service"
    },
    {
      img: "https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966125.jpg",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Project Bleed Green",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Community Service"
    },
    {
      img: "https://pbs.twimg.com/media/GhAkMZ5W0AAexdM?format=jpg&name=large",
      date: "April 29 2025",
      time: "10:03 AM",
      title: "Election Awareness Walkathon",
      loc: "Grand Bazaar NYC - New York, NY",
      service: "Vocational Service"
    },
  ];

  const pastSlides = [
    {
      img: "https://img.freepik.com/free-vector/flat-world-environment-day-illustration_23-2149403511.jpg",
      date: "March 15 2025",
      time: "09:00 AM",
      title: "Old Tree Plantation Drive",
      loc: "Central Park, NY",
      service: "Club Service"
    },
    {
      img: "https://img.freepik.com/free-vector/flat-world-environment-day-illustration_23-2149403511.jpg",
      date: "March 15 2025",
      time: "09:00 AM",
      title: "Old Tree Plantation Drive",
      loc: "Central Park, NY",
      service: "Community Service"
    },
    {
      img: "https://img.freepik.com/free-vector/flat-world-environment-day-illustration_23-2149403511.jpg",
      date: "March 15 2025",
      time: "09:00 AM",
      title: "Old Tree Plantation Drive",
      loc: "Central Park, NY",
      service: "Vocational Service"
    },
    {
      img: "https://img.freepik.com/free-vector/flat-world-environment-day-illustration_23-2149403511.jpg",
      date: "March 15 2025",
      time: "09:00 AM",
      title: "Old Tree Plantation Drive",
      loc: "Central Park, NY",
      service: "International Service"
    },
    {
      img: "https://img.freepik.com/free-photo/laptop-nature-concept_23-2150246076.jpg",
      date: "February 20 2025",
      time: "02:00 PM",
      title: "Eco Tech Hackathon",
      loc: "Brooklyn Tech Hub",
      service: "Youth Service"
    },
  ];

  // Helper function to convert admin events to display format
  const convertEventToSlide = (event) => {
    return {
      img: event.image || "https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966125.jpg", // Use uploaded image or default
      date: new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: event.time,
      title: event.title,
      loc: event.location || 'TBD',
      service: event.service
    };
  };

  // Get dynamic events or fallback to static data
  const getDynamicSlides = () => {
    if (dynamicEvents.length > 0) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time for date comparison

      const upcoming = dynamicEvents
        .filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= currentDate && event.status !== 'cancelled';
        })
        .map(convertEventToSlide);

      const past = dynamicEvents
        .filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate < currentDate || event.status === 'completed';
        })
        .map(convertEventToSlide);

      return activeTab === "upcoming" ? upcoming : past;
    }
    // Fallback to static data if no dynamic events
    return activeTab === "upcoming" ? upcomingSlides : pastSlides;
  };

  const slides = getDynamicSlides().filter(
    (slide) => slide.service === activeService
  );

  return (
    <div className="news-carousel">
      <div className="LtstNup">Events</div>

      <div className="service-categories">
        <Swiper
          modules={[Navigation]}
          spaceBetween={4}
          slidesPerView="auto"
          navigation={{
            nextEl: ".swiper-button-next-service",
            prevEl: ".swiper-button-prev-service",
          }}
          className="service-swiper"
        >
          {serviceCategories.map((category) => (
            <SwiperSlide key={category} className="service-slide">
              <button
                className={`service-button ${activeService === category ? "active" : ""}`}
                onClick={() => setActiveService(category)}
              >
                {category}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev-service"><GoChevronLeft /></div>
        <div className="swiper-button-next-service"><GoChevronRight /></div>
      </div>

      <div className="event-tabs">
      <div
        className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
        onClick={() => setActiveTab("upcoming")}
      >
        Upcoming ({upcomingCount})
      </div>

      <div
        className={`tab-button ${activeTab === "past" ? "active" : ""}`}
        onClick={() => setActiveTab("past")}
      >
        Past ({pastCount})
      </div>
    </div>

      <div className="swipper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          spaceBetween={15}
          slidesPerView={5}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{
            el: ".custom-pagination-progress",
            type: "progressbar",
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 15 },
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 15 },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    height: "320px",
                    boxShadow: "0px 4px 23px 15px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden"
                }}
              >
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img
                    src={slide.img}
                    alt="Event"
                    className="news-image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                </div>
                <div style={{
                  padding: "15px",
                  textAlign: "left",
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div className="eventtitle" style={{
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#000",
                    lineHeight: "1.3",
                    marginBottom: "10px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical"
                  }}>
                    {slide.title}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#DC542B", fontWeight: "500", marginBottom: "5px" }}>
                      {slide.date} | {slide.time}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6e6e6e" }}>{slide.loc}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          gap: "2rem",
        }}
      >
        
        <div className="smtxt">
          See More <HiArrowLongRight size={17} />
        </div>

        <div className="custom-navigation-buttons">
          <div className="swiper-button-prev-custom"><GoChevronLeft  /></div>
          <div className="swiper-button-next-custom"><GoChevronRight /></div>
        </div>
 

      </div>
    </div>
  );
};

export default NewsCarousel;
