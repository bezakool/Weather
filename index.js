function refreshWeather(response) {
  const temperatureElement = document.querySelector("#temperature");
  const temperature = response.data.temperature.current;
  const cityElement = document.querySelector("#city");
  const descriptionElement = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const windSpeedElement = document.querySelector("#wind-speed");
  const timeElement = document.querySelector("#time");
  const iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(new Date(response.data.time * 1000));
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" alt="${descriptionElement.innerHTML}" />`;

  // Call to get the weekly forecast
  getWeeklyForecast(response.data.city);
}

function getWeeklyForecast(city) {
  const apiKey = "a7ac27b6a56t38f80cb0022e4321ob1d"; // Your API key
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  axios.get(apiUrl).then(displayWeeklyForecast);
}

function displayWeeklyForecast(response) {
  const forecastElement = document.querySelector("#weekly-forecast");
  forecastElement.innerHTML = ""; // Clear previous forecast

  const forecastDays = response.data.daily;

  forecastDays.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("weather-forecast-day");

    const date = new Date(day.time * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const iconUrl = day.condition.icon_url; // Adjust based on your API
    const maxTemp = Math.round(day.temperature.maximum);
    const minTemp = Math.round(day.temperature.minimum);

    dayElement.innerHTML = `
            <div class="weather-forecast-date">${dayName}</div>
            <div class="weather-forecast-icon"><img src="${iconUrl}" alt="${day.condition.description}" /></div>
            <div class="weather-forecast-temperatures">
                <div class="weather-forecast-temperature"><strong>${maxTemp}º</strong></div>
                <div class="weather-forecast-temperature">${minTemp}º</div>
            </div>
        `;

    forecastElement.appendChild(dayElement);
  });
}

function formatDate(date) {
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hours = date.getHours();
  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  const apiKey = "a7ac27b6a56t38f80cb0022e4321ob1d"; // Your API key
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  axios.get(apiUrl).then(refreshWeather);
}

document
  .querySelector("#search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityInput = document.querySelector("#search-form-input");
    searchCity(cityInput.value);
    cityInput.value = ""; // Clear input field
  });

// Default city search
searchCity("New York"); // Replace with your default city
