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
  // return `${day} ${hour}:${min}`;
  return { DD: day, HH: hour, mm: min };
}

// This is a function responsible for updating the current weather info and icon
function updateOverview(response) {
  // Assign the Celsius temperature values to the global variables
  cTempCurrent = response.data.main.temp;
  cTempMax = response.data.main.temp_max;
  cTempMin = response.data.main.temp_min;

  // console.log(response.data);
  const city = document.getElementById("city");
  city.innerText = response.data.name;
  const time = document.getElementById("time");
  time.innerText =
    formatDate(response.data.dt).DD +
    " " +
    formatDate(response.data.dt).HH +
    ":" +
    formatDate(response.data.dt).mm;
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

  // Store an object of coordinates in a variable
  let coords = response.data.coord;
  getForecast(coords);
}

// This funtion calls the realtime API from OpenWeather
function getCurrentWeather(event) {
  event.preventDefault();
  const city = document.getElementById("city-input").value;

  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios
    .get(apiUrl)
    .then(updateOverview)
    .catch(function (error) {
      console.log(error);
    });
}

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", getCurrentWeather);

// This function calls the current weather API from OpenWeather
function getWeatherData(event) {
  event.preventDefault();
  const userCity = document.getElementById("city-input").value;

  const apiKey = "caa883a4a60d93878755b08a933f74ea";
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
  const apiKey = "5aac6d0188c6f17d6d2bbe6591b6fef0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(updateOverview)
    .catch((error) => console.log(error));
}

const crosshairs = document.getElementById("crosshairs");
crosshairs.addEventListener("click", getPosition);

// This function converts Celsius to Fahrenheit and modifies the styling of scales
function celToFahr(event) {
  event.preventDefault();
  const currentTemp = document.getElementById("current-temp");
  currentTemp.innerText = Math.round(cTempCurrent * 1.8 + 32);
  const tempMax = document.getElementById("current-temp-max");
  tempMax.innerHTML = Math.round(cTempMax * 1.8 + 32) + "°&nbsp";
  const tempMin = document.getElementById("current-temp-min");
  tempMin.innerHTML = Math.round(cTempMin * 1.8 + 32) + "°";
  // After converting cel to fahr
  degreeCel.classList.remove("inactive"); // Remove the class "inactive" from cel
  degreeFahr.classList.add("inactive"); // Add the class "inactive" to cel
}

// This function converts to Fahrenheit to Celsius and modifies the styling of scales
function fahrToCel(event) {
  event.preventDefault();
  const currentTemp = document.getElementById("current-temp");
  currentTemp.innerText = Math.round(cTempCurrent);
  const tempMax = document.getElementById("current-temp-max");
  tempMax.innerHTML = Math.round(cTempMax) + "°&nbsp";
  const tempMin = document.getElementById("current-temp-min");
  tempMin.innerHTML = Math.round(cTempMin) + "°";

  degreeFahr.classList.remove("inactive");
  degreeCel.classList.add("inactive");
}

// Global variables storing the current Celsius temperatures
let cTempCurrent;
let cTempMin;
let cTempMax;

let degreeFahr = document.getElementById("degree-fahrenheit");
degreeFahr.addEventListener("click", celToFahr);

let degreeCel = document.getElementById("degree-celsius");
degreeCel.addEventListener("click", fahrToCel);

// This function updates the weather forecast and repeats a block of code five times
function updateForecast(response) {
  const dailyForecast = response.data.daily;
  let forecastHTML = `<div class="row justify-content-center">`;

  dailyForecast.forEach((element, index) => {
    if (0 < index && index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 forecast">
          <div>${formatDate(element.dt).DD.slice(0, 3)}</div>
          <img
                class="weather-icon"
                src= ${weatherIconUrls[element.weather[0].icon]}
                alt="sunny"
                width="70"
          />
          <div>${Math.round(
            element.temp.max
          )}°&nbsp;&nbsp;<span class="temp-min">${Math.round(
          element.temp.min
        )}</span></div>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + "</div>";

  const forecast = document.getElementById("weather-forecast");
  forecast.innerHTML = forecastHTML;
}

// This funtion calls the One Call API from OpenWeather
function getForecast(coordinates) {
  console.log(coordinates);
  const apiKey = "caa883a4a60d93878755b08a933f74ea";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios
    .get(apiUrl)
    .then(updateForecast)
    .catch((error) => console.log(error));
}

// This function calls the current weather API for Shanghai and initializes the page
function initialization() {
  const apiKey = "caa883a4a60d93878755b08a933f74ea";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=shanghai&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(updateOverview)
    .catch((error) => console.log(error));
}

initialization();
