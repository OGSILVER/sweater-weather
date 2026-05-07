import { useReducer } from "react";
import { WeatherContext } from "./WeatherContext";

const initialState = {
    weather: null,
    forecast: null,
    lat: null,
    lon: null,
    city: null,
    loading: false,
    error: null,
    geoOptions: [],
    cities: [],
    chisinauLoaded: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_GEO_OPTIONS":
            return {
                ...state,
                geoOptions: action.payload
            };
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                weather: action.payload.weather,
                forecast: action.payload.forecast,
                lat: action.payload.lat,
                lon: action.payload.lon,
                city: action.payload.city,
                loading: false,
                error: null
            };
        case "FETCH_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case "ADD_CITY": {
            const existingIndex = state.cities.findIndex(c => c.name === action.payload.name);
            if (existingIndex !== -1) {
                const updated = [...state.cities];
                updated[existingIndex] = action.payload;
                return { ...state, cities: updated };
            }
            return {
                ...state,
                cities: [...state.cities, action.payload]
            };
        }
        case "CLEAR_GEO_OPTIONS":
            return {
                ...state,
                geoOptions: []
            };
        case "DELETE_CITY":
            return {
                ...state,
                cities: state.cities.filter(c => `${c.lat}-${c.lon}` !== action.payload)
            };
        case "MARK_CHISINAU_LOADED":
            return {
                ...state,
                chisinauLoaded: true
            };
        default:
            return state;
    }
}


export default function WeatherProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <WeatherContext value={{ state, dispatch }}>
            {children}
        </WeatherContext>
    );
}