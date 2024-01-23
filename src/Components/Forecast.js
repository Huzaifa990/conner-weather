import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import ReactAnimatedWeather from "react-animated-weather";

export default function Forecast() {
  var [tabName, setTabName] = useState("weather");
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("CLEAR_DAY");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          var response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&id=524901&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
          );
          var data = await response.json();

          if (
            data.weather[0].main === "Rain" ||
            data.weather[0].main === "Thunderstorm" ||
            data.weather[0].main === "Drizzle" ||
            data.weather[0].main === "Mist"
          ) {
            setIcon("RAIN");
          } else if (data.weather[0].main === "Snow") {
            setIcon("SNOW");
          } else if (
            data.weather[0].main === "Dust" ||
            data.weather[0].main === "Fog" ||
            data.weather[0].main === "Haze" ||
            data.weather[0].main === "Smoke"
          ) {
            setIcon("FOG");
          } else if (data.weather[0].main === "Clear") {
            setIcon("CLEAR_DAY");
          } else if (data.weather[0].main === "Clouds") {
            setIcon("CLOUDY");
          }

          console.log(data);
          setCity(data.name);
        },
        () => {
          alert("Location services denied!");
        }
      );
    } else {
      alert("Location Services not found!");
    }
  }, []);

  return (
    <div className="overall-container">
      <div className="tabBar">
        <center>
          <button onClick={() => setTabName("weather")}> Weather </button>
          <button onClick={() => setTabName("forecast")}> Forecast </button>
        </center>
      </div>
      {tabName === "weather" ? (
        <>
          <Weather
            city={city}
            setCity={setCity}
            icon={icon}
            setIcon={setIcon}
          />
        </>
      ) : (
        <>
          <ForecastSection city={city} />
        </>
      )}
    </div>
  );
}

function Weather({ city, setCity, icon, setIcon }) {
  var [weather, setWeather] = useState({});

  const defaults = {
    icon: icon,
    color: "white",
    size: 150,
    animate: true,
  };

  useEffect(() => {
    async function getData() {
      if (city !== "") {
        var response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
        );
        var data = await response.json();
        if (
          data.weather[0].main === "Rain" ||
          data.weather[0].main === "Thunderstorm" ||
          data.weather[0].main === "Drizzle" ||
          data.weather[0].main === "Mist"
        ) {
          setIcon("RAIN");
        } else if (data.weather[0].main === "Snow") {
          setIcon("SNOW");
        } else if (
          data.weather[0].main === "Dust" ||
          data.weather[0].main === "Fog" ||
          data.weather[0].main === "Haze" ||
          data.weather[0].main === "Smoke"
        ) {
          setIcon("FOG");
        } else if (data.weather[0].main === "Clear") {
          setIcon("CLEAR_DAY");
        } else if (data.weather[0].main === "Clouds") {
          setIcon("CLOUDY");
        }
        console.log(data);
        setWeather(data);
      }
    }
    getData();
  }, [city]);

  function search(e) {
    if (e.key === "Enter") {
      setCity(e.target.value);
    }
  }

  return (
    <>
      <div className="main-container">
        <div className="inner-child">
          <div className="left-container">
            <div className="top-left">
              <h1>{weather.name}</h1>
              <h3>{weather.sys?.country}</h3>
            </div>

            <div className="bottom-left">
              <div className="clock-left">
                <h1>
                  <Clock
                    format={"HH:mm:ss"}
                    ticking={true}
                    timezone={"US/Eastern"}
                  />
                </h1>
                <p>{new Date(weather.dt * 1000).toDateString()}</p>
              </div>
              <div className="temp-left">
                <h1>{Math.round(weather.main?.temp)}°F</h1>
              </div>
            </div>
          </div>
          <div className="right-container">
            <div className="logo-container">
              <ReactAnimatedWeather
                icon={defaults.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
            </div>

            <div className="weather-icon">
              <h1>{weather.weather?.[0].main}</h1>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather?.[0].icon}@2x.png`}
                alt="icons"
                width={70}
              />
            </div>

            <hr />

            <div className="middle-right">
              <input
                type="text"
                name="search"
                placeholder="Search city.."
                onKeyDown={(e) => {
                  search(e);
                }}
              />
            </div>

            <div className="weather-info">
              <h3>{weather.weather?.[0].description}</h3>
            </div>

            <div className="weather-stats">
              <div>
                <p>Feels Like</p>
                <p>{Math.round(weather.main?.feels_like)}°F</p>
              </div>

              <div>
                <p>Humidity</p>
                <p>{weather.main?.humidity}%</p>
              </div>

              <div>
                <p>Visibility</p>
                <p>{weather.visibility}</p>
              </div>

              <div>
                <p>Wind Speed</p>
                <p>{Math.round(weather.wind?.speed)} Mph</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ForecastSection({ city }) {
  var [forecast, setForecast] = useState([]);

  useEffect(() => {
    async function getData() {
      var response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
      );
      var data = await response.json();
      console.log(data);
      getForecast(data.coord.lat, data.coord.lon);
    }
    getData();

    async function getForecast(lat, lon) {
      var response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
      );
      var data = await response.json();
      console.log(data);
      setForecast(data.daily);
    }
  }, [city]);

  return (
    <div className="forecast-container">
      <div className="days-container">
        {forecast.map((day) => {
          return (
            <div>
              <h1>{new Date(day.dt * 1000).toDateString()}</h1>
              <p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather?.[0].icon}@2x.png`}
                  alt="icons"
                  width={70}
                />
              </p>
              <h2>{day.weather?.[0].description}</h2>
              <h3>
                {Math.round(day.temp.day)}°F/{Math.round(day.temp.night)}°F
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
