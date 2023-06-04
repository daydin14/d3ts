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

    // Normalize Data
    const sum = d3.sum(data, (d) => d.value);
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d, i) => ({
      ...d,
      value: max <= min ? (d.value - min) / 1 : (d.value - min) / (max - min),
      index: i,
    }));

    // Reference the chart SVG element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .nice()
      .range([0, chartWidth]);
    const yScale = d3.scaleBand().range([0, chartHeight]).padding(0.1);
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(d3.schemeTableau10);

    // Animation transition
    const duration = 500;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    // Chart Title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", (chartWidth + margin.left) / 2)
      .attr("y", -margin.top / 2)
      .text("Single-Stack Bar Chart Title")
      .attr("fill", "white");

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10, `${d3.format(".0%")}`);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${margin.left}, ${chartHeight + margin.top})`
      )
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

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
      .data(normalizedData)
      .join("rect")
      .attr("class", (d: any) => `bar rect-${d.index}`)
      .attr("x", (_, i) => x[i])
      .attr("transform", `translate(${margin.left}, ${chartHeight / 2})`)
      .attr("height", chartHeight / 5)
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .attr("width", (_, i) => w[i])
      .attr("fill", (d: any) => colorScale(d.category) as string);

    // Legend
    const highlight = (_event: any, d: any) => {
      d3.select(chartRef.current).selectAll(".bar").style("opacity", 0.1);
      d3.select(chartRef.current)
        .select(`.rect-${d.index}`)
        .style("opacity", 1);
    };
    const noHightlight = () => {
      d3.selectAll(".bar").style("opacity", 1);
    };
    var size = 20;
    const legend = d3
      .select(legendRef.current)
      .append("g")
      .attr("class", "legend");
    legend
      .append("g")
      .attr("class", "legend-squares")
      .selectAll("legend-squares")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("x", size + 25)
      .attr("y", (_d, i) => margin.top + margin.bottom + i * (size + 5))
      .attr("width", size)
      .attr("height", size)
      .style("fill", (d: any) => colorScale(d.category) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHightlight);

    legend
      .append("g")
      .attr("class", "legend-text")
      .selectAll("legend-text")
      .data(normalizedData)
      .enter()
      .append("text")
      .attr("x", size + 50)
      .attr(
        "y",
        (_d, i) => margin.top + margin.bottom + i * (size + 5) + size / 2
      )
      .text((d: any) => d.category)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("fill", (d) => colorScale(d.category) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHightlight);
  }, [data, width, height]);

  return (
    <>
      <div id="single-stack-bar-chart">
        <svg ref={chartRef} />
        <svg ref={legendRef} width={250} height={height / 2} />
      </div>
    </>
  );
};

export default SingleStack;
