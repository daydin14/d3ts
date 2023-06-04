// Styling
import "./styles.css";

// Dependencies
import React, { useState } from "react";

// Components
import HorizontalBarChart from "../d3/charts/bar/HorizontalBarChart";
import ButterflyChart from "../d3/charts/butterfly/ButterflyChart";
import SingleStack from "../d3/charts/single-stack/SingleStack";
import StackedAreaLine from "../d3/charts/stacked-area-line/StackedAreaLine";

// Mock Data
const bardata = [
  { label: "HTML", value: 10 },
  { label: "CSS", value: 20 },
  { label: "JavaScript", value: 30 },
  { label: "TypeScript", value: 40 },
  { label: "React", value: 50 },
];

const singlestackdata = [
  { category: "HTML", value: 10 },
  { category: "CSS", value: 20 },
  { category: "JavaScript", value: 30 },
  { category: "TypeScript", value: 40 },
  { category: "React", value: 50 },
];

const butterflydata = [
  { age: 5, gender: "M", value: 2 },
  { age: 15, gender: "M", value: 12 },
  { age: 25, gender: "M", value: 22 },
  { age: 35, gender: "M", value: 32 },
  { age: 45, gender: "M", value: 42 },

  { age: 5, gender: "F", value: 2 },
  { age: 15, gender: "F", value: 12 },
  { age: 25, gender: "F", value: 22 },
  { age: 35, gender: "F", value: 32 },
  { age: 45, gender: "F", value: 42 },
];

function generateRandomData(): any {
  return {
    year: Math.random() * (2023 - 1997) + 1997,
    a: Math.round(Math.random() * 1000000),
    b: Math.round(Math.random() * 1000000),
    c: Math.round(Math.random() * 1000000),
    d: Math.round(Math.random() * 1000000),
    e: Math.round(Math.random() * 1000000),
    f: Math.round(Math.random() * 1000000),
  };
}

const stackedarealinedata = Array.from({ length: 50 }, generateRandomData);

const Carousel: React.FC = () => {
  const [currentChart, setCurrentChart] = useState(0);

  const handlePrevious = () => {
    setCurrentChart((prevChart) => (prevChart === 0 ? 3 : prevChart - 1));
  };

  const handleNext = () => {
    setCurrentChart((prevChart) => (prevChart === 3 ? 0 : prevChart + 1));
  };

  const renderChart = () => {
    switch (currentChart) {
      case 0:
        return (
          <>
            <HorizontalBarChart
              data={bardata}
              width={800}
              height={800}
              xtitle="Skill Level"
              ytitle="Coding"
            />
          </>
        );
      case 1:
        return (
          <>
            <SingleStack data={singlestackdata} width={800} height={800} />
          </>
        );
      case 2:
        return (
          <>
            <ButterflyChart data={butterflydata} width={800} height={800} />
          </>
        );
      case 3:
        return (
          <>
            <StackedAreaLine
              data={stackedarealinedata}
              width={800}
              height={800}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div id="carousel">
        <button onClick={handlePrevious}>Previous</button>
        {renderChart()}
        <button onClick={handleNext}>Next</button>
      </div>
    </>
  );
};

export default Carousel;
