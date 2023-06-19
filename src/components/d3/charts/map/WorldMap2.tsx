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
        const chartWidth = width; // Adjust the width of the map as needed
        const chartHeight = height; // Adjust the height of the map as needed

        // Load the JSON data
        const states = feature(usTerritory, usTerritory.objects.states);
        const territories = feature(usTerritory, usTerritory.objects.territories);

        // Create a projection for the map
        const statesProjection = geoAlbersUsa().fitExtent(
            [
                [0, 0],
                [chartWidth, chartHeight],
            ],
            states
        );
        const territoriesProjection = geoAlbersUsa().fitExtent(
            [
                [0, 0],
                [chartWidth, chartHeight],
            ],
            territories
        );

        // Create a path for each projection
        const statesPath = geoPath().projection(statesProjection);
        const territoriesPath = geoPath().projection(territoriesProjection);

        select(svgRef.current)
            .append("g")
            .attr("class", "states")
            .selectAll("path")
            .data((states as any).features)
            .enter()
            .append("path")
            .attr("d", statesPath as any)
            .attr("fill", "steelblue")
            .attr("stroke", "white");

        select(svgRef.current)
            .append("g")
            .attr("class", "territories")
            .selectAll("path")
            .data((territories as any).features)
            .enter()
            .append("path")
            .attr("d", territoriesPath as any)
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
