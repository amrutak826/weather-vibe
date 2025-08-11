const API_KEY = '3cfec33bea10f17a36f19cdc8212a438'; // <-- Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const locateBtn = document.getElementById('locate-btn');

const locationName = document.getElementById('location-name');
const weatherIcon = document.getElementById('weather-icon');
const tempEl = document.getElementById('temp');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const feelsLikeEl = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast');

async function getWeatherByCity(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    displayWeather(data);
    getForecast(data.coord.lat, data.coord.lon);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const data = await res.json();
    displayWeather(data);
    getForecast(lat, lon);
  } catch (err) {
    alert('Error fetching weather data');
  }
}

async function getForecast(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`);
    const data = await res.json();
    displayForecast(data.daily);
  } catch (err) {
    console.error('Forecast error:', err);
  }
}

function displayWeather(data) {
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherIcon.alt = data.weather[0].description;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;

  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
  pressureEl.textContent = data.main.pressure;
  visibilityEl.textContent = (data.visibility / 1000).toFixed(1);
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

  changeBackground(data.weather[0].main);
}

function displayForecast(daily) {
  forecastContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const day = daily[i];
    const date = new Date(day.dt * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dayName = date.toLocaleDateString(undefined, options);
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const forecastDiv = document.createElement('div');
    forecastDiv.className = 'forecast-item';
    forecastDiv.innerHTML = `
      <h4>${dayName}</h4>
      <img src="${iconUrl}" alt="${day.weather[0].description}" />
      <p>${Math.round(day.temp.day)}°C</p>
    `;
    forecastContainer.appendChild(forecastDiv);
  }
}

function changeBackground(weatherMain) {
  const body = document.body;
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      body.style.background = 'linear-gradient(to right, #f7b733, #e1eec3)';
      break;
    case 'clouds':
      body.style.background = 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      break;
    case 'rain':
      body.style.background = 'linear-gradient(to right, #537895, #09203f)';
      break;
    case 'snow':
      body.style.background = 'linear-gradient(to right, #83a4d4, #b6fbff)';
      break;
    case 'mist':
    case 'haze':
    case 'fog':
      body.style.background = 'linear-gradient(to right, #606c88, #3f4c6b)';
      break;
    default:
      body.style.background = 'linear-gradient(to right, #6dd5ed, #2193b0)';
  }
}

function handleSearch() {
  const city = searchInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
}

function handleLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => alert('Could not get your location')
    );
  } else {
    alert('Geolocation not supported');
  }
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') handleSearch();
});
locateBtn.addEventListener('click', handleLocation);

// Load default city
getWeatherByCity('London');
