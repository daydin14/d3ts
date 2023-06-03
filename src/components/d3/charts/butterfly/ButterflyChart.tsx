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
  const margin = { top: 10, right: 0, bottom: 20, left: 0 };
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Define scales
      const xScaleMale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)!])
        .rangeRound([width / 2, margin.left]);

      const xScaleFemale = d3
        .scaleLinear()
        .domain(xScaleMale.domain())
        .rangeRound([width / 2, width - margin.right]);

      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => `${d.age}`))
        .rangeRound([height - margin.bottom, margin.top])
        .padding(0.1);

      // Add x-axis
      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(0, ${height - margin.bottom})`)
          .call((g) =>
            g.append("g").call(d3.axisBottom(xScaleMale).ticks(width / 80, "s"))
          ) // Affects left side of Y-Axis
          .call((g) =>
            g
              .append("g")
              .call(d3.axisBottom(xScaleFemale).ticks(width / 80, "s"))
          ) // Affects right side of Y-Axis
          .call((g) => g.selectAll(".domain").remove().attr("fill", "white"))
          .call((g) => g.selectAll(".tick:first-of-type").remove());

      // Add y-axis
      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(${xScaleMale(0)},0)`)
          .call(d3.axisRight(yScale).tickSizeOuter(0))
          .call((g) => g.selectAll(".tick text").attr("fill", "white"));

      svg
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("class", "scaleSvg");

      // const tooltip = svg.append("div")
      //     .attr('class', 'tooltip')
      //     .attr('id', 'tooltip')
      //     .style('opacity', 0);

      // Draw bars
      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("fill", (d) => d3.schemeSet1[d.gender === "M" ? 0 : 7])
        .attr("x", (d) =>
          d.gender === "M" ? xScaleMale(d.value) : xScaleFemale(0)
        )
        .attr("y", (d) => yScale(`${d.age}`)!)
        .attr("width", (d) =>
          d.gender === "M"
            ? xScaleMale(0) - xScaleFemale(-d.value)
            : xScaleFemale(d.value) - xScaleFemale(0)
        )
        .attr("height", yScale.bandwidth());
      // .on('mouseover', (d) => {
      //     tooltip.style('opacity', 0.9);
      //     tooltip.html(() => {
      //         return `Gender: ${d.gender}, Age: ${d.age}: Patient Counts: ${d.value}%`;
      //     })
      //         .style('left', `${(d3.event as MouseEvent).pageX + 10}px`)
      //         .style('top', `${(d3.event as MouseEvent).pageY - 28}px`);
      // })
      // .on('mouseout', (d) => {
      //     tooltip.style('opacity', 0);
      // });

      svg
        .append("g")
        .attr("fill", "blue")
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("text-anchor", (d) => (d.gender === "M" ? "start" : "end"))
        .attr("x", (d) =>
          d.gender === "M" ? xScaleMale(d.value) + 4 : xScaleFemale(d.value) - 4
        )
        .attr("y", (d) => yScale(`${d.age}`)! + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => `${d.value}%`);

      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("fill", "white")
        .attr("dy", "0.35em")
        .attr("x", xScaleMale(0) - 24)
        .attr("y", yScale(`${data[0].age}`)! + yScale.bandwidth() / 2)
        .text("Male");

      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("fill", "purple")
        .attr("dy", "0.35em")
        .attr("x", xScaleFemale(0) + 24)
        .attr("y", yScale(`${data[0].age}`)! + yScale.bandwidth() / 2)
        .text("Female");

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      // Add labels
      svg
        .selectAll(".label")
        .data(data)
        .join((enter) => enter.append("text").attr("class", "label"))
        .text((d) => `${Math.abs(d.value)}%`)
        .attr("x", (d) => xScaleMale(d.value) + (d.value > 0 ? -5 : 5))
        .attr(
          "y",
          (d) => yScale(`${d.age} ${d.gender}`)! + yScale.bandwidth() / 2
        )
        .attr("text-anchor", (d) => (d.value > 0 ? "end" : "start"))
        .attr("alignment-baseline");
    }
  }, [data, width, height]);
  return <svg ref={svgRef} width={width} height={height} />;
};

export default ButterflyChart;
