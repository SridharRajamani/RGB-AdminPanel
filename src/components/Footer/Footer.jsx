import React from 'react'
import RotaryGulmharLogo from '../../Images/NewRGBLogo.svg'
import './Footer.scss'
import { IoLogoFacebook } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
const Footer = () => {
    return (
      <footer className="footer-container">
        <div> <img style={{filter:"grayscale(100%)"}} src={RotaryGulmharLogo} width={300} alt="Rotary Gulmohar Logo" /></div>

        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/join-us">Join Us</a>
          <a href="/who-we-are">Who we are</a>
          <a href="/events">Events</a>
          <a href="/support-us">Support us</a>
        </div>

        <div style={{display:"flex", gap:"20px", justifyContent:"center"}}> 
           <IoLogoFacebook  />
            <a href="https://wa.me/918884000076" > <FaWhatsapp color='black'  />  </a> </div>

       
     
        <div className="footer-bottom" style={{display:"flex",  alignItems:"center", }}>

          <div className="legal-links" >
            <div href="/privacy-policy">Privacy Policy</div>
            <div href="/terms-of-use">Terms of Use</div>
          </div> 
          <span className="copyright">© 2025 Rotary Gulmohar. All rights reserved.</span>

          {/* <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
              <FaWhatsapp />
          <span>+91 8884000076</span>
           </div> */}
 
           <div> 
          {/* <span className="club-site-name">Rotary Gulmohar Club Site</span> */}
          <span className="managed-by">Powered by <a href="http://www.prematix.com">Prematix</a></span>
       </div>
        </div>

       
      </footer>
    );
  };
  
  export default Footer;
 