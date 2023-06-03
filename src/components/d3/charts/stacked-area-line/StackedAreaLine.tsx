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
  const legendRef = useRef<SVGSVGElement>(null);

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

    //////////
    // BRUSHING AND CHART //
    //////////

    // Add a clipPath: everything out of this area won't be drawn
    svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [chartWidth, chartHeight],
      ])
      .on("end", updateChart);

    const areaChart = svg.append("g").attr("clip-path", "url(#clip)");

    // Create the area generator
    const area = d3
      .area()
      .x((d: any) => xScale(d.data.year))
      .y0((d: any) => yScale(d[0]))
      .y1((d: any) => yScale(d[1]));

    // Show the areas
    areaChart
      .selectAll(".layers")
      .data(stackedData)
      .join("path")
      .attr("class", (d: any) => "myArea " + d.key)
      .style("fill", (d: any) => colorScale(d.key) as string)
      .attr("d", area as any);

    // Add the brushing
    areaChart.append("g").attr("class", "brush").call(brush);

    // Update chart feature
    let idleTimeout: number | null;

    function idled() {
      idleTimeout = null;
    }

    // A function that updates the chart for given boundaries
    function updateChart(event: d3.D3BrushEvent<any>, _d: any) {
      let extent = event.selection;

      // If no selection, back to the initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        xScale.domain(d3.extent(data, (d) => d.year) as [number, number]);
      } else {
        xScale.domain([
          xScale.invert(extent[0] as number),
          xScale.invert(extent[1] as number),
        ]);
        areaChart.select(".brush").call(brush.move as any, null); // This removes the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(xScale).ticks(5));
      areaChart
        .selectAll("path")
        .transition()
        .duration(1000)
        .attr("d", area as any);
    }
    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlight = (_event: any, d: any) => {
      d3.selectAll(".myArea").style("opacity", 0.1); // reduce opacity of all groups
      d3.select("." + d).style("opacity", 1); // except the one that is hovered
    };

    // And when it is not hovered anymore
    const noHighlight = () => {
      d3.selectAll(".myArea").style("opacity", 1);
    };

    // Line plot generator
    const line = d3
      .line()
      .x((d: any) => xScaleLine(d.year))
      .y((d: any) => yScaleLine(d.avgCount));

    //////////
    // LINE PLOT //
    //////////

    // Add the line plot
    lineGroup
      .append("path")
      .datum(avgCounts)
      .attr("class", "line")
      .attr("d", line as any);

    //////////
    // LEGEND  //
    //////////

    // Add one dot in the legend for each name
    const size = 20;
    const barLegend = d3.select(legendRef.current);

    barLegend
      .append("g")
      .attr("class", "stacked-area-line-legend")
      .selectAll(".legend-rect")
      .data(keys)
      .join("rect")
      .attr("class", "legend-rect")
      .attr("x", 0)
      .attr("y", (_d, i) => i * (size + 5) + size / 2)
      .attr("width", size)
      .attr("height", size)
      .style("fill", (d) => colorScale(d) as string)
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    // Add legend text
    barLegend
      .select(".stacked-area-line-legend")
      .selectAll(".legend-label")
      .data(keys)
      .join("text")
      .attr("class", "legend-label")
      .attr("x", 25)
      .attr("y", (_d, i) => 5 + i * (size + 5) + size / 2)
      .style("fill", (d) => colorScale(d) as string)
      .text((d) => d.toUpperCase())
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    // CSS styling for the line
    svg.append("style").text(`
        .line {
            fill: none;
            stroke: black;
            stroke-width: 10px;
        }
    `);
  }, [data, width, height]);

  return (
    <>
      <div id="stacked-area-line-chart">
        <svg ref={chartRef} />
        <svg ref={legendRef} width={250} height={height / 2} />
      </div>
    </>
  );
};

export default StackedAreaLine;
