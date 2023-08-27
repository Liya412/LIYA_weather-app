// This function converts a timestamp to time
function formatDate(timestamp) {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(timestamp * 1000);
  // Multiply the timestamp by 1000 so that the argument is in milliseconds
  const day = weekDays[date.getDay()];
  const hour = date.getHours();
  const min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return `${day} ${hour}:${min}`;
}

// This is a callback function responsible for updating the current weather info and icon
function updateOverview(response) {
  cTempCurrent = response.data.main.temp;
  cTempMax = response.data.main.temp_max;
  cTempMin = response.data.main.temp_min;

  // console.log(response.data);
  const city = document.getElementById("city");
  city.innerText = response.data.name;
  const time = document.getElementById("time");
  time.innerText = formatDate(response.data.dt);

  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.setAttribute(
    "src",
    weatherIconUrls[response.data.weather[0].icon]
  );
  const currentTemp = document.getElementById("current-temp");
  currentTemp.innerText = Math.round(response.data.main.temp);
  const descr = document.getElementById("description");
  descr.innerText = response.data.weather[0].description;
  const tempMax = document.getElementById("current-temp-max");
  tempMax.innerHTML = Math.round(response.data.main.temp_max) + "°&nbsp";
  const tempMin = document.getElementById("current-temp-min");
  tempMin.innerHTML = Math.round(response.data.main.temp_min) + "°";

  const pressure = document.getElementById("pressure");
  pressure.innerHTML = Math.round(response.data.main.pressure);
  const humidity = document.getElementById("humidity");
  humidity.innerHTML = response.data.main.humidity;
  const windSpeed = document.getElementById("wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
}

// This is a funtion calling the realtime API from weatherapi.com
function weatherApiCall(city) {
  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const unit = "metric";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  console.log(apiUrl);
  axios
    .get(apiUrl)
    .then(updateOverview)
    .catch(function (error) {
      console.log(error);
    });
}

weatherApiCall("tokyo");

// This is a callback function calling the weather API from OpenWeather
function getWeatherData(event) {
  event.preventDefault();
  const userCity = document.getElementById("city-input").value;

  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const unit = "metric";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiKey}&units=${unit}`;

  // console.log(apiUrl);
  axios
    .get(apiUrl)
    .then(update)
    .catch(function (error) {
      console.log(error);
    });
}

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", getWeatherData);

// Feature 3
// Add a current location button. Click it to get users' location and the temperature in it

// This is a callback function that obtains the current position
function getPosition(event) {
  navigator.geolocation.getCurrentPosition(success);
}

// A callback function that fetches weather data based on latitude and longitude
function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const unit = "metric";
  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios
    .get(apiUrl)
    .then(updateOverview)
    .catch((error) => console.log(error));
}

const crosshairs = document.getElementById("crosshairs");
crosshairs.addEventListener("click", getPosition);

function celToFahr(event) {
  event.preventDefault();
  const currentTemp = document.getElementById("current-temp");
  currentTemp.innerText = Math.round(cTempCurrent * 1.8 + 32);
  const tempMax = document.getElementById("current-temp-max");
  tempMax.innerHTML = Math.round(cTempMax * 1.8 + 32) + "°&nbsp";
  const tempMin = document.getElementById("current-temp-min");
  tempMin.innerHTML = Math.round(cTempMin * 1.8 + 32) + "°";
}

function fahrToCel(event) {
  event.preventDefault();
  const currentTemp = document.getElementById("current-temp");
  currentTemp.innerText = Math.round(cTempCurrent);
  const tempMax = document.getElementById("current-temp-max");
  tempMax.innerHTML = Math.round(cTempMax) + "°&nbsp";
  const tempMin = document.getElementById("current-temp-min");
  tempMin.innerHTML = Math.round(cTempMin) + "°";
}

// Global variables storing the current Celsius temperatures
var cTempCurrent;
var cTempMin;
var cTempMax;

const fUnit = document.getElementById("degree-fahrenheit");
fUnit.addEventListener("click", celToFahr);

const cUnit = document.getElementById("degree-celsius");
cUnit.addEventListener("click", fahrToCel);
