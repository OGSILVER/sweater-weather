import { useWeatherContext } from "../context/useWeatherContext";
import { useNavigate } from "react-router";
import { getWeatherEmoji } from "../utils/weatherEmoji";
import "../styles/WeatherCard.css";

const createSlug = (city) => {
    return city
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export default function WeatherCard() {
    const { state } = useWeatherContext();
    const { weather, city, lat, lon } = state;
    const navigate = useNavigate();

    if (!weather || !city || !lat || !lon) {
        return null;
    }

    const slug = createSlug(city);
    const emoji = getWeatherEmoji(weather.weather[0].description);

    return (
        <div className="weather-card">
            <div className="weather-card-header">
                <h2 className="weather-card-title">{city}</h2>
                <span className="weather-emoji">{emoji}</span>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <div className="detail-label">Temperature</div>
                    <div className="detail-value">{weather.main.temp}°C</div>
                </div>
                <div className="detail-item">
                    <div className="detail-label">Feels Like</div>
                    <div className="detail-value">{weather.main.feels_like}°C</div>
                </div>
                <div className="detail-item">
                    <div className="detail-label">Humidity</div>
                    <div className="detail-value">{weather.main.humidity}%</div>
                </div>
                <div className="detail-item">
                    <div className="detail-label">Wind Speed</div>
                    <div className="detail-value">{weather.wind.speed} m/s</div>
                </div>
            </div>

            <div className="weather-condition">Condition: {weather.weather[0].description}</div>

            <button
                className="view-forecast-button"
                onClick={() => {
                    navigate(`/city?name=${slug}&lat=${lat}&lon=${lon}`);
                }}
            >
                View Forecast
            </button>
        </div>
    );
}
