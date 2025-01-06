import React from 'react';
import "./clock.css";

const Clock = () => {
  
  return (
<div class="clock" id="analogClock" style="display: block;">

<svg fill="none" height="100%" viewBox="0 0 461 461" width="100%" xmlns="http://www.w3.org/2000/svg">
    <path class="bgLightTint" clip-rule="evenodd" d="M93.6379 63.9405C89.7543 78.4344 78.4333 89.7554 63.9394 93.639L56.4989 95.6327C34.0934 101.636 20.7969 124.666 26.8005 147.072L28.7201 154.236C32.6038 168.73 28.46 184.195 17.8497 194.805L12.3015 200.353C-4.1005 216.755 -4.10051 243.348 12.3015 259.75L17.9236 265.372C28.5338 275.983 32.6776 291.447 28.794 305.941L26.8004 313.382C20.7968 335.787 34.0933 358.817 56.4989 364.821L63.9395 366.815C78.4334 370.698 89.7544 382.019 93.638 396.513L95.6322 403.956C101.636 426.361 124.666 439.658 147.071 433.654L154.513 431.66C169.007 427.777 184.472 431.92 195.082 442.531L200.353 447.802C216.755 464.204 243.348 464.204 259.75 447.802L265.097 442.455C275.707 431.845 291.172 427.701 305.666 431.585L313.383 433.653C335.788 439.656 358.818 426.36 364.822 403.954L366.815 396.515C370.699 382.021 382.02 370.7 396.514 366.816L403.955 364.822C426.361 358.819 439.657 335.789 433.654 313.383L431.586 305.665C427.702 291.172 431.846 275.707 442.456 265.096L447.802 259.75C464.204 243.348 464.204 216.755 447.802 200.353L442.53 195.081C431.92 184.471 427.776 169.006 431.66 154.512L433.654 147.071C439.657 124.665 426.361 101.635 403.955 95.6312L396.514 93.6373C382.02 89.7537 370.699 78.4327 366.815 63.9389L364.822 56.4994C358.818 34.0938 335.788 20.7974 313.383 26.8009L305.942 28.7946C291.448 32.6782 275.983 28.5345 265.373 17.9242L259.75 12.3015C243.348 -4.10051 216.755 -4.1005 200.353 12.3015L194.806 17.8491C184.196 28.4593 168.731 32.6031 154.237 28.7195L147.071 26.7995C124.666 20.7959 101.636 34.0924 95.6322 56.498L93.6379 63.9405Z" fill="#FFF" fill-rule="evenodd"></path>
</svg>
<div class="centerPoint">
    <div class="sui" id="hour" style="transform: rotate(466.5deg); transition: transform 1s;"></div>
    <div class="sui" id="second" style="transform: rotate(186deg); transition: transform 1s;"></div>
    <div class="sui" id="minute" style="transform: rotate(201.1deg); transition: transform 1s;"></div>
</div>
</div>
  );
};

export default Clock;
// const clockRef = useRef(null);

//   useEffect(() => {
//     const clock = clockRef.current;
//     const ctx = clock.getContext('2d');
//     const radius = clock.height / 2;
//     ctx.translate(radius, radius);
//     setInterval(() => drawClock(ctx, radius), 1000);
//   }, []);

//   const drawClock = (ctx, radius) => {
//     drawFace(ctx, radius);
//     drawNumbers(ctx, radius);
//     drawTime(ctx, radius);
//   };

//   const drawFace = (ctx, radius) => {
//     ctx.beginPath();
//     ctx.arc(0, 0, radius, 0, 2 * Math.PI);
//     ctx.fillStyle = 'white';
//     ctx.fill();
//     ctx.strokeStyle = '#333';
//     ctx.lineWidth = radius * 0.1;
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
//     ctx.fillStyle = '#333';
//     ctx.fill();
//   };

//   const drawNumbers = (ctx, radius) => {
//     let ang;
//     let num;
//     ctx.font = radius * 0.15 + "px arial";
//     ctx.textBaseline = "middle";
//     ctx.textAlign = "center";
//     for (num = 1; num < 13; num++) {
//       ang = num * Math.PI / 6;
//       ctx.rotate(ang);
//       ctx.translate(0, -radius * 0.85);
//       ctx.rotate(-ang);
//       ctx.fillText(num.toString(), 0, 0);
//       ctx.rotate(ang);
//       ctx.translate(0, radius * 0.85);
//       ctx.rotate(-ang);
//     }
//   };

//   const drawTime = (ctx, radius) => {
//     const now = new Date();
//     const hour = now.getHours();
//     const minute = now.getMinutes();
//     const second = now.getSeconds();
//     const hourPos = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
//     const minutePos = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
//     const secondPos = second * Math.PI / 30;

//     drawHand(ctx, hourPos, radius * 0.5, radius * 0.07);
//     drawHand(ctx, minutePos, radius * 0.8, radius * 0.07);
//     drawHand(ctx, secondPos, radius * 0.9, radius * 0.02);
//   };

//   const drawHand = (ctx, pos, length, width) => {
//     ctx.beginPath();
//     ctx.lineWidth = width;
//     ctx.lineCap = "round";
//     ctx.moveTo(0, 0);
//     ctx.rotate(pos);
//     ctx.lineTo(0, -length);
//     ctx.stroke();
//     ctx.rotate(-pos);
//   };
