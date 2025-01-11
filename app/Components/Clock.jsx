import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import "./clock.css";

const Clock = () => {
  const secondHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const hourHandRef = useRef(null);
  const ClockRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDegrees = ((seconds / 60) * 360) + 90;
      const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
      const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

      if (secondHandRef.current) secondHandRef.current.style.transform = `rotate(${secondDegrees}deg)`;
      if (minuteHandRef.current) minuteHandRef.current.style.transform = `rotate(${minuteDegrees}deg)`;
      if (hourHandRef.current) hourHandRef.current.style.transform = `rotate(${hourDegrees}deg)`;
    };

    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e) => {
      const clock = clockRef.current;
      const shiftX = e.clientX - clock.getBoundingClientRect().left;
      const shiftY = e.clientY - clock.getBoundingClientRect().top;

      const handleMouseMove = (event) => {
        clock.style.left = `${event.pageX - shiftX}px`;
        clock.style.top = `${event.pageY - shiftY}px`;
      };

      document.addEventListener('mousemove', handleMouseMove);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMouseMove);
      }, { once: true });
    };

    const clock = clockRef.current;
    clock.addEventListener('mousedown', handleMouseDown);

    return () => {
      clock.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);


  return (
      <div className="clock" id="analogClock" style={{ display: "block", position: "absolute", left: "2px", top: "100px" }} ref={Clock

      }>
        <svg 
          fill="none" 
          height="100%" 
          viewBox="0 0 461 461" 
          width="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="230.5" cy="230.5" r="230.5" fill="#fff" />
          <path d="M230.5 0C103.2 0 0 103.2 0 230.5S103.2 461 230.5 461 461 357.8 461 230.5 357.8 0 230.5 0zm0 421c-104.9 0-190.5-85.6-190.5-190.5S125.6 40 230.5 40 421 125.6 421 230.5 335.4 421 230.5 421z" fill="#000" fillRule="evenodd" />
        </svg>
        <div className="centerPoint">
          <div className="sui" id="hour" ref={hourHandRef}></div>
          <div className="sui" id="second" ref={secondHandRef}></div>
          <div className="sui" id="minute" ref={minuteHandRef}></div>
        </div>
      </div>
    
  );
};

export default Clock;