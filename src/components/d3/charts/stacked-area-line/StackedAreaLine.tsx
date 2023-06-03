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

    // Reference the Chart SVG Element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height);
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
