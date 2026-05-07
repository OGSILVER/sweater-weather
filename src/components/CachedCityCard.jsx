import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useWeatherContext } from "../context/useWeatherContext";
import { getWeatherEmoji } from "../utils/weatherEmoji";
import "../styles/CachedCityCard.css";

const createSlug = (city) => {
    return city
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export default function CachedCityCard({ cityData }) {
    const navigate = useNavigate();
    const { dispatch } = useWeatherContext();
    const { name, lat, lon, weather, forecast } = cityData;

    if (!weather) {
        return null;
    }

    const slug = useMemo(() => createSlug(name), [name]);
    const emoji = getWeatherEmoji(weather.weather[0].description);

    const handleRemove = () => {
        dispatch({
            type: "DELETE_CITY",
            payload: `${lat}-${lon}`
        });
    };

    return (
        <div className="city-card">
            <div className="city-card-header">
                <h3 className="city-name">
                    <span className="city-emoji">{emoji}</span>
                    {name}
                </h3>
            </div>

            <div className="city-details">
                <div className="city-detail-row">
                    <div className="city-detail-label">Temperature</div>
                    <div className="city-detail-value">{weather.main.temp}°C</div>
                </div>
                <div className="city-detail-row">
                    <div className="city-detail-label">Feels Like</div>
                    <div className="city-detail-value">{weather.main.feels_like}°C</div>
                </div>
                <div className="city-detail-row">
                    <div className="city-detail-label">Humidity</div>
                    <div className="city-detail-value">{weather.main.humidity}%</div>
                </div>
                <div className="city-detail-row">
                    <div className="city-detail-label">Wind Speed</div>
                    <div className="city-detail-value">{weather.wind.speed} m/s</div>
                </div>
            </div>

            <div className="city-condition">
                {weather.weather[0].description}
            </div>

            <div className="city-card-buttons">
                <button
                    className="view-button"
                    onClick={() => {
                        navigate(`/city?name=${slug}&lat=${lat}&lon=${lon}`);
                    }}
                >
                    View Forecast
                </button>
                <button className="remove-button" onClick={handleRemove}>
                    Remove
                </button>
            </div>
        </div>
    );
}
