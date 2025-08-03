import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const ChartRenderer = ({ data }) => {
	const svgRef = useRef();
	const WIDTH = 800;
	const HEIGHT = 300;

	useEffect(() => {
		if (!data || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const isMultiSeries = Array.isArray(data[0][1]);

		const xDomain = d3.extent(data, (d) => d[0]);
		const xScale = d3
			.scaleLinear()
			.domain(xDomain)
			.range([50, WIDTH - 20]);

		let yValues;
		if (!isMultiSeries) {
			yValues = data.map((d) => d[1]).filter((v) => v !== null);
		} else {
			yValues = data.flatMap((d) => d[1]).filter((v) => v !== null);
		}

		const yDomain = [d3.min(yValues), d3.max(yValues)];
		const yScale = d3
			.scaleLinear()
			.domain(yDomain)
			.range([HEIGHT - 50, 20]);

		svg
			.append("g")
			.attr("transform", `translate(0,${HEIGHT - 50})`)
			.call(d3.axisBottom(xScale).ticks(6));

		svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(yScale).ticks(6));

		if (!isMultiSeries) {
			const filteredData = data.filter((d) => d[1] !== null);

			const line = d3
				.line()
				.x((d) => xScale(d[0]))
				.y((d) => yScale(d[1]))
				.defined((d) => d[1] !== null);

			svg.append("path").datum(filteredData).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2).attr("d", line);
		} else {
			const colors = ["blue", "green", "red"];

			for (let i = 0; i < 3; i++) {
				const seriesData = data.filter((d) => d[1][i] !== null).map((d) => [d[0], d[1][i]]);

				const line = d3
					.line()
					.x((d) => xScale(d[0]))
					.y((d) => yScale(d[1]))
					.defined((d) => d[1] !== null);

				svg.append("path").datum(seriesData).attr("fill", "none").attr("stroke", colors[i]).attr("stroke-width", 2).attr("d", line);
			}
		}
	}, [data]);

	return <svg ref={svgRef} width="100%" height="auto" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="chart-svg" />;
};

export default ChartRenderer;
