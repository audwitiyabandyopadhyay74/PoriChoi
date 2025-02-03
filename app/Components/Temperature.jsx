import React, { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";

const WeatherApp = () => {
  const [temperature, setTemperature] = useState(null);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        const apiKey = "9c318eb6fbcc2720496583f74d8cd34e";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        const getWeather = async () => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data.ico);

            const tempKelvin = data.main.temp;
            const tempCelsius = tempKelvin - 273.15;
            console.log(`Temperature: ${tempCelsius.toFixed(2)}°C`);
            setTemperature(tempCelsius.toFixed(0));
            setIcon(data.weather[0].icon);
            console.log(data);
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        };
        getWeather();
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }, []);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 5, bottom: 0 }}
      style={{
        width: "13vh",
        borderRadius: "300px",
        height: "25vh",
        // transform: "rotate(45deg)",
        background: "#ffffff",
        border: "solid 1px black",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10vh",
        flexDirection: "column",
      }}
      className="absolute top-1/2 right-[1px] flex-col transition-none p-1"
    >
      {" "}
      <br />
      <span className="text-2xl font-bold">Feels Like:</span>
      {temperature ? (
        `${temperature}°C`
      ) : (
        <i class="fa-solid fa-loader fa-rotate"></i>
      )}
      {icon && (
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="Weather Icon"
          draggable={false}
        />
      )}
    </motion.div>
  );
};

export default WeatherApp;
