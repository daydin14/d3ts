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
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Define the scales
    const xScale = d3
      .scaleLinear()
      .range([0, chartWidth])
      .domain([0, d3.max(data, (d) => d.value)!]);
    const yScale = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(data.map((d) => d.label))
      .padding(0.1);

    // Create the chart SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the bars to the chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.label)!)
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth());
    // .attr('style', 'color: white;');

    // Add the x-axis to the chart
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2r")));

    // Add the y-axis to the chart
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    return () => {
      // Clean up the chart when the component unmounts
      svg.selectAll("*").remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} />;
};

export default HorizontalBarChart;
