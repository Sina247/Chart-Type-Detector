import "./App.css";
import data from "./data.json";
import React, { useState, useEffect } from "react";
import ChartRenderer from "./components/ChartRenderer";

function App() {
	const [charts, setCharts] = useState([]);

	useEffect(() => {
		setCharts(data);
	}, []);

	return (
		<div className="app-container">
			{charts.map((chart, idx) => (
				<div key={idx} className="chart-wrapper">
					<h2 className="chart-title">{chart.title}</h2>
					<ChartRenderer data={chart.data} />
				</div>
			))}
		</div>
	);
}

export default App;
