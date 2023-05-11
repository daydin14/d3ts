// Styling
// import "../d3styles.css";

// Dependencies
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface SingleStackProps {
  data: { category: string; value: number }[];
  width: number;
  height: number;
}

const SingleStack: React.FC<SingleStackProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");
    // .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([0, width - margin.left - margin.right]);

    const yScale = d3
      .scaleBand()
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(d3.schemeTableau10);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10, "~s");
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(5, ${height - margin.top - margin.bottom})`) //${(height - margin.top - margin.bottom)/4}
      .call(xAxis)
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .call(yAxis)
      .call((g) => g.select(".domain").remove());

    var circleGrid = svg.append<SVGGElement>("g");
    var count = 10;
    // create one group for each insurance
    const layers = svg
      .append("g")
      .attr("class", "stacked-bar-legend")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("fill", (d: any) => {
        var circle = circleGrid.append("circle");
        var textTitle = circleGrid.append("text").text(d.category);
        //var text_elements = circleGrid.selectAll("text");
        //var textElement = text_elements.filter((_, i) => i === text_elements.size() - 1);
        //var textWidth = (textElement.node() as SVGTextElement).getComputedTextLength();

        circle
          .attr("class", "stacked-bar-circle-legend")
          .attr("cx", count)
          .attr("cy", "0")
          .attr("r", "10")
          .attr(`transform`, `translate(${width / height}, 25)`)
          .attr("fill", colorScale(d.category) as string);
        count = count + 50;

        textTitle
          .attr("class", "stacked-bar-legend-labels")
          .attr("x", count)
          .attr("transform", `translate(${width / height}, 10)`)
          .attr("y", 50)
          .attr("font-size", "24px")
          .attr("fill", "black");
        //count = count + textWidth;
        return colorScale(d.category) as string;
      });

    // Sliding animation transition for bars
    const duration = 100;
    const t = d3.transition().duration(duration).ease(d3.easeLinear);

    // draw bars
    layers.each(function (_, i: number) {
      console.log(i);
      // this refers to the group for a given insurance
      d3.select(this)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (_) => i * (width / data.length))
        .attr(`transform`, `translate(${width / height}, 200)`) // Moves bar
        .attr("height", 100) // Adjust height of the rectangles in the bar
        .transition(t)
        .delay(i * duration)
        .attr("width", width / data.length);
      //console.log(data)
      // .attr('width', (width/data.length));
    });

    // layers.each(function (d: any) {
    //     d3.select(this)
    //         .selectAll('text')
    //         .data(d)
    //         .join('text')
    //         .text((d: any) => { return `${(d[1] as number) - (d[0] as number)}%`;})
    //         .attr("x", (d: any) => xScale(d[0]))
    //         .attr("y", "30px")
    //         .attr("class", "stack-font-size")
    //         .style("fill", 'black');
    // });
  }, [data, width, height]);
  return <svg ref={svgRef} />;
};

export default SingleStack;
