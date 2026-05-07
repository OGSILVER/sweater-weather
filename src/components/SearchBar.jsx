import { useRef, useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { useWeatherContext } from "../context/useWeatherContext";
import "../styles/SearchBar.css";

export default function SearchBar() {
	const { state } = useWeatherContext();
	const { searchCity, getWeatherByCoords } = useWeather();
	const [value, setValue] = useState("");
	const [activeIndex, setActiveIndex] = useState(-1);
	const timerRef = useRef(null);

	const handleInputChange = (e) => {
		const val = e.target.value;
		setValue(val);
		setActiveIndex(-1);

		clearTimeout(timerRef.current);

		if (val.trim()) {
			timerRef.current = setTimeout(() => {
				searchCity(val);
			}, 500);
		}
	};

	const handleSelectOption = (option) => {
		getWeatherByCoords(option);
		setValue("");
		setActiveIndex(-1);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (state.geoOptions.length > 0) {
				handleSelectOption(state.geoOptions[0]);
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((prev) =>
				prev < state.geoOptions.length - 1 ? prev + 1 : prev
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
		}
	};

	const handleOptionClick = (option) => {
		handleSelectOption(option);
	};

	return (
		<div className="search-bar">
			<div className="search-input-wrapper">
				<input
					type="text"
					className="search-input"
					placeholder="Search for a city..."
					value={value}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				/>
			</div>

			{state.geoOptions.length > 0 && value.trim() && (
				<div className="dropdown">
					{state.geoOptions.map((option, index) => (
						<div
							key={index}
							className={`dropdown-option ${
								index === activeIndex ? "active" : ""
							}`}
							onClick={() => handleOptionClick(option)}
						>
							<div className="dropdown-option-text">
								{option.name}
								{option.state && `, ${option.state}`}
								{option.country && `, ${option.country}`}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}