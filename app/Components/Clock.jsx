import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
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

  return (
    <Draggable>
      <div className="clock">
        <div className="hand second-hand" ref={secondHandRef}></div>
        <div className="hand minute-hand" ref={minuteHandRef}></div>
        <div className="hand hour-hand" ref={hourHandRef}></div>
        <div className="center"></div>
      </div>
    </Draggable>
  );
};

export default Clock;