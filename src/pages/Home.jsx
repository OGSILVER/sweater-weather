import { useEffect, useMemo } from "react";
import { useWeatherContext } from "../context/useWeatherContext";
import CachedCityCard from "../components/CachedCityCard";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import { fetchCurrentWeather, fetchForecast } from "../services/weatherApi";
import "../styles/Home.css";

export default function Home() {
	const { state, dispatch } = useWeatherContext();

	useEffect(() => {
		if (!state.chisinauLoaded && state.cities.length === 0) {
			const fetchChisinau = async () => {
				try {
					const chisinauLat = 47.1611;
					const chisinauLon = 28.6656;
					const [currentWeather, cityForecast] = await Promise.all([
						fetchCurrentWeather(chisinauLat, chisinauLon),
						fetchForecast(chisinauLat, chisinauLon),
					]);

					dispatch({
						type: "ADD_CITY",
						payload: {
							name: "chisinau",
							lat: chisinauLat,
							lon: chisinauLon,
							weather: currentWeather,
							forecast: cityForecast
						}
					});

					dispatch({ type: "MARK_CHISINAU_LOADED" });
				} catch (err) {
					console.error("Failed to load Chisinau weather:", err);
					dispatch({ type: "MARK_CHISINAU_LOADED" });
				}
			};

			fetchChisinau();
		}
	}, [state.chisinauLoaded, state.cities.length, dispatch]);

	const savedCities = useMemo(
		() =>
			state.cities.map((city) => (
				<CachedCityCard key={`${city.lat}-${city.lon}`} cityData={city} />
			)),
		[state.cities]
	);

	return (
		<div className="home-container">
			<h1>🌤️ Weather App</h1>
			
			<div className="search-section">
				<SearchBar />
				<WeatherCard />
			</div>

			{state.cities.length > 0 && (
				<div className="saved-cities-section">
					<h2>📍 Your Saved Cities</h2>
					<div className="cities-grid">
						{savedCities}
					</div>
				</div>
			)}
		</div>
	);
}
