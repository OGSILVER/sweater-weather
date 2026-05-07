// hooks/useWeather.js
import { useWeatherContext } from "../context/useWeatherContext";
import { fetchCityCoords, fetchCurrentWeather, fetchForecast } from "../services/weatherApi";

export const useWeather = () => {
  const { dispatch } = useWeatherContext();

  const searchCity = async (city) => {
    dispatch({ type: "FETCH_START" });
    try {
      const results = await fetchCityCoords(city);
      
      dispatch({ type: "SET_GEO_OPTIONS", payload: results });
      
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };

  const getWeatherByCoords = async ({ lat, lon, name, country }) => {
    dispatch({ type: "FETCH_START" });
    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon)
      ]);
      const cityName = `${name}, ${country}`;
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { weather, forecast, lat, lon, city: cityName }
      });
      dispatch({
        type: "ADD_CITY",
        payload: { name: cityName, lat, lon, weather, forecast }
      });
      dispatch({ type: "CLEAR_GEO_OPTIONS" });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };


  return { searchCity, getWeatherByCoords }; // 👈 export both from the hook
};