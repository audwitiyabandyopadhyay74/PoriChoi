"use client";
import React, { useEffect, useRef, useState } from "react";
import { useEvent } from "react-use";

const Game1 = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  let bird = {
    x: 50,
    y: 200,
    radius: 15,
    velocity: 0,
    gravity: 0.6,
    lift: -10,
  };
  let pipes = [];
  let frame = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 500;

    const updateGame = () => {
      if (gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        setGameOver(true);
      }

      if (frame % 90 === 0) {
        let gap = 120;
        let topHeight = Math.random() * (canvas.height / 2);
        pipes.push({
          x: canvas.width,
          width: 40,
          top: topHeight,
          bottom: topHeight + gap,
        });
      }

      pipes.forEach((pipe) => {
        pipe.x -= 2;
        if (
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + pipe.width &&
          (bird.y - bird.radius < pipe.top ||
            bird.y + bird.radius > pipe.bottom)
        ) {
          setGameOver(true);
        }
      });

      pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);

      drawBird(ctx);
      drawPipes(ctx);
      frame++;
      requestAnimationFrame(updateGame);
    };

    const drawBird = (ctx) => {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = (ctx) => {
      ctx.fillStyle = "green";
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(
          pipe.x,
          pipe.bottom,
          pipe.width,
          canvas.height - pipe.bottom
        );
      });
    };

    updateGame();
  }, [gameOver]);

  const flap = () => {
    if (!gameOver) {
      bird.velocity = bird.lift;
    }
  };

  useEvent("keydown", (e) => {
    if (e.code === "Space") flap();
  });

  useEvent("click", flap);

  return (
    <div className="flex justify-center items-center h-screen bg-blue-400">
      <canvas
        ref={canvasRef}
        className="bg-white border-2 border-black"
      ></canvas>
    </div>
  );
};

export default Game1;
