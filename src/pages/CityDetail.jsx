import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { fetchCurrentWeather, fetchForecast } from "../services/weatherApi";
import { useWeatherContext } from "../context/useWeatherContext";
import { getWeatherEmoji } from "../utils/weatherEmoji";
import ForecastChart from "../components/ForecastChart";
import "../styles/CityDetail.css";

const createSlug = (city) => {
	return city
		.toLowerCase()
		.replace(/[^a-z0-9-\s]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

export default function CityDetail() {
	const { state, dispatch } = useWeatherContext();
	const [searchParams] = useSearchParams();
	const [weather, setWeather] = useState(null);
	const [forecast, setForecast] = useState(null);

	const slug = searchParams.get("name") ?? "";
	const lat = searchParams.get("lat");
	const lon = searchParams.get("lon");

	const cachedCity = useMemo(
		() => state.cities.find(c => createSlug(c.name) === slug),
		[state.cities, slug]
	);

	useEffect(() => {
		if (cachedCity) {
			dispatch({ type: "FETCH_SUCCESS", payload: { ...cachedCity } });
			return;
		}

		if (!lat || !lon) {
			dispatch({
				type: "FETCH_ERROR",
				payload: "Missing coordinates or city"
			});
			return;
		}

		let cancelled = false;

		const loadCity = async () => {
			dispatch({ type: "FETCH_START" });

			try {
				const [currentWeather, cityForecast] = await Promise.all([
					fetchCurrentWeather(lat, lon),
					fetchForecast(lat, lon),
				]);

				if (cancelled) return;

				setWeather(currentWeather);
				setForecast(cityForecast);

				dispatch({
					type: "ADD_CITY",
					payload: { name: slug, lat, lon, weather: currentWeather, forecast: cityForecast }
				});

				dispatch({
					type: "FETCH_SUCCESS",
					payload: { city: slug, lat, lon, weather: currentWeather, forecast: cityForecast }
				});
			} catch (err) {
				if (cancelled) return;
				dispatch({
					type: "FETCH_ERROR",
					payload: err.message
				});
			}
		};

		loadCity();

		return () => {
			cancelled = true;
		};
	}, [lat, lon, cachedCity, dispatch, slug]);

	const displayedWeather = cachedCity?.weather ?? weather;
	const displayedForecast = cachedCity?.forecast ?? forecast;
	const emoji = displayedWeather ? getWeatherEmoji(displayedWeather.weather[0].description) : "🌡️";

	return (
		<div className="city-detail-container">
			<div className="city-detail-header">
				<h1 className="city-detail-title">
					<span className="city-detail-emoji">{emoji}</span>
					{slug.replace(/-/g, ' ')}
				</h1>
				<div className="city-coordinates">
					📍 Lat: {lat}, Lon: {lon}
				</div>
			</div>

			{state.loading && <div className="loading">Loading weather data...</div>}
			{state.error && <div className="error">❌ Error: {state.error}</div>}

			{displayedWeather && (
				<div className="weather-section">
					<h2>Current Weather</h2>
					<div className="weather-grid">
						<div className="weather-stat">
							<div className="weather-stat-label">Temperature</div>
							<div className="weather-stat-value">{displayedWeather.main.temp}°C</div>
						</div>
						<div className="weather-stat">
							<div className="weather-stat-label">Feels Like</div>
							<div className="weather-stat-value">{displayedWeather.main.feels_like}°C</div>
						</div>
						<div className="weather-stat">
							<div className="weather-stat-label">Humidity</div>
							<div className="weather-stat-value">{displayedWeather.main.humidity}%</div>
						</div>
						<div className="weather-stat">
							<div className="weather-stat-label">Wind Speed</div>
							<div className="weather-stat-value">{displayedWeather.wind.speed} m/s</div>
						</div>
						<div className="weather-stat">
							<div className="weather-stat-label">Pressure</div>
							<div className="weather-stat-value">{displayedWeather.main.pressure} hPa</div>
						</div>
						<div className="weather-stat">
							<div className="weather-stat-label">Visibility</div>
							<div className="weather-stat-value">{(displayedWeather.visibility / 1000).toFixed(1)} km</div>
						</div>
					</div>
				</div>
			)}

			{displayedForecast && (
				<div className="forecast-section">
					<h2>5-Day Forecast</h2>
					<ForecastChart forecast={displayedForecast} />
				</div>
			)}
		</div>
	);
}
