import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

interface WorldMapProps {
  width: number;
  height: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ width, height }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Define the Dimensions of the Chart
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Reference the Chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Map and projection
    const path = d3.geoPath();
    const projection = d3
      .geoMercator()
      .scale(70)
      .center([0, 0])
      .translate([chartWidth / 2, chartHeight / 2]);

    // Data and color scale
    const data = new Map<string, number>();
    const colorScale = d3
      .scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7] as any);

    Promise.all([
      d3.json(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      ),
      d3.csv(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
        (d: { code: string; pop: string | number }) => {
          data.set(d.code, +d.pop);
        }
      ),
    ]).then(([topo]) => {
      const mouseOver = function (this: any, _d: any) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 0.5);
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black");
      };

      const mouseLeave = function (this: any) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 0.8);
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "transparent");
      };

      // Draw the map
      svg
        .append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", path.projection(projection) as any)
        // set the color of each country
        .attr("fill", (d: any) => {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", "Country")
        .style("opacity", 0.8)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave);
    });
  }, [width, height]);

  return (
    <>
      <svg ref={chartRef} />
    </>
  );
};

export default WorldMap;
