const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5"
const DAILY_WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast"
const CITY_URL = "https://api.openweathermap.org/geo/1.0"

export async function fetchCityCoords(city) {
    const res = await fetch(`${CITY_URL}/direct?q=${city}&limit=5&appid=${API_KEY}`)

    if (!res.ok) {
        throw new Error("Failed to fetch city coordinates");
    }
    
    const data = await res.json();
    if (data.length === 0) {
        throw new Error("City not found");
    }

    return data;
}


export async function fetchCurrentWeather(lat, lon) {
    const res = await fetch(`${WEATHER_URL}/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`)

    if (!res.ok) {
        throw new Error("Failed to fetch current weather data");
    }

    return res.json();
}


export async function fetchForecast(lat, lon) {
    const res = await fetch(`${DAILY_WEATHER_URL}?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`)

    if (!res.ok) {
        throw new Error("Failed to fetch forecast data");
    }   

    return res.json();
}