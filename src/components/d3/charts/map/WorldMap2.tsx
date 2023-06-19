import React, { useEffect, useRef } from "react";
import { feature, mesh } from "topojson-client";
import { select, geoAlbersUsa, geoPath } from "d3";

interface WorldMapProps {
    width: number;
    height: number;
    usTerritory: any;
}

const WorldMap2: React.FC<WorldMapProps> = ({ width, height, usTerritory }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Define the dimensions of the chart
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const chartWidth = width - margin.left - margin.right; // Adjust the width of the map as needed
        const chartHeight = height - margin.top - margin.bottom; // Adjust the height of the map as needed

        // Load the JSON data
        const states = feature(usTerritory, usTerritory.objects.states);
        const nation = feature(usTerritory, usTerritory.objects.nation);
        // Generate the path
        const path = geoPath();


        // Reference the chart SVG Element
        const svg =
            select(svgRef.current)
                .attr("width", chartWidth)
                .attr("height", chartHeight)
                .append("g")
                .attr("class", "chart")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        // States
        svg
            .append("g")
            .attr("class", "states")
            .selectAll("path")
            .data((states as any).features)
            .enter()
            .append("path")
            .attr("d", (path as any))
            .attr("fill", "steelblue")
            .attr("stroke", "white");
        // Nation
        svg
            .append("g")
            .attr("class", "nation")
            .selectAll("path")
            .data((nation as any).features)
            .enter()
            .append("path")
            .attr("d", path as any)
            .attr("fill", "white")
            .attr("stroke", "black");

    }, [width, height, usTerritory]);

    return (
        <>
            <svg ref={svgRef} width={width} height={height} />
        </>
    );
};

export default WorldMap2;
