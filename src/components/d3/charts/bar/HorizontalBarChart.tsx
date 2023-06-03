// Dependencies
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  width: number;
  height: number;
  xtitle: string;
  ytitle: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  width,
  height,
  xtitle,
  ytitle,
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Define the dimensions of the chart
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Normalize Data
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d, i) => ({
      ...d,
      value: (d.value - min) / (max - min),
      index: i,
    }));

    // Reference the chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "chart")
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
      .attr("transform", `translate(${margin.left},${chartHeight})`)
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
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end");

    // Axes Titles
    svg
      .select(".axes")
      .append("text")
      .attr("class", "x-title")
      .attr("text-anchor", "end")
      .attr("x", (chartWidth + margin.left) / 2)
      .attr("y", chartHeight + margin.top)
      .text(xtitle)
      .attr("fill", "white");
    svg
      .select(".axes")
      .append("text")
      .attr("class", "y-title")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -((margin.left + margin.right) / 2))
      .attr("x", -(chartWidth - margin.bottom) / 2)
      .text(ytitle)
      .attr("fill", "white");

    // Add the bars to the chart
    svg
      .append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("class", (d: any) => `bar rect-${d.index}`)
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.label)!)
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.label) as string);

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

    const barLegend = d3
      .select(legendRef.current)
      .append("g")
      .attr("class", "legend");
    var size = 20;
    barLegend
      .select(".legend")
      .append("g")
      .attr("class", "legend-squares")
      .selectAll("legend-squares")
      .data(normalizedData)
      .enter()
      .append("rect")
      .attr("x", 75)
      .attr("y", (_d, i) => 10 + i * (size + 5))
      .attr("width", size)
      .attr("height", size)
      .attr("fill", (d) => colorScale(d.label) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHightlight);
    barLegend
      .select(".legend")
      .append("g")
      .attr("class", "legend-text")
      .selectAll("legend-text")
      .data(normalizedData)
      .enter()
      .append("text")
      .attr("x", 100)
      .attr("y", (_d, i) => 10 + i * (size + 5) + size / 2)
      .text((d: any) => d.label)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .attr("fill", (d) => colorScale(d.label) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHightlight);

    return () => {
      // Clean up the chart when the component unmounts
      svg.selectAll("*").remove();
    };
  }, [data, width, height]);

  return (
    <>
      <svg ref={chartRef} />
      <svg ref={legendRef} width={200} height={500} />
    </>
  );
};

export default HorizontalBarChart;
