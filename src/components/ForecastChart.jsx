import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export default function ForecastChart({ forecast }) {
	if (!forecast || !forecast.list || forecast.list.length === 0) {
		return <div>No forecast data available</div>;
	}

	const chartData = forecast.list
		.filter((_, index) => index % 8 === 0)
		.map((item) => ({
			time: new Date(item.dt_txt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
			}),
			temp: Math.round(item.main.temp),
			feelsLike: Math.round(item.main.feels_like),
			humidity: item.main.humidity,
			dt_txt: item.dt_txt,
		}));

	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={chartData}
				margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
				<XAxis
					dataKey="time"
					stroke="#666"
					style={{ fontSize: "0.85rem" }}
				/>
				<YAxis
					stroke="#666"
					label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						border: "2px solid #0080ff",
						borderRadius: "8px",
						padding: "10px",
					}}
					labelStyle={{ color: "#333" }}
					formatter={(value) => `${value}°C`}
				/>
				<Legend
					wrapperStyle={{ paddingTop: "20px" }}
					iconType="line"
				/>
				<Line
					type="monotone"
					dataKey="temp"
					stroke="#0080ff"
					strokeWidth={3}
					dot={{ fill: "#0080ff", r: 5 }}
					activeDot={{ r: 7 }}
					name="Temperature"
					isAnimationActive={true}
				/>
				<Line
					type="monotone"
					dataKey="feelsLike"
					stroke="#00d4ff"
					strokeWidth={2}
					dot={{ fill: "#00d4ff", r: 4 }}
					strokeDasharray="5 5"
					name="Feels Like"
					isAnimationActive={true}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
