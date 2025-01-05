import React, { useEffect, useRef } from 'react';
import "./clock.css";

const Clock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    const clock = clockRef.current;
    const ctx = clock.getContext('2d');
    const radius = clock.height / 2;
    ctx.translate(radius, radius);
    setInterval(() => drawClock(ctx, radius), 1000);
  }, []);

  const drawClock = (ctx, radius) => {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
  };

  const drawFace = (ctx, radius) => {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  };

  const drawNumbers = (ctx, radius) => {
    let ang;
    let num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  };

  const drawTime = (ctx, radius) => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const hourPos = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    const minutePos = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    const secondPos = second * Math.PI / 30;

    drawHand(ctx, hourPos, radius * 0.5, radius * 0.07);
    drawHand(ctx, minutePos, radius * 0.8, radius * 0.07);
    drawHand(ctx, secondPos, radius * 0.9, radius * 0.02);
  };

  const drawHand = (ctx, pos, length, width) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  };

  return (
    <canvas ref={clockRef} className="clock" width="200" height="200"></canvas>
  );
};

export default Clock;
