// Styling
import "../../styles.css";

// Dependencies
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataItem {
  age: number;
  gender: string;
  value: number;
}

interface Props {
  data: DataItem[];
  width: number;
  height: number;
}

const ButterflyChart: React.FC<Props> = ({ data, width, height }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Define the Dimensions of the Chart
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const chartWidth = width - (margin.left + margin.right);
    const chartHeight = height - (margin.top + margin.bottom);

    // Reference the Chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Normalize Data
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d, i) => ({
      ...d,
      value: (d.value - min) / (max - min),
      index: i,
    }));
    const sum = d3.sum(normalizedData, (d) => d.value)!;

    // Define scales
    const xScaleMale = d3
      .scaleLinear()
      .domain([0, 1])
      .rangeRound([chartWidth / 2, margin.left]);

    const xScaleFemale = d3
      .scaleLinear()
      .domain(xScaleMale.domain())
      .rangeRound([chartWidth / 2, chartWidth - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(normalizedData.map((d) => `${d.age}`))
      .rangeRound([chartHeight - margin.bottom, margin.top])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(normalizedData.map((d) => d.gender))
      .range(d3.schemeTableau10);

    // Animation transition
    const duration = 1000;
    const t = d3.transition().duration(duration).ease(d3.easeBounceInOut);

    // Axes
    svg.append("g").attr("class", "butterfly-axes");

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .attr("transform", `translate(${margin.left}, ${chartHeight})`)
        .call((g) =>
          g
            .append("g")
            .call(
              d3
                .axisBottom(xScaleMale)
                .ticks(chartWidth / 80, `${d3.format(".0%")}`)
            )
        )
        .call((g) =>
          g
            .append("g")
            .call(
              d3
                .axisBottom(xScaleFemale)
                .ticks(chartWidth / 80, `${d3.format(".0%")}`)
            )
        )
        .call((g) => g.selectAll(".tick:first-of-type").remove());
    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .attr(
          "transform",
          `translate(${xScaleMale(0) + margin.left},${margin.top})`
        )
        .call(d3.axisRight(yScale).tickSizeOuter(0))
        .call((g) => g.selectAll(".tick text").attr("fill", "white"));

    svg
      .select(".butterfly-axes")
      .append("g")
      .attr("class", "butterfly-x-axis")
      .call(xAxis);
    svg
      .select(".butterfly-axes")
      .append("g")
      .attr("class", "butterfly-y-axis")
      .call(yAxis);

    // const tooltip = svg
    //   .append("div")
    //   .attr("class", "tooltip")
    //   .attr("id", "tooltip")
    //   .style("opacity", 0);

    // Draw bars
    svg
      .append("g")
      .attr("class", "bars")
      .selectAll("rect")
      .data(normalizedData)
      .join("rect")
      .attr("class", (d: any) => `butterfly-bar rect-${d.index}'`)
      .attr("fill", (d) => colorScale(d.gender) as string)
      .attr("x", (d) =>
        d.gender === "M"
          ? xScaleMale(d.value / sum) + margin.left
          : xScaleFemale(0) + margin.right
      )
      .attr("y", (d) => yScale(`${d.age}`)! + margin.top)
      .transition(t)
      .delay((_d, i) => i * (duration / normalizedData.length))
      .attr("width", (d) =>
        d.gender === "M"
          ? xScaleMale(0) - xScaleMale(d.value / sum)
          : xScaleFemale(d.value / sum) - xScaleFemale(0)
      )
      .attr("height", yScale.bandwidth() / 2);
    // .on("mouseover", (d) => {
    //   tooltip.style("opacity", 0.9);
    //   tooltip
    //     .html(() => {
    //       return `Gender: ${d.gender}, Age: ${d.age}: Patient Counts: ${d.value}%`;
    //     })
    //     .style("left", `${(event as MouseEvent).pageX + 10}px`)
    //     .style("top", `${(event as MouseEvent).pageY - 28}px`);
    // })
    // .on("mouseout", (_d) => {
    //   tooltip.style("opacity", 0);
    // });
  }, [data, width, height]);
  return <svg ref={chartRef} width={width} height={height} />;
};

export default ButterflyChart;
