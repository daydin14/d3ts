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
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

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

    }, [width, height, usTerritory]);

    return (
        <>
            <svg ref={svgRef} />
        </>
    );
};

export default WorldMap2;
