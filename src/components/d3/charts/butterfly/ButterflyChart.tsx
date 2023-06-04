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
  // const legendRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Define the Dimensions of the Chart
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const chartWidth = width - (margin.left + margin.right);
    const chartHeight = height - (margin.top + margin.bottom);

    // Normalize Data
    const max = d3.max(data, (d) => d.value)!;
    const min = d3.min(data, (d) => d.value)!;
    const normalizedData = data.map((d, i) => ({
      ...d,
      value: (d.value - min) / (max - min),
      index: i,
    }));
    const sum = d3.sum(normalizedData, (d) => d.value)!;

    // Reference the Chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    // Chart Title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", (chartWidth + margin.left) / 2)
      .attr("y", -margin.top / 2)
      .text("Butterfly Bar Chart Population Plot Title")
      .attr("fill", "white");

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

    // Axes Titles
    svg
      .select(".butterfly-x-axis")
      .append("text")
      .attr("class", "x-title")
      .attr("text-anchor", "end")
      .attr("x", chartWidth / 2 + margin.left + 10)
      .attr("y", margin.top)
      .text("Percent Total")
      .attr("fill", "white");
    svg
      .select(".butterfly-y-axis")
      .append("text")
      .attr("class", "y-title")
      .attr("text-anchor", "end")
      .attr("y", margin.top / 2)
      .attr("x", 10)
      .text("Age")
      .attr("fill", "white");

    const tooltip = d3
      .select(".butterfly-bar")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Draw bars
    svg
      .append("g")
      .attr("class", "bars")
      .selectAll("rect")
      .data(normalizedData)
      .join("rect")
      .attr(
        "class",
        (d: any) => `butterfly-bar gen-${d.gender} rect-${d.index}`
      )
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
      .attr("height", yScale.bandwidth() / 2)
      .on("mouseover", (event: any, d: any) => {
        const { pageX, pageY } = event;
        tooltip.style("opacity", 0.9);
        tooltip
          .html(() => {
            return `Gender: ${d.gender}, Age: ${d.age}, Patient Counts: ${d.value}%`;
          })
          .style("left", `${pageX + 10}px`)
          .style("top", `${pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Legend
    const highlight = (_event: any, d: any) => {
      d3.select(chartRef.current)
        .selectAll(".butterfly-bar")
        .style("opacity", 0.1);
      d3.select(chartRef.current)
        .selectAll(".butterfly-bar" + `.gen-${d === "M" ? "M" : "F"}`)
        .style("opacity", 1);
    };
    const noHighlight = () => {
      d3.selectAll(".butterfly-bar").style("opacity", 1);
    };
    const barLegend = d3
      .select("#butterfly-chart")
      .append("svg")
      .attr("width", 250)
      .attr("height", 100)
      .append("g")
      .attr("class", "butterfly-legend");
    const squareSize = 50;
    const squareTextGap = 50;
    const legendXOffset = 50;
    const legendYOffset = 50;

    barLegend
      .selectAll(".legend-item")
      .data(["M", "F"])
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("x", (_d, i) => legendXOffset + i * (squareSize + squareTextGap))
      .attr("y", legendYOffset / 5)
      .attr("width", squareSize)
      .attr("height", squareSize)
      .style("fill", (d: any) => colorScale(d) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    barLegend
      .selectAll(".legend-text")
      .data(["M", "F"])
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr(
        "x",
        (_d, i) => legendXOffset + i * (squareSize + squareTextGap) + 5
      )
      .attr("y", legendYOffset * 2 - legendYOffset / 5)
      .style("fill", (d: any) => colorScale(d) as string)
      .text((d: any) => (d === "M" ? "Male" : "Female"))
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);
  }, [data, width, height]);
  return (
    <>
      <div id="butterfly-chart">
        {/* <svg ref={legendRef} width={250} height={100} /> */}
        <svg ref={chartRef} />
      </div>
    </>
  );
};

export default ButterflyChart;
