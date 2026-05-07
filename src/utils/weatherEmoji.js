export const getWeatherEmoji = (description) => {
	if (!description) return "🌡️";
	
	const desc = description.toLowerCase();
	
	if (desc.includes("clear") || desc.includes("sunny")) return "☀️";
	if (desc.includes("cloud")) return "☁️";
	if (desc.includes("rain")) return "🌧️";
	if (desc.includes("thunderstorm") || desc.includes("storm")) return "⛈️";
	if (desc.includes("snow")) return "❄️";
	if (desc.includes("sleet")) return "🧊";
	if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
	if (desc.includes("wind")) return "💨";
	if (desc.includes("partly") || desc.includes("scattered")) return "🌤️";
	if (desc.includes("drizzle")) return "🌦️";
	if (desc.includes("overcast")) return "☁️";
	
	return "🌡️";
};
