import React from 'react';
import Marquee from "react-fast-marquee";
import './Marquee.scss';

 
const Marquee = ({ children, speed = 50, reverse = false }) => { 
  const direction = reverse ? 'right' : 'left';
  const duration = `${100 / speed}s`; 

  return (
    <div className="marquee-wrapper">
      <div
        className="marquee"
        style={{ animation: `marquee-${direction} ${duration} linear infinite` }}
      >

<Marquee>
  I can be a React component, multiple React components, or just some text.
</Marquee>

        {/* <div className="marquee__group">
          {children}dsadsa
        </div>
        <div className="marquee__group" aria-hidden="true">
          {children}dasda
        </div> */}
      </div>
    </div>
  );
};

export default Marquee;