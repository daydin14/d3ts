// Dependencies
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  width: number;
  height: number;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  width,
  height,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Define the dimensions of the chart
    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Normalize Data
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d) => ({
      ...d,
      value: (d.value - min) / (max - min),
    }));

    // Reference the chart SVG Element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .nice()
      .range([0, chartWidth - 90]); // Try [0,max] ?
    const yScale = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(data.map((d) => d.label))
      .padding(0.3);
    const colorScale = d3
      .scaleOrdinal()
      .domain(normalizedData.map((d) => d.label))
      .range(d3.schemeTableau10);

    // Animation transition
    const duration = 500;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    // Axes
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2r")));
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Add the bars to the chart
    svg
      .selectAll(".bar")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.label)!)
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.label) as string);

    return () => {
      // Clean up the chart when the component unmounts
      svg.selectAll("*").remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} />;
};

export default HorizontalBarChart;
