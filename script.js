// Recap
// Display the current date and time using JS

function formatTime(date) {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = weekDays[now.getDay()];
  const hour = now.getHours();
  const min = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

  return `${day} ${hour}:${min}`;
}

const now = new Date();
const localTime = document.getElementById("local-time");
localTime.innerHTML = formatTime(now);

// Feature 1
// When users search for a city, display the city name and the current temperature

// A callback function responsible for updating the city name and temperature on the page
function update(response) {
  const cityData = response.data.name;
  const tempData = Math.round(response.data.main.temp);
  const maxTempData = Math.round(response.data.main.temp_max);
  const minTempData = Math.round(response.data.main.temp_min);
  const descrData = response.data.weather[0].main;
  const humidityData = response.data.main.humidity;
  const windSpeedData = Math.round(response.data.wind.speed);

  const city = document.querySelector("h1");
  const temp = document.getElementById("city-temperature");
  const weatherReport = document.getElementById("weather-report");
  const weatherParams = document.getElementById("weather-params");

  city.innerHTML = cityData;
  temp.innerHTML = tempData;
  weatherReport.innerHTML =
    descrData + "<br />" + maxTempData + "°&nbsp;&nbsp" + minTempData + "°";
  weatherParams.innerHTML =
    "Humidity: " +
    humidityData +
    "%" +
    "<br />" +
    "Wind: " +
    windSpeedData +
    " km/h";
}

// A callback function that fetches weather data based on the city name
function getWeatherData(event) {
  event.preventDefault();
  const userCity = document.getElementById("user-city").value;

  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const unit = "metric";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiKey}&units=${unit}`;
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

// A callback function that obtains the current position
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

  axios.get(apiUrl).then(update);
}

const crosshairs = document.getElementById("clickable-crosshairs");
crosshairs.addEventListener("click", getPosition);
