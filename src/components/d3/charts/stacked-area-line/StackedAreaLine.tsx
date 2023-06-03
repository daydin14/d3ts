// Styling
import "../../styles.css";

// Dependencies
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface StackedAreaLineProps {
  width: number;
  height: number;
}

const StackedAreaLine: React.FC<StackedAreaLineProps> = ({ width, height }) => {
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
      .attr("height", height + margin.top + margin.bottom);
  }, [width, height]);
  return (
    <>
      <div id="stacked-area-line-chart">
        <svg ref={chartRef} />
      </div>
    </>
  );
};

export default StackedAreaLine;
