// StrategicAreas.jsx
import React, { useState, useEffect } from "react";
import "./StrategicAreas.scss";
import { HiArrowLongRight } from "react-icons/hi2";

// Default focus areas data (fallback)
const defaultCardData = [
  {
    id: 1,
    title: "Basic Education & Literacy",
    description:
      "We strive to improve healthcare access, promote awareness, and support medical initiatives to prevent diseases and enhance community well-being.",
    image: "https://img.freepik.com/free-photo/pretty-asian-teacher-smiling-camera-back-classroom-elementary-school-vintage-effect-style-pictures_1253-1133.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 2,
    title: "Maternal & ChildHealth",
    description: "Supporting mothers and children with healthcare services, nutrition programs, and educational resources for healthier communities.",
    image: "https://img.freepik.com/free-photo/young-mother-with-her-children-pediatrician-appointment_23-2149187458.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 3,
    title: "Peace & Conflict Prevention / Resolution",
    description:
      "Promoting peace through dialogue, conflict resolution training, and community building initiatives.",
    image: "https://img.freepik.com/free-photo/people-demonstrating-together-peace_23-2148296486.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 4,
    title: "Disease Prevention Treatment",
    description:
      "Ensuring clean water access and proper sanitation to promote healthier communities and a sustainable future.",
    image: "https://img.freepik.com/premium-photo/young-man-wearing-flu-mask-using-hand-sanitizer-standing-against-white-background_1048944-7404746.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 5,
    title: "Water, Sanitation & Hygiene",
    description: "Providing clean water access, sanitation facilities, and hygiene education to improve community health.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQjql2PIms14TmLHYqqlDV7zMViuvuk5kjmQ&s",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 6,
    title: "Community & Economic Development",
    description: "Empowering communities through economic opportunities, skill development, and sustainable growth initiatives.",
    image: "https://img.freepik.com/premium-photo/3d-rendered-photos-inclusion-equity-society_1139417-10043.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
  {
    id: 7,
    title: "Support the Environment",
    description: "Environmental conservation through tree planting, waste management, and sustainability education programs.",
    image: "https://img.freepik.com/premium-photo/father-daughter-are-planting-seedlings-garden_73944-17584.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
    location: "Grand Bazaar NYC – New York, NY",
    status: "active"
  },
];

const StrategicAreas = () => {
  const [focusAreas, setFocusAreas] = useState(defaultCardData);

  useEffect(() => {
    // Load focus areas from localStorage
    const loadFocusAreas = () => {
      try {
        const savedFocusAreas = localStorage.getItem('rotary_focus_areas');
        if (savedFocusAreas) {
          const parsed = JSON.parse(savedFocusAreas);
          // Only show active focus areas on landing page
          const activeFocusAreas = parsed.filter(area => area.status === 'active');
          if (activeFocusAreas.length > 0) {
            setFocusAreas(activeFocusAreas);
          }
        }
      } catch (error) {
        console.error('Error loading focus areas from localStorage:', error);
      }
    };

    // Initial load
    loadFocusAreas();

    // Listen for storage changes (other tabs/windows)
    const handleStorage = () => {
      loadFocusAreas();
    };
    window.addEventListener('storage', handleStorage);

    // Listen for custom event from admin panel (same tab)
    window.addEventListener('focusAreasDataUpdated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focusAreasDataUpdated', handleStorage);
    };
  }, []);

  return (
    <>
    <div className="strategic-areas">
      <h2>Focus Areas</h2>
      <p>
        Through these priority areas, Rotary Gulmohar Bangalore is committed to
        creating a lasting positive impact
      </p>

      <div className="cards-container">
        {focusAreas.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-content">
              <h3>{card.title}</h3>
              {/* {card.description && <p>{card.description}</p>} */}
              {/* <span>{card.location}</span> */}
            </div>
          </div>
        ))}
      </div> 
    </div>

    <div className="smtxt"> See More <HiArrowLongRight size={17} /></div> 
</>
  );
};

export default StrategicAreas;
