import React from 'react'
import RGLogo from '../../../Images/NewRGBLogo2.svg'
import Mail from '../../../Images/mail.png'
import Phone from '../../../Images/phone.png'
import WP from '../../../Images/wp.png'
import './Navbar.scss'
import { LiaHandshakeSolid } from 'react-icons/lia'
import { Link } from 'react-router-dom';
import { FiLogIn, FiMenu } from 'react-icons/fi'
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar=()=> {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div style={{padding:"0 2rem"}} className='MasterNav'>

        <div className='navbar-top'>
            <div> <a href="mailto:info@rotarygulohar.com"><img src={Mail} width={13}/> info@rotarygulohar.com</a></div>
            <div> <a href="tel:+918884000076"><img src={Phone} width={13} /> +91 8884000076</a></div>
            <div> <a href="https://wa.me/918884000076" target="_blank" rel="noopener noreferrer"><img src={WP} width={13} /> +91 8884000076</a></div>
        </div>
        <div className='navbar'>
          

            <div className='navbar-content'>
            <Link to="/">
              <img className='logo' src={RGLogo} width={240} alt='Rotary Gulmohar Logo'/>
            </Link>

                {/* Desktop Navigation */}
                <div className='navbar-content-left desktop-nav'>
                    <Link to="/" onClick={toggleNavbar}>Home</Link>
                    <Link to="/showcase" onClick={toggleNavbar}>Showcase</Link>
                    <Link to="/events" onClick={toggleNavbar}>Events</Link>
                    <Link to="/contact" onClick={toggleNavbar}>Contact</Link>
                </div>

                {/* Desktop Action Buttons */}
                <div className='ActionBtns desktop-actions'>
                    <Link to="/join-us" className='JoinBtn'><span>Join Rotary Gulmohar <LiaHandshakeSolid size={19} /></span></Link>
                    <Link to="/login" className='LoginBtn' onClick={toggleNavbar}><span> Login <FiLogIn size={19} /></span></Link>
                </div>

                {/* Mobile Action Buttons */}
                <div className='mobile-actions'>
                    <Link to="/join-us" className='JoinBtn mobile-join'><span>Join Rotary Gulmohar <LiaHandshakeSolid size={16} /></span></Link>
                    <div className='MenuIcon' onClick={toggleNavbar}>
                      {isOpen ? <FaTimes size={19} /> : <FiMenu size={19} />}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
              <div className='mobile-menu-overlay' onClick={toggleNavbar}>
                <div className='mobile-menu' onClick={(e) => e.stopPropagation()}>
                  <div className='mobile-menu-header'>
                    <img src={RGLogo} width={120} alt='Rotary Gulmohar Logo'/>
                    <div className='close-btn' onClick={toggleNavbar}>
                      <FaTimes size={20} />
                    </div>
                  </div>
                  <div className='mobile-menu-content'>
                    <Link to="/" onClick={toggleNavbar} className='mobile-menu-item'>Home</Link>
                    <Link to="/showcase" onClick={toggleNavbar} className='mobile-menu-item'>Showcase</Link>
                    <Link to="/events" onClick={toggleNavbar} className='mobile-menu-item'>Events</Link>
                    <Link to="/contact" onClick={toggleNavbar} className='mobile-menu-item'>Contact</Link>
                    <Link to="/login" onClick={toggleNavbar} className='mobile-menu-item login-item'>
                      <FiLogIn size={18} /> Login
                    </Link>
                  </div>
                </div>
              </div>
            )}

        </div>
    </div>
  )
}

export default Navbar
