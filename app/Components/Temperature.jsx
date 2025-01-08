import React, { useEffect, useState } from 'react';

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
                const apiKey = '9c318eb6fbcc2720496583f74d8cd34e';
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

                const getWeather = async () => {
                    try {
                        const response = await fetch(apiUrl);
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const data = await response.json();
                        const tempKelvin = data.main.temp;
                        const tempCelsius = tempKelvin - 273.15;
                        console.log(`Temperature: ${tempCelsius.toFixed(2)}°C`);
                        setTemperature(tempCelsius.toFixed(0));
                        setIcon(data.weather[0].icon);
                    } catch (error) {
                        console.error('Error fetching weather data:', error);
                    }
                };
                getWeather();
            },
            (error) => {
                console.error('Error getting geolocation:', error);
            }
        );
    }, []);

    return (
        <div style={{
            width: '13vh',
            borderRadius: '300px',
            height: '25vh',
            transform: 'rotate(45deg)',
            background: '#ffffff',
            border: 'solid 1px black',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        className="absolute top-[100px] right-[1px] flex-col"
        > <br />
<span className="text-2xl font-bold">
  Feels Like:
</span>
            {temperature ? `${temperature}°C` : 'Loading...'}
            {icon && <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather Icon" />}

        </div>
    );
};

export default WeatherApp;
