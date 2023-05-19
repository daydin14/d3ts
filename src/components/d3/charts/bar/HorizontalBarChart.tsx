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
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
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
      .attr("transform", `translate(${margin.left + 50},${margin.top})`);

    // Define the scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .nice()
      .range([0, chartWidth]);
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
    svg.append("g").attr("class", "axes");

    svg
      .select(".axes")
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".0%")))
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end");
    svg
      .select(".axes")
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

    // Axes Titles
    svg
      .select(".axes")
      .append("text")
      .attr("class", "x-title")
      .attr("text-anchor", "end")
      .attr("x", (width - margin.left) / 2)
      .attr("y", chartHeight + 50)
      .text("X-Axis Title")
      .attr("fill", "crimson");
    svg
      .select(".axes")
      .append("text")
      .attr("class", "y-title")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left - 20)
      .attr("x", -(chartWidth - margin.bottom) / 2)
      .text("Y Axis Ttile")
      .attr("fill", "crimson");

    // Add the bars to the chart
    svg
      .append("g")
      .attr("class", "bars")
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

    // Legend
    svg.append("g").attr("class", "legend");
    var size = 30;
    svg
      .select(".legend")
      .append("g")
      .attr("class", "legend-squares")
      .selectAll("legend-squares")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("x", chartWidth - margin.right - margin.left)
      .attr("y", (_d, i) => 10 + i * (size + 5))
      .attr("width", size)
      .attr("height", size)
      .attr("fill", (d) => colorScale(d.label) as string);
    svg
      .select(".legend")
      .append("g")
      .attr("class", "legend-text")
      .selectAll("legend-text")
      .data(normalizedData)
      .enter()
      .append("text")
      .attr("x", chartWidth - margin.right)
      .attr("y", (_d, i) => 10 + i * (size + 5) + size / 2)
      .text((d: any) => d.label)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .attr("fill", (d) => colorScale(d.label) as string);

    return () => {
      // Clean up the chart when the component unmounts
      svg.selectAll("*").remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} />;
};

export default HorizontalBarChart;
