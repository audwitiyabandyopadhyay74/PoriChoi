import React, { useEffect, useRef } from 'react';
import "./clock.css";

const Clock = () => {
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  useEffect(() => {
    const setDate = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const secondsDegrees = ((seconds / 60) * 360) + 90;
      secondHandRef.current.style.transform = `rotate(${secondsDegrees}deg)`;

      const minutes = now.getMinutes();
      const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
      minuteHandRef.current.style.transform = `rotate(${minutesDegrees}deg)`;

      const hours = now.getHours();
      const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;
      hourHandRef.current.style.transform = `rotate(${hoursDegrees}deg)`;
    };

    const interval = setInterval(setDate, 1000);
    setDate();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      <div className="clock-face">
        <div className="number number1">1</div>
        <div className="number number2">2</div>
        <div className="number number3">3</div>
        <div className="number number4">4</div>
        <div className="number number5">5</div>
        <div className="number number6">6</div>
        <div className="number number7">7</div>
        <div className="number number8">8</div>
        <div className="number number9">9</div>
        <div className="number number10">10</div>
        <div className="number number11">11</div>
        <div className="number number12">12</div>
        <div className="hand hour-hand" ref={hourHandRef}></div>
        <div className="hand minute-hand" ref={minuteHandRef}></div>
        <div className="hand second-hand" ref={secondHandRef}></div>
      </div>
    </div>
  );
};

export default Clock;
