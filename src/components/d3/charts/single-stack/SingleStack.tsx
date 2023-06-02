// Dependencies
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface SingleStackProps {
  data: { category: string; value: number }[];
  width: number;
  height: number;
}

const SingleStack: React.FC<SingleStackProps> = ({ data, width, height }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Define the dimensions of the chart
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - (margin.left + margin.right);
    const chartHeight = height - margin.top - margin.bottom;

    const sum = d3.sum(data, (d) => d.value);
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d) => ({
      ...d,
      value: max <= min ? (d.value - min) / 1 : (d.value - min) / (max - min),
    }));

    // Reference the chart SVG element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .nice()
      .range([0, chartWidth]);

    const yScale = d3
      .scaleBand()
      .range([0, chartHeight - 50])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(d3.schemeTableau10);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10, `${d3.format(".0%")}`);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(5, ${height - margin.top})`)
      .call(xAxis);
    //.call((g) => g.select(".domain").remove());     // This removes the x-axis line

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(5, ${margin.top + margin.bottom + 30})`)
      .call(yAxis);
    //.call((g) => g.select(".domain").remove());     // This removes the y-axis line

    // Animation transition
    const duration = 500;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    // Dynamic sizing of each bar in single-stack
    let x: number[] = [0];
    let w: number[] = [(data[0].value / sum) * chartWidth];

    data.forEach((d, i) => {
      if (i != 0) {
        w[i] = (d.value / sum) * chartWidth;
        x[i] = x[i - 1] + w[i - 1];
      }
    });

    // Draw Bars
    svg
      .append("g")
      .attr("class", "bars")
      .selectAll("g")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x[i])
      .attr("transform", `translate(5, ${height / 2})`)
      .attr("height", height / 5)
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .attr("width", (_, i) => w[i])
      .attr("fill", (d: any) => colorScale(d.category) as string);

    // Legend
    var size = 10;
    const legend = d3.select(legendRef.current);

    legend
      .append("g")
      .attr("class", "legend-squares")
      .selectAll("legend-squares")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("x", 75)
      .attr("y", (_d, i) => 50 + i * (size + 5))
      .attr("width", size)
      .attr("height", size)
      .style("fill", (d: any) => colorScale(d.category) as string);

    legend
      .append("g")
      .attr("class", "legend-text")
      .selectAll("legend-text")
      .data(normalizedData)
      .enter()
      .append("text")
      .attr("x", 100)
      .attr("y", (_d, i) => 50 + i * (size + 5) + size / 2)
      .style("fill", (d: any) => colorScale(d.category) as string)
      .text((d: any) => d.category)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }, [data, width, height]);
  return (
    <>
      <svg ref={chartRef} />
      <svg ref={legendRef} width={200} height={500} />
    </>
  );
};

export default SingleStack;
