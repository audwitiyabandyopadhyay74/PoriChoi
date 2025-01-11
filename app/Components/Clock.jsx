import React, { useEffect, useRef } from 'react';
import "./clock.css";

const Clock = () => {
  const secondHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const hourHandRef = useRef(null);

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
    const handleDrag = (e, handRef) => {
      const rect = handRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      handRef.current.style.transform = `rotate(${angle + 90}deg)`;
    };

    const handleMouseDown = (e, handRef) => {
      const handleMouseMove = (event) => handleDrag(event, handRef);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMouseMove);
      }, { once: true });
    };

    if (secondHandRef.current) {
      secondHandRef.current.addEventListener('mousedown', (e) => handleMouseDown(e, secondHandRef));
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.addEventListener('mousedown', (e) => handleMouseDown(e, minuteHandRef));
    }
    if (hourHandRef.current) {
      hourHandRef.current.addEventListener('mousedown', (e) => handleMouseDown(e, hourHandRef));
    }

    return () => {
      if (secondHandRef.current) {
        secondHandRef.current.removeEventListener('mousedown', (e) => handleMouseDown(e, secondHandRef));
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.removeEventListener('mousedown', (e) => handleMouseDown(e, minuteHandRef));
      }
      if (hourHandRef.current) {
        hourHandRef.current.removeEventListener('mousedown', (e) => handleMouseDown(e, hourHandRef));
      }
    };
  }, []);

  return (
    <div className="clock" id="analogClock" style={{ display: "block", position: "absolute", left: "2px", top: "100px" }}>
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