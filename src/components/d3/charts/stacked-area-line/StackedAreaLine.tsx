// Styling
import "../../styles.css";

// Dependencies
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface StackedAreaLineProps {
  data: {
    year: number;
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
  }[];
  width: number;
  height: number;
}

const StackedAreaLine: React.FC<StackedAreaLineProps> = ({
  data,
  width,
  height,
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    //////////
    // GENERAL //
    //////////

    // Define the dimensions of the chart
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Reference the Chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Reference the Line Plot Group for Chart
    const lineGroup = svg.append("g").attr("class", "line-group");

    // Generating Keys from Mock Data
    const keys = Object.keys(data[0]).filter((key) => key !== "year");

    // Stack the data
    const stackedData = d3
      .stack()
      .keys(keys)
      .value((d: any, key: string) => d[key])(data);

    // Calculate the average counts for each year
    const avgCounts = data.map((d) => ({
      year: d.year,
      avgCount: (d.a + d.b + d.c + d.e + d.f) / 6,
    }));

    //////////
    // STACKED-AREA + LINE PLOT + COLOR SCALES //
    //////////

    // Stacked Area Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(stackedData, (d) => d3.max(d, (dd) => dd[1])) as number,
      ])
      .range([chartHeight, 0]);

    // Line Plot Scales
    const xScaleLine = d3
      .scaleLinear()
      .domain(d3.extent(avgCounts, (d) => d.year) as [number, number])
      .range([0, chartWidth]);

    const yScaleLine = d3
      .scaleLinear()
      .domain([0, d3.max(avgCounts, (d) => d.avgCount) as number])
      .range([chartHeight, 0]);

    // Color Scale
    const colorScale = d3.scaleOrdinal().domain(keys).range(d3.schemeTableau10);

    //////////
    // AXES + AXES TITLES //
    //////////

    // Group Axes together
    svg.append("g").attr("class", "stacked-area-axes");

    const xAxis = svg
      .select(".stacked-area-axes")
      .append("g")
      .attr("class", "stacked-area-x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(10));

    svg
      .select(".stacked-area-axes")
      .append("g")
      .attr("class", "stacked-area-y-axis")
      .call(d3.axisLeft(yScale).ticks(10));

    // Axes Titles
    svg.append("g").attr("class", "stacked-area-axes-titles");

    // Add X axis label
    svg
      .select(".stacked-area-axes-titles")
      .append("text")
      .attr("class", "stacked-area-x-axis-title")
      .attr("text-anchor", "end")
      .attr("x", chartWidth)
      .attr("y", chartHeight + margin.bottom)
      .text("Years")
      .style("fill", "steelblue");

    // Add Y axis label
    svg
      .select(".stacked-area-axes-titles")
      .append("text")
      .attr("class", "stacked-area-y-axis-title")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20)
      .text("Counts")
      .attr("text-anchor", "start")
      .style("fill", "steelblue");
  }, [data, width, height]);
  return (
    <>
      <div id="stacked-area-line-chart">
        <svg ref={chartRef} />
      </div>
    </>
  );
};

export default StackedAreaLine;
